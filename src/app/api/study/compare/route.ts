import { streamText, gateway } from 'ai'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkTutorLimit } from '@/lib/study/plan-limits'
import { parseBody } from '@/lib/api/validation'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { z } from 'zod'

const compareSchema = z.object({
  service_a: z.string().min(1).max(100),
  service_b: z.string().min(1).max(100),
})

// Simple in-memory cache for comparisons
const comparisonCache = new Map<string, string>()
const CACHE_MAX_SIZE = 100

function getCacheKey(a: string, b: string): string {
  return [a, b].sort().join('::').toLowerCase()
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id, 'ai')
  if (!rl.allowed) return rl.response

  const usage = await checkTutorLimit(supabase, user.id)
  if (!usage.allowed) return NextResponse.json({ error: usage.message }, { status: 429 })

  const body = await request.json()
  const parsed = parseBody(compareSchema, body)
  if (!parsed.success) return parsed.response
  const { service_a, service_b } = parsed.data

  // Check cache
  const cacheKey = getCacheKey(service_a, service_b)
  const cached = comparisonCache.get(cacheKey)
  if (cached) {
    return new Response(cached, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  const prompt = `You are an AWS Solutions Architect comparing two AWS services for the SAA-C03 exam.

Compare: **${service_a}** vs **${service_b}**

Provide a structured comparison:

## Overview
One sentence about each service's primary purpose.

## Key Differences

| Feature | ${service_a} | ${service_b} |
|---------|${'-'.repeat(service_a.length + 2)}|${'-'.repeat(service_b.length + 2)}|
| Primary Use Case | ... | ... |
| Pricing Model | ... | ... |
| Performance | ... | ... |
| Scalability | ... | ... |
| Durability/Availability | ... | ... |
| Data Model / Type | ... | ... |

## When to Use ${service_a}
3-4 bullet points with specific scenarios.

## When to Use ${service_b}
3-4 bullet points with specific scenarios.

## Common Exam Scenarios
2-3 typical SAA-C03 question patterns involving these services and which one is the correct choice.

## Quick Memory Aid
A one-liner to remember the key difference.

Be concise, exam-focused, and accurate. Reference actual AWS limits and defaults where relevant.`

  const result = streamText({
    model: gateway('openai/gpt-4o-mini'),
    prompt,
    maxOutputTokens: 1200,
    async onFinish({ text }) {
      // Cache the result
      if (comparisonCache.size >= CACHE_MAX_SIZE) {
        const firstKey = comparisonCache.keys().next().value
        if (firstKey) comparisonCache.delete(firstKey)
      }
      comparisonCache.set(cacheKey, text)
    },
  })

  return result.toTextStreamResponse()
}
