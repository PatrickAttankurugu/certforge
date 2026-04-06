-- Question bookmarking system
CREATE TABLE IF NOT EXISTS bookmarked_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, question_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarked_questions(user_id);
CREATE INDEX idx_bookmarks_user_question ON bookmarked_questions(user_id, question_id);

-- RLS
ALTER TABLE bookmarked_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bookmarks"
  ON bookmarked_questions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
