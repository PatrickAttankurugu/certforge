import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: Load session recovery state
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const sessionType = searchParams.get('session_type')
  if (!sessionType) {
    return NextResponse.json({ error: 'session_type is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('session_recovery')
    .select('*')
    .eq('user_id', user.id)
    .eq('session_type', sessionType)
    .single()

  if (error || !data) return NextResponse.json(null)
  return NextResponse.json(data)
}

// POST: Save/upsert session recovery state
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { session_type, session_id, state_data } = body

  if (!session_type || !session_id) {
    return NextResponse.json({ error: 'session_type and session_id are required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('session_recovery')
    .upsert(
      {
        user_id: user.id,
        session_type,
        session_id,
        state_data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,session_type' },
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE: Clear session recovery state
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const sessionType = searchParams.get('session_type')
  if (!sessionType) {
    return NextResponse.json({ error: 'session_type is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('session_recovery')
    .delete()
    .eq('user_id', user.id)
    .eq('session_type', sessionType)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
