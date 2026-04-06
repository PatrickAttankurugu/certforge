import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DOMAIN_NAMES, DOMAIN_COLORS, EXAM_PASS_SCORE } from '@/lib/study/constants'
import { predictExamScore } from '@/lib/study/score-predictor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import {
  BookOpen,
  RotateCcw,
  Target,
  TrendingUp,
  Flame,
  ClipboardCheck,
  AlertTriangle,
  Calendar,
} from 'lucide-react'
import type { DomainId, DomainProgress, TopicProgress } from '@/types/study'

export const metadata = { title: 'Dashboard | CertForge' }

export default async function StudyDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Parallel data fetches
  const [
    { data: studyProfile },
    { data: domainProgress },
    { data: topicProgress },
    { data: todaySession },
    { data: dueCards },
    { data: recentExams },
  ] = await Promise.all([
    supabase.from('user_study_profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('domain_progress').select('*').eq('user_id', user.id),
    supabase.from('topic_progress').select('*').eq('user_id', user.id).eq('is_weak', true),
    supabase.from('study_sessions').select('*').eq('user_id', user.id).eq('session_date', new Date().toISOString().split('T')[0]).single(),
    supabase.rpc('get_due_cards', { p_user_id: user.id, p_limit: 1 }),
    supabase.from('mock_exams').select('score,completed_at').eq('user_id', user.id).eq('status', 'completed').order('completed_at', { ascending: false }).limit(3),
  ])

  const dp = (domainProgress ?? []) as DomainProgress[]
  const weakTopics = (topicProgress ?? []) as TopicProgress[]
  const prediction = dp.length > 0 ? predictExamScore(dp) : null
  const dueCount = Array.isArray(dueCards) ? dueCards.length : 0
  const todayAnswered = todaySession?.questions_answered ?? 0
  const dailyGoal = studyProfile?.daily_goal_questions ?? 20
  const streak = studyProfile?.study_streak ?? 0
  const totalAnswered = studyProfile?.total_questions_answered ?? 0

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Study Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          AWS Solutions Architect Associate (SAA-C03)
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Target className="h-3.5 w-3.5" />
              Daily Goal
            </div>
            <p className="text-2xl font-bold">{todayAnswered}<span className="text-sm text-muted-foreground font-normal">/{dailyGoal}</span></p>
            <Progress value={Math.min(100, (todayAnswered / dailyGoal) * 100)} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Flame className="h-3.5 w-3.5" />
              Streak
            </div>
            <p className="text-2xl font-bold">{streak} <span className="text-sm text-muted-foreground font-normal">days</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Predicted Score
            </div>
            <p className="text-2xl font-bold">
              {prediction ? prediction.predicted_score : '--'}
              <span className="text-sm text-muted-foreground font-normal">/{EXAM_PASS_SCORE} to pass</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <BookOpen className="h-3.5 w-3.5" />
              Total Practiced
            </div>
            <p className="text-2xl font-bold">{totalAnswered}</p>
          </CardContent>
        </Card>
      </div>

      {/* Exam countdown & pace */}
      {studyProfile?.target_exam_date && (() => {
        const examDate = new Date(studyProfile.target_exam_date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        examDate.setHours(0, 0, 0, 0)
        const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const totalQuestionsSeen = dp.reduce((sum, d) => sum + d.questions_seen, 0)
        // Estimate ~500 total questions needed for readiness
        const targetTotal = 500
        const remaining = Math.max(0, targetTotal - totalQuestionsSeen)
        const dailyPace = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining

        return (
          <Card className={daysLeft <= 7 ? 'border-red-500/30' : daysLeft <= 30 ? 'border-amber-500/30' : 'border-primary/30'}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {daysLeft > 0
                        ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} until exam`
                        : daysLeft === 0
                        ? 'Exam day is today!'
                        : 'Exam date has passed'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {examDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                {daysLeft > 0 && remaining > 0 && (
                  <div className="text-right">
                    <p className="text-lg font-bold font-mono">{dailyPace}</p>
                    <p className="text-xs text-muted-foreground">questions/day to stay on pace</p>
                  </div>
                )}
                {daysLeft > 0 && remaining === 0 && (
                  <Badge className="bg-green-500/20 text-green-400">On track</Badge>
                )}
              </div>
              {daysLeft > 0 && (
                <Progress value={Math.min(100, (totalQuestionsSeen / targetTotal) * 100)} className="h-1.5 mt-3" />
              )}
            </CardContent>
          </Card>
        )
      })()}

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/practice">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-5 pb-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Practice Questions</p>
                <p className="text-xs text-muted-foreground">Adaptive difficulty, AI explanations</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/review">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-5 pb-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <RotateCcw className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Review Queue</p>
                <p className="text-xs text-muted-foreground">
                  {dueCount > 0 ? `${dueCount} card${dueCount === 1 ? '' : 's'} due` : 'All caught up!'}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/mock-exam">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-5 pb-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <ClipboardCheck className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Mock Exam</p>
                <p className="text-xs text-muted-foreground">65 questions, 130 minutes</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Domain progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Domain Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(['secure', 'resilient', 'performant', 'cost'] as DomainId[]).map((id) => {
            const progress = dp.find((d) => d.domain_id === id)
            const accuracy = progress?.accuracy ?? 0
            const seen = progress?.questions_seen ?? 0
            return (
              <Link key={id} href={`/domains/${id}`}>
                <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[id] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{DOMAIN_NAMES[id]}</p>
                    <p className="text-xs text-muted-foreground">{seen} questions practiced</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-medium">{Math.round(accuracy * 100)}%</p>
                  </div>
                  <Progress value={accuracy * 100} className="w-24 h-1.5" />
                </div>
              </Link>
            )
          })}
        </CardContent>
      </Card>

      {/* Weak areas */}
      {weakTopics.length > 0 && (
        <Card className="border-amber-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Weak Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {weakTopics.slice(0, 6).map((tp) => (
                <Badge key={tp.topic_id} variant="outline" className="text-amber-400 border-amber-500/30">
                  {tp.topic_id.replace(/_/g, ' ')} ({Math.round(tp.accuracy * 100)}%)
                </Badge>
              ))}
            </div>
            <Link href="/practice?focus=weak">
              <Button variant="outline" size="sm" className="mt-3">
                Practice weak areas
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
