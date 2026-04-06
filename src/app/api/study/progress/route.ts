import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { predictExamScore } from '@/lib/study/score-predictor'
import type { DomainProgress } from '@/types/study'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [
    { data: studyProfile },
    { data: domainProgress },
    { data: topicProgress },
    { data: recentSessions },
    { data: recentExams },
  ] = await Promise.all([
    supabase.from('user_study_profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('domain_progress').select('*').eq('user_id', user.id),
    supabase.from('topic_progress').select('*').eq('user_id', user.id),
    supabase.from('study_sessions').select('*').eq('user_id', user.id).order('session_date', { ascending: false }).limit(30),
    supabase.from('mock_exams').select('score, correct_count, total_questions, completed_at').eq('user_id', user.id).eq('status', 'completed').order('completed_at', { ascending: false }).limit(10),
  ])

  const dp = (domainProgress ?? []) as DomainProgress[]
  const prediction = dp.length > 0 ? predictExamScore(dp) : null

  return NextResponse.json({
    study_profile: studyProfile,
    domain_progress: dp,
    topic_progress: topicProgress ?? [],
    recent_sessions: recentSessions ?? [],
    recent_exams: recentExams ?? [],
    prediction,
  })
}
