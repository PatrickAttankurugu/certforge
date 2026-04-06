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
  Zap,
  CheckCircle,
  XCircle,
  Lightbulb,
  RefreshCw,
  ArrowLeft,
  Trophy,
} from 'lucide-react'
import type { DueCard } from '@/types/study'

const QUICK_COUNT = 10

export default function Quick10Page() {
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
  const [explaining, setExplaining] = useState(false)
  const [aiExplanation, setAiExplanation] = useState('')

  const fetchCards = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/study/cards?mode=quick10')
    const data = await res.json()

    if (Array.isArray(data) && data.length > 0) {
      setCards(data.slice(0, QUICK_COUNT))
    } else {
      // Try assigning new cards first
      await fetch('/api/study/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: QUICK_COUNT }),
      })
      const retry = await fetch('/api/study/cards?mode=quick10')
      const retryData = await retry.json()
      setCards(Array.isArray(retryData) ? retryData.slice(0, QUICK_COUNT) : [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchCards() }, [fetchCards])

  const currentCard = cards[currentIndex]
  const totalQuestions = Math.min(cards.length, QUICK_COUNT)
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

  const handleExplainMore = async () => {
    if (!currentCard || !lastResult) return
    setExplaining(true)
    setAiExplanation('')

    const res = await fetch('/api/study/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: currentCard.question_id,
        selected_answer: lastResult.correct_answers,
      }),
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()
    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setAiExplanation((prev) => prev + decoder.decode(value))
      }
    }
    setExplaining(false)
  }

  const handleNext = () => {
    setLastResult(null)
    setAiExplanation('')
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
          <CardContent className="pt-6 text-center space-y-4">
            <Zap className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-lg font-semibold">No questions available</h2>
            <p className="text-sm text-muted-foreground">
              There are no questions ready for a Quick 10 session right now.
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

  // Completion screen
  if (completed) {
    const accuracy = totalQuestions > 0 ? Math.round((stats.correct / totalQuestions) * 100) : 0

    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-8 text-center space-y-6">
            <Trophy className="h-16 w-16 mx-auto text-amber-400" />
            <div>
              <h2 className="text-2xl font-bold">Quick 10 Complete!</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Great job finishing your focused session.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-500">{stats.correct}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-500">{stats.wrong}</p>
                <p className="text-xs text-muted-foreground">Incorrect</p>
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
              <Button onClick={() => {
                setCards([])
                setCurrentIndex(0)
                setStats({ correct: 0, wrong: 0 })
                setCompleted(false)
                setLastResult(null)
                setAiExplanation('')
                fetchCards()
              }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Another Quick 10
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/practice')} aria-label="Back to practice">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" aria-hidden="true" />
              <h1 className="text-lg font-bold">Quick 10</h1>
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

      {/* Progress bar */}
      <Progress value={progressPercent} className="h-2" aria-label={`Progress: ${Math.round(progressPercent)}%`} />

      {/* Question */}
      {currentCard && (
        <QuestionCard card={currentCard} onAnswer={handleAnswer} />
      )}

      {/* Post-answer actions */}
      {lastResult && (
        <div className="space-y-3">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm leading-relaxed">{lastResult.explanation}</p>
            </CardContent>
          </Card>

          {aiExplanation && (
            <Card className="border-blue-500/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-blue-400" aria-hidden="true" />
                  <span className="text-xs font-medium text-blue-400">AI Explanation</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{aiExplanation}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            {!aiExplanation && (
              <Button variant="outline" size="sm" onClick={handleExplainMore} disabled={explaining}>
                <Lightbulb className="h-4 w-4 mr-1" />
                {explaining ? 'Explaining...' : 'Explain more'}
              </Button>
            )}
            <Button onClick={handleNext} className="ml-auto">
              {currentIndex + 1 < totalQuestions ? 'Next Question' : 'Finish'}
              <RefreshCw className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
