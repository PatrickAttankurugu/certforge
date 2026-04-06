'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Bot, User, Send, RotateCcw } from 'lucide-react'
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

export default function TutorPage() {
  const [activeDomain, setActiveDomain] = useState<DomainId | null>(null)
  const [input, setInput] = useState('')

  const transport = useMemo(() => new DefaultChatTransport({
    api: '/api/study/tutor',
    body: { domain_id: activeDomain },
  }), [activeDomain])

  const { messages, sendMessage, status, setMessages } = useChat({ transport })

  const isBusy = status === 'streaming' || status === 'submitted'

  const handleSuggestion = (label: string, domain: DomainId) => {
    setActiveDomain(domain)
    setInput(`Explain ${label} for the SAA-C03 exam.`)
  }

  const handleReset = () => {
    setMessages([])
    setActiveDomain(null)
    setInput('')
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isBusy) return
    sendMessage({ text: input })
    setInput('')
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
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            New chat
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-4 pt-8">
            <div className="text-center">
              <Bot className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
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
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
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
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
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
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any AWS topic..."
            className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isBusy}
          />
          <Button type="submit" size="icon" disabled={isBusy || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
