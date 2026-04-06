'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Bot, User, Send, RotateCcw, History, MessageSquare, ArrowLeft } from 'lucide-react'
import { DOMAIN_NAMES } from '@/lib/study/constants'
import type { DomainId } from '@/types/study'

const SUGGESTED_TOPICS = [
  { label: 'VPC & Networking', domain: 'secure' as DomainId },
  { label: 'IAM Best Practices', domain: 'secure' as DomainId },
  { label: 'Auto Scaling', domain: 'resilient' as DomainId },
  { label: 'S3 Storage Classes', domain: 'cost' as DomainId },
  { label: 'CloudFront & Caching', domain: 'performant' as DomainId },
  { label: 'RDS vs DynamoDB', domain: 'performant' as DomainId },
]

interface ConversationSummary {
  id: string
  topic_id: string | null
  preview: string
  message_count: number
  created_at: string
  updated_at: string
}

export default function TutorPage() {
  const [activeDomain, setActiveDomain] = useState<DomainId | null>(null)
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const transport = useMemo(() => new DefaultChatTransport({
    api: '/api/study/tutor',
    body: { domain_id: activeDomain, conversation_id: conversationId },
  }), [activeDomain, conversationId])

  const { messages, sendMessage, status, setMessages } = useChat({ transport })

  const isBusy = status === 'streaming' || status === 'submitted'

  const loadHistory = async () => {
    setHistoryLoading(true)
    const res = await fetch('/api/study/tutor/conversations')
    const data = await res.json()
    setConversations(Array.isArray(data) ? data : [])
    setHistoryLoading(false)
  }

  const handleShowHistory = () => {
    setShowHistory(true)
    loadHistory()
  }

  const handleResumeConversation = async (id: string) => {
    const res = await fetch(`/api/study/tutor/conversations/${id}`)
    const data = await res.json()
    if (data.messages) {
      const restored = (data.messages as { role: string; content: string }[]).map((m, i) => ({
        id: `restored-${i}`,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        parts: [{ type: 'text' as const, text: m.content }],
        createdAt: new Date(),
      }))
      setMessages(restored)
      setConversationId(id)
    }
    setShowHistory(false)
  }

  const handleSuggestion = (label: string, domain: DomainId) => {
    setActiveDomain(domain)
    setInput(`Explain ${label} for the SAA-C03 exam.`)
  }

  const handleReset = () => {
    setMessages([])
    setActiveDomain(null)
    setConversationId(null)
    setInput('')
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isBusy) return
    sendMessage({ text: input })
    setInput('')
  }

  // History view
  if (showHistory) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto">
        <div className="p-4 border-b flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-bold">Conversation History</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {historyLoading ? (
            <>
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}
            </>
          ) : conversations.length === 0 ? (
            <div className="text-center pt-12">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No past conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleResumeConversation(conv.id)}
                className="w-full text-left rounded-lg border p-3 hover:bg-accent/50 transition-colors"
              >
                <p className="text-sm font-medium truncate">{conv.preview}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {new Date(conv.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {conv.message_count} messages
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Tutor
          </h1>
          <p className="text-xs text-muted-foreground">
            Ask about any AWS SAA-C03 topic
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleShowHistory} aria-label="View conversation history">
            <History className="h-4 w-4 mr-1" />
            History
          </Button>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              New chat
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-label="Chat messages">
        {messages.length === 0 && (
          <div className="space-y-4 pt-8">
            <div className="text-center">
              <Bot className="h-10 w-10 mx-auto text-muted-foreground mb-3" aria-hidden="true" />
              <h2 className="text-sm font-semibold">What would you like to learn?</h2>
              <p className="text-xs text-muted-foreground mt-1">
                I&apos;m your SAA-C03 study assistant. Pick a topic or ask anything.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED_TOPICS.map((topic) => (
                <Button
                  key={topic.label}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleSuggestion(topic.label, topic.domain)}
                >
                  {topic.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={cn('flex gap-3', message.role === 'user' && 'justify-end')}>
            {message.role === 'assistant' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10" aria-hidden="true">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              {message.parts.map((part, index) =>
                part.type === 'text' ? (
                  <p key={index} className="whitespace-pre-wrap">{part.text}</p>
                ) : null
              )}
            </div>
            {message.role === 'user' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted" aria-hidden="true">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isBusy && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <Skeleton className="h-16 w-64 rounded-lg" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t shrink-0">
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <label htmlFor="tutor-input" className="sr-only">Ask about any AWS topic</label>
          <input
            id="tutor-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any AWS topic..."
            className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isBusy}
          />
          <Button type="submit" size="icon" disabled={isBusy || !input.trim()} aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
