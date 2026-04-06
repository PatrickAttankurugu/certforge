'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

export function VoiceTutorButton() {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative inline-block">
      <Button
        variant="outline"
        size="sm"
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label="Voice Tutoring - Coming Soon"
        disabled
      >
        <Mic className="h-4 w-4 mr-1" />
        Voice Tutoring
        <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
          Soon
        </span>
      </Button>

      <div
        className={cn(
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-lg border bg-popover p-2.5 text-xs text-popover-foreground shadow-md transition-opacity',
          showTooltip ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        role="tooltip"
      >
        <p className="font-medium">Coming Soon</p>
        <p className="text-muted-foreground mt-0.5">
          Voice-enabled AI tutoring with speech recognition. Ask questions and get answers hands-free.
        </p>
      </div>
    </div>
  )
}
