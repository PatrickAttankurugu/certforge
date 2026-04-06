'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle, Keyboard } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EXAM_TIME_LIMIT_MS, DIFFICULTY_LABELS, DOMAIN_NAMES } from '@/lib/study/constants'
import { useKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts'
import type { DomainId, QuestionOption } from '@/types/study'

interface ExamQuestion {
  id: string
  domain_id: DomainId
  difficulty: number
  question_text: string
  question_type: 'single' | 'multi'
  options: { id: string; text: string }[]
}

interface ExamData {
  id: string
  status: string
  questions: ExamQuestion[]
  answers: Record<string, { selected: string[]; time_ms: number }>
  time_limit_ms: number
  started_at: string
}

export default function TakeExamPage({ params }: { params: Promise<{ examId: string }> }) {
  const router = useRouter()
  const [examId, setExamId] = useState<string>('')
  const [exam, setExam] = useState<ExamData | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_LIMIT_MS)
  const [submitting, setSubmitting] = useState(false)
  const questionStartTime = useRef(Date.now())

  // Resolve params
  useEffect(() => {
    params.then(({ examId: id }) => setExamId(id))
  }, [params])

  const fetchExam = useCallback(async () => {
    if (!examId) return
    setLoading(true)
    const res = await fetch(`/api/study/mock-exam/${examId}`)
    const data = await res.json()

    if (data.status === 'completed') {
      router.replace(`/mock-exam/${examId}/results`)
      return
    }

    setExam(data)
    // Restore answers
    const restored: Record<string, string[]> = {}
    for (const [qId, ans] of Object.entries(data.answers ?? {})) {
      restored[qId] = (ans as { selected: string[] }).selected
    }
    setAnswers(restored)

    // Calculate remaining time
    const elapsed = Date.now() - new Date(data.started_at).getTime()
    setTimeLeft(Math.max(0, data.time_limit_ms - elapsed))
    setLoading(false)
  }, [examId, router])

  useEffect(() => { fetchExam() }, [fetchExam])

  // Timer
  useEffect(() => {
    if (!exam || loading) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1000
        if (next <= 0) {
          clearInterval(interval)
          handleFinish()
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [exam, loading])

  // Load saved answer when navigating to a question
  useEffect(() => {
    if (!exam) return
    const q = exam.questions[currentIndex]
    if (!q) return
    const saved = answers[q.id]
    setSelected(new Set(saved ?? []))
    questionStartTime.current = Date.now()
  }, [currentIndex, exam])

  const currentQuestion = exam?.questions[currentIndex]
  const optionIds = currentQuestion?.options.map((o) => o.id) ?? []

  // Keyboard shortcuts: A/B/C/D to select, arrows to navigate
  useKeyboardShortcuts({
    optionIds,
    onSelectOption: useCallback((id: string) => {
      setSelected((prev) => {
        const next = new Set(prev)
        if (currentQuestion?.question_type === 'multi') {
          if (next.has(id)) next.delete(id)
          else next.add(id)
        } else {
          next.clear()
          next.add(id)
        }
        return next
      })
    }, [currentQuestion?.question_type]),
    onNext: useCallback(() => {
      setCurrentIndex((i) => i + 1 < (exam?.questions.length ?? 0) ? i + 1 : i)
    }, [exam?.questions.length]),
    onPrevious: useCallback(() => {
      setCurrentIndex((i) => i > 0 ? i - 1 : i)
    }, []),
    enabled: !!exam && !loading && !submitting,
  })

  const toggleOption = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (currentQuestion?.question_type === 'multi') {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      } else {
        next.clear()
        next.add(id)
      }
      return next
    })
  }, [currentQuestion?.question_type])

  const saveAnswer = async () => {
    if (!currentQuestion || selected.size === 0) return
    const timeMs = Date.now() - questionStartTime.current
    const selectedArr = Array.from(selected)

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedArr }))

    // Fire and forget save
    fetch(`/api/study/mock-exam/${examId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: currentQuestion.id,
        selected: selectedArr,
        time_ms: timeMs,
      }),
    })
  }

  const goNext = async () => {
    await saveAnswer()
    if (currentIndex + 1 < (exam?.questions.length ?? 0)) {
      setCurrentIndex((i) => i + 1)
    }
  }

  const goPrev = () => {
    saveAnswer()
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }

  const handleFinish = async () => {
    setSubmitting(true)
    await saveAnswer()
    const res = await fetch(`/api/study/mock-exam/${examId}/complete`, { method: 'POST' })
    if (res.ok) {
      router.push(`/mock-exam/${examId}/results`)
    } else {
      setSubmitting(false)
    }
  }

  const formatTimer = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return `${h > 0 ? `${h}:` : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  if (loading || !exam) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  const answeredCount = Object.keys(answers).length
  const totalQuestions = exam.questions.length
  const isLowTime = timeLeft < 10 * 60 * 1000 // less than 10 minutes

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
      {/* Top bar: timer + progress */}
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-background z-10 py-2">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono text-sm">
            {currentIndex + 1} / {totalQuestions}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {answeredCount} answered
          </Badge>
        </div>
        <div className={cn('flex items-center gap-2 font-mono text-sm font-medium', isLowTime && 'text-red-400')}>
          <Clock className="h-4 w-4" />
          {formatTimer(timeLeft)}
        </div>
      </div>

      <Progress value={(answeredCount / totalQuestions) * 100} className="h-1.5" />

      {/* Question */}
      {currentQuestion && (
        <Card>
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {DOMAIN_NAMES[currentQuestion.domain_id]}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {DIFFICULTY_LABELS[currentQuestion.difficulty]}
              </Badge>
              {currentQuestion.question_type === 'multi' && (
                <Badge variant="secondary" className="text-xs">Select all that apply</Badge>
              )}
            </div>

            <p className="text-sm leading-relaxed whitespace-pre-wrap">{currentQuestion.question_text}</p>

            <div className="space-y-2" role={currentQuestion.question_type === 'multi' ? 'group' : 'radiogroup'} aria-label="Answer options">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  role={currentQuestion.question_type === 'multi' ? 'checkbox' : 'radio'}
                  aria-checked={selected.has(option.id)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all',
                    selected.has(option.id)
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-border hover:border-muted-foreground/50 cursor-pointer'
                  )}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-muted text-xs font-bold" aria-hidden="true">
                    {option.id}
                  </span>
                  <span className="pt-0.5">{option.text}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={goPrev} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentIndex === totalQuestions - 1 ? (
            <ConfirmDialog
              trigger={
                <Button variant="destructive" disabled={submitting}>
                  <Flag className="h-4 w-4 mr-2" />
                  {submitting ? 'Submitting...' : 'Finish Exam'}
                </Button>
              }
              title="Submit exam?"
              description={`You have answered ${answeredCount} of ${totalQuestions} questions. ${totalQuestions - answeredCount > 0 ? `${totalQuestions - answeredCount} unanswered questions will be marked incorrect.` : 'All questions answered.'}`}
              confirmLabel="Submit Exam"
              onConfirm={handleFinish}
            />
          ) : (
            <Button onClick={goNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Question navigator */}
      <Card>
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground mb-2">Question Navigator</p>
          <div className="flex flex-wrap gap-1" role="navigation" aria-label="Question navigator">
            {exam.questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => { saveAnswer(); setCurrentIndex(i) }}
                className={cn(
                  'h-7 w-7 text-xs rounded border flex items-center justify-center font-mono transition-colors',
                  i === currentIndex && 'border-primary bg-primary/20',
                  i !== currentIndex && answers[q.id] && 'bg-muted text-foreground',
                  i !== currentIndex && !answers[q.id] && 'text-muted-foreground hover:bg-muted/50'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Keyboard shortcut hint */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Keyboard className="h-3.5 w-3.5" />
        <span>Press <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">A</kbd>-<kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">D</kbd> to select, <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">&larr;</kbd><kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">&rarr;</kbd> to navigate</span>
      </div>

      {/* Warning for unanswered */}
      {answeredCount < totalQuestions && timeLeft < 5 * 60 * 1000 && (
        <div className="flex items-center gap-2 text-amber-400 text-sm">
          <AlertTriangle className="h-4 w-4" />
          {totalQuestions - answeredCount} questions unanswered with {formatTimer(timeLeft)} remaining
        </div>
      )}
    </div>
  )
}
