import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: list user's AI tutor conversations
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: conversations } = await supabase
    .from('ai_conversations')
    .select('id, topic_id, messages, created_at, updated_at')
    .eq('user_id', user.id)
    .eq('conversation_type', 'tutoring')
    .order('updated_at', { ascending: false })
    .limit(20)

  // Return summary (first user message as preview, message count)
  const summaries = (conversations ?? []).map((c) => {
    const msgs = (c.messages ?? []) as { role: string; content: string }[]
    const firstUserMsg = msgs.find((m) => m.role === 'user')
    return {
      id: c.id,
      topic_id: c.topic_id,
      preview: firstUserMsg?.content?.slice(0, 100) ?? 'New conversation',
      message_count: msgs.length,
      created_at: c.created_at,
      updated_at: c.updated_at,
    }
  })

  return NextResponse.json(summaries)
}
