import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { parseBody } from '@/lib/api/validation'

const toggleBookmarkSchema = z.object({
  question_id: z.string().uuid(),
  note: z.string().max(500).optional().default(''),
})

// GET: list user's bookmarked questions
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: bookmarks } = await supabase
    .from('bookmarked_questions')
    .select(`
      id,
      question_id,
      note,
      created_at,
      questions (
        id, domain_id, topic_id, difficulty, question_text, question_type, options, explanation
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json(bookmarks ?? [])
}

// POST: toggle bookmark (add if missing, remove if exists)
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = parseBody(toggleBookmarkSchema, body)
  if (!parsed.success) return parsed.response
  const { question_id, note } = parsed.data

  // Check if already bookmarked
  const { data: existing } = await supabase
    .from('bookmarked_questions')
    .select('id')
    .eq('user_id', user.id)
    .eq('question_id', question_id)
    .single()

  if (existing) {
    // Remove bookmark
    await supabase
      .from('bookmarked_questions')
      .delete()
      .eq('id', existing.id)

    return NextResponse.json({ bookmarked: false })
  }

  // Add bookmark
  await supabase
    .from('bookmarked_questions')
    .insert({ user_id: user.id, question_id, note })

  return NextResponse.json({ bookmarked: true })
}
