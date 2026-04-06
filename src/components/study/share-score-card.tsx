'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Share2, ExternalLink, Copy, CheckCircle, Trophy, Target, Flame } from 'lucide-react'
import { toast } from 'sonner'
import type { DomainId } from '@/types/study'
import { DOMAIN_NAMES, DOMAIN_COLORS } from '@/lib/study/constants'

interface ShareScoreCardProps {
  type: 'mock-exam' | 'streak' | 'milestone'
  score?: number
  passed?: boolean
  correctCount?: number
  totalQuestions?: number
  streakDays?: number
  milestoneText?: string
  domainBreakdown?: Record<string, { correct: number; total: number; accuracy: number }>
}

export function ShareScoreCard({
  type,
  score,
  passed,
  correctCount,
  totalQuestions,
  streakDays,
  milestoneText,
  domainBreakdown,
}: ShareScoreCardProps) {
  const [showCard, setShowCard] = useState(false)
  const [copied, setCopied] = useState(false)

  const getShareText = () => {
    if (type === 'mock-exam') {
      return `I just scored ${score}/1000 on a CertForge AWS SAA-C03 mock exam! ${passed ? '🎉 Predicted PASS!' : '📚 Getting closer!'}\n\n${correctCount}/${totalQuestions} correct\n\nPreparing for AWS Solutions Architect with AI-powered study tools at certforge.dev`
    }
    if (type === 'streak') {
      return `🔥 ${streakDays}-day study streak on CertForge!\n\nConsistency is key to passing the AWS SAA-C03 exam. Building momentum one day at a time.\n\ncertforge.dev`
    }
    return `🏆 ${milestoneText}\n\nPreparing for AWS SAA-C03 with CertForge — AI-powered study tools that actually work.\n\ncertforge.dev`
  }

  const shareText = getShareText()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://certforge.dev')}&summary=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setShowCard(true)} className="gap-1.5">
        <Share2 className="h-3.5 w-3.5" />
        Share Result
      </Button>

      {showCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setShowCard(false)}>
          <Card className="w-full max-w-md border-primary/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <CardContent className="pt-6 space-y-4">
              {/* Preview card */}
              <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 rounded-lg p-5 border space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                    <span className="text-xs font-bold text-primary-foreground">CF</span>
                  </div>
                  <span className="font-semibold text-sm">CertForge</span>
                  <Badge variant="secondary" className="text-[10px] ml-auto">AWS SAA-C03</Badge>
                </div>

                {type === 'mock-exam' && (
                  <div className="text-center space-y-2">
                    <Trophy className={`h-10 w-10 mx-auto ${passed ? 'text-green-500' : 'text-amber-500'}`} />
                    <p className="text-3xl font-bold font-mono">{score}</p>
                    <Badge className={passed ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}>
                      {passed ? 'PREDICTED PASS' : 'KEEP GOING'}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{correctCount}/{totalQuestions} correct</p>

                    {domainBreakdown && (
                      <div className="grid grid-cols-2 gap-1.5 mt-3">
                        {(['secure', 'resilient', 'performant', 'cost'] as DomainId[]).map((d) => {
                          const b = domainBreakdown[d]
                          if (!b) return null
                          return (
                            <div key={d} className="bg-background/50 rounded px-2 py-1 text-[10px]">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[d] }} />
                                <span className="truncate">{DOMAIN_NAMES[d].replace('Design ', '')}</span>
                              </div>
                              <span className="font-mono font-semibold">{Math.round(b.accuracy * 100)}%</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {type === 'streak' && (
                  <div className="text-center space-y-2">
                    <Flame className="h-10 w-10 mx-auto text-orange-500" />
                    <p className="text-3xl font-bold">{streakDays}</p>
                    <p className="text-sm text-muted-foreground">Day Study Streak</p>
                  </div>
                )}

                {type === 'milestone' && (
                  <div className="text-center space-y-2">
                    <Target className="h-10 w-10 mx-auto text-primary" />
                    <p className="text-lg font-bold">{milestoneText}</p>
                  </div>
                )}
              </div>

              {/* Share buttons */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Share your progress</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" onClick={handleTwitter} className="gap-1.5 text-xs">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Twitter/X
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLinkedIn} className="gap-1.5 text-xs">
                    <ExternalLink className="h-3.5 w-3.5" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
                    {copied ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={() => setShowCard(false)} className="w-full text-xs">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
