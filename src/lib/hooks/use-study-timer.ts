'use client'

import { useEffect, useRef } from 'react'

const REPORT_INTERVAL_MS = 5 * 60 * 1000 // Report every 5 minutes

/**
 * Tracks active study time and periodically reports to the server.
 * Uses visibility API to pause when tab is hidden.
 */
export function useStudyTimer(enabled = true) {
  const activeSecondsRef = useRef(0)
  const lastTickRef = useRef(Date.now())
  const isVisibleRef = useRef(true)

  useEffect(() => {
    if (!enabled) return

    // Track visibility
    function handleVisibility() {
      if (document.hidden) {
        isVisibleRef.current = false
      } else {
        isVisibleRef.current = true
        lastTickRef.current = Date.now()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    // Tick every second to accumulate active time
    const ticker = setInterval(() => {
      if (!isVisibleRef.current) return
      const now = Date.now()
      const elapsed = Math.min(now - lastTickRef.current, 2000) // Cap at 2s to avoid jumps
      activeSecondsRef.current += elapsed / 1000
      lastTickRef.current = now
    }, 1000)

    // Report to server periodically
    const reporter = setInterval(() => {
      const minutes = Math.floor(activeSecondsRef.current / 60)
      if (minutes >= 1) {
        activeSecondsRef.current = activeSecondsRef.current % 60 // Keep remainder
        fetch('/api/study/track-time', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ minutes }),
        }).catch(() => {
          // Put minutes back if report fails
          activeSecondsRef.current += minutes * 60
        })
      }
    }, REPORT_INTERVAL_MS)

    // Report on unmount/page leave
    function reportOnLeave() {
      const minutes = Math.floor(activeSecondsRef.current / 60)
      if (minutes >= 1) {
        // Use sendBeacon for reliable delivery on page close
        navigator.sendBeacon(
          '/api/study/track-time',
          new Blob(
            [JSON.stringify({ minutes })],
            { type: 'application/json' }
          )
        )
      }
    }

    window.addEventListener('beforeunload', reportOnLeave)

    return () => {
      clearInterval(ticker)
      clearInterval(reporter)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('beforeunload', reportOnLeave)
      reportOnLeave()
    }
  }, [enabled])
}
