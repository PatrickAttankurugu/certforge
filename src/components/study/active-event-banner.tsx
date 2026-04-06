'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getActiveEvent, getEventProgress, type SeasonalEvent } from '@/lib/study/events'
import { createClient } from '@/lib/supabase/client'

export function ActiveEventBanner() {
  const [event, setEvent] = useState<SeasonalEvent | null>(null)
  const [progress, setProgress] = useState<{ current: number; target: number; percentage: number } | null>(null)

  useEffect(() => {
    const activeEvent = getActiveEvent()
    if (!activeEvent) return
    setEvent(activeEvent)

    const fetchProgress = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const [{ data: studyProfile }, { count: mockExamCount }] = await Promise.all([
        supabase
          .from('user_study_profiles')
          .select('study_streak, total_questions_answered')
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('mock_exams')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .gte('completed_at', monthStart),
      ])

      // Get questions answered this month
      const { data: monthSessions } = await supabase
        .from('study_sessions')
        .select('questions_answered')
        .eq('user_id', user.id)
        .gte('session_date', monthStart.split('T')[0])

      const questionsThisMonth = (monthSessions ?? []).reduce(
        (sum, s) => sum + s.questions_answered,
        0
      )

      const eventProgress = getEventProgress(activeEvent, {
        questionsThisMonth,
        streakDays: studyProfile?.study_streak ?? 0,
        mockExamsThisMonth: mockExamCount ?? 0,
      })

      setProgress(eventProgress)
    }

    fetchProgress()
  }, [])

  if (!event) return null

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="py-3 px-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{event.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{event.name}</p>
              <Badge variant="secondary" className="text-[10px]">Limited Event</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{event.description}</p>
            {progress && progress.target > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">
                    {progress.current} / {progress.target}
                  </span>
                  <span className="font-medium">{progress.percentage}%</span>
                </div>
                <Progress value={progress.percentage} className="h-1.5" />
              </div>
            )}
            {event.multiplier && (
              <p className="text-xs text-primary font-medium mt-1">
                {event.multiplier}x XP active for correct answers!
              </p>
            )}
          </div>
          <Badge variant="outline" className={`${event.color} shrink-0 text-[10px]`}>
            {event.reward}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
