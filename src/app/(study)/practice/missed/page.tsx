'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionCard } from '@/components/study/question-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  XCircle,
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  Trophy,
  Lightbulb,
} from 'lucide-react'
import type { DueCard } from '@/types/study'

export default function MissedQuestionsPage() {
  const router = useRouter()
  const [cards, setCards] = useState<DueCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ correct: 0, wrong: 0 })
  const [completed, setCompleted] = useState(false)
  const [lastResult, setLastResult] = useState<{
    is_correct: boolean
    explanation: string
    correct_answers: string[]
  } | null>(null)

  const fetchCards = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/study/cards/missed?limit=20')
    const data = await res.json()
    setCards(Array.isArray(data) ? data : [])
    setCurrentIndex(0)
    setStats({ correct: 0, wrong: 0 })
    setCompleted(false)
    setLoading(false)
  }, [])

  useEffect(() => { fetchCards() }, [fetchCards])

  const currentCard = cards[currentIndex]
  const totalQuestions = cards.length
  const progressPercent = totalQuestions > 0 ? ((currentIndex + (lastResult ? 1 : 0)) / totalQuestions) * 100 : 0

  const handleAnswer = async (selectedIds: string[], timeMs: number) => {
    if (!currentCard) return

    const res = await fetch(`/api/study/cards/${currentCard.card_id}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selected_answer: selectedIds, time_spent_ms: timeMs }),
    })
    const result = await res.json()

    setLastResult(result)
    setStats((prev) => ({
      correct: prev.correct + (result.is_correct ? 1 : 0),
      wrong: prev.wrong + (result.is_correct ? 0 : 1),
    }))
  }

  const handleNext = () => {
    setLastResult(null)
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((i) => i + 1)
    } else {
      setCompleted(true)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Card>
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-lg font-semibold">No missed questions!</h2>
            <p className="text-sm text-muted-foreground">
              You&apos;ve answered everything correctly, or haven&apos;t practiced yet. Keep it up!
            </p>
            <Button variant="outline" onClick={() => router.push('/practice')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Practice
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (completed) {
    const accuracy = totalQuestions > 0 ? Math.round((stats.correct / totalQuestions) * 100) : 0
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-8 text-center space-y-6">
            <Trophy className="h-16 w-16 mx-auto text-amber-400" />
            <div>
              <h2 className="text-2xl font-bold">Review Complete!</h2>
              <p className="text-muted-foreground text-sm mt-1">
                You&apos;ve reviewed all your missed questions.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-500">{stats.correct}</p>
                <p className="text-xs text-muted-foreground">Now Correct</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-500">{stats.wrong}</p>
                <p className="text-xs text-muted-foreground">Still Missed</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push('/practice')}>
                Back to Practice
              </Button>
              <Button onClick={fetchCards}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Review Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/practice')} aria-label="Back to practice">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-400" aria-hidden="true" />
              <h1 className="text-lg font-bold">Missed Questions</h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" aria-hidden="true" />
            {stats.correct}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <XCircle className="h-3 w-3 text-red-500" aria-hidden="true" />
            {stats.wrong}
          </Badge>
        </div>
      </div>

      <Progress value={progressPercent} className="h-2" aria-label={`Progress: ${Math.round(progressPercent)}%`} />

      {currentCard && <QuestionCard card={currentCard} onAnswer={handleAnswer} />}

      {lastResult && (
        <div className="space-y-3">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-blue-400" aria-hidden="true" />
                <span className="text-xs font-medium">Explanation</span>
              </div>
              <p className="text-sm leading-relaxed">{lastResult.explanation}</p>
            </CardContent>
          </Card>
          <Button onClick={handleNext} className="w-full">
            {currentIndex + 1 < totalQuestions ? 'Next Question' : 'Finish Review'}
          </Button>
        </div>
      )}
    </div>
  )
}
