'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { QuestionCard } from '@/components/study/question-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, RefreshCw, CheckCircle, XCircle, Lightbulb, Filter } from 'lucide-react'
import { DOMAIN_NAMES, DOMAIN_COLORS } from '@/lib/study/constants'
import type { DueCard, DomainId } from '@/types/study'
import { Suspense } from 'react'

const DOMAINS: DomainId[] = ['secure', 'resilient', 'performant', 'cost']

function PracticeContent() {
  const searchParams = useSearchParams()
  const focusDomain = searchParams.get('domain')

  const [cards, setCards] = useState<DueCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0, total: 0 })
  const [lastResult, setLastResult] = useState<{
    is_correct: boolean
    explanation: string
    correct_answers: string[]
  } | null>(null)
  const [explaining, setExplaining] = useState(false)
  const [aiExplanation, setAiExplanation] = useState('')

  const fetchCards = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '20' })
    if (focusDomain) params.set('domain', focusDomain)

    const res = await fetch(`/api/study/cards?${params}`)
    const data = await res.json()

    if (Array.isArray(data) && data.length > 0) {
      setCards(data)
      setCurrentIndex(0)
    } else {
      // No due cards — assign new ones
      await fetch('/api/study/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain_id: focusDomain, count: 20 }),
      })
      const retry = await fetch(`/api/study/cards?${params}`)
      const retryData = await retry.json()
      setCards(Array.isArray(retryData) ? retryData : [])
      setCurrentIndex(0)
    }
    setLoading(false)
  }, [focusDomain])

  useEffect(() => { fetchCards() }, [fetchCards])

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
    setSessionStats((prev) => ({
      correct: prev.correct + (result.is_correct ? 1 : 0),
      wrong: prev.wrong + (result.is_correct ? 0 : 1),
      total: prev.total + 1,
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
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((i) => i + 1)
    } else {
      fetchCards()
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

  if (cards.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-lg font-semibold">No questions available</h2>
            <p className="text-sm text-muted-foreground">
              Questions need to be seeded into the database first.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleDomainFilter = (domain: DomainId | null) => {
    const params = new URLSearchParams(window.location.search)
    if (domain) {
      params.set('domain', domain)
    } else {
      params.delete('domain')
    }
    window.history.replaceState(null, '', `?${params.toString()}`)
    window.location.reload()
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      {/* Session header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Practice</h1>
          <p className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {cards.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            {sessionStats.correct}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <XCircle className="h-3 w-3 text-red-500" />
            {sessionStats.wrong}
          </Badge>
        </div>
      </div>

      {/* Domain filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        <button
          onClick={() => handleDomainFilter(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !focusDomain ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
          }`}
        >
          All Domains
        </button>
        {DOMAINS.map((d) => (
          <button
            key={d}
            onClick={() => handleDomainFilter(d)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              focusDomain === d ? 'text-white' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
            style={focusDomain === d ? { backgroundColor: DOMAIN_COLORS[d] } : undefined}
          >
            {DOMAIN_NAMES[d].replace('Design ', '').replace(' Architectures', '')}
          </button>
        ))}
      </div>

      {/* Question */}
      {currentCard && (
        <QuestionCard card={currentCard} onAnswer={handleAnswer} />
      )}

      {/* Post-answer actions */}
      {lastResult && (
        <div className="space-y-3">
          {/* Static explanation */}
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm leading-relaxed">{lastResult.explanation}</p>
            </CardContent>
          </Card>

          {/* AI explanation */}
          {aiExplanation && (
            <Card className="border-blue-500/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-blue-400" />
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
              Next Question
              <RefreshCw className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="p-6"><Skeleton className="h-64 w-full max-w-3xl mx-auto" /></div>}>
      <PracticeContent />
    </Suspense>
  )
}
