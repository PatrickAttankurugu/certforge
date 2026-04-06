'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import {
  Trophy,
  Flame,
  Target,
  Brain,
  Zap,
  Star,
  Award,
  BookOpen,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'

interface Achievement {
  id: string
  icon: LucideIcon
  title: string
  description: string
  color: string
}

const ACHIEVEMENTS: Achievement[] = [
  // Question milestones
  { id: 'first-question', icon: Zap, title: 'First Steps', description: 'Answered your first question', color: 'text-blue-500' },
  { id: '10-questions', icon: BookOpen, title: 'Getting Started', description: 'Answered 10 questions', color: 'text-blue-500' },
  { id: '50-questions', icon: BookOpen, title: 'Building Momentum', description: 'Answered 50 questions', color: 'text-green-500' },
  { id: '100-questions', icon: Target, title: 'Century Club', description: 'Answered 100 questions', color: 'text-amber-500' },
  { id: '500-questions', icon: Brain, title: 'Knowledge Machine', description: 'Answered 500 questions', color: 'text-purple-500' },
  { id: '1000-questions', icon: Trophy, title: 'Question Master', description: 'Answered 1,000 questions!', color: 'text-yellow-500' },

  // Streak milestones
  { id: '3-day-streak', icon: Flame, title: 'On Fire', description: '3-day study streak', color: 'text-orange-500' },
  { id: '7-day-streak', icon: Flame, title: 'Week Warrior', description: '7-day study streak!', color: 'text-orange-500' },
  { id: '14-day-streak', icon: Flame, title: 'Unstoppable', description: '14-day study streak!', color: 'text-red-500' },
  { id: '30-day-streak', icon: Flame, title: 'Legendary Streak', description: '30-day study streak!', color: 'text-red-500' },

  // Mock exam milestones
  { id: 'first-mock', icon: GraduationCap, title: 'Mock Exam Rookie', description: 'Completed your first mock exam', color: 'text-purple-500' },
  { id: 'first-pass', icon: Trophy, title: 'Exam Ready', description: 'Passed your first mock exam!', color: 'text-green-500' },
  { id: 'score-800', icon: Star, title: 'High Achiever', description: 'Scored 800+ on a mock exam', color: 'text-yellow-500' },
  { id: 'score-900', icon: Award, title: 'Elite Scorer', description: 'Scored 900+ on a mock exam!', color: 'text-yellow-500' },

  // Accuracy milestones
  { id: '80-accuracy', icon: Target, title: 'Sharpshooter', description: '80%+ accuracy on a domain', color: 'text-green-500' },
  { id: '90-accuracy', icon: Target, title: 'Precision Expert', description: '90%+ accuracy on a domain', color: 'text-cyan-500' },
]

function showAchievementToast(achievement: Achievement) {
  const Icon = achievement.icon
  toast(
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
        <Icon className={`h-5 w-5 ${achievement.color}`} />
      </div>
      <div>
        <p className="font-semibold text-sm">{achievement.title}</p>
        <p className="text-xs text-muted-foreground">{achievement.description}</p>
      </div>
    </div>,
    {
      duration: 5000,
    }
  )
}

/**
 * Check achievements based on current user stats and show toasts.
 * Uses localStorage to track which achievements have been shown.
 */
export function useAchievementChecker() {
  const checkedRef = useRef(false)

  const checkAchievements = (stats: {
    totalQuestions: number
    streak: number
    mockExamsCompleted?: number
    bestMockScore?: number
    domainAccuracies?: number[]
  }) => {
    // Only check once per render cycle
    if (checkedRef.current) return
    checkedRef.current = true
    setTimeout(() => { checkedRef.current = false }, 1000)

    const shown = JSON.parse(localStorage.getItem('certforge_achievements') || '[]') as string[]

    const earned: Achievement[] = []

    // Question milestones
    if (stats.totalQuestions >= 1 && !shown.includes('first-question')) earned.push(ACHIEVEMENTS.find(a => a.id === 'first-question')!)
    if (stats.totalQuestions >= 10 && !shown.includes('10-questions')) earned.push(ACHIEVEMENTS.find(a => a.id === '10-questions')!)
    if (stats.totalQuestions >= 50 && !shown.includes('50-questions')) earned.push(ACHIEVEMENTS.find(a => a.id === '50-questions')!)
    if (stats.totalQuestions >= 100 && !shown.includes('100-questions')) earned.push(ACHIEVEMENTS.find(a => a.id === '100-questions')!)
    if (stats.totalQuestions >= 500 && !shown.includes('500-questions')) earned.push(ACHIEVEMENTS.find(a => a.id === '500-questions')!)
    if (stats.totalQuestions >= 1000 && !shown.includes('1000-questions')) earned.push(ACHIEVEMENTS.find(a => a.id === '1000-questions')!)

    // Streak milestones
    if (stats.streak >= 3 && !shown.includes('3-day-streak')) earned.push(ACHIEVEMENTS.find(a => a.id === '3-day-streak')!)
    if (stats.streak >= 7 && !shown.includes('7-day-streak')) earned.push(ACHIEVEMENTS.find(a => a.id === '7-day-streak')!)
    if (stats.streak >= 14 && !shown.includes('14-day-streak')) earned.push(ACHIEVEMENTS.find(a => a.id === '14-day-streak')!)
    if (stats.streak >= 30 && !shown.includes('30-day-streak')) earned.push(ACHIEVEMENTS.find(a => a.id === '30-day-streak')!)

    // Mock exam milestones
    if (stats.mockExamsCompleted && stats.mockExamsCompleted >= 1 && !shown.includes('first-mock'))
      earned.push(ACHIEVEMENTS.find(a => a.id === 'first-mock')!)
    if (stats.bestMockScore && stats.bestMockScore >= 720 && !shown.includes('first-pass'))
      earned.push(ACHIEVEMENTS.find(a => a.id === 'first-pass')!)
    if (stats.bestMockScore && stats.bestMockScore >= 800 && !shown.includes('score-800'))
      earned.push(ACHIEVEMENTS.find(a => a.id === 'score-800')!)
    if (stats.bestMockScore && stats.bestMockScore >= 900 && !shown.includes('score-900'))
      earned.push(ACHIEVEMENTS.find(a => a.id === 'score-900')!)

    // Domain accuracy milestones
    if (stats.domainAccuracies) {
      if (stats.domainAccuracies.some(a => a >= 0.8) && !shown.includes('80-accuracy'))
        earned.push(ACHIEVEMENTS.find(a => a.id === '80-accuracy')!)
      if (stats.domainAccuracies.some(a => a >= 0.9) && !shown.includes('90-accuracy'))
        earned.push(ACHIEVEMENTS.find(a => a.id === '90-accuracy')!)
    }

    // Show toasts with stagger
    const newShown = [...shown]
    earned.filter(Boolean).forEach((achievement, index) => {
      newShown.push(achievement.id)
      setTimeout(() => showAchievementToast(achievement), index * 1500)
    })

    if (earned.length > 0) {
      localStorage.setItem('certforge_achievements', JSON.stringify(newShown))
    }
  }

  return { checkAchievements }
}

/**
 * Component that checks achievements on mount based on passed-in stats.
 * Designed to be placed on the dashboard page.
 */
export function AchievementChecker({
  totalQuestions,
  streak,
  mockExamsCompleted,
  bestMockScore,
  domainAccuracies,
}: {
  totalQuestions: number
  streak: number
  mockExamsCompleted?: number
  bestMockScore?: number
  domainAccuracies?: number[]
}) {
  const { checkAchievements } = useAchievementChecker()

  useEffect(() => {
    checkAchievements({
      totalQuestions,
      streak,
      mockExamsCompleted,
      bestMockScore,
      domainAccuracies,
    })
  }, [totalQuestions, streak, mockExamsCompleted, bestMockScore]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
