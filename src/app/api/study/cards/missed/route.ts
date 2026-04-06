import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: Fetch questions the user previously got wrong
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const domainId = searchParams.get('domain') ?? undefined

  // Find questions the user got wrong that they haven't since gotten correct
  // Strategy: get distinct question_ids from review_logs where is_correct=false,
  // excluding any that the user subsequently answered correctly.
  let query = supabase
    .from('review_logs')
    .select(`
      question_id,
      domain_id,
      reviewed_at
    `)
    .eq('user_id', user.id)
    .eq('is_correct', false)
    .order('reviewed_at', { ascending: false })

  if (domainId) {
    query = query.eq('domain_id', domainId)
  }

  const { data: wrongLogs, error: wrongError } = await query.limit(200)
  if (wrongError) return NextResponse.json({ error: wrongError.message }, { status: 500 })
  if (!wrongLogs || wrongLogs.length === 0) {
    return NextResponse.json([])
  }

  // Get unique question IDs that were answered wrong
  const wrongQuestionIds = [...new Set(wrongLogs.map((l) => l.question_id))]

  // Check which of these were later answered correctly
  const { data: correctLogs } = await supabase
    .from('review_logs')
    .select('question_id')
    .eq('user_id', user.id)
    .eq('is_correct', true)
    .in('question_id', wrongQuestionIds)

  const correctedIds = new Set((correctLogs ?? []).map((l) => l.question_id))

  // Filter to only questions still not mastered
  const missedIds = wrongQuestionIds
    .filter((id) => !correctedIds.has(id))
    .slice(0, limit)

  if (missedIds.length === 0) {
    // Fallback: include questions that were wrong even if later corrected (for extra practice)
    const fallbackIds = wrongQuestionIds.slice(0, limit)
    if (fallbackIds.length === 0) return NextResponse.json([])

    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('id, domain_id, topic_id, difficulty, question_text, question_type, options, explanation, wrong_explanations')
      .in('id', fallbackIds)
      .eq('is_active', true)

    if (qError) return NextResponse.json({ error: qError.message }, { status: 500 })

    const cards = (questions ?? []).map((q) => ({
      card_id: q.id, // use question id as card_id for missed mode
      question_id: q.id,
      domain_id: q.domain_id,
      topic_id: q.topic_id,
      difficulty: q.difficulty,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options,
      explanation: q.explanation,
      wrong_explanations: q.wrong_explanations,
      state: 0,
      due: new Date().toISOString(),
      stability: 0,
      difficulty_fsrs: 0,
      reps: 0,
      lapses: 0,
    }))

    return NextResponse.json(cards)
  }

  // Fetch full question data for missed questions
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, domain_id, topic_id, difficulty, question_text, question_type, options, explanation, wrong_explanations')
    .in('id', missedIds)
    .eq('is_active', true)

  if (qError) return NextResponse.json({ error: qError.message }, { status: 500 })

  const cards = (questions ?? []).map((q) => ({
    card_id: q.id,
    question_id: q.id,
    domain_id: q.domain_id,
    topic_id: q.topic_id,
    difficulty: q.difficulty,
    question_text: q.question_text,
    question_type: q.question_type,
    options: q.options,
    explanation: q.explanation,
    wrong_explanations: q.wrong_explanations,
    state: 0,
    due: new Date().toISOString(),
    stability: 0,
    difficulty_fsrs: 0,
    reps: 0,
    lapses: 0,
  }))

  return NextResponse.json(cards)
}
