// ─── Database row types ─────────────────────────────────────────

export type DomainId = 'secure' | 'resilient' | 'performant' | 'cost'

export interface ExamDomain {
  id: DomainId
  name: string
  description: string | null
  weight: number
  sort_order: number
}

export interface ExamTopic {
  id: string
  domain_id: DomainId
  name: string
  description: string | null
  sort_order: number
}

export interface QuestionOption {
  id: string // "A", "B", "C", "D"
  text: string
  is_correct: boolean
}

export type QuestionType = 'single' | 'multi'
export type QuestionSource = 'seed' | 'ai_generated' | 'community'

export interface Question {
  id: string
  domain_id: DomainId
  topic_id: string | null
  difficulty: 1 | 2 | 3 | 4 | 5
  question_text: string
  question_type: QuestionType
  options: QuestionOption[]
  explanation: string
  wrong_explanations: Record<string, string> | null
  aws_services: string[]
  source: QuestionSource
  ai_model: string | null
  quality_score: number | null
  times_answered: number
  times_correct: number
  is_active: boolean
  created_at: string
}

// FSRS card states
export enum CardState {
  New = 0,
  Learning = 1,
  Review = 2,
  Relearning = 3,
}

// FSRS ratings
export enum Rating {
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4,
}

export interface StudyCard {
  id: string
  user_id: string
  question_id: string
  stability: number
  difficulty_fsrs: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  state: CardState
  due: string
  last_review: string | null
  created_at: string
}

export interface ReviewLog {
  id: string
  user_id: string
  card_id: string
  question_id: string
  domain_id: DomainId
  topic_id: string | null
  rating: Rating
  selected_answer: string[]
  is_correct: boolean
  time_spent_ms: number | null
  difficulty: number
  reviewed_at: string
}

export interface UserStudyProfile {
  id: string
  user_id: string
  target_exam_date: string | null
  daily_goal_minutes: number
  daily_goal_questions: number
  study_streak: number
  longest_streak: number
  last_study_date: string | null
  total_questions_answered: number
  total_study_minutes: number
  estimated_score: number | null
  created_at: string
  updated_at: string
}

export interface DomainProgress {
  id: string
  user_id: string
  domain_id: DomainId
  questions_seen: number
  questions_correct: number
  accuracy: number
  avg_time_ms: number | null
  mastery_level: number
  last_practiced: string | null
  updated_at: string
}

export interface TopicProgress {
  id: string
  user_id: string
  topic_id: string
  domain_id: DomainId
  questions_seen: number
  questions_correct: number
  accuracy: number
  avg_time_ms: number | null
  is_weak: boolean
  last_practiced: string | null
  updated_at: string
}

export type MockExamStatus = 'in_progress' | 'completed' | 'abandoned'

export interface MockExamAnswer {
  selected: string[]
  time_ms: number
}

export interface DomainBreakdown {
  correct: number
  total: number
  accuracy: number
}

export interface MockExam {
  id: string
  user_id: string
  status: MockExamStatus
  question_ids: string[]
  answers: Record<string, MockExamAnswer>
  total_questions: number
  correct_count: number | null
  score: number | null
  predicted_pass: boolean | null
  domain_breakdown: Record<DomainId, DomainBreakdown> | null
  time_limit_ms: number
  time_used_ms: number | null
  started_at: string
  completed_at: string | null
  created_at: string
}

export interface StudySession {
  id: string
  user_id: string
  session_date: string
  questions_answered: number
  questions_correct: number
  study_minutes: number
  ai_explanations_used: number
  ai_questions_generated: number
  created_at: string
  updated_at: string
}

// ─── Composite / UI types ───────────────────────────────────────

export interface DueCard {
  card_id: string
  question_id: string
  domain_id: DomainId
  topic_id: string | null
  difficulty: number
  question_text: string
  question_type: QuestionType
  options: QuestionOption[]
  state: CardState
  due: string
  stability: number
  difficulty_fsrs: number
  reps: number
  lapses: number
}

export interface WeakArea {
  topic_id: string
  topic_name: string
  domain_id: DomainId
  domain_name: string
  accuracy: number
  questions_seen: number
  impact_score: number // weighted by domain importance
}

export interface ScorePrediction {
  predicted_score: number
  pass_likelihood: 'likely' | 'possible' | 'unlikely'
  confidence: number
  breakdown: {
    domain: DomainId
    accuracy: number
    contribution: number
  }[]
}

export type StudyPlan = 'free' | 'standard' | 'premium'

export interface StudyPlanLimits {
  questions_per_day: number
  ai_explanations_per_day: number
  ai_questions_per_day: number
  tutor_messages_per_day: number
  mock_exams_per_month: number
  weak_area_reports: boolean
  score_prediction: boolean
}

// ─── User profile (shared with auth) ───────────────────────────

export interface Profile {
  id: string
  email: string
  full_name: string | null
  plan: StudyPlan
  stripe_customer_id: string | null
  created_at: string
}
