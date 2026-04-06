-- RPC to atomically increment study minutes
CREATE OR REPLACE FUNCTION increment_study_minutes(p_user_id UUID, p_minutes INT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_study_profiles
  SET total_study_minutes = total_study_minutes + p_minutes
  WHERE user_id = p_user_id;
END;
$$;
