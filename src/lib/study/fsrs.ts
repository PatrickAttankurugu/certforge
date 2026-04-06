/**
 * FSRS-5 (Free Spaced Repetition Scheduler) implementation.
 * Pure functions — no DB calls. Runs client-side for instant feedback.
 *
 * Reference: https://github.com/open-spaced-repetition/fsrs4anki/wiki/Algorithm
 */

import { CardState, Rating } from '@/types/study'
import { FSRS_DEFAULT_WEIGHTS, FSRS_DESIRED_RETENTION } from './constants'

export interface FSRSCard {
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  state: CardState
  due: Date
  last_review: Date | null
}

export interface FSRSOutput {
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  state: CardState
  due: Date
}

const w = FSRS_DEFAULT_WEIGHTS
const DECAY = -0.5
const FACTOR = 19 / 81 // (0.9^(1/DECAY) - 1)

// ─── Core math ──────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Memory retrievability at elapsed_days given stability */
export function retrievability(elapsed_days: number, stability: number): number {
  if (stability <= 0) return 0
  return Math.pow(1 + (FACTOR * elapsed_days) / stability, DECAY)
}

/** Initial stability for a new card based on rating */
function initStability(rating: Rating): number {
  return Math.max(w[rating - 1], 0.1)
}

/** Initial difficulty for a new card based on rating */
function initDifficulty(rating: Rating): number {
  return clamp(w[4] - Math.exp(w[5] * (rating - 1)) + 1, 1, 10)
}

/** Next difficulty after a review */
function nextDifficulty(d: number, rating: Rating): number {
  const delta = d - w[6] * (rating - 3)
  // Mean reversion
  const next = w[7] * initDifficulty(Rating.Easy) + (1 - w[7]) * delta
  return clamp(next, 1, 10)
}

/** Short-term stability for learning/relearning states */
function shortTermStability(s: number, rating: Rating): number {
  return s * Math.exp(w[17] * (rating - 3 + w[18]))
}

/** Next stability after successful recall */
function nextRecallStability(
  d: number,
  s: number,
  r: number,
  rating: Rating
): number {
  const hardPenalty = rating === Rating.Hard ? w[15] : 1
  const easyBonus = rating === Rating.Easy ? w[16] : 1
  return (
    s *
    (1 +
      Math.exp(w[8]) *
      (11 - d) *
      Math.pow(s, -w[9]) *
      (Math.exp((1 - r) * w[10]) - 1) *
      hardPenalty *
      easyBonus)
  )
}

/** Next stability after forgetting (lapse) */
function nextForgetStability(
  d: number,
  s: number,
  r: number
): number {
  return Math.max(
    w[11] *
    Math.pow(d, -w[12]) *
    (Math.pow(s + 1, w[13]) - 1) *
    Math.exp((1 - r) * w[14]),
    0.1
  )
}

/** Convert stability to interval in days */
function nextInterval(stability: number): number {
  const interval = (stability / FACTOR) * (Math.pow(FSRS_DESIRED_RETENTION, 1 / DECAY) - 1)
  return Math.max(Math.round(interval), 1)
}

// ─── Main scheduling function ───────────────────────────────────

export function scheduleCard(card: FSRSCard, rating: Rating, now: Date = new Date()): FSRSOutput {
  const elapsed = card.last_review
    ? (now.getTime() - card.last_review.getTime()) / (1000 * 60 * 60 * 24)
    : 0

  let s: number
  let d: number
  let newState: CardState
  let reps = card.reps
  let lapses = card.lapses

  if (card.state === CardState.New) {
    // First review of a new card
    s = initStability(rating)
    d = initDifficulty(rating)
    reps = 1

    if (rating === Rating.Again) {
      newState = CardState.Learning
      lapses += 1
    } else {
      newState = CardState.Review
    }
  } else if (card.state === CardState.Learning || card.state === CardState.Relearning) {
    // In learning/relearning phase
    s = shortTermStability(card.stability, rating)
    d = nextDifficulty(card.difficulty, rating)
    reps += 1

    if (rating === Rating.Again) {
      newState = card.state // stay in current learning state
    } else if (rating === Rating.Good || rating === Rating.Easy) {
      newState = CardState.Review
    } else {
      newState = card.state
    }
  } else {
    // Review state
    const r = retrievability(elapsed, card.stability)
    d = nextDifficulty(card.difficulty, rating)
    reps += 1

    if (rating === Rating.Again) {
      s = nextForgetStability(card.difficulty, card.stability, r)
      newState = CardState.Relearning
      lapses += 1
    } else {
      s = nextRecallStability(card.difficulty, card.stability, r, rating)
      newState = CardState.Review
    }
  }

  const scheduledDays = newState === CardState.Review ? nextInterval(s) : 0
  const due = new Date(now.getTime() + scheduledDays * 24 * 60 * 60 * 1000)

  // For learning/relearning, schedule shorter intervals
  if (newState === CardState.Learning || newState === CardState.Relearning) {
    const minutesMap = {
      [Rating.Again]: 1,
      [Rating.Hard]: 5,
      [Rating.Good]: 10,
      [Rating.Easy]: 0, // graduates immediately
    }
    const minutes = minutesMap[rating]
    if (minutes > 0) {
      due.setTime(now.getTime() + minutes * 60 * 1000)
    }
  }

  return {
    stability: s!,
    difficulty: d,
    elapsed_days: elapsed,
    scheduled_days: scheduledDays,
    reps,
    lapses,
    state: newState,
    due,
  }
}

// ─── Helpers ────────────────────────────────────────────────────

/** Map a user's answer to an FSRS rating */
export function answerToRating(
  isCorrect: boolean,
  timeSpentMs: number,
  medianTimeMs: number = 45000
): Rating {
  if (!isCorrect) return Rating.Again
  if (timeSpentMs < medianTimeMs * 0.6) return Rating.Easy
  if (timeSpentMs > medianTimeMs * 2) return Rating.Hard
  return Rating.Good
}

/** Create a new blank FSRS card */
export function newCard(): FSRSCard {
  return {
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: CardState.New,
    due: new Date(),
    last_review: null,
  }
}
