import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { z } from 'zod'

const createReplySchema = z.object({
  content: z.string().min(3).max(2000),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id)
  if (!rl.allowed) return rl.response

  const { data: replies, error } = await supabase
    .from('discussion_replies')
    .select(`
      id, content, upvotes, created_at,
      user_id, profiles!inner(full_name)
    `)
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get user votes for replies
  const replyIds = (replies ?? []).map((r: { id: string }) => r.id)
  let userVotes: Record<string, number> = {}

  if (replyIds.length > 0) {
    const { data: votes } = await supabase
      .from('discussion_votes')
      .select('reply_id, vote')
      .eq('user_id', user.id)
      .in('reply_id', replyIds)

    if (votes) {
      userVotes = Object.fromEntries(votes.map((v) => [v.reply_id, v.vote]))
    }
  }

  return NextResponse.json({
    replies: replies ?? [],
    user_votes: userVotes,
  })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id)
  if (!rl.allowed) return rl.response

  const body = await request.json()
  const parsed = createReplySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const { data: reply, error } = await supabase
    .from('discussion_replies')
    .insert({
      thread_id: threadId,
      user_id: user.id,
      content: parsed.data.content,
    })
    .select('id, content, upvotes, created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reply })
}
