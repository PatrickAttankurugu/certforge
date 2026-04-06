'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, CheckCircle, XCircle, Trophy, TrendingUp } from 'lucide-react'
import { DOMAIN_NAMES, DOMAIN_COLORS, EXAM_PASS_SCORE } from '@/lib/study/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { DomainId, DomainBreakdown } from '@/types/study'

interface ExamResults {
  id: string
  status: string
  score: number | null
  correct_count: number | null
  total_questions: number
  predicted_pass: boolean | null
  domain_breakdown: Record<string, DomainBreakdown> | null
  time_used_ms: number | null
  started_at: string
  completed_at: string | null
}

export default function ExamResultsPage({ params }: { params: Promise<{ examId: string }> }) {
  const router = useRouter()
  const [examId, setExamId] = useState<string>('')
  const [exam, setExam] = useState<ExamResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(({ examId: id }) => setExamId(id))
  }, [params])

  useEffect(() => {
    if (!examId) return
    fetch(`/api/study/mock-exam/${examId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === 'in_progress') {
          router.replace(`/mock-exam/${examId}`)
          return
        }
        setExam(data)
        setLoading(false)
      })
  }, [examId, router])

  if (loading || !exam) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const passed = exam.predicted_pass
  const percentage = exam.total_questions > 0 ? ((exam.correct_count ?? 0) / exam.total_questions * 100) : 0
  const timeMinutes = exam.time_used_ms ? Math.round(exam.time_used_ms / 60000) : null
  const domains = (['secure', 'resilient', 'performant', 'cost'] as DomainId[])

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/mock-exam">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Exam Results</h1>
      </div>

      {/* Score hero card */}
      <Card className={passed ? 'border-green-500/50' : 'border-red-500/50'}>
        <CardContent className="pt-6 pb-6 text-center space-y-3">
          {passed ? (
            <Trophy className="h-14 w-14 mx-auto text-green-500" />
          ) : (
            <XCircle className="h-14 w-14 mx-auto text-red-500" />
          )}
          <div>
            <p className="text-4xl font-bold font-mono">{exam.score ?? 0}</p>
            <p className="text-sm text-muted-foreground">
              {EXAM_PASS_SCORE} required to pass
            </p>
          </div>
          <Badge className={cn('text-sm', passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>
            {passed ? 'PASS' : 'FAIL'}
          </Badge>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{exam.correct_count ?? 0}<span className="text-sm text-muted-foreground font-normal">/{exam.total_questions}</span></p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{Math.round(percentage)}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{timeMinutes ?? '--'}<span className="text-sm text-muted-foreground font-normal">min</span></p>
            <p className="text-xs text-muted-foreground">Time Used</p>
          </CardContent>
        </Card>
      </div>

      {/* Domain breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Domain Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {domains.map((domain) => {
            const breakdown = exam.domain_breakdown?.[domain]
            const accuracy = breakdown ? breakdown.accuracy : 0
            const correct = breakdown?.correct ?? 0
            const total = breakdown?.total ?? 0

            return (
              <div key={domain} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[domain] }} />
                    <span className="truncate">{DOMAIN_NAMES[domain]}</span>
                  </div>
                  <span className="font-mono text-xs">
                    {correct}/{total} ({Math.round(accuracy * 100)}%)
                  </span>
                </div>
                <Progress value={accuracy * 100} className="h-1.5" />
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Link href="/mock-exam">
          <Button variant="outline">Back to Exams</Button>
        </Link>
        <Link href="/practice">
          <Button>Practice Weak Areas</Button>
        </Link>
      </div>
    </div>
  )
}
