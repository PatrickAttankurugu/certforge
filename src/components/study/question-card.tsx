'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS, DOMAIN_NAMES } from '@/lib/study/constants'
import type { DueCard, QuestionOption, DomainId } from '@/types/study'

interface QuestionCardProps {
  card: DueCard
  onAnswer: (selectedIds: string[], timeMs: number) => void
  showFeedback?: boolean
  examMode?: boolean // no immediate feedback in exam mode
}

export function QuestionCard({ card, onAnswer, showFeedback = true, examMode = false }: QuestionCardProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const startTime = useRef(Date.now())

  useEffect(() => {
    // Reset on new question
    setSelected(new Set())
    setSubmitted(false)
    setIsCorrect(null)
    startTime.current = Date.now()
  }, [card.card_id])

  const isMulti = card.question_type === 'multi'
  const correctIds = (card.options as QuestionOption[])
    .filter((o) => o.is_correct)
    .map((o) => o.id)

  const toggleOption = (id: string) => {
    if (submitted) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (isMulti) {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      } else {
        next.clear()
        next.add(id)
      }
      return next
    })
  }

  const handleSubmit = () => {
    if (selected.size === 0) return
    const elapsed = Date.now() - startTime.current
    const selectedArr = Array.from(selected)

    if (!examMode && showFeedback) {
      const correct =
        selectedArr.length === correctIds.length &&
        selectedArr.every((s) => correctIds.includes(s))
      setIsCorrect(correct)
      setSubmitted(true)
    }

    onAnswer(selectedArr, elapsed)
  }

  const getOptionStyle = (id: string) => {
    if (!submitted) {
      return selected.has(id)
        ? 'border-primary bg-primary/10 ring-1 ring-primary'
        : 'border-border hover:border-muted-foreground/50 cursor-pointer'
    }
    const isOptionCorrect = correctIds.includes(id)
    const wasSelected = selected.has(id)

    if (isOptionCorrect) return 'border-green-500 bg-green-500/10'
    if (wasSelected && !isOptionCorrect) return 'border-red-500 bg-red-500/10'
    return 'border-border opacity-50'
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {DOMAIN_NAMES[card.domain_id as DomainId]}
          </Badge>
          <Badge variant="secondary" className={cn('text-xs', DIFFICULTY_COLORS[card.difficulty])}>
            {DIFFICULTY_LABELS[card.difficulty]}
          </Badge>
          {isMulti && (
            <Badge variant="secondary" className="text-xs">
              Select {correctIds.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{card.question_text}</p>

        <div className="space-y-2">
          {(card.options as QuestionOption[]).map((option) => (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              disabled={submitted}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all',
                getOptionStyle(option.id)
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-muted text-xs font-bold">
                {option.id}
              </span>
              <span className="pt-0.5">{option.text}</span>
            </button>
          ))}
        </div>

        {!submitted && (
          <Button
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className="w-full"
          >
            {examMode ? 'Save Answer' : 'Submit Answer'}
          </Button>
        )}

        {submitted && isCorrect !== null && (
          <div
            className={cn(
              'rounded-lg border p-4 text-sm',
              isCorrect
                ? 'border-green-500/50 bg-green-500/10 text-green-200'
                : 'border-red-500/50 bg-red-500/10 text-red-200'
            )}
          >
            <p className="font-semibold mb-1">
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
