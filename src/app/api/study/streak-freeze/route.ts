import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/api/rate-limit'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id)
  if (!rl.allowed) return rl.response

  const { data: freezes, error } = await supabase
    .from('streak_freezes')
    .select('*')
    .eq('user_id', user.id)
    .is('used_on', null)
    .gt('expires_at', new Date().toISOString())
    .order('earned_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: usedFreezes } = await supabase
    .from('streak_freezes')
    .select('id, used_on')
    .eq('user_id', user.id)
    .not('used_on', 'is', null)
    .order('used_on', { ascending: false })
    .limit(5)

  return NextResponse.json({
    available: freezes?.length ?? 0,
    freezes: freezes ?? [],
    recently_used: usedFreezes ?? [],
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id)
  if (!rl.allowed) return rl.response

  // Find the oldest available (unused, non-expired) freeze
  const { data: freezes } = await supabase
    .from('streak_freezes')
    .select('id')
    .eq('user_id', user.id)
    .is('used_on', null)
    .gt('expires_at', new Date().toISOString())
    .order('earned_at', { ascending: true })
    .limit(1)

  if (!freezes || freezes.length === 0) {
    return NextResponse.json({ error: 'No streak freezes available' }, { status: 400 })
  }

  const today = new Date().toISOString().split('T')[0]

  const { error } = await supabase
    .from('streak_freezes')
    .update({ used_on: today })
    .eq('id', freezes[0].id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, used_on: today })
}
