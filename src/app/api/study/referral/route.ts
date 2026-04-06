import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { generateReferralCode } from '@/lib/study/referral'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id)
  if (!rl.allowed) return rl.response

  // Get user's referral code from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code')
    .eq('id', user.id)
    .single()

  // Get referral stats
  const { data: referrals } = await supabase
    .from('referrals')
    .select('id, status, reward_granted, created_at')
    .eq('referrer_id', user.id)

  const stats = {
    total_referred: referrals?.length ?? 0,
    signed_up: referrals?.filter((r) => r.status === 'signed_up' || r.status === 'converted').length ?? 0,
    converted: referrals?.filter((r) => r.status === 'converted').length ?? 0,
    rewards_earned: referrals?.filter((r) => r.reward_granted).length ?? 0,
  }

  return NextResponse.json({
    referral_code: profile?.referral_code ?? null,
    stats,
    referrals: referrals ?? [],
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id)
  if (!rl.allowed) return rl.response

  // Check if user already has a referral code
  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code')
    .eq('id', user.id)
    .single()

  if (profile?.referral_code) {
    return NextResponse.json({ referral_code: profile.referral_code })
  }

  // Generate a new unique code
  let code = generateReferralCode()
  let attempts = 0

  while (attempts < 5) {
    const { error } = await supabase
      .from('profiles')
      .update({ referral_code: code })
      .eq('id', user.id)

    if (!error) {
      return NextResponse.json({ referral_code: code })
    }

    // Code collision, try again
    code = generateReferralCode()
    attempts++
  }

  return NextResponse.json({ error: 'Failed to generate referral code' }, { status: 500 })
}
