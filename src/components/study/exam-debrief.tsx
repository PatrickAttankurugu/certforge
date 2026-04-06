'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Brain, Loader2 } from 'lucide-react'

interface ExamDebriefProps {
  examId: string
}

export function ExamDebrief({ examId }: ExamDebriefProps) {
  const [debrief, setDebrief] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [started, setStarted] = useState(false)

  const generateDebrief = useCallback(async () => {
    setLoading(true)
    setError(null)
    setStarted(true)
    setDebrief('')

    try {
      const res = await fetch(`/api/study/mock-exam/${examId}/debrief`, {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to generate debrief')
        setLoading(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setError('Streaming not supported')
        setLoading(false)
        return
      }

      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setDebrief(accumulated)
      }

      setLoading(false)
    } catch {
      setError('Failed to connect. Please try again.')
      setLoading(false)
    }
  }, [examId])

  if (!started) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6 text-center space-y-3">
          <Brain className="h-8 w-8 mx-auto text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">AI Exam Debrief</p>
            <p className="text-xs text-muted-foreground mt-1">
              Get a personalized analysis of your performance with specific study recommendations.
            </p>
          </div>
          <Button onClick={generateDebrief} size="sm">
            <Brain className="h-4 w-4 mr-2" />
            Generate Debrief
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-4 w-4" />
          AI Exam Debrief
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
            <Button variant="ghost" size="sm" onClick={generateDebrief} className="mt-2">
              Retry
            </Button>
          </div>
        )}

        {loading && !debrief && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}

        {debrief && (
          <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
            {debrief}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
