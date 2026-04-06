import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { z } from 'zod'

const voteSchema = z.object({
  vote: z.union([z.literal(1), z.literal(-1)]),
  reply_id: z.string().uuid().optional(),
})

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
  const parsed = voteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const { vote, reply_id } = parsed.data

  if (reply_id) {
    // Vote on a reply
    // Check for existing vote
    const { data: existing } = await supabase
      .from('discussion_votes')
      .select('id, vote')
      .eq('user_id', user.id)
      .eq('reply_id', reply_id)
      .single()

    if (existing) {
      if (existing.vote === vote) {
        // Remove vote (toggle off)
        await supabase.from('discussion_votes').delete().eq('id', existing.id)
        await supabase.rpc('increment_reply_votes', { p_reply_id: reply_id, p_delta: -vote })
        return NextResponse.json({ action: 'removed', vote: 0 })
      }
      // Change vote
      await supabase.from('discussion_votes').update({ vote }).eq('id', existing.id)
      await supabase.rpc('increment_reply_votes', { p_reply_id: reply_id, p_delta: vote * 2 })
      return NextResponse.json({ action: 'changed', vote })
    }

    // New vote on reply
    const { error } = await supabase.from('discussion_votes').insert({
      user_id: user.id,
      reply_id,
      vote,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Update reply upvotes count directly
    await supabase
      .from('discussion_replies')
      .update({ upvotes: vote === 1 ? 1 : 0 })
      .eq('id', reply_id)
      .single()

    return NextResponse.json({ action: 'voted', vote })
  }

  // Vote on thread
  const { data: existing } = await supabase
    .from('discussion_votes')
    .select('id, vote')
    .eq('user_id', user.id)
    .eq('thread_id', threadId)
    .single()

  if (existing) {
    if (existing.vote === vote) {
      // Remove vote (toggle off)
      await supabase.from('discussion_votes').delete().eq('id', existing.id)
      // Decrement upvotes
      const { data: thread } = await supabase
        .from('discussion_threads')
        .select('upvotes')
        .eq('id', threadId)
        .single()
      await supabase
        .from('discussion_threads')
        .update({ upvotes: Math.max(0, (thread?.upvotes ?? 0) - vote) })
        .eq('id', threadId)
      return NextResponse.json({ action: 'removed', vote: 0 })
    }
    // Change vote
    await supabase.from('discussion_votes').update({ vote }).eq('id', existing.id)
    const { data: thread } = await supabase
      .from('discussion_threads')
      .select('upvotes')
      .eq('id', threadId)
      .single()
    await supabase
      .from('discussion_threads')
      .update({ upvotes: Math.max(0, (thread?.upvotes ?? 0) + vote * 2) })
      .eq('id', threadId)
    return NextResponse.json({ action: 'changed', vote })
  }

  // New vote on thread
  const { error } = await supabase.from('discussion_votes').insert({
    user_id: user.id,
    thread_id: threadId,
    vote,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: thread } = await supabase
    .from('discussion_threads')
    .select('upvotes')
    .eq('id', threadId)
    .single()
  await supabase
    .from('discussion_threads')
    .update({ upvotes: (thread?.upvotes ?? 0) + vote })
    .eq('id', threadId)

  return NextResponse.json({ action: 'voted', vote })
}
