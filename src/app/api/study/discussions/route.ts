import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { z } from 'zod'

const createThreadSchema = z.object({
  question_id: z.string().uuid(),
  content: z.string().min(10).max(2000),
})

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id)
  if (!rl.allowed) return rl.response

  const url = new URL(request.url)
  const questionId = url.searchParams.get('question_id')
  if (!questionId) {
    return NextResponse.json({ error: 'question_id is required' }, { status: 400 })
  }

  const { data: threads, error } = await supabase.rpc('get_question_discussions', {
    p_question_id: questionId,
    p_limit: 20,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get user's votes for these threads
  const threadIds = (threads ?? []).map((t: { thread_id: string }) => t.thread_id)
  let userVotes: Record<string, number> = {}

  if (threadIds.length > 0) {
    const { data: votes } = await supabase
      .from('discussion_votes')
      .select('thread_id, vote')
      .eq('user_id', user.id)
      .in('thread_id', threadIds)

    if (votes) {
      userVotes = Object.fromEntries(votes.map((v) => [v.thread_id, v.vote]))
    }
  }

  return NextResponse.json({
    threads: threads ?? [],
    user_votes: userVotes,
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id)
  if (!rl.allowed) return rl.response

  const body = await request.json()
  const parsed = createThreadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const { question_id, content } = parsed.data

  const { data: thread, error } = await supabase
    .from('discussion_threads')
    .insert({
      question_id,
      user_id: user.id,
      content,
    })
    .select('id, content, upvotes, created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ thread })
}
