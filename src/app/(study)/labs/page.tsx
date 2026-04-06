'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FlaskConical, Clock, ExternalLink, Lock, CheckCircle, Shield, BarChart3, Zap, Target,
} from 'lucide-react'
import { LABS, type Lab } from '@/lib/study/lab-data'
import { DOMAIN_NAMES } from '@/lib/study/constants'
import type { DomainId } from '@/types/study'

const domainIcons: Record<DomainId, typeof Shield> = {
  secure: Shield,
  resilient: BarChart3,
  performant: Zap,
  cost: Target,
}

const domainColors: Record<DomainId, { color: string; bg: string }> = {
  secure: { color: 'text-blue-500', bg: 'bg-blue-500/10' },
  resilient: { color: 'text-green-500', bg: 'bg-green-500/10' },
  performant: { color: 'text-amber-500', bg: 'bg-amber-500/10' },
  cost: { color: 'text-purple-500', bg: 'bg-purple-500/10' },
}

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'text-green-500', bg: 'bg-green-500/10' },
  intermediate: { label: 'Intermediate', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  advanced: { label: 'Advanced', color: 'text-red-500', bg: 'bg-red-500/10' },
}

function LabCard({ lab }: { lab: Lab }) {
  const Icon = domainIcons[lab.domainId]
  const colors = domainColors[lab.domainId]
  const diff = difficultyConfig[lab.difficulty]

  return (
    <Card className="hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colors.bg}`}>
              <Icon className={`h-4 w-4 ${colors.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-snug">{lab.title}</h3>
              <p className="text-xs text-muted-foreground">{DOMAIN_NAMES[lab.domainId]}</p>
            </div>
          </div>
          {lab.isPremium && (
            <Badge variant="outline" className="text-xs gap-1 shrink-0">
              <Lock className="h-3 w-3" /> Premium
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{lab.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className={`text-xs ${diff.color}`}>
            {diff.label}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> {lab.estimatedMinutes} min
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {lab.awsServices.map((service) => (
            <Badge key={service} variant="outline" className="text-xs font-normal">
              {service}
            </Badge>
          ))}
        </div>

        {/* Steps preview */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Steps:</p>
          <ol className="space-y-1">
            {lab.steps.slice(0, 3).map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500/60 shrink-0 mt-0.5" />
                {step}
              </li>
            ))}
            {lab.steps.length > 3 && (
              <li className="text-xs text-muted-foreground/60 ml-5">
                + {lab.steps.length - 3} more steps...
              </li>
            )}
          </ol>
        </div>

        <a href={lab.guideUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
            <ExternalLink className="h-3 w-3" />
            View Full Guide
          </Button>
        </a>
      </CardContent>
    </Card>
  )
}

export default function LabsPage() {
  const domainGroups = LABS.reduce<Record<string, Lab[]>>((acc, lab) => {
    if (!acc[lab.domainId]) acc[lab.domainId] = []
    acc[lab.domainId].push(lab)
    return acc
  }, {})

  const domainOrder: DomainId[] = ['secure', 'resilient', 'performant', 'cost']

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          Hands-on Labs
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Complement your study with practical AWS exercises. Each lab includes step-by-step instructions
          to build real-world architectures.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Badge variant="secondary" className="gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" />
          {LABS.filter((l) => !l.isPremium).length} free labs
        </Badge>
        <Badge variant="secondary" className="gap-1">
          <Lock className="h-3 w-3" />
          {LABS.filter((l) => l.isPremium).length} premium labs
        </Badge>
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          {Math.round(LABS.reduce((sum, l) => sum + l.estimatedMinutes, 0) / 60)} hours total
        </Badge>
      </div>

      {domainOrder.map((domainId) => {
        const labs = domainGroups[domainId]
        if (!labs || labs.length === 0) return null
        const DIcon = domainIcons[domainId]
        const dColors = domainColors[domainId]

        return (
          <section key={domainId}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded ${dColors.bg}`}>
                <DIcon className={`h-3.5 w-3.5 ${dColors.color}`} />
              </div>
              {DOMAIN_NAMES[domainId]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {labs.map((lab) => (
                <LabCard key={lab.id} lab={lab} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
