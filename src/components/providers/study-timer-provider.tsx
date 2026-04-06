'use client'

import { useStudyTimer } from '@/lib/hooks/use-study-timer'

export function StudyTimerProvider({ children }: { children: React.ReactNode }) {
  useStudyTimer(true)
  return <>{children}</>
}
