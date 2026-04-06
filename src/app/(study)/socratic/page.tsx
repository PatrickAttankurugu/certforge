'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Brain, User, Send, RotateCcw, HelpCircle } from 'lucide-react'
import { DOMAIN_NAMES } from '@/lib/study/constants'
import type { DomainId } from '@/types/study'

const STARTER_TOPICS = [
  { label: 'VPC Security Groups vs NACLs', domain: 'secure' as DomainId },
  { label: 'S3 Replication Strategies', domain: 'resilient' as DomainId },
  { label: 'ElastiCache vs DynamoDB DAX', domain: 'performant' as DomainId },
  { label: 'Reserved vs Spot Instances', domain: 'cost' as DomainId },
  { label: 'EBS Volume Types', domain: 'performant' as DomainId },
  { label: 'IAM Roles vs Policies', domain: 'secure' as DomainId },
]

export default function SocraticPage() {
  const [activeDomain, setActiveDomain] = useState<DomainId | null>(null)
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [conversationId] = useState<string | null>(null)

  const transport = useMemo(() => new DefaultChatTransport({
    api: '/api/study/socratic',
    body: { domain_id: activeDomain, topic: activeTopic, conversation_id: conversationId },
  }), [activeDomain, activeTopic, conversationId])

  const { messages, sendMessage, status, setMessages } = useChat({ transport })

  const isBusy = status === 'streaming' || status === 'submitted'

  const handleTopic = (label: string, domain: DomainId) => {
    setActiveDomain(domain)
    setActiveTopic(label)
    setInput(`I want to explore: ${label}`)
  }

  const handleReset = () => {
    setMessages([])
    setActiveDomain(null)
    setActiveTopic(null)
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
            <Brain className="h-5 w-5" />
            Socratic Deep-Dive
          </h1>
          <p className="text-xs text-muted-foreground">
            Learn through guided questioning &mdash; no direct answers
          </p>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              New session
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-label="Socratic dialogue">
        {messages.length === 0 && (
          <div className="space-y-4 pt-8">
            <div className="text-center">
              <Brain className="h-10 w-10 mx-auto text-muted-foreground mb-3" aria-hidden="true" />
              <h2 className="text-sm font-semibold">Ready to think deeply?</h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                I will guide you with questions instead of answers. You will build real understanding
                by working through concepts yourself.
              </p>
            </div>

            <Card className="max-w-md mx-auto">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">How it works</span>
                </div>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Pick a topic or type your own</li>
                  <li>I ask you questions to test understanding</li>
                  <li>Answer as best you can &mdash; wrong answers are fine</li>
                  <li>I guide you toward the right understanding</li>
                </ol>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2 justify-center">
              {STARTER_TOPICS.map((topic) => (
                <Button
                  key={topic.label}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleTopic(topic.label, topic.domain)}
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
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/10" aria-hidden="true">
                <Brain className="h-4 w-4 text-purple-500" />
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
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
              <Brain className="h-4 w-4 text-purple-500" />
            </div>
            <Skeleton className="h-16 w-64 rounded-lg" />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t shrink-0">
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <label htmlFor="socratic-input" className="sr-only">Your answer or topic</label>
          <input
            id="socratic-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer or pick a topic..."
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
