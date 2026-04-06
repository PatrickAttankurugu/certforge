import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FlaskConical, Clock, BarChart3, ExternalLink, Lock } from 'lucide-react'
import { LABS } from '@/lib/study/lab-data'
import Link from 'next/link'

export const metadata = { title: 'Hands-on Labs | CertForge' }

export default function LabsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Hands-on Labs</h1>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Practice AWS services with guided hands-on exercises. Build real infrastructure to reinforce exam concepts.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {LABS.map((lab) => (
          <Card key={lab.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base leading-snug">{lab.title}</CardTitle>
                {lab.isPremium && (
                  <Badge variant="secondary" className="shrink-0 gap-1">
                    <Lock className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{lab.description}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs gap-1">
                  <Clock className="h-3 w-3" />
                  {lab.estimatedMinutes} min
                </Badge>
                <Badge variant="outline" className="text-xs gap-1">
                  <BarChart3 className="h-3 w-3" />
                  {lab.difficulty}
                </Badge>
                {lab.relatedTopics.slice(0, 2).map((topic) => (
                  <Badge key={topic} variant="secondary" className="text-[10px]">
                    {topic.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Link href={`/domains/${lab.domainId}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Study Domain
                  </Button>
                </Link>
                <Button size="sm" className="flex-1 gap-1 text-xs" disabled={lab.isPremium}>
                  <ExternalLink className="h-3 w-3" />
                  Start Lab
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
