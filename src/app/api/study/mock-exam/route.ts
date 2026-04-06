import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildMockExam } from '@/lib/study/exam-builder'
import { EXAM_TIME_LIMIT_MS, EXAM_TOTAL_QUESTIONS } from '@/lib/study/constants'
import { checkMockExamLimit } from '@/lib/study/plan-limits'
import { checkRateLimit } from '@/lib/api/rate-limit'
import type { Question } from '@/types/study'

// GET: list user's mock exams
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: exams } = await supabase
    .from('mock_exams')
    .select('id, status, total_questions, correct_count, score, predicted_pass, time_used_ms, started_at, completed_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return NextResponse.json(exams ?? [])
}

// POST: create a new mock exam
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id, 'exam')
  if (!rl.allowed) return rl.response

  // Check plan limits
  const usage = await checkMockExamLimit(supabase, user.id)
  if (!usage.allowed) return NextResponse.json({ error: usage.message }, { status: 429 })

  // Check for in-progress exam
  const { data: existing } = await supabase
    .from('mock_exams')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'in_progress')
    .limit(1)

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: 'You already have an exam in progress', exam_id: existing[0].id }, { status: 409 })
  }

  // Fetch all active questions
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('is_active', true)

  if (!questions || questions.length < EXAM_TOTAL_QUESTIONS) {
    return NextResponse.json(
      { error: `Not enough questions. Need ${EXAM_TOTAL_QUESTIONS}, have ${questions?.length ?? 0}` },
      { status: 422 }
    )
  }

  const questionIds = buildMockExam(questions as Question[])

  const { data: exam, error } = await supabase
    .from('mock_exams')
    .insert({
      user_id: user.id,
      status: 'in_progress',
      question_ids: questionIds,
      answers: {},
      total_questions: questionIds.length,
      time_limit_ms: EXAM_TIME_LIMIT_MS,
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ exam_id: exam.id }, { status: 201 })
}
