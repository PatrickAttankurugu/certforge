-- Allow authenticated users to insert AI-generated question variants.
-- Variants are shared/cached across users, so any authenticated user may seed one.
CREATE POLICY "Authenticated can insert variants"
  ON public.question_variants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
