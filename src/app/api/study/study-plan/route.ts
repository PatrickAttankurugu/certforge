import { generateText, Output, gateway } from 'ai'
import { z } from 'zod'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkTutorLimit } from '@/lib/study/plan-limits'
import { parseBody } from '@/lib/api/validation'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { DOMAIN_NAMES } from '@/lib/study/constants'
import type { DomainId } from '@/types/study'

const createPlanSchema = z.object({
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  daily_goal_minutes: z.number().int().min(15).max(480).optional().default(60),
  daily_goal_questions: z.number().int().min(5).max(200).optional().default(20),
})

const weekSchema = z.object({
  week_number: z.number(),
  theme: z.string(),
  days: z.array(z.object({
    day: z.string(),
    focus_domain: z.string(),
    topics: z.array(z.string()),
    question_target: z.number(),
    activities: z.array(z.string()),
  })),
  weekly_goal: z.string(),
})

const studyPlanSchema = z.object({
  title: z.string(),
  summary: z.string(),
  weeks: z.array(weekSchema),
  key_priorities: z.array(z.string()),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: plan } = await supabase
    .from('study_plans')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!plan) return NextResponse.json({ plan: null })
  return NextResponse.json({ plan })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id, 'ai')
  if (!rl.allowed) return rl.response

  const usage = await checkTutorLimit(supabase, user.id)
  if (!usage.allowed) return NextResponse.json({ error: usage.message }, { status: 429 })

  const body = await request.json()
  const parsed = parseBody(createPlanSchema, body)
  if (!parsed.success) return parsed.response
  const { target_date, daily_goal_minutes, daily_goal_questions } = parsed.data

  // Get user's domain progress
  const { data: domainProgress } = await supabase
    .from('domain_progress')
    .select('domain_id, accuracy, questions_seen, mastery_level')
    .eq('user_id', user.id)

  // Get weak topics
  const { data: weakTopics } = await supabase
    .from('topic_progress')
    .select('topic_id, domain_id, accuracy, questions_seen')
    .eq('user_id', user.id)
    .eq('is_weak', true)
    .limit(10)

  const domainSummary = (['secure', 'resilient', 'performant', 'cost'] as DomainId[])
    .map((d) => {
      const dp = domainProgress?.find((p) => p.domain_id === d)
      if (!dp) return `${DOMAIN_NAMES[d]}: No data yet`
      return `${DOMAIN_NAMES[d]}: ${Math.round(dp.accuracy * 100)}% accuracy, ${dp.questions_seen} questions seen, mastery ${dp.mastery_level}/5`
    })
    .join('\n')

  const weakSummary = (weakTopics ?? [])
    .map((w) => `${w.topic_id.replace(/_/g, ' ')} (${DOMAIN_NAMES[w.domain_id as DomainId]}) - ${Math.round(w.accuracy * 100)}%`)
    .join(', ')

  const today = new Date()
  const target = new Date(target_date)
  const daysUntilExam = Math.max(1, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  const weeksUntilExam = Math.max(1, Math.ceil(daysUntilExam / 7))

  const prompt = `You are an AWS SAA-C03 exam study planner.
Create a personalized ${Math.min(weeksUntilExam, 8)}-week study plan.

STUDENT PROFILE:
- Days until exam: ${daysUntilExam}
- Daily study time: ${daily_goal_minutes} minutes
- Daily question target: ${daily_goal_questions} questions

CURRENT DOMAIN PERFORMANCE:
${domainSummary}

WEAK AREAS: ${weakSummary || 'None identified yet'}

EXAM WEIGHT:
- Design Secure Architectures: 30%
- Design Resilient Architectures: 26%
- Design High-Performing Architectures: 24%
- Design Cost-Optimized Architectures: 20%

Create a realistic study plan. Front-load weak areas. Include review days. Each week should have a theme.
For each day, specify the focus domain, specific topics, question target, and activities (e.g., "Review S3 lifecycle policies", "Take practice quiz on VPC").
Use day names: Monday through Sunday.`

  const { output: plan } = await generateText({
    model: gateway('openai/gpt-4o-mini'),
    prompt,
    output: Output.object({ schema: studyPlanSchema }),
  })

  if (!plan) return NextResponse.json({ error: 'Failed to generate study plan' }, { status: 500 })

  // Archive existing active plans
  await supabase
    .from('study_plans')
    .update({ status: 'archived' })
    .eq('user_id', user.id)
    .eq('status', 'active')

  // Save new plan
  const { data: saved, error } = await supabase
    .from('study_plans')
    .insert({
      user_id: user.id,
      title: plan.title,
      plan_data: { summary: plan.summary, key_priorities: plan.key_priorities },
      weekly_schedule: plan.weeks,
      target_date,
      status: 'active',
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ plan_id: saved.id, ...plan })
}
