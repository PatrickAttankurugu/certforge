import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { DOMAIN_NAMES, DOMAIN_COLORS, DOMAIN_WEIGHTS } from '@/lib/study/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import type { DomainId, TopicProgress } from '@/types/study'

const VALID_DOMAINS: DomainId[] = ['secure', 'resilient', 'performant', 'cost']

export async function generateMetadata({ params }: { params: Promise<{ domainId: string }> }) {
  const { domainId } = await params
  const name = DOMAIN_NAMES[domainId as DomainId]
  return { title: name ? `${name} | CertForge` : 'Domain | CertForge' }
}

export default async function DomainDetailPage({ params }: { params: Promise<{ domainId: string }> }) {
  const { domainId: rawId } = await params
  if (!VALID_DOMAINS.includes(rawId as DomainId)) notFound()
  const domainId = rawId as DomainId

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: domainProgress }, { data: topicProgress }, { data: topics }] = await Promise.all([
    supabase.from('domain_progress').select('*').eq('user_id', user.id).eq('domain_id', domainId).single(),
    supabase.from('topic_progress').select('*').eq('user_id', user.id).eq('domain_id', domainId),
    supabase.from('exam_topics').select('id, name, sort_order').eq('domain_id', domainId).order('sort_order'),
  ])

  const tp = (topicProgress ?? []) as TopicProgress[]
  const accuracy = domainProgress?.accuracy ?? 0
  const seen = domainProgress?.questions_seen ?? 0

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/domains">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[domainId] }} />
            <h1 className="text-xl font-bold">{DOMAIN_NAMES[domainId]}</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {Math.round(DOMAIN_WEIGHTS[domainId] * 100)}% of exam &middot; {seen} questions practiced &middot; {Math.round(accuracy * 100)}% accuracy
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href={`/practice?domain=${domainId}`}>
          <Button>
            <BookOpen className="h-4 w-4 mr-2" />
            Practice this domain
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Topics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(topics ?? []).map((topic) => {
            const progress = tp.find((t) => t.topic_id === topic.id)
            const topicAccuracy = progress?.accuracy ?? 0
            const topicSeen = progress?.questions_seen ?? 0
            const isWeak = progress?.is_weak ?? false

            return (
              <div key={topic.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{topic.name}</p>
                    {isWeak && (
                      <Badge className="bg-amber-500/20 text-amber-400 text-xs">Weak</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{topicSeen} practiced</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-mono font-medium">{Math.round(topicAccuracy * 100)}%</p>
                </div>
                <Progress value={topicAccuracy * 100} className="w-20 h-1.5" />
              </div>
            )
          })}

          {(topics ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No topics loaded for this domain yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
