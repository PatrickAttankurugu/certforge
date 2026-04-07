import { generateText, Output, gateway } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { buildQuestionGenerationPrompt } from '@/lib/study/question-generator'
import { checkQuestionGenerationLimit } from '@/lib/study/plan-limits'
import { generateQuestionSchema, parseBody } from '@/lib/api/validation'
import { checkRateLimit } from '@/lib/api/rate-limit'
import type { DomainId } from '@/types/study'
import { NextResponse } from 'next/server'

const questionSchema = z.object({
  question_text: z.string(),
  question_type: z.enum(['single', 'multi']),
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
    is_correct: z.boolean(),
  })),
  explanation: z.string(),
  wrong_explanations: z.array(z.object({
    option_id: z.string(),
    explanation: z.string(),
  })),
  aws_services: z.array(z.string()),
  difficulty: z.number().min(1).max(5),
})

export async function POST(request: Request) {
  try {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id, 'ai')
  if (!rl.allowed) return rl.response

  const usage = await checkQuestionGenerationLimit(supabase, user.id)
  if (!usage.allowed) return NextResponse.json({ error: usage.message }, { status: 429 })

  const body = await request.json()
  const inputParsed = parseBody(generateQuestionSchema, body)
  if (!inputParsed.success) return inputParsed.response
  const { topic_id, domain_id, difficulty, question_type } = inputParsed.data

  // Get topic name
  let topicName = 'General AWS'
  if (topic_id) {
    const { data: topic } = await supabase
      .from('exam_topics')
      .select('name')
      .eq('id', topic_id)
      .single()
    topicName = topic?.name ?? topicName
  }

  // Get user accuracy for this topic
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

  const prompt = buildQuestionGenerationPrompt(
    topicName,
    (domain_id ?? 'secure') as DomainId,
    difficulty ?? 3,
    question_type ?? 'single',
    accuracy
  )

  const { output: question } = await generateText({
    model: gateway('openai/gpt-5.4-mini'),
    prompt,
    output: Output.object({ schema: questionSchema }),
  })

  if (!question) return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 })

  // Save to database
  const { data: saved, error } = await supabase
    .from('questions')
    .insert({
      domain_id: domain_id ?? 'secure',
      topic_id: topic_id ?? null,
      difficulty: question.difficulty,
      question_text: question.question_text,
      question_type: question.question_type,
      options: question.options,
      explanation: question.explanation,
      wrong_explanations: Object.fromEntries(question.wrong_explanations.map((w) => [w.option_id, w.explanation])),
      aws_services: question.aws_services,
      source: 'ai_generated',
      ai_model: 'gpt-5.4-mini',
      is_active: true,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ question_id: saved.id, ...question })
  } catch (e) {
    console.error('[questions/generate] error', e)
    const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e)
    return NextResponse.json({ error: msg, stack: e instanceof Error ? e.stack?.split('\n').slice(0,5) : undefined }, { status: 500 })
  }
}
