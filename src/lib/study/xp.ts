// ─── XP Constants ──────────────────────────────────────────────

export const XP_REWARDS = {
  CORRECT_ANSWER: 10,
  WRONG_ANSWER: 2,
  STREAK_BONUS_PER_DAY: 5,
  DAILY_GOAL_COMPLETE: 50,
  MOCK_EXAM_COMPLETE: 100,
  FIRST_QUESTION: 5,
  REVIEW_COMPLETE: 20,
} as const

export const LEAGUE_THRESHOLDS = {
  bronze: 0,
  silver: 500,
  gold: 1500,
  platinum: 3000,
  diamond: 5000,
} as const

export type League = keyof typeof LEAGUE_THRESHOLDS

export const LEAGUE_ORDER: League[] = ['diamond', 'platinum', 'gold', 'silver', 'bronze']

export const LEAGUE_COLORS: Record<League, string> = {
  bronze: 'text-amber-700',
  silver: 'text-slate-400',
  gold: 'text-yellow-500',
  platinum: 'text-cyan-400',
  diamond: 'text-violet-400',
}

export const LEAGUE_BG_COLORS: Record<League, string> = {
  bronze: 'bg-amber-700/10',
  silver: 'bg-slate-400/10',
  gold: 'bg-yellow-500/10',
  platinum: 'bg-cyan-400/10',
  diamond: 'bg-violet-400/10',
}

export function getLeagueForXP(xp: number): League {
  for (const league of LEAGUE_ORDER) {
    if (xp >= LEAGUE_THRESHOLDS[league]) return league
  }
  return 'bronze'
}

export function getStreakBonus(streakDays: number): number {
  return streakDays * XP_REWARDS.STREAK_BONUS_PER_DAY
}

export function getNextLeague(currentLeague: League): { league: League; xpNeeded: number } | null {
  const idx = LEAGUE_ORDER.indexOf(currentLeague)
  if (idx <= 0) return null // already diamond
  const next = LEAGUE_ORDER[idx - 1]
  return { league: next, xpNeeded: LEAGUE_THRESHOLDS[next] }
}
