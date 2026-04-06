import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { parseBody } from '@/lib/api/validation'

const trackTimeSchema = z.object({
  minutes: z.number().min(1).max(120),
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = parseBody(trackTimeSchema, body)
  if (!parsed.success) return parsed.response
  const { minutes } = parsed.data

  const today = new Date().toISOString().split('T')[0]

  // Upsert study session for today
  const { data: session } = await supabase
    .from('study_sessions')
    .select('id, study_minutes')
    .eq('user_id', user.id)
    .eq('session_date', today)
    .single()

  if (session) {
    await supabase
      .from('study_sessions')
      .update({ study_minutes: session.study_minutes + minutes })
      .eq('id', session.id)
  } else {
    await supabase
      .from('study_sessions')
      .insert({ user_id: user.id, session_date: today, study_minutes: minutes })
  }

  // Update total study minutes in user profile
  await supabase.rpc('increment_study_minutes', {
    p_user_id: user.id,
    p_minutes: minutes,
  })

  return NextResponse.json({ tracked: true })
}
