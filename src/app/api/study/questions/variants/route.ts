import { generateText, Output, gateway } from 'ai'
import { z } from 'zod'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkQuestionGenerationLimit } from '@/lib/study/plan-limits'
import { parseBody } from '@/lib/api/validation'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { DOMAIN_NAMES } from '@/lib/study/constants'
import type { DomainId, QuestionOption } from '@/types/study'

const variantRequestSchema = z.object({
  question_id: z.string().uuid(),
})

const variantOutputSchema = z.object({
  variant_text: z.string(),
  variant_options: z.array(z.object({
    id: z.string(),
    text: z.string(),
    is_correct: z.boolean(),
  })),
  variant_explanation: z.string(),
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id, 'ai')
  if (!rl.allowed) return rl.response

  const usage = await checkQuestionGenerationLimit(supabase, user.id)
  if (!usage.allowed) return NextResponse.json({ error: usage.message }, { status: 429 })

  const body = await request.json()
  const parsed = parseBody(variantRequestSchema, body)
  if (!parsed.success) return parsed.response
  const { question_id } = parsed.data

  // Check for existing variant first
  const { data: existingVariant } = await supabase
    .from('question_variants')
    .select('*')
    .eq('original_id', question_id)
    .limit(1)
    .single()

  if (existingVariant) {
    return NextResponse.json({
      id: existingVariant.id,
      variant_text: existingVariant.variant_text,
      variant_options: existingVariant.variant_options,
      variant_explanation: existingVariant.variant_explanation,
    })
  }

  // Fetch original question
  const { data: question } = await supabase
    .from('questions')
    .select('*, exam_topics(name)')
    .eq('id', question_id)
    .single()

  if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 })

  const options = question.options as QuestionOption[]
  const topicName = question.exam_topics?.name ?? 'General'
  const domainName = DOMAIN_NAMES[question.domain_id as DomainId]

  const prompt = `You are an AWS SAA-C03 exam question writer.
Create a VARIANT of the following question. The variant must test the SAME underlying concept
but use a DIFFERENT scenario, company context, or service configuration.

ORIGINAL QUESTION:
Domain: ${domainName}
Topic: ${topicName}
Type: ${question.question_type}

${question.question_text}

Options:
${options.map((o) => `${o.id}. ${o.text} ${o.is_correct ? '(correct)' : ''}`).join('\n')}

RULES:
- Same number of options (${options.length})
- Same number of correct answers (${options.filter((o) => o.is_correct).length})
- Different scenario but same core concept
- Use option IDs: ${options.map((o) => o.id).join(', ')}
- Make the explanation reference the core concept and why the correct answer applies in this new scenario`

  const { output: variant } = await generateText({
    model: gateway('openai/gpt-4o-mini'),
    prompt,
    output: Output.object({ schema: variantOutputSchema }),
  })

  if (!variant) return NextResponse.json({ error: 'Failed to generate variant' }, { status: 500 })

  // Save to database
  const { data: saved, error } = await supabase
    .from('question_variants')
    .insert({
      original_id: question_id,
      variant_text: variant.variant_text,
      variant_options: variant.variant_options,
      variant_explanation: variant.variant_explanation,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    id: saved.id,
    ...variant,
  })
}
