'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ClipboardCheck, Clock, CheckCircle, XCircle, Plus } from 'lucide-react'
import { EXAM_TOTAL_QUESTIONS, EXAM_PASS_SCORE } from '@/lib/study/constants'

interface ExamSummary {
  id: string
  status: string
  total_questions: number
  correct_count: number | null
  score: number | null
  predicted_pass: boolean | null
  time_used_ms: number | null
  started_at: string
  completed_at: string | null
}

export default function MockExamListPage() {
  const router = useRouter()
  const [exams, setExams] = useState<ExamSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetch('/api/study/mock-exam')
      .then((r) => r.json())
      .then((data) => setExams(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    setCreating(true)
    const res = await fetch('/api/study/mock-exam', { method: 'POST' })
    const data = await res.json()

    if (data.exam_id) {
      router.push(`/mock-exam/${data.exam_id}`)
    } else if (data.error && data.exam_id) {
      // Resume in-progress exam
      router.push(`/mock-exam/${data.exam_id}`)
    } else {
      alert(data.error || 'Failed to create exam')
      setCreating(false)
    }
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    return `${minutes}m`
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  const inProgress = exams.find((e) => e.status === 'in_progress')

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mock Exams</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Simulate the real SAA-C03 exam: {EXAM_TOTAL_QUESTIONS} questions, 130 minutes.
          </p>
        </div>
        {inProgress ? (
          <Button onClick={() => router.push(`/mock-exam/${inProgress.id}`)}>
            Resume Exam
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={creating}>
            <Plus className="h-4 w-4 mr-2" />
            {creating ? 'Creating...' : 'Start New Exam'}
          </Button>
        )}
      </div>

      {exams.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-lg font-semibold">No exams yet</h2>
            <p className="text-sm text-muted-foreground">
              Take your first mock exam to see how you&apos;d score.
            </p>
          </CardContent>
        </Card>
      )}

      {exams.length > 0 && (
        <div className="space-y-3">
          {exams.map((exam) => (
            <Card
              key={exam.id}
              className={exam.status === 'in_progress' ? 'border-primary/50 cursor-pointer' : 'cursor-pointer'}
              onClick={() => {
                if (exam.status === 'in_progress') router.push(`/mock-exam/${exam.id}`)
                else router.push(`/mock-exam/${exam.id}/results`)
              }}
            >
              <CardContent className="py-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">
                      {new Date(exam.started_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    {exam.status === 'in_progress' && (
                      <Badge className="bg-blue-500/20 text-blue-400 text-xs">In Progress</Badge>
                    )}
                    {exam.status === 'completed' && exam.predicted_pass && (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">Passed</Badge>
                    )}
                    {exam.status === 'completed' && !exam.predicted_pass && (
                      <Badge className="bg-red-500/20 text-red-400 text-xs">Failed</Badge>
                    )}
                  </div>
                  {exam.status === 'completed' && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {exam.correct_count}/{exam.total_questions} correct
                      {exam.time_used_ms ? ` · ${formatTime(exam.time_used_ms)}` : ''}
                    </p>
                  )}
                </div>
                {exam.score !== null && (
                  <div className="text-right">
                    <p className="text-lg font-bold font-mono">{exam.score}</p>
                    <p className="text-xs text-muted-foreground">{EXAM_PASS_SCORE} to pass</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
