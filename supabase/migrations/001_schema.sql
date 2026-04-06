-- ============================================================
-- CertForge Database Schema
-- SAA-C03 AWS Solutions Architect Study Assistant
-- ============================================================

-- ============================================================
-- TABLE: profiles (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  full_name       TEXT,
  plan            TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'standard', 'premium')),
  stripe_customer_id TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TABLE: exam_domains
-- ============================================================
CREATE TABLE public.exam_domains (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  weight      DECIMAL(4,2) NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0
);

INSERT INTO public.exam_domains (id, name, description, weight, sort_order) VALUES
  ('secure',    'Design Secure Architectures',          'IAM, encryption, network security, logging', 0.30, 1),
  ('resilient', 'Design Resilient Architectures',       'Multi-AZ, DR, decoupling, scaling',          0.26, 2),
  ('performant','Design High-Performing Architectures', 'Compute, storage, DB, networking perf',      0.24, 3),
  ('cost',      'Design Cost-Optimized Architectures',  'Cost-effective compute, storage, pricing',   0.20, 4);

ALTER TABLE public.exam_domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read domains" ON public.exam_domains FOR SELECT USING (true);

-- ============================================================
-- TABLE: exam_topics
-- ============================================================
CREATE TABLE public.exam_topics (
  id          TEXT PRIMARY KEY,
  domain_id   TEXT NOT NULL REFERENCES public.exam_domains(id),
  name        TEXT NOT NULL,
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_topics_domain ON public.exam_topics(domain_id);
ALTER TABLE public.exam_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read topics" ON public.exam_topics FOR SELECT USING (true);

INSERT INTO public.exam_topics (id, domain_id, name, sort_order) VALUES
  ('iam',              'secure',    'IAM Policies & Roles',           1),
  ('cognito',          'secure',    'Amazon Cognito',                 2),
  ('kms_encryption',   'secure',    'KMS & Encryption',               3),
  ('vpc_security',     'secure',    'VPC Security Groups & NACLs',    4),
  ('waf_shield',       'secure',    'WAF & Shield',                   5),
  ('secrets_manager',  'secure',    'Secrets Manager & SSM',          6),
  ('cloudtrail',       'secure',    'CloudTrail & Config',            7),
  ('s3_security',      'secure',    'S3 Bucket Policies & ACLs',      8),
  ('org_scp',          'secure',    'Organizations & SCPs',           9),
  ('certificate_mgr',  'secure',    'ACM & SSL/TLS',                 10),
  ('multi_az',         'resilient', 'Multi-AZ & Multi-Region',        1),
  ('auto_scaling',     'resilient', 'Auto Scaling',                   2),
  ('elb',              'resilient', 'Elastic Load Balancing',         3),
  ('sqs_sns',          'resilient', 'SQS, SNS & Decoupling',         4),
  ('route53',          'resilient', 'Route 53 & DNS',                 5),
  ('backup_dr',        'resilient', 'Backup & Disaster Recovery',     6),
  ('rds_aurora',       'resilient', 'RDS & Aurora HA',                7),
  ('s3_replication',   'resilient', 'S3 Cross-Region Replication',    8),
  ('step_functions',   'resilient', 'Step Functions & EventBridge',   9),
  ('ec2_types',        'performant','EC2 Instance Types & Placement', 1),
  ('ebs_volumes',      'performant','EBS Volume Types',               2),
  ('s3_performance',   'performant','S3 Performance & Transfer',      3),
  ('cloudfront',       'performant','CloudFront & Caching',           4),
  ('elasticache',      'performant','ElastiCache',                    5),
  ('dynamodb',         'performant','DynamoDB Design & DAX',          6),
  ('efs_fsx',          'performant','EFS & FSx',                      7),
  ('global_accel',     'performant','Global Accelerator',             8),
  ('lambda_perf',      'performant','Lambda Performance',             9),
  ('ec2_pricing',      'cost',      'EC2 Pricing Models',             1),
  ('s3_tiers',         'cost',      'S3 Storage Classes',             2),
  ('reserved_savings', 'cost',      'Reserved Instances & Savings Plans', 3),
  ('spot_instances',   'cost',      'Spot Instances',                 4),
  ('cost_explorer',    'cost',      'Cost Explorer & Budgets',        5),
  ('data_transfer',    'cost',      'Data Transfer Costs',            6),
  ('right_sizing',     'cost',      'Right Sizing & Compute Optimizer', 7),
  ('serverless_cost',  'cost',      'Serverless Cost Optimization',   8);

-- ============================================================
-- TABLE: questions
-- ============================================================
CREATE TABLE public.questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id       TEXT NOT NULL REFERENCES public.exam_domains(id),
  topic_id        TEXT REFERENCES public.exam_topics(id),
  difficulty       INT NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  question_text   TEXT NOT NULL,
  question_type   TEXT NOT NULL DEFAULT 'single' CHECK (question_type IN ('single', 'multi')),
  options         JSONB NOT NULL,
  explanation     TEXT NOT NULL,
  wrong_explanations JSONB,
  aws_services    TEXT[] NOT NULL DEFAULT '{}',
  source          TEXT NOT NULL DEFAULT 'seed' CHECK (source IN ('seed', 'ai_generated', 'community')),
  ai_model        TEXT,
  quality_score   DECIMAL(3,2),
  times_answered  INT NOT NULL DEFAULT 0,
  times_correct   INT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_questions_domain ON public.questions(domain_id);
CREATE INDEX idx_questions_topic ON public.questions(topic_id);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX idx_questions_active ON public.questions(is_active) WHERE is_active = true;
CREATE INDEX idx_questions_services ON public.questions USING gin(aws_services);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active questions" ON public.questions FOR SELECT USING (is_active = true);
CREATE POLICY "Service role manages questions" ON public.questions FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- TABLE: user_study_profiles
-- ============================================================
CREATE TABLE public.user_study_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_exam_date    DATE,
  daily_goal_minutes  INT NOT NULL DEFAULT 30,
  daily_goal_questions INT NOT NULL DEFAULT 20,
  study_streak        INT NOT NULL DEFAULT 0,
  longest_streak      INT NOT NULL DEFAULT 0,
  last_study_date     DATE,
  total_questions_answered INT NOT NULL DEFAULT 0,
  total_study_minutes INT NOT NULL DEFAULT 0,
  estimated_score     INT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_study_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own study profile" ON public.user_study_profiles
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: study_cards (FSRS)
-- ============================================================
CREATE TABLE public.study_cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  stability       FLOAT NOT NULL DEFAULT 0,
  difficulty_fsrs FLOAT NOT NULL DEFAULT 0.3,
  elapsed_days    FLOAT NOT NULL DEFAULT 0,
  scheduled_days  FLOAT NOT NULL DEFAULT 0,
  reps            INT NOT NULL DEFAULT 0,
  lapses          INT NOT NULL DEFAULT 0,
  state           INT NOT NULL DEFAULT 0,
  due             TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_review     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

CREATE INDEX idx_cards_user_due ON public.study_cards(user_id, due);
CREATE INDEX idx_cards_user_state ON public.study_cards(user_id, state);

ALTER TABLE public.study_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cards" ON public.study_cards
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: review_logs
-- ============================================================
CREATE TABLE public.review_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_id         UUID NOT NULL REFERENCES public.study_cards(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES public.questions(id),
  domain_id       TEXT NOT NULL REFERENCES public.exam_domains(id),
  topic_id        TEXT REFERENCES public.exam_topics(id),
  rating          INT NOT NULL CHECK (rating BETWEEN 1 AND 4),
  selected_answer JSONB NOT NULL,
  is_correct      BOOLEAN NOT NULL,
  time_spent_ms   INT,
  difficulty      INT NOT NULL,
  reviewed_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_user ON public.review_logs(user_id);
CREATE INDEX idx_reviews_user_date ON public.review_logs(user_id, reviewed_at);
CREATE INDEX idx_reviews_domain ON public.review_logs(user_id, domain_id);
CREATE INDEX idx_reviews_topic ON public.review_logs(user_id, topic_id);

ALTER TABLE public.review_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own reviews" ON public.review_logs
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: domain_progress
-- ============================================================
CREATE TABLE public.domain_progress (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  domain_id         TEXT NOT NULL REFERENCES public.exam_domains(id),
  questions_seen    INT NOT NULL DEFAULT 0,
  questions_correct INT NOT NULL DEFAULT 0,
  accuracy          DECIMAL(5,4) NOT NULL DEFAULT 0,
  avg_time_ms       INT,
  mastery_level     INT NOT NULL DEFAULT 0,
  last_practiced    TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, domain_id)
);

CREATE INDEX idx_domain_progress_user ON public.domain_progress(user_id);
ALTER TABLE public.domain_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own domain progress" ON public.domain_progress
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: topic_progress
-- ============================================================
CREATE TABLE public.topic_progress (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id          TEXT NOT NULL REFERENCES public.exam_topics(id),
  domain_id         TEXT NOT NULL REFERENCES public.exam_domains(id),
  questions_seen    INT NOT NULL DEFAULT 0,
  questions_correct INT NOT NULL DEFAULT 0,
  accuracy          DECIMAL(5,4) NOT NULL DEFAULT 0,
  avg_time_ms       INT,
  is_weak           BOOLEAN NOT NULL DEFAULT false,
  last_practiced    TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

CREATE INDEX idx_topic_progress_user ON public.topic_progress(user_id);
CREATE INDEX idx_topic_progress_weak ON public.topic_progress(user_id, is_weak) WHERE is_weak = true;
ALTER TABLE public.topic_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own topic progress" ON public.topic_progress
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: mock_exams
-- ============================================================
CREATE TABLE public.mock_exams (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status            TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  question_ids      UUID[] NOT NULL,
  answers           JSONB NOT NULL DEFAULT '{}',
  total_questions   INT NOT NULL DEFAULT 65,
  correct_count     INT,
  score             INT,
  predicted_pass    BOOLEAN,
  domain_breakdown  JSONB,
  time_limit_ms     INT NOT NULL DEFAULT 7800000,
  time_used_ms      INT,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mock_exams_user ON public.mock_exams(user_id);
ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own mock exams" ON public.mock_exams
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: study_sessions
-- ============================================================
CREATE TABLE public.study_sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  questions_answered INT NOT NULL DEFAULT 0,
  questions_correct  INT NOT NULL DEFAULT 0,
  study_minutes     INT NOT NULL DEFAULT 0,
  ai_explanations_used INT NOT NULL DEFAULT 0,
  ai_questions_generated INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, session_date)
);

CREATE INDEX idx_sessions_user_date ON public.study_sessions(user_id, session_date);
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own sessions" ON public.study_sessions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: ai_conversations
-- ============================================================
CREATE TABLE public.ai_conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id     UUID REFERENCES public.questions(id),
  topic_id        TEXT REFERENCES public.exam_topics(id),
  conversation_type TEXT NOT NULL CHECK (conversation_type IN ('explanation', 'tutoring', 'deep_dive')),
  messages        JSONB NOT NULL DEFAULT '[]',
  tokens_used     INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversations_user ON public.ai_conversations(user_id);
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own conversations" ON public.ai_conversations
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTION: record_answer (atomic answer submission)
-- ============================================================
CREATE OR REPLACE FUNCTION record_answer(
  p_user_id UUID,
  p_card_id UUID,
  p_question_id UUID,
  p_domain_id TEXT,
  p_topic_id TEXT,
  p_rating INT,
  p_selected_answer JSONB,
  p_is_correct BOOLEAN,
  p_time_spent_ms INT,
  p_difficulty INT,
  p_stability FLOAT,
  p_difficulty_fsrs FLOAT,
  p_elapsed_days FLOAT,
  p_scheduled_days FLOAT,
  p_reps INT,
  p_lapses INT,
  p_state INT,
  p_due TIMESTAMPTZ
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_review_id UUID;
BEGIN
  INSERT INTO review_logs (user_id, card_id, question_id, domain_id, topic_id,
    rating, selected_answer, is_correct, time_spent_ms, difficulty)
  VALUES (p_user_id, p_card_id, p_question_id, p_domain_id, p_topic_id,
    p_rating, p_selected_answer, p_is_correct, p_time_spent_ms, p_difficulty)
  RETURNING id INTO v_review_id;

  UPDATE study_cards SET
    stability = p_stability, difficulty_fsrs = p_difficulty_fsrs,
    elapsed_days = p_elapsed_days, scheduled_days = p_scheduled_days,
    reps = p_reps, lapses = p_lapses, state = p_state, due = p_due,
    last_review = now()
  WHERE id = p_card_id AND user_id = p_user_id;

  INSERT INTO domain_progress (user_id, domain_id, questions_seen, questions_correct, accuracy, avg_time_ms, last_practiced)
  VALUES (p_user_id, p_domain_id, 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    CASE WHEN p_is_correct THEN 1.0 ELSE 0.0 END, p_time_spent_ms, now())
  ON CONFLICT (user_id, domain_id) DO UPDATE SET
    questions_seen = domain_progress.questions_seen + 1,
    questions_correct = domain_progress.questions_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    accuracy = (domain_progress.questions_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END)::DECIMAL / (domain_progress.questions_seen + 1),
    avg_time_ms = (COALESCE(domain_progress.avg_time_ms, 0) * domain_progress.questions_seen + p_time_spent_ms) / (domain_progress.questions_seen + 1),
    last_practiced = now(), updated_at = now();

  IF p_topic_id IS NOT NULL THEN
    INSERT INTO topic_progress (user_id, topic_id, domain_id, questions_seen, questions_correct, accuracy, avg_time_ms, last_practiced)
    VALUES (p_user_id, p_topic_id, p_domain_id, 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END,
      CASE WHEN p_is_correct THEN 1.0 ELSE 0.0 END, p_time_spent_ms, now())
    ON CONFLICT (user_id, topic_id) DO UPDATE SET
      questions_seen = topic_progress.questions_seen + 1,
      questions_correct = topic_progress.questions_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
      accuracy = (topic_progress.questions_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END)::DECIMAL / (topic_progress.questions_seen + 1),
      avg_time_ms = (COALESCE(topic_progress.avg_time_ms, 0) * topic_progress.questions_seen + p_time_spent_ms) / (topic_progress.questions_seen + 1),
      last_practiced = now(), updated_at = now();
  END IF;

  INSERT INTO study_sessions (user_id, session_date, questions_answered, questions_correct)
  VALUES (p_user_id, CURRENT_DATE, 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END)
  ON CONFLICT (user_id, session_date) DO UPDATE SET
    questions_answered = study_sessions.questions_answered + 1,
    questions_correct = study_sessions.questions_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    updated_at = now();

  UPDATE user_study_profiles SET
    total_questions_answered = total_questions_answered + 1, updated_at = now()
  WHERE user_id = p_user_id;

  UPDATE questions SET
    times_answered = times_answered + 1,
    times_correct = times_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END
  WHERE id = p_question_id;

  RETURN v_review_id;
END;
$$;

-- ============================================================
-- FUNCTION: get_due_cards
-- ============================================================
CREATE OR REPLACE FUNCTION get_due_cards(
  p_user_id UUID,
  p_limit INT DEFAULT 20,
  p_domain_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  card_id UUID, question_id UUID, domain_id TEXT, topic_id TEXT,
  difficulty INT, question_text TEXT, question_type TEXT, options JSONB,
  state INT, due TIMESTAMPTZ, stability FLOAT, difficulty_fsrs FLOAT, reps INT, lapses INT
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT sc.id, q.id, q.domain_id, q.topic_id, q.difficulty, q.question_text,
    q.question_type, q.options, sc.state, sc.due, sc.stability, sc.difficulty_fsrs, sc.reps, sc.lapses
  FROM study_cards sc
  JOIN questions q ON q.id = sc.question_id
  WHERE sc.user_id = p_user_id AND sc.due <= now() AND q.is_active = true
    AND (p_domain_id IS NULL OR q.domain_id = p_domain_id)
  ORDER BY sc.due ASC, sc.state ASC
  LIMIT p_limit;
END;
$$;
