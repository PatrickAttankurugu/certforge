import { streamText, gateway } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { buildExplanationPrompt } from '@/lib/study/explanation-prompt'
import { checkExplanationLimit } from '@/lib/study/plan-limits'
import type { DomainId, QuestionOption } from '@/types/study'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const usage = await checkExplanationLimit(supabase, user.id)
  if (!usage.allowed) return new Response(JSON.stringify({ error: usage.message }), { status: 429 })

  const { question_id, selected_answer } = await request.json()

  // Fetch question details
  const { data: question } = await supabase
    .from('questions')
    .select('*, exam_topics(name)')
    .eq('id', question_id)
    .single()

  if (!question) return new Response('Question not found', { status: 404 })

  const options = question.options as QuestionOption[]
  const correctIds = options.filter((o: QuestionOption) => o.is_correct).map((o: QuestionOption) => o.id)
  const topicName = question.exam_topics?.name ?? 'General'

  const prompt = buildExplanationPrompt(
    question.question_text,
    options,
    selected_answer,
    correctIds,
    topicName,
    question.domain_id as DomainId
  )

  const result = streamText({
    model: gateway('anthropic/claude-haiku-4.5'),
    prompt,
    maxOutputTokens: 500,
  })

  return result.toTextStreamResponse()
}
