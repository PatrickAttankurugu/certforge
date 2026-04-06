import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: fetch a single conversation's full messages
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: conversation } = await supabase
    .from('ai_conversations')
    .select('id, topic_id, messages, created_at, updated_at')
    .eq('id', conversationId)
    .eq('user_id', user.id)
    .single()

  if (!conversation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(conversation)
}
