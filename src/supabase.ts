import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TestRow {
  id: string;
  title: string;
  subject: string;
  topic: string;
  class_name: string;
  session: string;
  duration_minutes: number;
  prepared_by: string;
  is_active: boolean;
  created_at: string;
}

export interface QuestionRow {
  id: string;
  test_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string; // 'A' | 'B' | 'C' | 'D'
  display_order: number;
  created_at: string;
}

export interface AttemptRow {
  id: string;
  test_id: string;
  student_name: string;
  roll_number: string;
  school_name: string;
  answers: Record<string, string>;
  score: number;
  total_questions: number;
  percentage: number;
  status: "in_progress" | "completed";
  started_at: string;
  completed_at: string | null;
}
