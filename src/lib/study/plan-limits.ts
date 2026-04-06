import { SupabaseClient } from '@supabase/supabase-js'
import { PLAN_LIMITS } from './constants'
import type { StudyPlan } from '@/types/study'

interface UsageCheck {
  allowed: boolean
  limit: number
  used: number
  message: string
}

async function getUserPlan(supabase: SupabaseClient, userId: string): Promise<StudyPlan> {
  const { data } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single()
  return (data?.plan ?? 'free') as StudyPlan
}

async function getTodaySession(supabase: SupabaseClient, userId: string) {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('study_sessions')
    .select('questions_answered, ai_explanations_used, ai_questions_generated')
    .eq('user_id', userId)
    .eq('session_date', today)
    .single()
  return data
}

export async function checkExplanationLimit(supabase: SupabaseClient, userId: string): Promise<UsageCheck> {
  const plan = await getUserPlan(supabase, userId)
  const limits = PLAN_LIMITS[plan]
  if (limits.ai_explanations_per_day === Infinity) {
    return { allowed: true, limit: Infinity, used: 0, message: '' }
  }

  const session = await getTodaySession(supabase, userId)
  const used = session?.ai_explanations_used ?? 0

  if (used >= limits.ai_explanations_per_day) {
    return {
      allowed: false,
      limit: limits.ai_explanations_per_day,
      used,
      message: `You've used all ${limits.ai_explanations_per_day} AI explanations for today. Upgrade your plan for unlimited explanations.`,
    }
  }

  return { allowed: true, limit: limits.ai_explanations_per_day, used, message: '' }
}

export async function checkTutorLimit(supabase: SupabaseClient, userId: string): Promise<UsageCheck> {
  const plan = await getUserPlan(supabase, userId)
  const limits = PLAN_LIMITS[plan]
  if (limits.tutor_messages_per_day === Infinity) {
    return { allowed: true, limit: Infinity, used: 0, message: '' }
  }
  if (limits.tutor_messages_per_day === 0) {
    return {
      allowed: false,
      limit: 0,
      used: 0,
      message: 'AI Tutor is available on Standard and Premium plans.',
    }
  }

  // Count today's tutor messages from ai_conversations
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { count } = await supabase
    .from('ai_conversations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('conversation_type', 'tutoring')
    .gte('created_at', today.toISOString())

  const used = count ?? 0
  if (used >= limits.tutor_messages_per_day) {
    return {
      allowed: false,
      limit: limits.tutor_messages_per_day,
      used,
      message: `You've reached ${limits.tutor_messages_per_day} tutor messages today. Upgrade for more.`,
    }
  }

  return { allowed: true, limit: limits.tutor_messages_per_day, used, message: '' }
}

export async function checkQuestionGenerationLimit(supabase: SupabaseClient, userId: string): Promise<UsageCheck> {
  const plan = await getUserPlan(supabase, userId)
  const limits = PLAN_LIMITS[plan]
  if (limits.ai_questions_per_day === Infinity) {
    return { allowed: true, limit: Infinity, used: 0, message: '' }
  }
  if (limits.ai_questions_per_day === 0) {
    return {
      allowed: false,
      limit: 0,
      used: 0,
      message: 'AI question generation is available on Standard and Premium plans.',
    }
  }

  const session = await getTodaySession(supabase, userId)
  const used = session?.ai_questions_generated ?? 0

  if (used >= limits.ai_questions_per_day) {
    return {
      allowed: false,
      limit: limits.ai_questions_per_day,
      used,
      message: `You've used all ${limits.ai_questions_per_day} AI-generated questions today. Upgrade for more.`,
    }
  }

  return { allowed: true, limit: limits.ai_questions_per_day, used, message: '' }
}

export async function checkMockExamLimit(supabase: SupabaseClient, userId: string): Promise<UsageCheck> {
  const plan = await getUserPlan(supabase, userId)
  const limits = PLAN_LIMITS[plan]
  if (limits.mock_exams_per_month === Infinity) {
    return { allowed: true, limit: Infinity, used: 0, message: '' }
  }

  // Count this month's completed + in_progress exams
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const { count } = await supabase
    .from('mock_exams')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth)

  const used = count ?? 0
  if (used >= limits.mock_exams_per_month) {
    return {
      allowed: false,
      limit: limits.mock_exams_per_month,
      used,
      message: `You've used all ${limits.mock_exams_per_month} mock exam${limits.mock_exams_per_month === 1 ? '' : 's'} this month. Upgrade for more.`,
    }
  }

  return { allowed: true, limit: limits.mock_exams_per_month, used, message: '' }
}

export async function checkDailyQuestionLimit(supabase: SupabaseClient, userId: string): Promise<UsageCheck> {
  const plan = await getUserPlan(supabase, userId)
  const limits = PLAN_LIMITS[plan]
  if (limits.questions_per_day === Infinity) {
    return { allowed: true, limit: Infinity, used: 0, message: '' }
  }

  const session = await getTodaySession(supabase, userId)
  const used = session?.questions_answered ?? 0

  if (used >= limits.questions_per_day) {
    return {
      allowed: false,
      limit: limits.questions_per_day,
      used,
      message: `You've answered all ${limits.questions_per_day} questions for today. Upgrade for unlimited practice.`,
    }
  }

  return { allowed: true, limit: limits.questions_per_day, used, message: '' }
}
