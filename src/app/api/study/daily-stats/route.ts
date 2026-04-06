import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = new Date().toISOString().split('T')[0]

  const { data: session } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('session_date', today)
    .single()

  return NextResponse.json(session ?? {
    questions_answered: 0,
    questions_correct: 0,
    study_minutes: 0,
    ai_explanations_used: 0,
  })
}
