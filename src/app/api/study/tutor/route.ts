import { streamText, gateway } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { buildTutorSystemPrompt } from '@/lib/study/tutor-prompt'
import type { DomainId, WeakArea } from '@/types/study'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { messages, topic_id, domain_id } = await request.json()

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

  return result.toUIMessageStreamResponse()
}
