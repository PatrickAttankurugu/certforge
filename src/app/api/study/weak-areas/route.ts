import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: weakTopics } = await supabase
    .from('topic_progress')
    .select('topic_id, domain_id, accuracy, questions_seen, is_weak')
    .eq('user_id', user.id)
    .eq('is_weak', true)
    .order('accuracy', { ascending: true })

  // Enrich with topic names
  const topicIds = (weakTopics ?? []).map((t) => t.topic_id)
  const { data: topicNames } = topicIds.length > 0
    ? await supabase.from('exam_topics').select('id, name, domain_id').in('id', topicIds)
    : { data: [] }

  const nameMap = new Map((topicNames ?? []).map((t) => [t.id, t.name]))

  const enriched = (weakTopics ?? []).map((t) => ({
    ...t,
    topic_name: nameMap.get(t.topic_id) ?? t.topic_id.replace(/_/g, ' '),
  }))

  return NextResponse.json(enriched)
}
