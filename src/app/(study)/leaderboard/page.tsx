'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, ChevronLeft, ChevronRight, Crown, Medal, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  LEAGUE_COLORS,
  LEAGUE_BG_COLORS,
  type League,
} from '@/lib/study/xp'

interface LeaderboardEntry {
  user_id: string
  full_name: string | null
  xp_earned: number
  questions_answered: number
  accuracy: number
  streak_days: number
  league: League
  rank_position: number
}

const LEAGUE_ICONS: Record<string, typeof Trophy> = {
  diamond: Crown,
  platinum: Crown,
  gold: Trophy,
  silver: Medal,
  bronze: Award,
}

function getWeekStart(offset: number = 0): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) + offset * 7
  const monday = new Date(now.getFullYear(), now.getMonth(), diff)
  return monday.toISOString().split('T')[0]
}

function formatWeekLabel(weekStart: string): string {
  const start = new Date(weekStart + 'T00:00:00')
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${start.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', opts)}`
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userEntry, setUserEntry] = useState<LeaderboardEntry | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const weekStart = getWeekStart(weekOffset)

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setCurrentUserId(user.id)

    const res = await fetch(`/api/study/leaderboard?week=${weekStart}`)
    if (res.ok) {
      const data = await res.json()
      setLeaderboard(data.leaderboard)
      setUserEntry(data.user_entry)
    }
    setLoading(false)
  }, [weekStart])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Weekly Leaderboard
        </h1>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setWeekOffset((o) => o - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium min-w-[200px] text-center">
          {formatWeekLabel(weekStart)}
          {weekOffset === 0 && (
            <Badge variant="secondary" className="ml-2 text-[10px]">Current</Badge>
          )}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setWeekOffset((o) => Math.min(0, o + 1))}
          disabled={weekOffset >= 0}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* User's own position */}
      {userEntry && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-primary">#{userEntry.rank_position}</span>
                <div>
                  <p className="text-sm font-medium">Your Position</p>
                  <p className="text-xs text-muted-foreground">{userEntry.xp_earned} XP this week</p>
                </div>
              </div>
              <LeagueBadge league={userEntry.league} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No entries for this week yet.</p>
              <p className="text-xs mt-1">Start studying to earn XP and climb the ranks!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {leaderboard.map((entry) => {
                const isUser = entry.user_id === currentUserId
                return (
                  <div
                    key={entry.user_id}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isUser ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent/50'
                    }`}
                  >
                    <RankBadge rank={entry.rank_position} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {entry.full_name ?? 'Anonymous'}
                        {isUser && <span className="text-xs text-primary ml-1">(you)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.questions_answered} questions &middot; {Math.round((entry.accuracy ?? 0) * 100)}% accuracy
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm">{entry.xp_earned} XP</p>
                      <LeagueBadge league={entry.league} small />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500 font-bold text-sm">1</div>
  if (rank === 2) return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-400/20 text-slate-400 font-bold text-sm">2</div>
  if (rank === 3) return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-700/20 text-amber-700 font-bold text-sm">3</div>
  return <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium text-sm">{rank}</div>
}

function LeagueBadge({ league, small = false }: { league: League; small?: boolean }) {
  const Icon = LEAGUE_ICONS[league] ?? Award
  const colorClass = LEAGUE_COLORS[league]
  const bgClass = LEAGUE_BG_COLORS[league]

  if (small) {
    return (
      <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium capitalize ${colorClass}`}>
        <Icon className="h-3 w-3" />
        {league}
      </span>
    )
  }

  return (
    <Badge variant="outline" className={`${bgClass} ${colorClass} capitalize gap-1`}>
      <Icon className="h-3.5 w-3.5" />
      {league}
    </Badge>
  )
}
