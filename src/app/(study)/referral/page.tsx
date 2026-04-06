'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Gift, Copy, CheckCircle, Users, UserPlus, ExternalLink, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { getReferralLink, getShareText } from '@/lib/study/referral'

interface ReferralStats {
  total_referred: number
  signed_up: number
  converted: number
  rewards_earned: number
}

export default function ReferralPage() {
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/study/referral')
      if (res.ok) {
        const data = await res.json()
        setReferralCode(data.referral_code)
        setStats(data.stats)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    const res = await fetch('/api/study/referral', { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setReferralCode(data.referral_code)
      toast.success('Referral code generated!')
    } else {
      toast.error('Failed to generate referral code')
    }
    setGenerating(false)
  }

  const handleCopy = async () => {
    if (!referralCode) return
    await navigator.clipboard.writeText(getReferralLink(referralCode))
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareTwitter = () => {
    if (!referralCode) return
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText(referralCode))}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  const handleShareLinkedIn = () => {
    if (!referralCode) return
    const link = getReferralLink(referralCode)
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`
    window.open(url, '_blank', 'width=550,height=420')
  }

  const handleShareEmail = () => {
    if (!referralCode) return
    const subject = encodeURIComponent('Join me on CertForge - AWS Certification Prep')
    const body = encodeURIComponent(getShareText(referralCode))
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-32" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Gift className="h-6 w-6 text-primary" />
        Referral Program
      </h1>

      {/* Referral link */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {referralCode ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border bg-muted/50 px-3 py-2 text-sm font-mono truncate">
                  {getReferralLink(referralCode)}
                </div>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Code:</span>
                <Badge variant="secondary" className="font-mono">{referralCode}</Badge>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">
                Generate your referral code to start inviting friends.
              </p>
              <Button onClick={handleGenerate} disabled={generating}>
                <UserPlus className="h-4 w-4 mr-2" />
                {generating ? 'Generating...' : 'Generate Referral Code'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share buttons */}
      {referralCode && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" onClick={handleShareTwitter} className="gap-1.5 text-xs">
                <ExternalLink className="h-3.5 w-3.5" />
                Twitter/X
              </Button>
              <Button variant="outline" onClick={handleShareLinkedIn} className="gap-1.5 text-xs">
                <ExternalLink className="h-3.5 w-3.5" />
                LinkedIn
              </Button>
              <Button variant="outline" onClick={handleShareEmail} className="gap-1.5 text-xs">
                <Mail className="h-3.5 w-3.5" />
                Email
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {stats && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Referral Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold">{stats.total_referred}</p>
                <p className="text-xs text-muted-foreground">People Referred</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold">{stats.signed_up}</p>
                <p className="text-xs text-muted-foreground">Signed Up</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold">{stats.converted}</p>
                <p className="text-xs text-muted-foreground">Converted</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold">{stats.rewards_earned}</p>
                <p className="text-xs text-muted-foreground">Rewards Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How it works */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">1</span>
              Share your unique referral link with friends
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">2</span>
              They sign up using your link
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">3</span>
              When they upgrade to a paid plan, you both get bonus XP and a free streak freeze
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
