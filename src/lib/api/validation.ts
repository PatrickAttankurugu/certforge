import { z } from 'zod'
import { NextResponse } from 'next/server'

const VALID_DOMAINS = ['secure', 'resilient', 'performant', 'cost'] as const

export const domainIdSchema = z.enum(VALID_DOMAINS)

// POST /api/study/cards
export const assignCardsSchema = z.object({
  domain_id: domainIdSchema.nullable().optional(),
  count: z.number().int().min(1).max(50).optional().default(10),
})

// POST /api/study/cards/[cardId]/answer
export const answerCardSchema = z.object({
  selected_answer: z.array(z.string().min(1)).min(1).max(10),
  time_spent_ms: z.number().int().min(0).max(600000),
})

// POST /api/study/explain
export const explainSchema = z.object({
  question_id: z.string().uuid(),
  selected_answer: z.array(z.string().min(1)),
})

// PATCH /api/study/mock-exam/[examId]
export const saveExamAnswerSchema = z.object({
  question_id: z.string().uuid(),
  selected: z.array(z.string().min(1)).min(1).max(10),
  time_ms: z.number().int().min(0).max(600000),
})

// POST /api/study/tutor
export const tutorSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().max(10000),
  })).min(1).max(100),
  topic_id: z.string().nullable().optional(),
  domain_id: domainIdSchema.nullable().optional(),
  conversation_id: z.string().uuid().nullable().optional(),
})

// POST /api/study/questions/generate
export const generateQuestionSchema = z.object({
  topic_id: z.string().nullable().optional(),
  domain_id: domainIdSchema.optional().default('secure'),
  difficulty: z.number().int().min(1).max(5).optional().default(3),
  question_type: z.enum(['single', 'multi']).optional().default('single'),
})

/** Parse request body with a Zod schema. Returns parsed data or a 400 Response. */
export function parseBody<T extends z.ZodType>(
  schema: T,
  data: unknown,
): { success: true; data: z.infer<T> } | { success: false; response: NextResponse } {
  const result = schema.safeParse(data)
  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid request', details: result.error.flatten().fieldErrors },
        { status: 400 },
      ),
    }
  }
  return { success: true, data: result.data }
}
