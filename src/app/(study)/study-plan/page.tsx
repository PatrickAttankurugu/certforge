'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { CalendarDays, Target, Loader2, RefreshCw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react'

interface DayPlan {
  day: string
  focus_domain: string
  topics: string[]
  question_target: number
  activities: string[]
}

interface WeekPlan {
  week_number: number
  theme: string
  days: DayPlan[]
  weekly_goal: string
}

interface StudyPlanData {
  id: string
  title: string
  plan_data: { summary: string; key_priorities: string[] }
  weekly_schedule: WeekPlan[]
  target_date: string | null
  status: string
  created_at: string
}

export default function StudyPlanPage() {
  const [plan, setPlan] = useState<StudyPlanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [targetDate, setTargetDate] = useState('')
  const [dailyMinutes, setDailyMinutes] = useState(60)
  const [dailyQuestions, setDailyQuestions] = useState(20)
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null)
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/study/study-plan')
      .then((r) => r.json())
      .then((data) => {
        if (data.plan) setPlan(data.plan)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Load completed days from localStorage
  useEffect(() => {
    if (plan) {
      const saved = localStorage.getItem(`study-plan-progress-${plan.id}`)
      if (saved) setCompletedDays(new Set(JSON.parse(saved)))
    }
  }, [plan])

  const toggleDay = (key: string) => {
    setCompletedDays((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      if (plan) localStorage.setItem(`study-plan-progress-${plan.id}`, JSON.stringify([...next]))
      return next
    })
  }

  const handleGenerate = async () => {
    if (!targetDate) return
    setGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/study/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_date: targetDate,
          daily_goal_minutes: dailyMinutes,
          daily_goal_questions: dailyQuestions,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to generate plan')
        setGenerating(false)
        return
      }

      // Reload plan
      const planRes = await fetch('/api/study/study-plan')
      const planData = await planRes.json()
      if (planData.plan) {
        setPlan(planData.plan)
        setCompletedDays(new Set())
      }
    } catch {
      setError('Failed to generate plan. Please try again.')
    }
    setGenerating(false)
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          AI Study Plan
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personalized week-by-week plan based on your progress and weak areas
        </p>
      </div>

      {/* Generate / Regenerate form */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1">
              <label htmlFor="target-date" className="text-xs font-medium">Target Exam Date</label>
              <input
                id="target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="block rounded-md border bg-background px-3 py-2 text-sm"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="daily-minutes" className="text-xs font-medium">Daily Minutes</label>
              <input
                id="daily-minutes"
                type="number"
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(Number(e.target.value))}
                className="block w-24 rounded-md border bg-background px-3 py-2 text-sm"
                min={15}
                max={480}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="daily-questions" className="text-xs font-medium">Daily Questions</label>
              <input
                id="daily-questions"
                type="number"
                value={dailyQuestions}
                onChange={(e) => setDailyQuestions(Number(e.target.value))}
                className="block w-24 rounded-md border bg-background px-3 py-2 text-sm"
                min={5}
                max={200}
              />
            </div>
            <Button onClick={handleGenerate} disabled={generating || !targetDate} size="sm">
              {generating ? (
                <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Generating...</>
              ) : plan ? (
                <><RefreshCw className="h-4 w-4 mr-1" /> Regenerate Plan</>
              ) : (
                <><Target className="h-4 w-4 mr-1" /> Generate Plan</>
              )}
            </Button>
          </div>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {/* Existing plan display */}
      {plan && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{plan.title}</CardTitle>
              {plan.target_date && (
                <p className="text-xs text-muted-foreground">
                  Target: {new Date(plan.target_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{plan.plan_data.summary}</p>

              {plan.plan_data.key_priorities?.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1">Key Priorities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.plan_data.key_priorities.map((p, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly schedule */}
          <div className="space-y-3">
            {(plan.weekly_schedule as WeekPlan[]).map((week) => {
              const isExpanded = expandedWeek === week.week_number
              const weekDayKeys = week.days.map((_, di) => `w${week.week_number}-d${di}`)
              const completedCount = weekDayKeys.filter((k) => completedDays.has(k)).length
              const totalDays = week.days.length

              return (
                <Card key={week.week_number}>
                  <button
                    onClick={() => setExpandedWeek(isExpanded ? null : week.week_number)}
                    className="w-full text-left"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-sm">
                            Week {week.week_number}: {week.theme}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">{week.weekly_goal}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {completedCount}/{totalDays} days
                          </Badge>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>
                    </CardHeader>
                  </button>

                  {isExpanded && (
                    <CardContent className="pt-0 space-y-2">
                      {week.days.map((day, di) => {
                        const dayKey = `w${week.week_number}-d${di}`
                        const isDone = completedDays.has(dayKey)

                        return (
                          <div
                            key={di}
                            className={cn(
                              'rounded-lg border p-3 space-y-2 transition-colors',
                              isDone && 'bg-green-500/5 border-green-500/20'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleDay(dayKey)}
                                  className={cn(
                                    'h-5 w-5 rounded-full border flex items-center justify-center transition-colors',
                                    isDone ? 'bg-green-500 border-green-500' : 'border-muted-foreground/30 hover:border-muted-foreground'
                                  )}
                                  aria-label={isDone ? `Mark ${day.day} incomplete` : `Mark ${day.day} complete`}
                                >
                                  {isDone && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                                </button>
                                <span className="text-sm font-medium">{day.day}</span>
                                <Badge variant="secondary" className="text-xs">{day.focus_domain}</Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">{day.question_target} questions</span>
                            </div>

                            <div className="pl-7 space-y-1">
                              <div className="flex flex-wrap gap-1">
                                {day.topics.map((topic, ti) => (
                                  <Badge key={ti} variant="outline" className="text-xs">{topic}</Badge>
                                ))}
                              </div>
                              <ul className="text-xs text-muted-foreground space-y-0.5">
                                {day.activities.map((activity, ai) => (
                                  <li key={ai}>&bull; {activity}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )
                      })}
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </>
      )}

      {!plan && !generating && (
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No active study plan</p>
            <p className="text-xs text-muted-foreground mt-1">
              Set your exam date above and generate a personalized study plan.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
