import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { z } from 'zod'

const sendRequestSchema = z.object({
  buddy_id: z.string().uuid(),
  action: z.enum(['send', 'accept', 'decline']).default('send'),
})

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id)
  if (!rl.allowed) return rl.response

  const url = new URL(request.url)
  const tab = url.searchParams.get('tab') ?? 'buddies'

  if (tab === 'find') {
    // Find potential buddies: users studying the same cert with similar progress
    const { data: myProfile } = await supabase
      .from('user_study_profiles')
      .select('total_questions_answered, daily_goal_questions')
      .eq('user_id', user.id)
      .single()

    const myQuestions = myProfile?.total_questions_answered ?? 0
    const minQ = Math.max(0, myQuestions - 100)
    const maxQ = myQuestions + 100

    const { data: candidates } = await supabase
      .from('user_study_profiles')
      .select('user_id, total_questions_answered, study_streak, daily_goal_questions')
      .neq('user_id', user.id)
      .gte('total_questions_answered', minQ)
      .lte('total_questions_answered', maxQ)
      .limit(20)

    // Get profile info for candidates
    const candidateIds = (candidates ?? []).map((c) => c.user_id)
    let profiles: Record<string, string> = {}

    if (candidateIds.length > 0) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', candidateIds)

      if (profileData) {
        profiles = Object.fromEntries(profileData.map((p) => [p.id, p.full_name ?? 'Student']))
      }
    }

    // Exclude existing buddies
    const { data: existingBuddies } = await supabase
      .from('study_buddies')
      .select('buddy_id, user_id')
      .or(`user_id.eq.${user.id},buddy_id.eq.${user.id}`)

    const excludeIds = new Set(
      (existingBuddies ?? []).flatMap((b) => [b.buddy_id, b.user_id])
    )

    const suggestions = (candidates ?? [])
      .filter((c) => !excludeIds.has(c.user_id))
      .map((c) => ({
        user_id: c.user_id,
        full_name: profiles[c.user_id] ?? 'Student',
        total_questions: c.total_questions_answered,
        streak: c.study_streak,
        daily_goal: c.daily_goal_questions,
      }))

    return NextResponse.json({ suggestions })
  }

  // Get current buddies and pending requests
  const [{ data: sentRequests }, { data: receivedRequests }] = await Promise.all([
    supabase
      .from('study_buddies')
      .select('id, buddy_id, status, created_at')
      .eq('user_id', user.id),
    supabase
      .from('study_buddies')
      .select('id, user_id, status, created_at')
      .eq('buddy_id', user.id),
  ])

  // Gather all buddy user IDs for profile lookup
  const allBuddyIds = [
    ...(sentRequests ?? []).map((r) => r.buddy_id),
    ...(receivedRequests ?? []).map((r) => r.user_id),
  ]

  let buddyProfiles: Record<string, { full_name: string; total_xp: number }> = {}
  if (allBuddyIds.length > 0) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, full_name, total_xp')
      .in('id', allBuddyIds)

    if (profileData) {
      buddyProfiles = Object.fromEntries(
        profileData.map((p) => [p.id, { full_name: p.full_name ?? 'Student', total_xp: p.total_xp }])
      )
    }
  }

  // Get study stats for buddies
  let buddyStats: Record<string, { streak: number; questions: number }> = {}
  if (allBuddyIds.length > 0) {
    const { data: statsData } = await supabase
      .from('user_study_profiles')
      .select('user_id, study_streak, total_questions_answered')
      .in('user_id', allBuddyIds)

    if (statsData) {
      buddyStats = Object.fromEntries(
        statsData.map((s) => [s.user_id, { streak: s.study_streak, questions: s.total_questions_answered }])
      )
    }
  }

  const activeBuddies = [
    ...(sentRequests ?? []).filter((r) => r.status === 'active').map((r) => ({
      request_id: r.id,
      user_id: r.buddy_id,
      ...buddyProfiles[r.buddy_id],
      ...buddyStats[r.buddy_id],
      since: r.created_at,
    })),
    ...(receivedRequests ?? []).filter((r) => r.status === 'active').map((r) => ({
      request_id: r.id,
      user_id: r.user_id,
      ...buddyProfiles[r.user_id],
      ...buddyStats[r.user_id],
      since: r.created_at,
    })),
  ]

  const pendingReceived = (receivedRequests ?? [])
    .filter((r) => r.status === 'pending')
    .map((r) => ({
      request_id: r.id,
      user_id: r.user_id,
      ...buddyProfiles[r.user_id],
      ...buddyStats[r.user_id],
      sent_at: r.created_at,
    }))

  const pendingSent = (sentRequests ?? [])
    .filter((r) => r.status === 'pending')
    .map((r) => ({
      request_id: r.id,
      user_id: r.buddy_id,
      ...buddyProfiles[r.buddy_id],
      sent_at: r.created_at,
    }))

  return NextResponse.json({
    buddies: activeBuddies,
    pending_received: pendingReceived,
    pending_sent: pendingSent,
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id)
  if (!rl.allowed) return rl.response

  const body = await request.json()
  const parsed = sendRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const { buddy_id, action } = parsed.data

  if (buddy_id === user.id) {
    return NextResponse.json({ error: 'Cannot buddy yourself' }, { status: 400 })
  }

  if (action === 'send') {
    // Check for existing request
    const { data: existing } = await supabase
      .from('study_buddies')
      .select('id')
      .or(`and(user_id.eq.${user.id},buddy_id.eq.${buddy_id}),and(user_id.eq.${buddy_id},buddy_id.eq.${user.id})`)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Request already exists' }, { status: 409 })
    }

    const { error } = await supabase.from('study_buddies').insert({
      user_id: user.id,
      buddy_id,
      status: 'pending',
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, action: 'sent' })
  }

  if (action === 'accept' || action === 'decline') {
    const newStatus = action === 'accept' ? 'active' : 'declined'
    const { error } = await supabase
      .from('study_buddies')
      .update({ status: newStatus })
      .eq('buddy_id', user.id)
      .eq('user_id', buddy_id)
      .eq('status', 'pending')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, action })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
