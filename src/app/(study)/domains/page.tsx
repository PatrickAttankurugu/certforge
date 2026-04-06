import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DOMAIN_NAMES, DOMAIN_COLORS, DOMAIN_WEIGHTS } from '@/lib/study/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { DomainId, DomainProgress } from '@/types/study'

export const metadata = { title: 'Domains | CertForge' }

export default async function DomainsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: domainProgress } = await supabase
    .from('domain_progress')
    .select('*')
    .eq('user_id', user.id)

  const dp = (domainProgress ?? []) as DomainProgress[]
  const domains: DomainId[] = ['secure', 'resilient', 'performant', 'cost']

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exam Domains</h1>
        <p className="text-muted-foreground text-sm mt-1">
          SAA-C03 covers 4 domains. Master each to pass.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {domains.map((id) => {
          const progress = dp.find((d) => d.domain_id === id)
          const accuracy = progress?.accuracy ?? 0
          const seen = progress?.questions_seen ?? 0
          const weight = DOMAIN_WEIGHTS[id]

          return (
            <Link key={id} href={`/domains/${id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[id] }} />
                      <CardTitle className="text-base">{DOMAIN_NAMES[id]}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(weight * 100)}% of exam
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{seen} questions practiced</span>
                    <span className="font-mono font-medium">{Math.round(accuracy * 100)}%</span>
                  </div>
                  <Progress value={accuracy * 100} className="h-2" />
                  <div className="flex gap-2">
                    {accuracy >= 0.8 && <Badge className="bg-green-500/20 text-green-400 text-xs">Strong</Badge>}
                    {accuracy >= 0.6 && accuracy < 0.8 && <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Improving</Badge>}
                    {accuracy < 0.6 && seen > 0 && <Badge className="bg-red-500/20 text-red-400 text-xs">Needs Work</Badge>}
                    {seen === 0 && <Badge variant="outline" className="text-xs">Not started</Badge>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
