import type { DomainId, DomainProgress, ScorePrediction } from '@/types/study'
import { DOMAIN_WEIGHTS, EXAM_PASS_SCORE } from './constants'

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

/**
 * Predict exam score based on domain progress.
 * Maps weighted accuracy to the SAA-C03 scaled score (100-1000).
 */
export function predictExamScore(
  domainProgress: DomainProgress[]
): ScorePrediction {
  const domains: DomainId[] = ['secure', 'resilient', 'performant', 'cost']

  // Weighted accuracy across domains using exam weights
  let weightedAccuracy = 0
  let totalWeight = 0

  const breakdown = domains.map((domain) => {
    const progress = domainProgress.find((d) => d.domain_id === domain)
    const weight = DOMAIN_WEIGHTS[domain]
    const accuracy = progress?.accuracy ?? 0

    weightedAccuracy += accuracy * weight
    totalWeight += weight

    return {
      domain,
      accuracy,
      contribution: Math.round(accuracy * weight * 1000),
    }
  })

  if (totalWeight > 0) {
    weightedAccuracy /= totalWeight
  }

  // Scale to 100-1000 with sigmoid curve
  // 0.0 accuracy -> ~200, 0.5 -> ~500, 0.72 -> ~720, 1.0 -> ~950
  const rawScore = 100 + 850 * sigmoid((weightedAccuracy - 0.5) * 6)
  const predictedScore = Math.round(rawScore)

  // Confidence based on total questions answered
  const totalSeen = domainProgress.reduce((s, d) => s + d.questions_seen, 0)
  const confidence = Math.min(1, totalSeen / 500)

  // Pass likelihood
  let passLikelihood: ScorePrediction['pass_likelihood']
  if (predictedScore >= EXAM_PASS_SCORE) {
    passLikelihood = 'likely'
  } else if (predictedScore >= EXAM_PASS_SCORE - 50) {
    passLikelihood = 'possible'
  } else {
    passLikelihood = 'unlikely'
  }

  return {
    predicted_score: predictedScore,
    pass_likelihood: passLikelihood,
    confidence,
    breakdown,
  }
}

/**
 * Convert raw exam results (correct/total) to a scaled score.
 * Approximates the AWS scoring curve.
 */
export function scaleExamScore(correct: number, total: number): number {
  const rawAccuracy = total > 0 ? correct / total : 0
  // AWS uses a non-linear scale. This approximation:
  // 50% raw -> ~550, 72% raw -> ~720, 90% raw -> ~900
  const scaled = 100 + 850 * sigmoid((rawAccuracy - 0.5) * 5.5)
  return Math.round(Math.max(100, Math.min(1000, scaled)))
}
