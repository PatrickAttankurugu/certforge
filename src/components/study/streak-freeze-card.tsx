'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Snowflake, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface StreakFreezeCardProps {
  compact?: boolean
}

export function StreakFreezeCard({ compact = false }: StreakFreezeCardProps) {
  const [available, setAvailable] = useState(0)
  const [loading, setLoading] = useState(true)
  const [using, setUsing] = useState(false)

  useEffect(() => {
    const fetchFreezes = async () => {
      const res = await fetch('/api/study/streak-freeze')
      if (res.ok) {
        const data = await res.json()
        setAvailable(data.available)
      }
      setLoading(false)
    }
    fetchFreezes()
  }, [])

  const handleUseFreeze = async () => {
    setUsing(true)
    const res = await fetch('/api/study/streak-freeze', { method: 'POST' })
    if (res.ok) {
      setAvailable((prev) => Math.max(0, prev - 1))
      toast.success('Streak freeze activated! Your streak is protected for today.')
    } else {
      const data = await res.json()
      toast.error(data.error ?? 'Failed to use streak freeze')
    }
    setUsing(false)
  }

  if (loading) return null

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <Snowflake className="h-3.5 w-3.5 text-cyan-400" />
        <span className="text-muted-foreground">Streak Freezes:</span>
        <Badge variant="secondary" className="text-[10px]">{available}</Badge>
        {available > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 text-[10px] px-1.5"
            onClick={handleUseFreeze}
            disabled={using}
          >
            {using ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Use'}
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="py-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Streak Freezes</p>
              <p className="text-xs text-muted-foreground">
                {available > 0
                  ? `${available} available - protects your streak for a day`
                  : 'Earn freezes by maintaining a 7-day streak'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm font-bold">{available}</Badge>
            {available > 0 && (
              <Button size="sm" variant="outline" onClick={handleUseFreeze} disabled={using}>
                {using ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Activate'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
