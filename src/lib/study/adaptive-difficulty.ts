import type { DomainId, DomainProgress, TopicProgress } from '@/types/study'
import { DOMAIN_WEIGHTS } from './constants'

/**
 * Select target difficulty based on user's accuracy and recent performance.
 * Returns a difficulty level 1-5.
 */
export function selectDifficulty(
  domainAccuracy: number,
  totalQuestionsSeen: number,
  recentCorrectStreak: number
): 1 | 2 | 3 | 4 | 5 {
  // Base difficulty from accuracy (0.0 -> 1, 1.0 -> 5)
  let target = Math.round(1 + domainAccuracy * 4)

  // Streak bonus: push difficulty up when on a roll
  if (recentCorrectStreak >= 5) target += 1
  else if (recentCorrectStreak >= 3) target += 1

  // Floor at 2 if user has seen enough questions (past basic recall phase)
  if (totalQuestionsSeen >= 10) target = Math.max(target, 2)

  // Ceiling at 3 if accuracy is low (prevent frustration)
  if (domainAccuracy < 0.4 && totalQuestionsSeen >= 5) {
    target = Math.min(target, 3)
  }

  return Math.max(1, Math.min(5, target)) as 1 | 2 | 3 | 4 | 5
}

/**
 * Select which domain to practice next based on exam weights and user weakness.
 * Prioritizes weak domains that carry high exam weight.
 */
export function selectDomain(
  domainProgress: DomainProgress[]
): DomainId {
  const domainIds: DomainId[] = ['secure', 'resilient', 'performant', 'cost']

  // If no progress data, pick by exam weight (secure first)
  if (domainProgress.length === 0) return 'secure'

  // Score each domain: high weight + low accuracy = high priority
  const scores = domainIds.map((id) => {
    const progress = domainProgress.find((d) => d.domain_id === id)
    const weight = DOMAIN_WEIGHTS[id]
    const accuracy = progress?.accuracy ?? 0
    const seen = progress?.questions_seen ?? 0

    // Unseen domains get maximum priority
    if (seen === 0) return { id, score: weight * 2 }

    // Priority = weight * (1 - accuracy) -- higher when weak and important
    return { id, score: weight * (1 - accuracy) }
  })

  scores.sort((a, b) => b.score - a.score)
  return scores[0].id
}

/**
 * Get weighted random domain for practice variety.
 * Biased toward weak + high-weight domains but includes variety.
 */
export function selectDomainWeighted(
  domainProgress: DomainProgress[]
): DomainId {
  const domainIds: DomainId[] = ['secure', 'resilient', 'performant', 'cost']

  const weights = domainIds.map((id) => {
    const progress = domainProgress.find((d) => d.domain_id === id)
    const examWeight = DOMAIN_WEIGHTS[id]
    const accuracy = progress?.accuracy ?? 0
    const seen = progress?.questions_seen ?? 0

    if (seen === 0) return examWeight * 3
    return examWeight * (1.5 - accuracy)
  })

  const total = weights.reduce((s, w) => s + w, 0)
  let rand = Math.random() * total
  for (let i = 0; i < domainIds.length; i++) {
    rand -= weights[i]
    if (rand <= 0) return domainIds[i]
  }
  return domainIds[0]
}

/**
 * Identify weak topics ranked by impact (domain weight * weakness).
 */
export function detectWeakAreas(
  topicProgress: TopicProgress[],
  accuracyThreshold = 0.6,
  minQuestions = 5
): TopicProgress[] {
  return topicProgress
    .filter((tp) =>
      tp.questions_seen >= minQuestions &&
      (tp.accuracy < accuracyThreshold ||
        (tp.accuracy < 0.7 && (tp.avg_time_ms ?? 0) > 90_000))
    )
    .sort((a, b) => {
      const aScore = (1 - a.accuracy) * DOMAIN_WEIGHTS[a.domain_id]
      const bScore = (1 - b.accuracy) * DOMAIN_WEIGHTS[b.domain_id]
      return bScore - aScore
    })
}
