'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, UserPlus, Check, X, Flame, BookOpen, Search } from 'lucide-react'
import { toast } from 'sonner'

interface Buddy {
  request_id: string
  user_id: string
  full_name: string
  total_xp?: number
  streak?: number
  questions?: number
  since?: string
  sent_at?: string
}

interface Suggestion {
  user_id: string
  full_name: string
  total_questions: number
  streak: number
  daily_goal: number
}

export default function BuddiesPage() {
  const [tab, setTab] = useState<'buddies' | 'find'>('buddies')
  const [buddies, setBuddies] = useState<Buddy[]>([])
  const [pendingReceived, setPendingReceived] = useState<Buddy[]>([])
  const [pendingSent, setPendingSent] = useState<Buddy[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBuddies = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/study/buddies?tab=${tab}`)
    if (res.ok) {
      const data = await res.json()
      if (tab === 'buddies') {
        setBuddies(data.buddies ?? [])
        setPendingReceived(data.pending_received ?? [])
        setPendingSent(data.pending_sent ?? [])
      } else {
        setSuggestions(data.suggestions ?? [])
      }
    }
    setLoading(false)
  }, [tab])

  useEffect(() => {
    fetchBuddies()
  }, [fetchBuddies])

  const handleAction = async (buddyId: string, action: 'send' | 'accept' | 'decline') => {
    const res = await fetch('/api/study/buddies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buddy_id: buddyId, action }),
    })

    if (res.ok) {
      const labels = { send: 'Request sent!', accept: 'Buddy added!', decline: 'Request declined' }
      toast.success(labels[action])
      fetchBuddies()
    } else {
      const data = await res.json()
      toast.error(data.error ?? 'Something went wrong')
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Users className="h-6 w-6 text-primary" />
        Study Buddies
      </h1>

      {/* Tab switcher */}
      <div className="flex gap-2">
        <Button
          variant={tab === 'buddies' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTab('buddies')}
        >
          <Users className="h-4 w-4 mr-1.5" />
          My Buddies
        </Button>
        <Button
          variant={tab === 'find' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTab('find')}
        >
          <Search className="h-4 w-4 mr-1.5" />
          Find a Buddy
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : tab === 'buddies' ? (
        <>
          {/* Pending requests */}
          {pendingReceived.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Pending Requests
                  <Badge variant="secondary">{pendingReceived.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingReceived.map((req) => (
                  <div key={req.request_id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                        {(req.full_name ?? 'S')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{req.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {req.streak ?? 0} day streak &middot; {req.questions ?? 0} questions
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleAction(req.user_id, 'accept')}>
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleAction(req.user_id, 'decline')}>
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Active buddies */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Your Buddies</CardTitle>
            </CardHeader>
            <CardContent>
              {buddies.length === 0 && pendingSent.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No study buddies yet.</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setTab('find')}>
                    <Search className="h-3.5 w-3.5 mr-1.5" />
                    Find a Buddy
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {buddies.map((buddy) => (
                    <div key={buddy.request_id} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                        {(buddy.full_name ?? 'S')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{buddy.full_name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            {buddy.streak ?? 0} days
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {buddy.questions ?? 0} questions
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {buddy.total_xp ?? 0} XP
                      </Badge>
                    </div>
                  ))}
                  {pendingSent.map((req) => (
                    <div key={req.request_id} className="flex items-center gap-3 rounded-lg border border-dashed p-3 opacity-60">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                        {(req.full_name ?? 'S')[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{req.full_name ?? 'Student'}</p>
                        <p className="text-xs text-muted-foreground">Pending request...</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        /* Find a buddy tab */
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Suggested Buddies</CardTitle>
            <p className="text-xs text-muted-foreground">
              People with similar progress studying the same certification
            </p>
          </CardHeader>
          <CardContent>
            {suggestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No suggestions right now.</p>
                <p className="text-xs mt-1">Check back later as more users join!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {suggestions.map((s) => (
                  <div key={s.user_id} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                      {s.full_name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{s.full_name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {s.streak} days
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {s.total_questions} questions
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleAction(s.user_id, 'send')}>
                      <UserPlus className="h-3.5 w-3.5 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
