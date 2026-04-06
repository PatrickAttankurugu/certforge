'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, Target, Flame, BookOpen, Award, AlertTriangle, FileDown } from 'lucide-react'
import { DOMAIN_NAMES, DOMAIN_COLORS, EXAM_PASS_SCORE } from '@/lib/study/constants'
import { cn } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts'
import type { DomainId, DomainProgress, TopicProgress, ScorePrediction, StudySession } from '@/types/study'

interface ProgressData {
  study_profile: {
    study_streak: number
    longest_streak: number
    total_questions_answered: number
    total_study_minutes: number
    daily_goal_questions: number
  } | null
  domain_progress: DomainProgress[]
  topic_progress: TopicProgress[]
  recent_sessions: StudySession[]
  recent_exams: { score: number; correct_count: number; total_questions: number; completed_at: string }[]
  prediction: ScorePrediction | null
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/study/progress')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  const profile = data.study_profile
  const domains: DomainId[] = ['secure', 'resilient', 'performant', 'cost']
  const weakTopics = data.topic_progress.filter((t) => t.is_weak)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Progress & Analytics</h1>
        <a
          href="/api/study/report"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
        >
          <FileDown className="h-4 w-4" />
          Export Report
        </a>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <BookOpen className="h-3.5 w-3.5" />
              Questions
            </div>
            <p className="text-2xl font-bold">{profile?.total_questions_answered ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Flame className="h-3.5 w-3.5" />
              Streak
            </div>
            <p className="text-2xl font-bold">{profile?.study_streak ?? 0} <span className="text-sm text-muted-foreground font-normal">days</span></p>
            <p className="text-xs text-muted-foreground">Best: {profile?.longest_streak ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Target className="h-3.5 w-3.5" />
              Study Time
            </div>
            <p className="text-2xl font-bold">{profile?.total_study_minutes ?? 0} <span className="text-sm text-muted-foreground font-normal">min</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Predicted Score
            </div>
            <p className="text-2xl font-bold font-mono">
              {data.prediction?.predicted_score ?? '--'}
            </p>
            {data.prediction && (
              <Badge className={cn('text-xs mt-1',
                data.prediction.pass_likelihood === 'likely' ? 'bg-green-500/20 text-green-400' :
                data.prediction.pass_likelihood === 'possible' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              )}>
                {data.prediction.pass_likelihood === 'likely' ? 'Likely Pass' :
                 data.prediction.pass_likelihood === 'possible' ? 'Possible Pass' : 'Unlikely Pass'}
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Domain breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Domain Mastery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {domains.map((id) => {
            const progress = data.domain_progress.find((d) => d.domain_id === id)
            const accuracy = progress?.accuracy ?? 0
            const seen = progress?.questions_seen ?? 0

            return (
              <div key={id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[id] }} />
                    <span>{DOMAIN_NAMES[id]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{seen} questions</span>
                    <span className="font-mono text-sm font-medium w-10 text-right">{Math.round(accuracy * 100)}%</span>
                  </div>
                </div>
                <Progress value={accuracy * 100} className="h-2" />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Study activity bar chart */}
        {data.recent_sessions.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Study Activity (Last 14 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.recent_sessions.slice(0, 14).reverse().map((s) => ({
                  date: new Date(s.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  questions: s.questions_answered,
                  correct: s.questions_correct,
                }))}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="questions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Answered" />
                  <Bar dataKey="correct" fill="#22c55e" radius={[4, 4, 0, 0]} name="Correct" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Domain radar chart */}
        {data.domain_progress.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Domain Mastery Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={domains.map((id) => {
                  const p = data.domain_progress.find((d) => d.domain_id === id)
                  return {
                    domain: DOMAIN_NAMES[id].replace('Design ', '').replace(' Architectures', ''),
                    accuracy: Math.round((p?.accuracy ?? 0) * 100),
                  }
                })}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="domain" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <Radar dataKey="accuracy" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Weak areas */}
      {weakTopics.length > 0 && (
        <Card className="border-amber-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Weak Areas ({weakTopics.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {weakTopics.map((tp) => (
              <div key={tp.topic_id} className="flex items-center justify-between p-2 rounded-lg border">
                <div>
                  <p className="text-sm">{tp.topic_id.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">{tp.questions_seen} questions</p>
                </div>
                <Badge className="bg-red-500/20 text-red-400 text-xs font-mono">
                  {Math.round(tp.accuracy * 100)}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Mock exam history */}
      {data.recent_exams.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" />
              Mock Exam History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.recent_exams.map((exam, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg border">
                  <div>
                    <p className="text-sm">
                      {new Date(exam.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {exam.correct_count}/{exam.total_questions} correct
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-lg font-bold font-mono', exam.score >= EXAM_PASS_SCORE ? 'text-green-400' : 'text-red-400')}>
                      {exam.score}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent activity */}
      {data.recent_sessions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Study Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {data.recent_sessions.slice(0, 14).map((session) => {
                const accuracy = session.questions_answered > 0
                  ? session.questions_correct / session.questions_answered
                  : 0

                return (
                  <div key={session.id} className="flex items-center justify-between py-1.5 text-sm">
                    <span className="text-muted-foreground">
                      {new Date(session.session_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{session.questions_answered} questions</span>
                      <span className="font-mono text-xs w-10 text-right">{Math.round(accuracy * 100)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
