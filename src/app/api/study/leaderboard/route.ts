import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/api/rate-limit'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id)
  if (!rl.allowed) return rl.response

  const url = new URL(request.url)
  const weekParam = url.searchParams.get('week')
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 50), 100)

  // Default to current week start (Monday)
  let weekStart: string
  if (weekParam) {
    weekStart = weekParam
  } else {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(now.setDate(diff))
    weekStart = monday.toISOString().split('T')[0]
  }

  const { data: leaderboard, error } = await supabase.rpc('get_weekly_leaderboard', {
    p_week_start: weekStart,
    p_limit: limit,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Find current user's entry
  const userEntry = (leaderboard ?? []).find(
    (entry: { user_id: string }) => entry.user_id === user.id
  )

  return NextResponse.json({
    leaderboard: leaderboard ?? [],
    user_entry: userEntry ?? null,
    week_start: weekStart,
  })
}
