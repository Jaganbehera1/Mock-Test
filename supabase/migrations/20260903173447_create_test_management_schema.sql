/*
# Create Test Management Schema

This migration creates the complete database schema for an online test platform.

## Tables Created

1. **tests** — Represents a test "folder" (e.g., "Class 10th English — At the High School")
   - id (uuid, primary key)
   - title (text, name of the test)
   - subject (text, e.g., "English")
   - topic (text, e.g., "At the High School")
   - class_name (text, e.g., "Class 10th")
   - session (text, e.g., "2026–2027")
   - duration_minutes (int, time limit for the test)
   - prepared_by (text, school/institution name)
   - is_active (boolean, whether students can take it)
   - created_at (timestamp)

2. **questions** — Individual questions belonging to a test
   - id (uuid, primary key)
   - test_id (uuid, foreign key to tests)
   - question_text (text, the question)
   - option_a (text)
   - option_b (text)
   - option_c (text)
   - option_d (text)
   - correct_answer (text: 'A', 'B', 'C', or 'D')
   - display_order (int, ordering within the test)
   - created_at (timestamp)

3. **student_attempts** — Records each student's test attempt and score
   - id (uuid, primary key)
   - test_id (uuid, foreign key to tests)
   - student_name (text)
   - roll_number (text)
   - school_name (text)
   - answers (jsonb, map of question_id -> selected option letter)
   - score (int, number of correct answers)
   - total_questions (int)
   - percentage (numeric)
   - status (text: 'in_progress' or 'completed')
   - started_at (timestamp)
   - completed_at (timestamp)

## Security

This is a no-auth app (no sign-in screen for students or admin). All tables use
`TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)` because the
data is intentionally shared — students need to read tests/questions and write
attempts, and the admin needs full CRUD on all tables.
*/

CREATE TABLE IF NOT EXISTS tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL DEFAULT '',
  topic text NOT NULL DEFAULT '',
  class_name text NOT NULL DEFAULT '',
  session text NOT NULL DEFAULT '',
  duration_minutes int NOT NULL DEFAULT 90,
  prepared_by text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tests" ON tests;
CREATE POLICY "anon_select_tests" ON tests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tests" ON tests;
CREATE POLICY "anon_insert_tests" ON tests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tests" ON tests;
CREATE POLICY "anon_update_tests" ON tests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tests" ON tests;
CREATE POLICY "anon_delete_tests" ON tests FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_questions" ON questions;
CREATE POLICY "anon_select_questions" ON questions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_questions" ON questions;
CREATE POLICY "anon_insert_questions" ON questions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_questions" ON questions;
CREATE POLICY "anon_update_questions" ON questions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_questions" ON questions;
CREATE POLICY "anon_delete_questions" ON questions FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_questions_test_id ON questions(test_id);
CREATE INDEX IF NOT EXISTS idx_questions_display_order ON questions(test_id, display_order);

CREATE TABLE IF NOT EXISTS student_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  roll_number text NOT NULL DEFAULT '',
  school_name text NOT NULL DEFAULT '',
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  score int NOT NULL DEFAULT 0,
  total_questions int NOT NULL DEFAULT 0,
  percentage numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE student_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_attempts" ON student_attempts;
CREATE POLICY "anon_select_attempts" ON student_attempts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_attempts" ON student_attempts;
CREATE POLICY "anon_insert_attempts" ON student_attempts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_attempts" ON student_attempts;
CREATE POLICY "anon_update_attempts" ON student_attempts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_attempts" ON student_attempts;
CREATE POLICY "anon_delete_attempts" ON student_attempts FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_attempts_test_id ON student_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON student_attempts(status);
