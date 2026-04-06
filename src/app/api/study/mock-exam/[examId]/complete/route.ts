import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { scaleExamScore } from '@/lib/study/score-predictor'
import { EXAM_PASS_SCORE } from '@/lib/study/constants'
import type { DomainId, QuestionOption, DomainBreakdown, MockExamAnswer } from '@/types/study'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: exam } = await supabase
    .from('mock_exams')
    .select('*')
    .eq('id', examId)
    .eq('user_id', user.id)
    .single()

  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
  if (exam.status !== 'in_progress') return NextResponse.json({ error: 'Exam already completed' }, { status: 400 })

  // Fetch all questions to grade
  const { data: questions } = await supabase
    .from('questions')
    .select('id, domain_id, options')
    .in('id', exam.question_ids)

  const questionMap = new Map((questions ?? []).map((q) => [q.id, q]))
  const answers = (exam.answers ?? {}) as Record<string, MockExamAnswer>

  let correctCount = 0
  const domainBreakdown: Record<string, DomainBreakdown> = {}
  let totalTimeMs = 0

  for (const qId of exam.question_ids as string[]) {
    const question = questionMap.get(qId)
    if (!question) continue

    const domain = question.domain_id as DomainId
    if (!domainBreakdown[domain]) {
      domainBreakdown[domain] = { correct: 0, total: 0, accuracy: 0 }
    }
    domainBreakdown[domain].total++

    const answer = answers[qId]
    if (!answer) continue

    totalTimeMs += answer.time_ms ?? 0

    const correctIds = (question.options as QuestionOption[])
      .filter((o) => o.is_correct)
      .map((o) => o.id)

    const isCorrect =
      answer.selected.length === correctIds.length &&
      answer.selected.every((s: string) => correctIds.includes(s))

    if (isCorrect) {
      correctCount++
      domainBreakdown[domain].correct++
    }
  }

  // Calculate domain accuracies
  for (const domain of Object.keys(domainBreakdown)) {
    const d = domainBreakdown[domain]
    d.accuracy = d.total > 0 ? d.correct / d.total : 0
  }

  const score = scaleExamScore(correctCount, (exam.question_ids as string[]).length)
  const predictedPass = score >= EXAM_PASS_SCORE

  const { error } = await supabase
    .from('mock_exams')
    .update({
      status: 'completed',
      correct_count: correctCount,
      score,
      predicted_pass: predictedPass,
      domain_breakdown: domainBreakdown,
      time_used_ms: totalTimeMs,
      completed_at: new Date().toISOString(),
    })
    .eq('id', examId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    score,
    correct_count: correctCount,
    total_questions: (exam.question_ids as string[]).length,
    predicted_pass: predictedPass,
    domain_breakdown: domainBreakdown,
    time_used_ms: totalTimeMs,
  })
}
