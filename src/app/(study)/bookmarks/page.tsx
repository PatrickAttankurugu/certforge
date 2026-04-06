'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Bookmark, Trash2, BookOpen, BookMarked } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import Link from 'next/link'
import { DOMAIN_NAMES, DIFFICULTY_LABELS, DOMAIN_COLORS } from '@/lib/study/constants'
import { cn } from '@/lib/utils'
import type { DomainId, QuestionOption } from '@/types/study'

interface BookmarkedQuestion {
  id: string
  question_id: string
  note: string
  created_at: string
  questions: {
    id: string
    domain_id: DomainId
    topic_id: string
    difficulty: number
    question_text: string
    question_type: string
    options: QuestionOption[]
    explanation: string
  }
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/study/bookmarks')
      .then((r) => r.json())
      .then(setBookmarks)
      .finally(() => setLoading(false))
  }, [])

  const removeBookmark = async (questionId: string) => {
    await fetch('/api/study/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: questionId }),
    })
    setBookmarks((prev) => prev.filter((b) => b.question_id !== questionId))
  }

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-amber-400" />
            Bookmarked Questions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {bookmarks.length} question{bookmarks.length === 1 ? '' : 's'} saved for review
          </p>
        </div>
      </div>

      {bookmarks.length === 0 && (
        <EmptyState
          icon={BookMarked}
          title="No bookmarks yet"
          description="Click the bookmark icon on any question during practice to save it for later review."
          action={
            <Link href="/practice">
              <Button size="sm" className="shadow-lg shadow-primary/20">Start Practicing</Button>
            </Link>
          }
        />
      )}

      {bookmarks.map((bm) => {
        const q = bm.questions
        if (!q) return null
        const correctIds = q.options.filter((o) => o.is_correct).map((o) => o.id)
        const isExpanded = expandedId === bm.id

        return (
          <Card key={bm.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[q.domain_id] }} />
                  <Badge variant="outline" className="text-xs">
                    {DOMAIN_NAMES[q.domain_id]}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {DIFFICULTY_LABELS[q.difficulty]}
                  </Badge>
                </div>
                <button
                  onClick={() => removeBookmark(bm.question_id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-red-400 transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed">{q.question_text}</p>

              <button
                onClick={() => setExpandedId(isExpanded ? null : bm.id)}
                className="text-xs text-primary hover:underline"
              >
                {isExpanded ? 'Hide answer' : 'Show answer'}
              </button>

              {isExpanded && (
                <div className="space-y-2 pt-2 border-t">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={cn(
                        'flex items-start gap-2 rounded-lg border p-2 text-sm',
                        correctIds.includes(opt.id)
                          ? 'border-green-500/50 bg-green-500/5'
                          : 'border-border opacity-60'
                      )}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold bg-muted">
                        {opt.id}
                      </span>
                      <span className="text-sm">{opt.text}</span>
                    </div>
                  ))}
                  {q.explanation && (
                    <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground mt-2">
                      {q.explanation}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
