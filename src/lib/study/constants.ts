import type { DomainId, StudyPlan, StudyPlanLimits } from '@/types/study'

// ─── SAA-C03 Exam Constants ──────────────────────────────────────

export const EXAM_CODE = 'SAA-C03'
export const EXAM_NAME = 'AWS Solutions Architect Associate'
export const EXAM_TOTAL_QUESTIONS = 65
export const EXAM_TIME_LIMIT_MS = 130 * 60 * 1000 // 130 minutes
export const EXAM_PASS_SCORE = 720
export const EXAM_MIN_SCORE = 100
export const EXAM_MAX_SCORE = 1000

export const DOMAIN_WEIGHTS: Record<DomainId, number> = {
  secure: 0.30,
  resilient: 0.26,
  performant: 0.24,
  cost: 0.20,
}

export const DOMAIN_QUESTION_COUNTS: Record<DomainId, number> = {
  secure: 20,
  resilient: 17,
  performant: 16,
  cost: 12,
}

export const DOMAIN_NAMES: Record<DomainId, string> = {
  secure: 'Design Secure Architectures',
  resilient: 'Design Resilient Architectures',
  performant: 'Design High-Performing Architectures',
  cost: 'Design Cost-Optimized Architectures',
}

export const DOMAIN_COLORS: Record<DomainId, string> = {
  secure: '#3b82f6',     // blue
  resilient: '#22c55e',  // green
  performant: '#f59e0b', // amber
  cost: '#a855f7',       // purple
}

// ─── Difficulty Labels ──────────────────────────────────────────

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Basic Recall',
  2: 'Comprehension',
  3: 'Application',
  4: 'Analysis',
  5: 'Scenario-Based',
}

export const DIFFICULTY_COLORS: Record<number, string> = {
  1: 'text-green-500',
  2: 'text-blue-500',
  3: 'text-yellow-500',
  4: 'text-orange-500',
  5: 'text-red-500',
}

// ─── Plan Limits ────────────────────────────────────────────────

export const PLAN_LIMITS: Record<StudyPlan, StudyPlanLimits> = {
  free: {
    questions_per_day: 10,
    ai_explanations_per_day: 3,
    ai_questions_per_day: 0,
    tutor_messages_per_day: 0,
    mock_exams_per_month: 1,
    weak_area_reports: false,
    score_prediction: false,
  },
  standard: {
    questions_per_day: Infinity,
    ai_explanations_per_day: Infinity,
    ai_questions_per_day: 10,
    tutor_messages_per_day: 20,
    mock_exams_per_month: 5,
    weak_area_reports: true,
    score_prediction: true,
  },
  premium: {
    questions_per_day: Infinity,
    ai_explanations_per_day: Infinity,
    ai_questions_per_day: Infinity,
    tutor_messages_per_day: Infinity,
    mock_exams_per_month: Infinity,
    weak_area_reports: true,
    score_prediction: true,
  },
}

// ─── FSRS Defaults ──────────────────────────────────────────────

export const FSRS_DESIRED_RETENTION = 0.9
export const FSRS_DEFAULT_WEIGHTS = [
  0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651, 0.0589,
  1.5330, 0.1544, 1.0347, 1.9395, 0.1100, 0.2939, 2.7254, 0.2484,
  2.8908, 0.0234, 0.3173,
]

// ─── Weak Area Thresholds ───────────────────────────────────────

export const WEAK_AREA_ACCURACY_THRESHOLD = 0.6
export const WEAK_AREA_MIN_QUESTIONS = 5
export const SLOW_ANSWER_THRESHOLD_MS = 90_000 // 90 seconds
