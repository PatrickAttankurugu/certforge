import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { saveExamAnswerSchema, parseBody } from '@/lib/api/validation'
import type { QuestionOption } from '@/types/study'

// GET: fetch exam with questions for taking
export async function GET(
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

  // Fetch questions in order
  const { data: questions } = await supabase
    .from('questions')
    .select('id, domain_id, topic_id, difficulty, question_text, question_type, options, explanation')
    .in('id', exam.question_ids)

  // Maintain exam order
  const questionMap = new Map((questions ?? []).map((q) => [q.id, q]))
  const orderedQuestions = (exam.question_ids as string[]).map((id) => {
    const q = questionMap.get(id)
    if (!q) return null
    // Strip is_correct in active exams
    if (exam.status === 'in_progress') {
      return {
        ...q,
        options: (q.options as QuestionOption[]).map(({ id: oid, text }) => ({ id: oid, text })),
      }
    }
    return q
  }).filter(Boolean)

  return NextResponse.json({
    ...exam,
    questions: orderedQuestions,
  })
}

// PATCH: save an answer during exam
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = parseBody(saveExamAnswerSchema, body)
  if (!parsed.success) return parsed.response
  const { question_id, selected, time_ms } = parsed.data

  const { data: exam } = await supabase
    .from('mock_exams')
    .select('answers, status')
    .eq('id', examId)
    .eq('user_id', user.id)
    .single()

  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
  if (exam.status !== 'in_progress') return NextResponse.json({ error: 'Exam is not in progress' }, { status: 400 })

  const answers = (exam.answers ?? {}) as Record<string, { selected: string[]; time_ms: number }>
  answers[question_id] = { selected, time_ms }

  await supabase
    .from('mock_exams')
    .update({ answers })
    .eq('id', examId)

  return NextResponse.json({ saved: true, answered: Object.keys(answers).length })
}
