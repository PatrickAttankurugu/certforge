'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, Shuffle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS, DOMAIN_NAMES } from '@/lib/study/constants'
import { useKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts'
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
  const [bookmarked, setBookmarked] = useState(false)
  const [variant, setVariant] = useState<{ variant_text: string; variant_options: QuestionOption[]; variant_explanation: string } | null>(null)
  const [variantLoading, setVariantLoading] = useState(false)
  const [variantSelected, setVariantSelected] = useState<Set<string>>(new Set())
  const [variantSubmitted, setVariantSubmitted] = useState(false)
  const startTime = useRef(Date.now())

  useEffect(() => {
    // Reset on new question
    setSelected(new Set())
    setSubmitted(false)
    setIsCorrect(null)
    setVariant(null)
    setVariantLoading(false)
    setVariantSelected(new Set())
    setVariantSubmitted(false)
    startTime.current = Date.now()
  }, [card.card_id])

  // Check bookmark status on mount
  useEffect(() => {
    fetch(`/api/study/bookmarks/check?question_id=${card.question_id}`)
      .then((r) => r.json())
      .then((d) => setBookmarked(d.bookmarked))
      .catch(() => {})
  }, [card.question_id])

  const toggleBookmark = useCallback(async () => {
    const res = await fetch('/api/study/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: card.question_id }),
    })
    const data = await res.json()
    setBookmarked(data.bookmarked)
  }, [card.question_id])

  const isMulti = card.question_type === 'multi'
  const correctIds = (card.options as QuestionOption[])
    .filter((o) => o.is_correct)
    .map((o) => o.id)

  const toggleOption = useCallback((id: string) => {
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
  }, [submitted, isMulti])

  const handleSubmit = useCallback(() => {
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
  }, [selected, examMode, showFeedback, correctIds, onAnswer])

  // Keyboard: A/B/C/D to select, Enter to submit
  useKeyboardShortcuts({
    optionIds: (card.options as QuestionOption[]).map((o) => o.id),
    onSelectOption: toggleOption,
    onSubmit: handleSubmit,
    enabled: !submitted,
  })

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
        <div className="flex items-center justify-between">
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
          <button
            onClick={toggleBookmark}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              bookmarked ? 'text-amber-400 hover:text-amber-300' : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark question'}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark for later'}
          >
            <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-current')} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{card.question_text}</p>

        <div className="space-y-2" role={isMulti ? 'group' : 'radiogroup'} aria-label="Answer options">
          {(card.options as QuestionOption[]).map((option) => (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              disabled={submitted}
              role={isMulti ? 'checkbox' : 'radio'}
              aria-checked={selected.has(option.id)}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all',
                getOptionStyle(option.id)
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-muted text-xs font-bold" aria-hidden="true">
                {option.id}
              </span>
              <span className="pt-0.5">{option.text}</span>
            </button>
          ))}
        </div>

        {!submitted && (
          <div className="space-y-2">
            <Button
              onClick={handleSubmit}
              disabled={selected.size === 0}
              className="w-full"
            >
              {examMode ? 'Save Answer' : 'Submit Answer'}
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Press <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">A</kbd>-<kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">D</kbd> to select, <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">Enter</kbd> to submit
            </p>
          </div>
        )}

        {submitted && isCorrect !== null && (
          <div className="space-y-3">
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

            {/* Try Similar button */}
            {!examMode && !variant && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  setVariantLoading(true)
                  try {
                    const res = await fetch('/api/study/questions/variants', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ question_id: card.question_id }),
                    })
                    if (res.ok) {
                      const data = await res.json()
                      setVariant(data)
                    }
                  } catch { /* ignore */ }
                  setVariantLoading(false)
                }}
                disabled={variantLoading}
              >
                {variantLoading ? (
                  <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Generating...</>
                ) : (
                  <><Shuffle className="h-3.5 w-3.5 mr-1" /> Try Similar</>
                )}
              </Button>
            )}

            {/* Per-option explanations for wrong answers */}
            {!isCorrect && (card as DueCard & { wrong_explanations?: Record<string, string> }).wrong_explanations && (
              <div className="space-y-2">
                {Array.from(selected).filter(id => !correctIds.includes(id)).map((wrongId) => {
                  const explanation = ((card as DueCard & { wrong_explanations?: Record<string, string> }).wrong_explanations)?.[wrongId]
                  if (!explanation) return null
                  return (
                    <div key={wrongId} className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm">
                      <p className="font-medium text-red-400 text-xs mb-1">Why {wrongId} is wrong:</p>
                      <p className="text-muted-foreground text-xs leading-relaxed">{explanation}</p>
                    </div>
                  )
                })}
                {correctIds.map((correctId) => {
                  const option = (card.options as QuestionOption[]).find(o => o.id === correctId)
                  return (
                    <div key={correctId} className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 text-sm">
                      <p className="font-medium text-green-400 text-xs mb-1">Why {correctId} is correct:</p>
                      <p className="text-muted-foreground text-xs leading-relaxed">{option?.text}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Variant question inline */}
        {variant && (
          <div className="border-t pt-4 mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <Shuffle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Similar Question</span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{variant.variant_text}</p>
            <div className="space-y-2">
              {(variant.variant_options as QuestionOption[]).map((option) => {
                const vCorrectIds = (variant.variant_options as QuestionOption[]).filter((o) => o.is_correct).map((o) => o.id)
                const wasSelected = variantSelected.has(option.id)
                const isOptionCorrect = vCorrectIds.includes(option.id)
                let style = 'border-border hover:border-muted-foreground/50 cursor-pointer'
                if (variantSubmitted) {
                  if (isOptionCorrect) style = 'border-green-500 bg-green-500/10'
                  else if (wasSelected && !isOptionCorrect) style = 'border-red-500 bg-red-500/10'
                  else style = 'border-border opacity-50'
                } else if (wasSelected) {
                  style = 'border-primary bg-primary/10 ring-1 ring-primary'
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (variantSubmitted) return
                      setVariantSelected((prev) => {
                        const next = new Set(prev)
                        next.clear()
                        next.add(option.id)
                        return next
                      })
                    }}
                    disabled={variantSubmitted}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all',
                      style
                    )}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-muted text-xs font-bold">
                      {option.id}
                    </span>
                    <span className="pt-0.5">{option.text}</span>
                  </button>
                )
              })}
            </div>
            {!variantSubmitted && (
              <Button
                onClick={() => setVariantSubmitted(true)}
                disabled={variantSelected.size === 0}
                size="sm"
                className="w-full"
              >
                Check Answer
              </Button>
            )}
            {variantSubmitted && (
              <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                <p className="text-xs leading-relaxed">{variant.variant_explanation}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
