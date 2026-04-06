import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { XP_REWARDS } from '@/lib/study/xp'
import { z } from 'zod'

const awardXPSchema = z.object({
  action: z.enum([
    'answer_correct',
    'answer_wrong',
    'streak_bonus',
    'mock_exam',
    'daily_goal',
    'review_complete',
    'first_question',
  ]),
  xp_amount: z.number().int().min(1).max(500).optional(),
})

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id)
  if (!rl.allowed) return rl.response

  const [{ data: profile }, { data: todayXP }, { data: weekXP }] = await Promise.all([
    supabase.from('profiles').select('total_xp').eq('id', user.id).single(),
    supabase
      .from('xp_log')
      .select('xp_amount')
      .eq('user_id', user.id)
      .gte('created_at', new Date().toISOString().split('T')[0]),
    supabase
      .from('xp_log')
      .select('xp_amount')
      .eq('user_id', user.id)
      .gte('created_at', getWeekStart()),
  ])

  const todayTotal = (todayXP ?? []).reduce((sum, r) => sum + r.xp_amount, 0)
  const weekTotal = (weekXP ?? []).reduce((sum, r) => sum + r.xp_amount, 0)

  return NextResponse.json({
    total_xp: profile?.total_xp ?? 0,
    today_xp: todayTotal,
    week_xp: weekTotal,
    xp_rewards: XP_REWARDS,
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id)
  if (!rl.allowed) return rl.response

  const body = await request.json()
  const parsed = awardXPSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const { action } = parsed.data
  let xpAmount = parsed.data.xp_amount

  // Default XP amounts if not provided
  if (!xpAmount) {
    const defaults: Record<string, number> = {
      answer_correct: XP_REWARDS.CORRECT_ANSWER,
      answer_wrong: XP_REWARDS.WRONG_ANSWER,
      streak_bonus: XP_REWARDS.STREAK_BONUS_PER_DAY,
      mock_exam: XP_REWARDS.MOCK_EXAM_COMPLETE,
      daily_goal: XP_REWARDS.DAILY_GOAL_COMPLETE,
      review_complete: XP_REWARDS.REVIEW_COMPLETE,
      first_question: XP_REWARDS.FIRST_QUESTION,
    }
    xpAmount = defaults[action] ?? 10
  }

  // Log XP
  const { error: logError } = await supabase.from('xp_log').insert({
    user_id: user.id,
    action,
    xp_amount: xpAmount,
  })

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 500 })
  }

  // Update total XP on profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_xp')
    .eq('id', user.id)
    .single()

  const newTotal = (profile?.total_xp ?? 0) + xpAmount

  await supabase
    .from('profiles')
    .update({ total_xp: newTotal })
    .eq('id', user.id)

  // Update leaderboard entry for this week
  const weekStart = getWeekStart()
  await supabase
    .from('leaderboard_entries')
    .upsert(
      {
        user_id: user.id,
        week_start: weekStart,
        xp_earned: newTotal, // will be recalculated
      },
      { onConflict: 'user_id,week_start' }
    )

  return NextResponse.json({ success: true, xp_awarded: xpAmount, total_xp: newTotal })
}

function getWeekStart(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now.getFullYear(), now.getMonth(), diff)
  return monday.toISOString().split('T')[0]
}
