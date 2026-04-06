import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: Fetch due cards for the current user
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const domainId = searchParams.get('domain') ?? undefined

  const { data, error } = await supabase.rpc('get_due_cards', {
    p_user_id: user.id,
    p_limit: limit,
    p_domain_id: domainId ?? null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// POST: Assign new questions as cards to the user
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { domain_id, count = 10, difficulty } = await request.json()

  // Fetch questions the user hasn't seen yet
  let query = supabase
    .from('questions')
    .select('id')
    .eq('is_active', true)

  if (domain_id) query = query.eq('domain_id', domain_id)
  if (difficulty) query = query.eq('difficulty', difficulty)

  const { data: questions } = await query.limit(100)
  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: 'No questions available' }, { status: 404 })
  }

  // Check which ones the user already has cards for
  const questionIds = questions.map((q) => q.id)
  const { data: existingCards } = await supabase
    .from('study_cards')
    .select('question_id')
    .eq('user_id', user.id)
    .in('question_id', questionIds)

  const existingIds = new Set((existingCards ?? []).map((c) => c.question_id))
  const newIds = questionIds.filter((id) => !existingIds.has(id)).slice(0, count)

  if (newIds.length === 0) {
    return NextResponse.json({ message: 'All available questions already assigned', created: 0 })
  }

  // Create new cards
  const cards = newIds.map((question_id) => ({
    user_id: user.id,
    question_id,
    state: 0,
    due: new Date().toISOString(),
  }))

  const { error } = await supabase.from('study_cards').insert(cards)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ created: cards.length })
}
