import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { selectDifficulty, selectDomainWeighted } from '@/lib/study/adaptive-difficulty'
import { checkDailyQuestionLimit } from '@/lib/study/plan-limits'
import { assignCardsSchema, parseBody } from '@/lib/api/validation'
import type { DomainProgress } from '@/types/study'

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

// POST: Assign new questions as cards to the user (with adaptive difficulty)
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const usage = await checkDailyQuestionLimit(supabase, user.id)
  if (!usage.allowed) return NextResponse.json({ error: usage.message }, { status: 429 })

  const body = await request.json()
  const parsed = parseBody(assignCardsSchema, body)
  if (!parsed.success) return parsed.response
  const { domain_id, count } = parsed.data

  // Get user's domain progress for adaptive difficulty
  const { data: domainProgress } = await supabase
    .from('domain_progress')
    .select('*')
    .eq('user_id', user.id)

  const dp = (domainProgress ?? []) as DomainProgress[]

  // Use adaptive difficulty to select target domain and difficulty
  const targetDomain = domain_id || selectDomainWeighted(dp)
  const domainAccuracy = dp.find((d) => d.domain_id === targetDomain)?.accuracy ?? 0
  const totalSeen = dp.find((d) => d.domain_id === targetDomain)?.questions_seen ?? 0

  // Get recent correct streak for this domain
  const { data: recentReviews } = await supabase
    .from('review_logs')
    .select('is_correct')
    .eq('user_id', user.id)
    .eq('domain_id', targetDomain)
    .order('reviewed_at', { ascending: false })
    .limit(10)

  let correctStreak = 0
  for (const r of (recentReviews ?? [])) {
    if (r.is_correct) correctStreak++
    else break
  }

  const targetDifficulty = selectDifficulty(domainAccuracy, totalSeen, correctStreak)

  // Fetch questions near target difficulty, with some range for variety
  const minDiff = Math.max(1, targetDifficulty - 1)
  const maxDiff = Math.min(5, targetDifficulty + 1)

  const { data: questions } = await supabase
    .from('questions')
    .select('id, difficulty')
    .eq('is_active', true)
    .eq('domain_id', targetDomain)
    .gte('difficulty', minDiff)
    .lte('difficulty', maxDiff)
    .limit(100)

  if (!questions || questions.length === 0) {
    // Fallback: any active questions in this domain
    const { data: fallback } = await supabase
      .from('questions')
      .select('id, difficulty')
      .eq('is_active', true)
      .eq('domain_id', targetDomain)
      .limit(100)

    if (!fallback || fallback.length === 0) {
      return NextResponse.json({ error: 'No questions available' }, { status: 404 })
    }

    return await assignCards(supabase, user.id, fallback.map(q => q.id), count)
  }

  // Sort by closeness to target difficulty, then randomize within same distance
  const sorted = questions.sort((a, b) => {
    const aDist = Math.abs(a.difficulty - targetDifficulty)
    const bDist = Math.abs(b.difficulty - targetDifficulty)
    return aDist - bDist || Math.random() - 0.5
  })

  return await assignCards(supabase, user.id, sorted.map(q => q.id), count)
}

async function assignCards(supabase: ReturnType<typeof createClient> extends Promise<infer R> ? R : never, userId: string, questionIds: string[], count: number) {
  const { data: existingCards } = await supabase
    .from('study_cards')
    .select('question_id')
    .eq('user_id', userId)
    .in('question_id', questionIds)

  const existingIds = new Set((existingCards ?? []).map((c) => c.question_id))
  const newIds = questionIds.filter((id) => !existingIds.has(id)).slice(0, count)

  if (newIds.length === 0) {
    return NextResponse.json({ message: 'All available questions already assigned', created: 0 })
  }

  const cards = newIds.map((question_id) => ({
    user_id: userId,
    question_id,
    state: 0,
    due: new Date().toISOString(),
  }))

  const { error } = await supabase.from('study_cards').insert(cards)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ created: cards.length })
}
