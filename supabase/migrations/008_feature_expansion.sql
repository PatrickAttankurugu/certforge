-- ============================================================
-- Migration 008: Feature expansion tables
-- Leaderboards, referrals, discussions, streak freezes,
-- study plans, session recovery, service comparisons
-- ============================================================

-- ============================================================
-- TABLE: leaderboard_entries (weekly leaderboard)
-- ============================================================
CREATE TABLE public.leaderboard_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_start      DATE NOT NULL,
  xp_earned       INT NOT NULL DEFAULT 0,
  questions_answered INT NOT NULL DEFAULT 0,
  accuracy         DECIMAL(5,4) NOT NULL DEFAULT 0,
  streak_days     INT NOT NULL DEFAULT 0,
  league          TEXT NOT NULL DEFAULT 'bronze' CHECK (league IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  rank_position   INT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX idx_leaderboard_week ON public.leaderboard_entries(week_start, xp_earned DESC);
CREATE INDEX idx_leaderboard_user ON public.leaderboard_entries(user_id);
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read leaderboard" ON public.leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "Users manage own leaderboard" ON public.leaderboard_entries FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: referrals
-- ============================================================
CREATE TABLE public.referrals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  referral_code   TEXT NOT NULL UNIQUE,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'converted')),
  reward_granted  BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  converted_at    TIMESTAMPTZ
);

CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own referrals" ON public.referrals FOR ALL USING (auth.uid() = referrer_id);
CREATE POLICY "Users can read referrals they were referred by" ON public.referrals FOR SELECT USING (auth.uid() = referred_id);

-- ============================================================
-- TABLE: discussion_threads (per-question discussions)
-- ============================================================
CREATE TABLE public.discussion_threads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id     UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  upvotes         INT NOT NULL DEFAULT 0,
  is_pinned       BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_discussions_question ON public.discussion_threads(question_id);
CREATE INDEX idx_discussions_user ON public.discussion_threads(user_id);
ALTER TABLE public.discussion_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read discussions" ON public.discussion_threads FOR SELECT USING (true);
CREATE POLICY "Users manage own discussions" ON public.discussion_threads
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: discussion_replies
-- ============================================================
CREATE TABLE public.discussion_replies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id       UUID NOT NULL REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  upvotes         INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_replies_thread ON public.discussion_replies(thread_id);
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read replies" ON public.discussion_replies FOR SELECT USING (true);
CREATE POLICY "Users manage own replies" ON public.discussion_replies
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: discussion_votes
-- ============================================================
CREATE TABLE public.discussion_votes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  thread_id       UUID REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
  reply_id        UUID REFERENCES public.discussion_replies(id) ON DELETE CASCADE,
  vote            INT NOT NULL CHECK (vote IN (-1, 1)),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, thread_id),
  UNIQUE(user_id, reply_id),
  CHECK (thread_id IS NOT NULL OR reply_id IS NOT NULL)
);

ALTER TABLE public.discussion_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own votes" ON public.discussion_votes
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: streak_freezes
-- ============================================================
CREATE TABLE public.streak_freezes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  used_on         DATE,
  earned_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days')
);

CREATE INDEX idx_streak_freezes_user ON public.streak_freezes(user_id);
ALTER TABLE public.streak_freezes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own streak freezes" ON public.streak_freezes
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: xp_log (XP earned from actions)
-- ============================================================
CREATE TABLE public.xp_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action          TEXT NOT NULL CHECK (action IN ('answer_correct', 'answer_wrong', 'streak_bonus', 'mock_exam', 'daily_goal', 'review_complete', 'first_question')),
  xp_amount       INT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_xp_log_user ON public.xp_log(user_id);
CREATE INDEX idx_xp_log_user_date ON public.xp_log(user_id, created_at);
ALTER TABLE public.xp_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own xp" ON public.xp_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages xp" ON public.xp_log FOR ALL USING (true);

-- ============================================================
-- TABLE: study_plans (AI-generated study plans)
-- ============================================================
CREATE TABLE public.study_plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  plan_data       JSONB NOT NULL DEFAULT '{}',
  weekly_schedule JSONB NOT NULL DEFAULT '[]',
  target_date     DATE,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_study_plans_user ON public.study_plans(user_id);
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own study plans" ON public.study_plans
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: session_recovery (crash recovery for mock exams)
-- ============================================================
CREATE TABLE public.session_recovery (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_type    TEXT NOT NULL CHECK (session_type IN ('mock_exam', 'practice', 'review')),
  session_id      UUID,
  state_data      JSONB NOT NULL DEFAULT '{}',
  last_heartbeat  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, session_type)
);

ALTER TABLE public.session_recovery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own sessions" ON public.session_recovery
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: question_variants (AI-generated question variations)
-- ============================================================
CREATE TABLE public.question_variants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id     UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  variant_text    TEXT NOT NULL,
  variant_options JSONB NOT NULL,
  variant_explanation TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_variants_original ON public.question_variants(original_id);
ALTER TABLE public.question_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read variants" ON public.question_variants FOR SELECT USING (true);

-- ============================================================
-- TABLE: achievements
-- ============================================================
CREATE TABLE public.achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id  TEXT NOT NULL,
  unlocked_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_achievements_user ON public.achievements(user_id);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own achievements" ON public.achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service inserts achievements" ON public.achievements FOR INSERT WITH CHECK (true);

-- ============================================================
-- TABLE: study_buddies (matching system)
-- ============================================================
CREATE TABLE public.study_buddies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buddy_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'declined')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, buddy_id),
  CHECK(user_id != buddy_id)
);

ALTER TABLE public.study_buddies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own buddy requests" ON public.study_buddies
  FOR ALL USING (auth.uid() = user_id OR auth.uid() = buddy_id);

-- ============================================================
-- Add XP and referral fields to profiles
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_xp INT NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id);

-- Add streak_freeze_count to user_study_profiles
ALTER TABLE public.user_study_profiles ADD COLUMN IF NOT EXISTS streak_freeze_count INT NOT NULL DEFAULT 0;
ALTER TABLE public.user_study_profiles ADD COLUMN IF NOT EXISTS xp_today INT NOT NULL DEFAULT 0;

-- ============================================================
-- FUNCTION: get_weekly_leaderboard
-- ============================================================
CREATE OR REPLACE FUNCTION get_weekly_leaderboard(
  p_week_start DATE DEFAULT date_trunc('week', CURRENT_DATE)::DATE,
  p_limit INT DEFAULT 50
)
RETURNS TABLE (
  user_id UUID, full_name TEXT, xp_earned INT, questions_answered INT,
  accuracy DECIMAL, streak_days INT, league TEXT, rank_position BIGINT
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT le.user_id, p.full_name, le.xp_earned, le.questions_answered,
    le.accuracy, le.streak_days, le.league,
    ROW_NUMBER() OVER (ORDER BY le.xp_earned DESC) as rank_position
  FROM leaderboard_entries le
  JOIN profiles p ON p.id = le.user_id
  WHERE le.week_start = p_week_start
  ORDER BY le.xp_earned DESC
  LIMIT p_limit;
END;
$$;

-- ============================================================
-- FUNCTION: get_question_discussions
-- ============================================================
CREATE OR REPLACE FUNCTION get_question_discussions(
  p_question_id UUID,
  p_limit INT DEFAULT 20
)
RETURNS TABLE (
  thread_id UUID, user_id UUID, full_name TEXT, content TEXT,
  upvotes INT, is_pinned BOOLEAN, created_at TIMESTAMPTZ, reply_count BIGINT
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT dt.id, dt.user_id, p.full_name, dt.content,
    dt.upvotes, dt.is_pinned, dt.created_at,
    (SELECT COUNT(*) FROM discussion_replies dr WHERE dr.thread_id = dt.id) as reply_count
  FROM discussion_threads dt
  JOIN profiles p ON p.id = dt.user_id
  WHERE dt.question_id = p_question_id
  ORDER BY dt.is_pinned DESC, dt.upvotes DESC, dt.created_at DESC
  LIMIT p_limit;
END;
$$;
