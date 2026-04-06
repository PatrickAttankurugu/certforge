'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Zap,
  ArrowRight,
  CheckCircle,
  X,
  Shield,
  TrendingUp,
  Bot,
  Target,
  Lock,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

type UpgradeContext =
  | 'question-limit'
  | 'explanation-limit'
  | 'tutor-limit'
  | 'mock-exam-limit'
  | 'score-prediction'
  | 'weak-area-report'
  | 'general'

interface UpgradePromptProps {
  context: UpgradeContext
  currentPlan?: string
  onDismiss?: () => void
}

const CONTEXT_CONFIG: Record<UpgradeContext, {
  icon: typeof Zap
  title: string
  description: string
  color: string
  bg: string
}> = {
  'question-limit': {
    icon: Lock,
    title: 'You\'ve hit your daily question limit',
    description: 'Upgrade to Standard for unlimited daily practice — the #1 way to pass faster.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  'explanation-limit': {
    icon: Bot,
    title: 'AI explanations are key to learning',
    description: 'You\'ve used your 3 free AI explanations today. Upgrade for unlimited AI-powered learning.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  'tutor-limit': {
    icon: Bot,
    title: 'Unlock your personal AI tutor',
    description: 'Free users don\'t have AI tutor access. Upgrade to ask questions about any AWS topic, 24/7.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  'mock-exam-limit': {
    icon: Target,
    title: 'Mock exams are the best predictor of success',
    description: 'You\'ve used your free mock exam this month. Upgrade for up to 5 monthly mock exams.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  'score-prediction': {
    icon: TrendingUp,
    title: 'Know exactly when you\'re ready',
    description: 'Score prediction is a paid feature. See your projected exam score across all 4 domains.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  'weak-area-report': {
    icon: TrendingUp,
    title: 'Get a detailed weak area report',
    description: 'Identify exactly which topics need more work. Focus your study time where it matters most.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  general: {
    icon: Sparkles,
    title: 'Supercharge your exam prep',
    description: 'Upgrade to unlock the full power of CertForge and pass your exam faster.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
}

export function UpgradePrompt({ context, currentPlan = 'free', onDismiss }: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false)
  const config = CONTEXT_CONFIG[context]
  const Icon = config.icon

  if (dismissed || currentPlan !== 'free') return null

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <Card className="border-primary/30 relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />

      <CardContent className="pt-5 pb-5 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg} shrink-0`}>
            <Icon className={`h-5 w-5 ${config.color}`} />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-sm">{config.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {config.description}
              </p>
            </div>

            {/* Hormozi: Stack the value */}
            <div className="flex flex-wrap gap-2">
              {[
                'Unlimited questions',
                'AI explanations',
                'Score prediction',
                'Mock exams',
              ].map((feature) => (
                <span key={feature} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {feature}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link href="/settings">
                <Button size="sm" className="gap-1.5 shadow-sm shadow-primary/20">
                  Upgrade to Standard — $29/mo
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>

              {/* Cialdini: Risk reversal */}
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3 text-green-500" />
                7-day money-back guarantee
              </span>
            </div>

            {/* Hormozi: Anchor against the cost of failure */}
            <p className="text-[10px] text-muted-foreground/60">
              Less than 10% the cost of an exam retake ($300)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Inline upgrade nudge — smaller, for embedding within feature sections.
 * Cialdini: Scarcity (limited on free) + Reciprocity (you already got value)
 */
export function UpgradeNudge({ feature, plan = 'free' }: { feature: string; plan?: string }) {
  if (plan !== 'free') return null

  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs">
      <Lock className="h-3.5 w-3.5 text-primary shrink-0" />
      <span className="text-muted-foreground">
        <strong className="text-foreground">{feature}</strong> is a paid feature.{' '}
        <Link href="/settings" className="text-primary underline underline-offset-2 hover:text-primary/80">
          Upgrade &rarr;
        </Link>
      </span>
    </div>
  )
}
