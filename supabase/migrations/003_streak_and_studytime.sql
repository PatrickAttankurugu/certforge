-- ============================================================
-- Migration 003: Add streak tracking + study time to record_answer
-- ============================================================

-- Replace record_answer to include streak logic and study_minutes tracking
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
  v_last_study_date DATE;
  v_current_streak INT;
  v_longest_streak INT;
  v_time_minutes INT;
BEGIN
  -- 1. Insert review log
  INSERT INTO review_logs (user_id, card_id, question_id, domain_id, topic_id,
    rating, selected_answer, is_correct, time_spent_ms, difficulty)
  VALUES (p_user_id, p_card_id, p_question_id, p_domain_id, p_topic_id,
    p_rating, p_selected_answer, p_is_correct, p_time_spent_ms, p_difficulty)
  RETURNING id INTO v_review_id;

  -- 2. Update card FSRS state
  UPDATE study_cards SET
    stability = p_stability, difficulty_fsrs = p_difficulty_fsrs,
    elapsed_days = p_elapsed_days, scheduled_days = p_scheduled_days,
    reps = p_reps, lapses = p_lapses, state = p_state, due = p_due,
    last_review = now()
  WHERE id = p_card_id AND user_id = p_user_id;

  -- 3. Update domain progress
  INSERT INTO domain_progress (user_id, domain_id, questions_seen, questions_correct, accuracy, avg_time_ms, last_practiced)
  VALUES (p_user_id, p_domain_id, 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    CASE WHEN p_is_correct THEN 1.0 ELSE 0.0 END, p_time_spent_ms, now())
  ON CONFLICT (user_id, domain_id) DO UPDATE SET
    questions_seen = domain_progress.questions_seen + 1,
    questions_correct = domain_progress.questions_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    accuracy = (domain_progress.questions_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END)::DECIMAL / (domain_progress.questions_seen + 1),
    avg_time_ms = (COALESCE(domain_progress.avg_time_ms, 0) * domain_progress.questions_seen + p_time_spent_ms) / (domain_progress.questions_seen + 1),
    last_practiced = now(), updated_at = now();

  -- 4. Update topic progress
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

  -- 5. Update study session (now includes study_minutes)
  v_time_minutes := GREATEST(1, ROUND(p_time_spent_ms / 60000.0));

  INSERT INTO study_sessions (user_id, session_date, questions_answered, questions_correct, study_minutes)
  VALUES (p_user_id, CURRENT_DATE, 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END, v_time_minutes)
  ON CONFLICT (user_id, session_date) DO UPDATE SET
    questions_answered = study_sessions.questions_answered + 1,
    questions_correct = study_sessions.questions_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    study_minutes = study_sessions.study_minutes + v_time_minutes,
    updated_at = now();

  -- 6. Update user study profile with streak logic
  SELECT last_study_date, study_streak, longest_streak
  INTO v_last_study_date, v_current_streak, v_longest_streak
  FROM user_study_profiles WHERE user_id = p_user_id;

  IF v_last_study_date IS NULL OR v_last_study_date < CURRENT_DATE THEN
    -- New day of studying
    IF v_last_study_date = CURRENT_DATE - INTERVAL '1 day' THEN
      -- Consecutive day: increment streak
      v_current_streak := v_current_streak + 1;
    ELSIF v_last_study_date IS NULL OR v_last_study_date < CURRENT_DATE - INTERVAL '1 day' THEN
      -- Missed a day (or first ever): reset streak to 1
      v_current_streak := 1;
    END IF;
    -- Update longest streak if needed
    IF v_current_streak > v_longest_streak THEN
      v_longest_streak := v_current_streak;
    END IF;

    UPDATE user_study_profiles SET
      total_questions_answered = total_questions_answered + 1,
      total_study_minutes = total_study_minutes + v_time_minutes,
      study_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_study_date = CURRENT_DATE,
      updated_at = now()
    WHERE user_id = p_user_id;
  ELSE
    -- Same day: just increment totals
    UPDATE user_study_profiles SET
      total_questions_answered = total_questions_answered + 1,
      total_study_minutes = total_study_minutes + v_time_minutes,
      updated_at = now()
    WHERE user_id = p_user_id;
  END IF;

  -- 7. Update question stats
  UPDATE questions SET
    times_answered = times_answered + 1,
    times_correct = times_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END
  WHERE id = p_question_id;

  RETURN v_review_id;
END;
$$;
