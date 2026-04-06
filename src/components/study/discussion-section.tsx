'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

interface Thread {
  thread_id: string
  user_id: string
  full_name: string | null
  content: string
  upvotes: number
  is_pinned: boolean
  created_at: string
  reply_count: number
}

interface Reply {
  id: string
  user_id: string
  content: string
  upvotes: number
  created_at: string
  profiles?: { full_name: string | null }
}

interface DiscussionSectionProps {
  questionId: string
}

export function DiscussionSection({ questionId }: DiscussionSectionProps) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [userVotes, setUserVotes] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [newThreadContent, setNewThreadContent] = useState('')
  const [posting, setPosting] = useState(false)
  const [expandedThread, setExpandedThread] = useState<string | null>(null)
  const [replies, setReplies] = useState<Record<string, Reply[]>>({})
  const [replyVotes, setReplyVotes] = useState<Record<string, number>>({})
  const [replyContent, setReplyContent] = useState<Record<string, string>>({})
  const [replyPosting, setReplyPosting] = useState<string | null>(null)

  const fetchThreads = useCallback(async () => {
    const res = await fetch(`/api/study/discussions?question_id=${questionId}`)
    if (res.ok) {
      const data = await res.json()
      setThreads(data.threads)
      setUserVotes(data.user_votes)
    }
    setLoading(false)
  }, [questionId])

  useEffect(() => {
    fetchThreads()
  }, [fetchThreads])

  const handlePostThread = async () => {
    if (!newThreadContent.trim() || newThreadContent.length < 10) {
      toast.error('Discussion must be at least 10 characters')
      return
    }

    setPosting(true)
    const res = await fetch('/api/study/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: questionId, content: newThreadContent }),
    })

    if (res.ok) {
      setNewThreadContent('')
      toast.success('Discussion posted!')
      fetchThreads()
    } else {
      toast.error('Failed to post discussion')
    }
    setPosting(false)
  }

  const handleVote = async (threadId: string, vote: 1 | -1, replyId?: string) => {
    const res = await fetch(`/api/study/discussions/${threadId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote, reply_id: replyId }),
    })

    if (res.ok) {
      const data = await res.json()
      if (replyId) {
        setReplyVotes((prev) => ({ ...prev, [replyId]: data.vote }))
      } else {
        setUserVotes((prev) => ({ ...prev, [threadId]: data.vote }))
      }
      fetchThreads()
      if (expandedThread === threadId && replyId) {
        fetchReplies(threadId)
      }
    }
  }

  const fetchReplies = async (threadId: string) => {
    const res = await fetch(`/api/study/discussions/${threadId}`)
    if (res.ok) {
      const data = await res.json()
      setReplies((prev) => ({ ...prev, [threadId]: data.replies }))
      setReplyVotes((prev) => ({ ...prev, ...data.user_votes }))
    }
  }

  const toggleThread = (threadId: string) => {
    if (expandedThread === threadId) {
      setExpandedThread(null)
    } else {
      setExpandedThread(threadId)
      if (!replies[threadId]) {
        fetchReplies(threadId)
      }
    }
  }

  const handlePostReply = async (threadId: string) => {
    const content = replyContent[threadId]?.trim()
    if (!content || content.length < 3) {
      toast.error('Reply must be at least 3 characters')
      return
    }

    setReplyPosting(threadId)
    const res = await fetch(`/api/study/discussions/${threadId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    if (res.ok) {
      setReplyContent((prev) => ({ ...prev, [threadId]: '' }))
      toast.success('Reply posted!')
      fetchReplies(threadId)
      fetchThreads()
    } else {
      toast.error('Failed to post reply')
    }
    setReplyPosting(null)
  }

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Discussion</h3>
        {threads.length > 0 && (
          <Badge variant="secondary" className="text-[10px]">{threads.length}</Badge>
        )}
      </div>

      {/* New thread form */}
      <div className="flex gap-2">
        <textarea
          value={newThreadContent}
          onChange={(e) => setNewThreadContent(e.target.value)}
          placeholder="Share your thoughts or ask a question about this problem..."
          className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring min-h-[60px]"
          rows={2}
        />
        <Button
          size="icon"
          onClick={handlePostThread}
          disabled={posting || newThreadContent.length < 10}
          className="self-end"
        >
          {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {/* Thread list */}
      {loading ? (
        <p className="text-xs text-muted-foreground">Loading discussions...</p>
      ) : threads.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          No discussions yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-2">
          {threads.map((thread) => {
            const isExpanded = expandedThread === thread.thread_id
            const threadReplies = replies[thread.thread_id] ?? []
            const userVote = userVotes[thread.thread_id] ?? 0

            return (
              <div key={thread.thread_id} className="rounded-lg border">
                <div className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{thread.full_name ?? 'Anonymous'}</span>
                        <span>&middot;</span>
                        <span>{timeAgo(thread.created_at)}</span>
                        {thread.is_pinned && <Badge variant="outline" className="text-[9px] py-0">Pinned</Badge>}
                      </div>
                      <p className="text-sm mt-1">{thread.content}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleVote(thread.thread_id, 1)}
                        className={`p-1 rounded hover:bg-accent transition-colors ${userVote === 1 ? 'text-green-500' : 'text-muted-foreground'}`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-medium min-w-[16px] text-center">{thread.upvotes}</span>
                      <button
                        onClick={() => handleVote(thread.thread_id, -1)}
                        className={`p-1 rounded hover:bg-accent transition-colors ${userVote === -1 ? 'text-red-500' : 'text-muted-foreground'}`}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => toggleThread(thread.thread_id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      {thread.reply_count} {thread.reply_count === 1 ? 'reply' : 'replies'}
                    </button>
                  </div>
                </div>

                {/* Replies */}
                {isExpanded && (
                  <div className="border-t bg-muted/30 p-3 space-y-3">
                    {threadReplies.map((reply) => {
                      const rVote = replyVotes[reply.id] ?? 0
                      return (
                        <div key={reply.id} className="pl-4 border-l-2 border-border space-y-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {reply.profiles?.full_name ?? 'Anonymous'}
                            </span>
                            <span>&middot;</span>
                            <span>{timeAgo(reply.created_at)}</span>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleVote(thread.thread_id, 1, reply.id)}
                              className={`p-0.5 rounded hover:bg-accent transition-colors ${rVote === 1 ? 'text-green-500' : 'text-muted-foreground'}`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </button>
                            <span className="text-[10px] font-medium">{reply.upvotes}</span>
                            <button
                              onClick={() => handleVote(thread.thread_id, -1, reply.id)}
                              className={`p-0.5 rounded hover:bg-accent transition-colors ${rVote === -1 ? 'text-red-500' : 'text-muted-foreground'}`}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )
                    })}

                    {/* Reply form */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={replyContent[thread.thread_id] ?? ''}
                        onChange={(e) =>
                          setReplyContent((prev) => ({ ...prev, [thread.thread_id]: e.target.value }))
                        }
                        placeholder="Write a reply..."
                        className="flex-1 rounded-md border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handlePostReply(thread.thread_id)
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePostReply(thread.thread_id)}
                        disabled={replyPosting === thread.thread_id}
                        className="h-7 text-xs"
                      >
                        {replyPosting === thread.thread_id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          'Reply'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
