import { streamText, gateway } from 'ai'
import { after, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkTutorLimit } from '@/lib/study/plan-limits'
import { parseBody } from '@/lib/api/validation'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { z } from 'zod'
import type { DomainId } from '@/types/study'
import { DOMAIN_NAMES } from '@/lib/study/constants'

const socraticSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().max(10000),
  })).min(1).max(100),
  topic: z.string().max(200).optional(),
  domain_id: z.enum(['secure', 'resilient', 'performant', 'cost']).nullable().optional(),
  conversation_id: z.string().uuid().nullable().optional(),
})

function buildSocraticSystemPrompt(
  topic: string | null,
  domainId: DomainId | null
): string {
  const context: string[] = []
  if (topic) context.push(`The student wants to explore: ${topic}`)
  if (domainId) context.push(`Domain: ${DOMAIN_NAMES[domainId]}`)

  return `You are a Socratic tutor for the AWS Solutions Architect Associate (SAA-C03) exam.

YOUR METHOD:
- NEVER give direct answers or explanations
- Ask probing questions to guide the student toward understanding
- Start with broad questions, then narrow down based on their responses
- When they give a wrong answer, ask a clarifying question that exposes the flaw in their reasoning
- When they give a correct answer, push deeper: "Why?" "What happens if...?" "How does that compare to...?"
- Use scenarios: "Imagine a company needs X... what would you recommend and why?"
- Challenge assumptions: "You said X. But what about Y scenario?"
- Celebrate correct reasoning, not just correct answers

${context.length > 0 ? '\nCONTEXT:\n' + context.join('\n') + '\n' : ''}
EXAM SPECIFICS (SAA-C03):
- 4 domains: Secure (30%), Resilient (26%), High-Performing (24%), Cost-Optimized (20%)
- 65 questions, 130 minutes, 720/1000 to pass

GUIDELINES:
- Keep each response to 2-3 sentences max (one question + brief context)
- If the student is stuck, give a small hint as a question: "What if I told you that S3 has a feature called...?"
- After 4-5 good answers on a sub-topic, move to a related concept
- Always tie back to exam-relevant scenarios
- If asked something outside SAA-C03 scope, redirect with a related question`
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id, 'ai')
  if (!rl.allowed) return rl.response

  // Use tutor limits for Socratic mode
  const usage = await checkTutorLimit(supabase, user.id)
  if (!usage.allowed) return NextResponse.json({ error: usage.message }, { status: 429 })

  const body = await request.json()
  const parsed = parseBody(socraticSchema, body)
  if (!parsed.success) return parsed.response
  const { messages, topic, domain_id, conversation_id } = parsed.data

  const systemPrompt = buildSocraticSystemPrompt(
    topic ?? null,
    (domain_id ?? null) as DomainId | null
  )

  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4.6'),
    system: systemPrompt,
    messages,
    maxOutputTokens: 500,
  })

  // Save conversation in background
  after(async () => {
    const fullText = await result.text
    const admin = createAdminClient()
    const userMessage = messages[messages.length - 1]

    if (conversation_id) {
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
      await admin
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          topic_id: null,
          conversation_type: 'socratic',
          messages: [
            { role: 'user', content: userMessage?.content ?? '', timestamp: new Date().toISOString() },
            { role: 'assistant', content: fullText, timestamp: new Date().toISOString() },
          ],
        })
    }
  })

  return result.toUIMessageStreamResponse()
}
