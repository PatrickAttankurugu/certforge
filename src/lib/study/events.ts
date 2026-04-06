export interface SeasonalEvent {
  id: string
  name: string
  description: string
  month: number // 1-12
  icon: string // emoji
  color: string
  reward: string
  goal: string
  multiplier?: number
  targetCount?: number
}

export const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    id: 'spring-sprint',
    name: 'Spring Sprint',
    description: '2x XP for all correct answers this month!',
    month: 4,
    icon: '🌸',
    color: 'text-pink-500',
    reward: 'Spring Sprinter badge',
    goal: 'Earn double XP on every correct answer',
    multiplier: 2,
  },
  {
    id: 'summer-scholar',
    name: 'Summer Scholar',
    description: 'Complete 500 questions for a special badge!',
    month: 7,
    icon: '☀️',
    color: 'text-amber-500',
    reward: 'Summer Scholar badge',
    goal: 'Answer 500 questions this month',
    targetCount: 500,
  },
  {
    id: 'fall-focus',
    name: 'Fall Focus',
    description: 'Achieve a 30-day study streak this month!',
    month: 10,
    icon: '🍂',
    color: 'text-orange-500',
    reward: 'Fall Focus badge',
    goal: 'Build a 30-day study streak',
    targetCount: 30,
  },
  {
    id: 'winter-warrior',
    name: 'Winter Warrior',
    description: 'Complete 5 mock exams this month!',
    month: 12,
    icon: '❄️',
    color: 'text-blue-400',
    reward: 'Winter Warrior badge',
    goal: 'Complete 5 full mock exams',
    targetCount: 5,
  },
]

export function getActiveEvent(): SeasonalEvent | null {
  const currentMonth = new Date().getMonth() + 1
  return SEASONAL_EVENTS.find((e) => e.month === currentMonth) ?? null
}

export function getEventProgress(
  event: SeasonalEvent,
  stats: { questionsThisMonth: number; streakDays: number; mockExamsThisMonth: number }
): { current: number; target: number; percentage: number } {
  let current = 0
  let target = event.targetCount ?? 0

  switch (event.id) {
    case 'spring-sprint':
      // No specific target - just a multiplier
      return { current: 0, target: 0, percentage: 100 }
    case 'summer-scholar':
      current = stats.questionsThisMonth
      break
    case 'fall-focus':
      current = stats.streakDays
      break
    case 'winter-warrior':
      current = stats.mockExamsThisMonth
      break
  }

  const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0
  return { current, target, percentage }
}
