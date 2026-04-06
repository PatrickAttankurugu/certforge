import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ bookmarked: false })

  const { searchParams } = new URL(request.url)
  const questionId = searchParams.get('question_id')
  if (!questionId) return NextResponse.json({ bookmarked: false })

  const { data } = await supabase
    .from('bookmarked_questions')
    .select('id')
    .eq('user_id', user.id)
    .eq('question_id', questionId)
    .single()

  return NextResponse.json({ bookmarked: !!data })
}
