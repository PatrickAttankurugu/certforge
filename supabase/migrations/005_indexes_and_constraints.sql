-- ============================================================
-- Migration 005: Add performance indexes + data integrity constraints
-- ============================================================

-- Performance indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_questions_active_domain
  ON public.questions (is_active, domain_id);

CREATE INDEX IF NOT EXISTS idx_questions_active_domain_diff
  ON public.questions (is_active, domain_id, difficulty);

CREATE INDEX IF NOT EXISTS idx_cards_user_question
  ON public.study_cards (user_id, question_id);

CREATE INDEX IF NOT EXISTS idx_cards_user_due
  ON public.study_cards (user_id, due)
  WHERE state > 0;

CREATE INDEX IF NOT EXISTS idx_reviews_user_domain_date
  ON public.review_logs (user_id, domain_id, reviewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_mock_exams_user_status
  ON public.mock_exams (user_id, status);

CREATE INDEX IF NOT EXISTS idx_sessions_user_date
  ON public.study_sessions (user_id, session_date DESC);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user
  ON public.ai_conversations (user_id, created_at DESC);

-- Data integrity: FSRS column constraints
ALTER TABLE public.study_cards
  ADD CONSTRAINT chk_card_state CHECK (state BETWEEN 0 AND 3),
  ADD CONSTRAINT chk_card_stability CHECK (stability >= 0),
  ADD CONSTRAINT chk_card_reps CHECK (reps >= 0),
  ADD CONSTRAINT chk_card_lapses CHECK (lapses >= 0);

-- Accuracy must be 0-1
ALTER TABLE public.domain_progress
  ADD CONSTRAINT chk_domain_accuracy CHECK (accuracy >= 0 AND accuracy <= 1);

ALTER TABLE public.topic_progress
  ADD CONSTRAINT chk_topic_accuracy CHECK (accuracy >= 0 AND accuracy <= 1);

-- Question difficulty 1-5
ALTER TABLE public.questions
  ADD CONSTRAINT chk_question_difficulty CHECK (difficulty BETWEEN 1 AND 5);
