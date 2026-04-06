'use client'

import { useState, useEffect, useCallback } from 'react'
import { QuestionCard } from '@/components/study/question-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { RotateCcw, CheckCircle, PartyPopper } from 'lucide-react'
import type { DueCard } from '@/types/study'

export default function ReviewPage() {
  const [cards, setCards] = useState<DueCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [reviewed, setReviewed] = useState(0)
  const [lastResult, setLastResult] = useState<{
    is_correct: boolean
    explanation: string
  } | null>(null)

  const fetchDueCards = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/study/cards?limit=50')
    const data = await res.json()
    setCards(Array.isArray(data) ? data : [])
    setCurrentIndex(0)
    setLoading(false)
  }, [])

  useEffect(() => { fetchDueCards() }, [fetchDueCards])

  const currentCard = cards[currentIndex]

  const handleAnswer = async (selectedIds: string[], timeMs: number) => {
    if (!currentCard) return

    const res = await fetch(`/api/study/cards/${currentCard.card_id}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selected_answer: selectedIds, time_spent_ms: timeMs }),
    })
    const result = await res.json()
    setLastResult(result)
    setReviewed((r) => r + 1)
  }

  const handleNext = () => {
    setLastResult(null)
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((i) => i + 1)
    } else {
      setCards([]) // all done
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (cards.length === 0 || currentIndex >= cards.length) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            {reviewed > 0 ? (
              <>
                <PartyPopper className="h-12 w-12 mx-auto text-green-500" />
                <h2 className="text-lg font-semibold">All caught up!</h2>
                <p className="text-sm text-muted-foreground">
                  You reviewed {reviewed} card{reviewed === 1 ? '' : 's'} this session.
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                <h2 className="text-lg font-semibold">No cards due for review</h2>
                <p className="text-sm text-muted-foreground">
                  Practice new questions to build your review queue.
                </p>
              </>
            )}
            <Button variant="outline" onClick={fetchDueCards}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Check again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Spaced Review
          </h1>
          <p className="text-sm text-muted-foreground">
            {currentIndex + 1} of {cards.length} due cards
          </p>
        </div>
        <Badge variant="outline">{reviewed} reviewed</Badge>
      </div>

      <QuestionCard card={currentCard} onAnswer={handleAnswer} />

      {lastResult && (
        <div className="space-y-3">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm leading-relaxed">{lastResult.explanation}</p>
            </CardContent>
          </Card>
          <Button onClick={handleNext} className="w-full">
            Next Card
          </Button>
        </div>
      )}
    </div>
  )
}
