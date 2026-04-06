import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { scheduleCard, answerToRating, type FSRSCard } from '@/lib/study/fsrs'
import { CardState } from '@/types/study'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const { cardId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { selected_answer, time_spent_ms } = await request.json()

  // Fetch the card and question
  const { data: card } = await supabase
    .from('study_cards')
    .select('*, questions(*)')
    .eq('id', cardId)
    .eq('user_id', user.id)
    .single()

  if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 })

  const question = card.questions
  const options = question.options as { id: string; is_correct: boolean }[]
  const correctIds = options.filter((o) => o.is_correct).map((o) => o.id)

  // Check correctness
  const isCorrect =
    selected_answer.length === correctIds.length &&
    selected_answer.every((s: string) => correctIds.includes(s))

  // Compute FSRS
  const rating = answerToRating(isCorrect, time_spent_ms)
  const fsrsCard: FSRSCard = {
    stability: card.stability,
    difficulty: card.difficulty_fsrs,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as CardState,
    due: new Date(card.due),
    last_review: card.last_review ? new Date(card.last_review) : null,
  }

  const result = scheduleCard(fsrsCard, rating)

  // Atomic update via RPC
  const { data: reviewId, error } = await supabase.rpc('record_answer', {
    p_user_id: user.id,
    p_card_id: cardId,
    p_question_id: question.id,
    p_domain_id: question.domain_id,
    p_topic_id: question.topic_id,
    p_rating: rating,
    p_selected_answer: selected_answer,
    p_is_correct: isCorrect,
    p_time_spent_ms: time_spent_ms,
    p_difficulty: question.difficulty,
    p_stability: result.stability,
    p_difficulty_fsrs: result.difficulty,
    p_elapsed_days: result.elapsed_days,
    p_scheduled_days: result.scheduled_days,
    p_reps: result.reps,
    p_lapses: result.lapses,
    p_state: result.state,
    p_due: result.due.toISOString(),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    review_id: reviewId,
    is_correct: isCorrect,
    correct_answers: correctIds,
    explanation: question.explanation,
    wrong_explanations: question.wrong_explanations,
    next_due: result.due.toISOString(),
    rating,
  })
}
