'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Gift, X, Copy, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Referral banner — shown at top of study area.
 * Berger: Social Currency (sharing = status) + Stories (pass it forward)
 * Cialdini: Reciprocity (give free days, get free days)
 * Traction: Viral loop mechanism
 *
 * Uses localStorage to track dismissal so it doesn't persist across sessions forever.
 */
export function ReferralBanner() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    const dismissedAt = localStorage.getItem('certforge_referral_dismissed')
    if (!dismissedAt) return false
    // Show again after 7 days
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    return Date.now() - Number(dismissedAt) < sevenDays
  })
  const [copied, setCopied] = useState(false)

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('certforge_referral_dismissed', String(Date.now()))
  }

  const handleCopyLink = async () => {
    const referralUrl = `${window.location.origin}/signup?ref=share`
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    toast.success('Referral link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-primary/5 border-b border-primary/10 px-4 py-2 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs">
        <Gift className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="text-muted-foreground">
          <strong className="text-foreground">Share CertForge</strong> with a friend and both get{' '}
          <strong className="text-primary">7 days of Standard free</strong>
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={handleCopyLink} className="h-7 text-xs gap-1 px-2">
          {copied ? <CheckCircle className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
        <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
