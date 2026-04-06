import type { DomainId, Question } from '@/types/study'
import { DOMAIN_QUESTION_COUNTS, EXAM_TOTAL_QUESTIONS } from './constants'

interface ExamBuildOptions {
  excludeQuestionIds?: Set<string> // questions seen recently
}

/**
 * Select 65 questions matching the SAA-C03 exam distribution.
 * Domain split: secure=20, resilient=17, performant=16, cost=12
 * Difficulty mix: 10% basic, 30% intermediate, 40% advanced, 20% scenario
 * ~10% multi-select questions
 */
export function buildMockExam(
  questions: Question[],
  options: ExamBuildOptions = {}
): string[] {
  const { excludeQuestionIds = new Set() } = options

  const available = questions.filter(
    (q) => q.is_active && !excludeQuestionIds.has(q.id)
  )

  const selected: string[] = []
  const domains: DomainId[] = ['secure', 'resilient', 'performant', 'cost']

  for (const domain of domains) {
    const target = DOMAIN_QUESTION_COUNTS[domain]
    const domainQuestions = available.filter((q) => q.domain_id === domain)

    // Target difficulty distribution
    const difficultyTargets = [
      { difficulty: 2, count: Math.round(target * 0.1) },
      { difficulty: 3, count: Math.round(target * 0.3) },
      { difficulty: 4, count: Math.round(target * 0.4) },
      { difficulty: 5, count: Math.round(target * 0.2) },
    ]

    const domainSelected: string[] = []

    for (const { difficulty, count } of difficultyTargets) {
      const pool = domainQuestions.filter(
        (q) => q.difficulty === difficulty && !domainSelected.includes(q.id)
      )
      const shuffled = shuffleArray(pool)
      const picked = shuffled.slice(0, count)
      domainSelected.push(...picked.map((q) => q.id))
    }

    // Fill remaining slots if difficulty distribution didn't have enough
    if (domainSelected.length < target) {
      const remaining = domainQuestions.filter(
        (q) => !domainSelected.includes(q.id)
      )
      const shuffled = shuffleArray(remaining)
      const needed = target - domainSelected.length
      domainSelected.push(...shuffled.slice(0, needed).map((q) => q.id))
    }

    selected.push(...domainSelected.slice(0, target))
  }

  // If we don't have enough questions, pad with whatever's available
  if (selected.length < EXAM_TOTAL_QUESTIONS) {
    const remaining = available.filter((q) => !selected.includes(q.id))
    const shuffled = shuffleArray(remaining)
    const needed = EXAM_TOTAL_QUESTIONS - selected.length
    selected.push(...shuffled.slice(0, needed).map((q) => q.id))
  }

  // Final shuffle to mix domains
  return shuffleArray(selected)
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
