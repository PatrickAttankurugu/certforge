import { streamText, gateway } from 'ai'
import { after, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildTutorSystemPrompt } from '@/lib/study/tutor-prompt'
import { checkTutorLimit } from '@/lib/study/plan-limits'
import { tutorSchema, parseBody } from '@/lib/api/validation'
import { checkRateLimit } from '@/lib/api/rate-limit'
import type { DomainId, WeakArea } from '@/types/study'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id, 'ai')
  if (!rl.allowed) return rl.response

  const usage = await checkTutorLimit(supabase, user.id)
  if (!usage.allowed) return NextResponse.json({ error: usage.message }, { status: 429 })

  const body = await request.json()
  const parsed = parseBody(tutorSchema, body)
  if (!parsed.success) return parsed.response
  const { messages, topic_id, domain_id, conversation_id } = parsed.data

  // Get topic name and user's weak areas for context
  let topicName: string | null = null
  if (topic_id) {
    const { data: topic } = await supabase
      .from('exam_topics')
      .select('name')
      .eq('id', topic_id)
      .single()
    topicName = topic?.name ?? null
  }

  let accuracy: number | null = null
  if (topic_id) {
    const { data: tp } = await supabase
      .from('topic_progress')
      .select('accuracy')
      .eq('user_id', user.id)
      .eq('topic_id', topic_id)
      .single()
    accuracy = tp?.accuracy ?? null
  }

  const { data: weakTopics } = await supabase
    .from('topic_progress')
    .select('topic_id, domain_id, accuracy, questions_seen')
    .eq('user_id', user.id)
    .eq('is_weak', true)
    .limit(5)

  const weakAreas: WeakArea[] = (weakTopics ?? []).map((tp) => ({
    topic_id: tp.topic_id,
    topic_name: tp.topic_id.replace(/_/g, ' '),
    domain_id: tp.domain_id as DomainId,
    domain_name: '',
    accuracy: tp.accuracy,
    questions_seen: tp.questions_seen,
    impact_score: 0,
  }))

  const systemPrompt = buildTutorSystemPrompt(
    topicName,
    domain_id as DomainId | null,
    accuracy,
    weakAreas
  )

  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4.6'),
    system: systemPrompt,
    messages,
    maxOutputTokens: 1000,
  })

  // Save conversation in background after response streams
  after(async () => {
    const fullText = await result.text
    const admin = createAdminClient()
    const userMessage = messages[messages.length - 1]

    if (conversation_id) {
      // Append to existing conversation
      const { data: existing } = await admin
        .from('ai_conversations')
        .select('messages')
        .eq('id', conversation_id)
        .single()

      const existingMessages = (existing?.messages ?? []) as Array<Record<string, string>>
      existingMessages.push(
        { role: 'user', content: userMessage?.content ?? '', timestamp: new Date().toISOString() },
        { role: 'assistant', content: fullText, timestamp: new Date().toISOString() }
      )

      await admin
        .from('ai_conversations')
        .update({ messages: existingMessages, updated_at: new Date().toISOString() })
        .eq('id', conversation_id)
    } else {
      // Create new conversation
      await admin
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          topic_id: topic_id ?? null,
          conversation_type: 'tutoring',
          messages: [
            { role: 'user', content: userMessage?.content ?? '', timestamp: new Date().toISOString() },
            { role: 'assistant', content: fullText, timestamp: new Date().toISOString() },
          ],
        })
    }
  })

  return result.toUIMessageStreamResponse()
}
