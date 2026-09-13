import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Clock, CheckCircle2, Circle, ChevronLeft, ChevronRight, Flag,
  AlertCircle, Eye, RotateCcw, X, Menu, BookOpen, Calendar, Timer,
  User, GraduationCap, Award, Loader2, Folder, FolderOpen,
} from "lucide-react";
import { firebaseDb as supabase, type TestRow, type QuestionRow, type AttemptRow } from "@/firebase";

type Phase = "register" | "select" | "test" | "result";
type AnswerMap = Record<string, string>;
type FlagMap = Record<string, boolean>;

const OPTION_LABELS = ["A", "B", "C", "D"];
const TEST_FOLDERS = ["Math", "Geography", "History", "English", "Odia", "Science"];

function getStudentFolder(subject: string) {
  const normalized = subject.trim().toLowerCase();
  if (normalized === "maths" || normalized === "mathematics") return "Math";
  return TEST_FOLDERS.find((folder) => folder.toLowerCase() === normalized) || subject.trim() || "Other Tests";
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function StudentFlow({ onExit, sharedTestId }: { onExit: () => void; sharedTestId?: string }) {
  const [phase, setPhase] = useState<Phase>("register");
  const [student, setStudent] = useState({ name: "", roll: "", school: "" });
  const [selectedTest, setSelectedTest] = useState<TestRow | null>(null);
  const [attempt, setAttempt] = useState<AttemptRow | null>(null);

  if (phase === "register") {
    return (
      <RegistrationScreen
        onComplete={(info) => {
          setStudent(info);
          setPhase("select");
        }}
      />
    );
  }

  if (phase === "select") {
    return (
      <TestSelectScreen
        student={student}
        sharedTestId={sharedTestId}
        onSelect={(test) => {
          setSelectedTest(test);
          setPhase("test");
        }}
        onBack={() => setPhase("register")}
      />
    );
  }

  if (phase === "test" && selectedTest) {
    return (
      <TestScreen
        test={selectedTest}
        student={student}
        onComplete={(att) => {
          setAttempt(att);
          setPhase("result");
        }}
        onExit={onExit}
      />
    );
  }

  if (phase === "result" && selectedTest && attempt) {
    return (
      <ResultScreen
        test={selectedTest}
        attempt={attempt}
        onRestart={() => {
          setPhase("select");
          setSelectedTest(null);
          setAttempt(null);
        }}
        onExit={onExit}
      />
    );
  }

  return null;
}

// ===================== Registration =====================

function RegistrationScreen({
  onComplete,
}: {
  onComplete: (info: { name: string; roll: string; school: string }) => void;
}) {
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [school, setSchool] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!roll.trim()) {
      setError("Please enter your roll number");
      return;
    }
    if (!school.trim()) {
      setError("Please enter your school name");
      return;
    }
    setError("");
    onComplete({ name: name.trim(), roll: roll.trim(), school: school.trim() });
  };

  return (
    <div className="min-h-[calc(100vh-49px)] flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#FF9933] via-[#FFB347] to-[#138808] px-6 py-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-xl bg-white/30 backdrop-blur flex items-center justify-center border border-white/40">
                <User className="w-7 h-7 text-gray-800" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Student Registration</h2>
            <p className="text-gray-700 text-sm mt-1">Enter your details to begin</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <FormField
              label="Full Name"
              placeholder="e.g., Rahul Sharma"
              value={name}
              onChange={setName}
              icon={<User className="w-4 h-4" />}
            />
            <FormField
              label="Roll Number"
              placeholder="e.g., 10A-045"
              value={roll}
              onChange={setRoll}
              icon={<GraduationCap className="w-4 h-4" />}
            />
            <FormField
              label="School Name"
              placeholder="e.g., Astarang High School"
              value={school}
              onChange={setSchool}
              icon={<BookOpen className="w-4 h-4" />}
            />

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#FF8C00] text-gray-800 font-bold text-sm hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Continue to Tests
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="kalinga-font w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
}

// ===================== Test Selection =====================

function TestSelectScreen({
  student,
  sharedTestId,
  onSelect,
  onBack,
}: {
  student: { name: string; roll: string; school: string };
  sharedTestId?: string;
  onSelect: (test: TestRow) => void;
  onBack: () => void;
}) {
  const [tests, setTests] = useState<TestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>({});
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const onSelectRef = useRef(onSelect);

  onSelectRef.current = onSelect;

  useEffect(() => {
    (async () => {
      setLoading(true);
      let query = supabase
        .from("tests")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (sharedTestId) query = query.eq("id", sharedTestId);

      const { data, error } = await query;

      if (error) {
        setError("Could not load tests. Please try again.");
        setLoading(false);
        return;
      }

      const rows = (data || []) as unknown as TestRow[];
      setTests(rows);

      const counts: Record<string, number> = {};
      for (const t of rows) {
        const { count } = await supabase
          .from("questions")
          .select("*", { count: "exact", head: true })
          .eq("test_id", t.id);
        counts[t.id] = count || 0;
      }
      setQuestionCounts(counts);
      setLoading(false);
      if (sharedTestId && rows.length === 1 && (counts[rows[0].id] || 0) > 0) {
        onSelectRef.current(rows[0]);
      }
    })();
  }, [sharedTestId]);

  const folders = Array.from(new Set(tests.map((test) => getStudentFolder(test.subject))));
  const folderTests = selectedFolder ? tests.filter((test) => getStudentFolder(test.subject) === selectedFolder) : [];
  const units = Array.from(new Set(folderTests.map((test) => test.topic.trim() || "General Tests")));

  return (
    <div className="min-h-[calc(100vh-49px)] bg-gradient-to-br from-orange-50 via-white to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Student info banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF9933] to-[#FF8C00] text-gray-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-800 truncate">{student.name}</p>
            <p className="text-xs text-slate-600 truncate">
              Roll: {student.roll} &middot; {student.school}
            </p>
          </div>
          <button
            onClick={onBack}
            className="text-xs text-[#FF9933] font-semibold hover:underline flex-shrink-0"
          >
            Change
          </button>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-1">Choose a Subject Folder</h2>
        <p className="text-sm text-slate-600 mb-6">Open a subject, then choose a unit test.</p>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2 text-sm">Loading tests...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No tests are available yet. Please check back later.</p>
          </div>
        ) : (
          <>
            {!selectedFolder ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {folders.map((folder) => (
                  <button
                    key={folder}
                    onClick={() => setSelectedFolder(folder)}
                    className="text-left bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-[#FF9933] transition-all group"
                  >
                    <Folder className="w-9 h-9 text-[#FF9933] mb-4" />
                    <h3 className="font-bold text-slate-800 text-base">{folder}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {tests.filter((test) => getStudentFolder(test.subject) === folder).length} unit test(s)
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#FF9933] group-hover:translate-x-1 transition-transform">
                      Open folder <ChevronRight className="w-4 h-4" />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <button onClick={() => setSelectedFolder(null)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#FF9933] mb-4">
                  <ChevronLeft className="w-4 h-4" /> All subject folders
                </button>
                <div className="flex items-center gap-3 mb-5">
                  <FolderOpen className="w-6 h-6 text-[#FF9933]" />
                  <h3 className="text-lg font-bold text-slate-800">{selectedFolder}</h3>
                </div>
                <div className="space-y-6">
                  {units.map((unit) => (
                    <section key={unit}>
                      <h4 className="text-sm font-bold text-slate-700 mb-3">{unit}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {folderTests.filter((test) => (test.topic.trim() || "General Tests") === unit).map((test) => (
                          <TestCard key={test.id} test={test} questionCount={questionCounts[test.id] || 0} onSelect={() => onSelect(test)} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TestCard({
  test,
  questionCount,
  onSelect,
}: {
  test: TestRow;
  questionCount: number;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={questionCount === 0}
      className="text-left bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-[#FF9933] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-11 h-11 rounded-lg bg-[#FF9933]/15 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-[#FF9933]" />
        </div>
        {questionCount > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-[#138808]/10 text-[#138808] font-medium">
            {questionCount} Questions
          </span>
        )}
      </div>
      <h3 className="font-bold text-slate-800 text-sm mb-1 leading-snug">{test.title}</h3>
      <div className="space-y-1 text-xs text-slate-600 mb-4">
        {test.subject && <p>Subject: {test.subject}</p>}
        {test.topic && <p>Topic: {test.topic}</p>}
        {test.class_name && <p>Class: {test.class_name}</p>}
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#FF9933]" />
          {test.duration_minutes} min
        </span>
        {test.session && (
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#138808]" />
            {test.session}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-500 truncate">{test.prepared_by}</span>
        <span className="text-sm font-bold text-[#FF9933] group-hover:translate-x-1 transition-transform">
          Start →
        </span>
      </div>
    </button>
  );
}

// ===================== Test Taking =====================

function TestScreen({
  test,
  student,
  onComplete,
  onExit,
}: {
  test: TestRow;
  student: { name: string; roll: string; school: string };
  onComplete: (attempt: AttemptRow) => void;
  onExit: () => void;
}) {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [flags, setFlags] = useState<FlagMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(test.duration_minutes * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showPaletteMobile, setShowPaletteMobile] = useState(false);
  const [showStartConfirm, setShowStartConfirm] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("test_id", test.id)
        .order("display_order", { ascending: true });

      if (error) {
        setError("Could not load questions.");
        setLoading(false);
        return;
      }
      setQuestions((data || []) as unknown as QuestionRow[]);
      setLoading(false);
    })();
  }, [test.id]);

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flags).filter(Boolean).length;

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    let correct = 0;
    for (const q of questions) {
      const userAnswer = answers[q.id];
      if (userAnswer === q.correct_answer) correct++;
    }
    const total = questions.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    const { data, error } = await supabase
      .from("student_attempts")
      .insert({
        test_id: test.id,
        student_name: student.name,
        roll_number: student.roll,
        school_name: student.school,
        answers: answers,
        score: correct,
        total_questions: total,
        percentage: pct,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    setSubmitting(false);
    if (error || !data) {
      setShowSubmitConfirm(false);
      setError("Could not submit test. Please try again.");
      return;
    }
    onComplete(data as unknown as AttemptRow);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [answers, questions, test.id, student, onComplete]);

  const handleTimeUp = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    handleSubmit();
  }, [handleSubmit]);

  useEffect(() => {
    if (showStartConfirm) return;
    if (questions.length === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showStartConfirm, questions.length, handleTimeUp]);

  const selectAnswer = (questionId: string, letter: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: letter }));
    if (currentIndex < questions.length - 1) {
      window.setTimeout(() => {
        setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 250);
    }
  };

  const toggleFlag = (questionId: string) => {
    setFlags((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
    setShowPaletteMobile(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Start confirmation overlay
  if (showStartConfirm && !loading && !error) {
    return (
      <div className="min-h-[calc(100vh-49px)] flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#FF9933] via-[#FFB347] to-[#138808] px-6 py-8 text-center">
            <GraduationCap className="w-10 h-10 text-gray-800 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-800">{test.title}</h2>
            <p className="text-gray-700 text-sm mt-1">{test.subject} &middot; {test.topic}</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-3 mb-6">
              <InfoStat icon={<BookOpen className="w-5 h-5" />} label="Questions" value={String(questions.length)} />
              <InfoStat icon={<Clock className="w-5 h-5" />} label="Minutes" value={String(test.duration_minutes)} />
              <InfoStat icon={<Timer className="w-5 h-5" />} label="Max Score" value={String(questions.length)} />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Before You Start
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-700">
                <li>• The timer starts as soon as you click "Start Test"</li>
                <li>• The test auto-submits when time runs out</li>
                <li>• You can navigate between questions using the palette</li>
                <li>• Flag questions to review them later</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onExit}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowStartConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#FF8C00] text-gray-800 font-bold text-sm hover:shadow-lg transition-all"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2 text-sm">Loading test...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button onClick={onExit} className="text-sm text-[#FF9933] font-semibold hover:underline">
          Go back
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-500">This test has no questions yet.</p>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-600">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2 text-sm font-medium">Submitting your test...</span>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const timeWarning = timeLeft <= 300;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-[calc(100vh-49px)] bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-[#FF9933] to-[#FF8C00] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-gray-800" />
            </div>
            <div className="min-w-0 hidden sm:block">
              <h1 className="text-sm font-bold text-slate-800 truncate">{test.title}</h1>
              <p className="text-xs text-slate-600 truncate">{test.subject} &middot; {test.topic}</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-mono font-bold text-sm sm:text-base transition-colors ${
              timeWarning ? "bg-red-50 text-red-700 border border-red-200 animate-pulse" : "bg-slate-100 text-slate-700"
            }`}
          >
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowPaletteMobile(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#FF9933] to-[#FF8C00] text-gray-800 text-sm font-medium"
          >
            <Menu className="w-5 h-5" />
            <span className="hidden sm:inline">Questions</span>
          </button>
        </div>
      </header>

      {/* Info bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-700">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#FF9933]" />
            {test.subject} | {test.topic}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#138808]" />
            {test.session}
          </span>
          <span className="flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-[#FF9933]" />
            {test.duration_minutes} Minutes
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Main Question Area */}
        <div className="flex-1 min-w-0">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-sm text-slate-600">{answeredCount} answered</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF9933] to-[#FF8C00] rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card - with Kalinga font for Odia text */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-8">
            <div className="flex items-start gap-3 mb-6">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-[#FF9933] to-[#FF8C00] text-gray-800 flex items-center justify-center font-bold text-sm">
                {currentIndex + 1}
              </div>
              <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                <h2 className="kalinga-font min-w-0 flex-1 text-base sm:text-lg font-semibold text-slate-800 leading-relaxed pt-1">
                  {currentQuestion.question_text}
                </h2>
                {currentQuestion.image_url && (
                  <div className="flex h-[224px] w-[176px] flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2 sm:h-[280px] sm:w-[220px]">
                    <img
                      src={currentQuestion.image_url}
                      alt={`Diagram for question ${currentIndex + 1}`}
                      onError={(event) => { event.currentTarget.style.display = "none"; }}
                      className="max-h-full max-w-full rounded object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {OPTION_LABELS.map((letter, optIdx) => {
                const optionText = [
                  currentQuestion.option_a,
                  currentQuestion.option_b,
                  currentQuestion.option_c,
                  currentQuestion.option_d,
                ][optIdx];
                const isSelected = answers[currentQuestion.id] === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => selectAnswer(currentQuestion.id, letter)}
                    className={`w-full text-left flex items-center gap-3 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 group ${
                      isSelected ? "border-[#FF9933] bg-orange-50 shadow-sm" : "border-slate-200 bg-white hover:border-[#FF9933]/50 hover:bg-orange-50/30"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                        isSelected ? "bg-[#FF9933] text-gray-800" : "bg-slate-100 text-slate-600 group-hover:bg-[#FF9933]/20 group-hover:text-[#FF9933]"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className={`kalinga-font text-sm sm:text-base ${isSelected ? "text-[#FF9933] font-medium" : "text-slate-700"}`}>
                      {optionText}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Flag toggle */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  flags[currentQuestion.id] ? "text-amber-700 bg-amber-50" : "text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                }`}
              >
                <Flag className={`w-4 h-4 ${flags[currentQuestion.id] ? "fill-amber-500 text-amber-500" : ""}`} />
                {flags[currentQuestion.id] ? "Flagged for review" : "Flag this question"}
              </button>
              <span
                className={`text-xs px-2 py-1 rounded font-medium ${
                  answers[currentQuestion.id] !== undefined ? "bg-[#138808]/10 text-[#138808]" : "bg-slate-100 text-slate-600"
                }`}
              >
                {answers[currentQuestion.id] !== undefined ? "Answered" : "Not answered"}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            {isLastQuestion ? (
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-lg bg-gradient-to-r from-[#138808] to-[#0d6605] text-white font-bold text-sm transition-colors hover:shadow-lg shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5" />
                Submit Test
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#FF9933] to-[#FF8C00] text-gray-800 font-medium text-sm transition-colors hover:shadow-lg"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Palette */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-24">
            <QuestionPalette
              questions={questions}
              answers={answers}
              flags={flags}
              currentIndex={currentIndex}
              goToQuestion={goToQuestion}
              answeredCount={answeredCount}
              flaggedCount={flaggedCount}
              onSubmit={() => setShowSubmitConfirm(true)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Palette Drawer */}
      {showPaletteMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPaletteMobile(false)} />
          <div className="relative ml-auto w-80 max-w-[85vw] bg-white h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Questions</h3>
              <button onClick={() => setShowPaletteMobile(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4">
              <QuestionPalette
                questions={questions}
                answers={answers}
                flags={flags}
                currentIndex={currentIndex}
                goToQuestion={goToQuestion}
                answeredCount={answeredCount}
                flaggedCount={flaggedCount}
                onSubmit={() => { setShowPaletteMobile(false); setShowSubmitConfirm(true); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSubmitConfirm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Submit Test?</h3>
                <p className="text-sm text-slate-600 mb-1">
                  You have answered <span className="font-bold text-slate-800">{answeredCount}</span> out of{" "}
                  <span className="font-bold text-slate-800">{totalQuestions}</span> questions.
                </p>
                {answeredCount < totalQuestions && (
                  <p className="text-sm text-amber-600 mb-4">
                    {totalQuestions - answeredCount} question(s) are still unanswered.
                  </p>
                )}
                {answeredCount === totalQuestions && <p className="text-sm text-[#138808] mb-4">All questions answered!</p>}
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
              >
                Keep Going
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#138808] to-[#0d6605] text-white text-sm font-bold hover:shadow-lg disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-200">
      <div className="flex justify-center text-[#FF9933] mb-1">{icon}</div>
      <p className="text-lg font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-600">{label}</p>
    </div>
  );
}

function QuestionPalette({
  questions,
  answers,
  flags,
  currentIndex,
  goToQuestion,
  answeredCount,
  flaggedCount,
  onSubmit,
}: {
  questions: QuestionRow[];
  answers: AnswerMap;
  flags: FlagMap;
  currentIndex: number;
  goToQuestion: (index: number) => void;
  answeredCount: number;
  flaggedCount: number;
  onSubmit: () => void;
}) {
  return (
    <div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h3 className="font-bold text-slate-800 text-sm mb-3">Question Palette</h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-700 mb-4">
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-[#138808]" /> Answered</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-amber-400" /> Flagged</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-[#FF9933]" /> Current</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-slate-200 border border-slate-300" /> Not visited</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isFlagged = flags[q.id];
            const isCurrent = idx === currentIndex;
            let bgClass = "bg-slate-200 text-slate-600 border border-slate-300";
            if (isCurrent) bgClass = "bg-[#FF9933] text-gray-800 ring-2 ring-[#FF9933]/50";
            else if (isAnswered && isFlagged) bgClass = "bg-amber-400 text-gray-800";
            else if (isAnswered) bgClass = "bg-[#138808] text-white";
            else if (isFlagged) bgClass = "bg-amber-100 text-amber-700 border border-amber-300";
            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all hover:scale-110 ${bgClass}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-slate-600">Answered</span><span className="font-bold text-[#138808]">{answeredCount}</span></div>
          <div className="flex justify-between"><span className="text-slate-600">Flagged</span><span className="font-bold text-amber-600">{flaggedCount}</span></div>
          <div className="flex justify-between"><span className="text-slate-600">Remaining</span><span className="font-bold text-slate-700">{questions.length - answeredCount}</span></div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#138808] to-[#0d6605] text-white font-bold text-sm transition-colors hover:shadow-lg shadow-sm flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-5 h-5" />
        Submit Test
      </button>
    </div>
  );
}

// ===================== Results =====================

function ResultScreen({
  test,
  attempt,
  onRestart,
  onExit,
}: {
  test: TestRow;
  attempt: AttemptRow;
  onRestart: () => void;
  onExit: () => void;
}) {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("questions")
        .select("*")
        .eq("test_id", test.id)
        .order("display_order", { ascending: true });
      setQuestions((data || []) as unknown as QuestionRow[]);
      setLoading(false);
    })();
  }, [test.id]);

  const correct = attempt.score;
  const total = attempt.total_questions;
  const percentage = Math.round(attempt.percentage);
  const passed = percentage >= 35;
  const wrong = total - correct - (total - Object.keys(attempt.answers).length);
  const unanswered = total - Object.keys(attempt.answers).length;

  const getGrade = (pct: number): string => {
    if (pct >= 90) return "A+";
    if (pct >= 80) return "A";
    if (pct >= 70) return "B";
    if (pct >= 60) return "C";
    if (pct >= 50) return "D";
    if (pct >= 35) return "E";
    return "F";
  };

  return (
    <div className="min-h-[calc(100vh-49px)] bg-gradient-to-br from-orange-50 via-white to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Score Card */}
        <div className={`bg-white rounded-2xl border-2 shadow-lg overflow-hidden ${passed ? "border-[#138808]/30" : "border-red-200"}`}>
          <div className={`px-6 py-8 sm:px-10 text-center ${passed ? "bg-gradient-to-r from-[#138808] to-[#0d6605]" : "bg-gradient-to-r from-red-600 to-rose-600"}`}>
            <div className="flex justify-center mb-3">
              {passed ? <Award className="w-14 h-14 text-white" /> : <AlertCircle className="w-14 h-14 text-white" />}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {passed ? "Congratulations!" : "Keep Practicing!"}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              {passed ? "You passed the test." : "You need 35% to pass."}
            </p>
            <div className="mt-6 inline-flex items-baseline gap-2 bg-white/15 backdrop-blur px-6 py-3 rounded-xl">
              <span className="text-4xl sm:text-5xl font-bold text-white">{correct}</span>
              <span className="text-xl text-white/80">/ {total}</span>
            </div>
            <p className="text-white/90 text-lg font-semibold mt-2">{percentage}%</p>
            <div className="mt-3 inline-block px-4 py-1 rounded-full bg-white/20 text-white text-sm font-bold">
              Grade: {getGrade(percentage)}
            </div>
          </div>

          {/* Student Info */}
          <div className="px-6 sm:px-10 py-4 bg-slate-50 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate-700">
              <span className="font-medium text-slate-800">{attempt.student_name}</span>
              <span>Roll: {attempt.roll_number}</span>
              <span className="truncate">{attempt.school_name}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <StatCard label="Correct" value={correct} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
              <StatCard label="Wrong" value={Math.max(wrong, 0)} icon={<X className="w-5 h-5" />} color="red" />
              <StatCard label="Unanswered" value={unanswered} icon={<Circle className="w-5 h-5" />} color="slate" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <BookOpen className="w-4 h-4 text-[#FF9933]" />
                <span>{test.subject} &middot; {test.topic}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-[#138808]" />
                <span>{test.session}</span>
              </div>
            </div>

            <button
              onClick={() => setShowReview(!showReview)}
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm transition-colors hover:bg-slate-900 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Eye className="w-5 h-5" />
              {showReview ? "Hide Answer Review" : "Review Answers & Correct Options"}
            </button>
          </div>
        </div>

        {/* Review - with Kalinga font for Odia text */}
        {showReview && !loading && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-bold text-slate-800 px-1">Answer Review</h3>
            {questions.map((q, idx) => (
              <ReviewItem key={q.id} question={q} index={idx} userAnswer={attempt.answers[q.id]} />
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-full mt-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-100"
            >
              Back to Top
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#FF8C00] text-gray-800 font-bold text-sm hover:shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Take Another Test
          </button>
          <button
            onClick={onExit}
            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label, value, icon, color,
}: {
  label: string; value: number; icon: React.ReactNode; color: "green" | "red" | "slate";
}) {
  const colorClasses = {
    green: "bg-[#138808]/10 text-[#138808] border-[#138808]/20",
    red: "bg-red-50 text-red-700 border-red-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <div className={`rounded-xl border p-3 sm:p-4 text-center ${colorClasses[color]}`}>
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-2xl sm:text-3xl font-bold">{value}</p>
      <p className="text-xs font-medium mt-0.5 opacity-80">{label}</p>
    </div>
  );
}

function ReviewItem({
  question, index, userAnswer,
}: {
  question: QuestionRow; index: number; userAnswer: string | undefined;
}) {
  const isCorrect = userAnswer === question.correct_answer;
  const isUnanswered = userAnswer === undefined;
  const options = [
    { letter: "A", text: question.option_a },
    { letter: "B", text: question.option_b },
    { letter: "C", text: question.option_c },
    { letter: "D", text: question.option_d },
  ];

  return (
    <div className={`bg-white rounded-xl border-l-4 shadow-sm p-4 sm:p-5 ${isCorrect ? "border-[#138808]" : isUnanswered ? "border-slate-300" : "border-red-500"}`}>
      <div className="flex items-start gap-3 mb-3">
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
          isCorrect ? "bg-[#138808]/10 text-[#138808]" : isUnanswered ? "bg-slate-100 text-slate-500" : "bg-red-100 text-red-700"
        }`}>
          {index + 1}
        </span>
        <p className="kalinga-font text-sm font-semibold text-slate-800 leading-relaxed pt-0.5">{question.question_text}</p>
      </div>

      <div className="space-y-1.5 ml-10">
        {options.map((opt) => {
          const isCorrectOpt = opt.letter === question.correct_answer;
          const isUserOpt = opt.letter === userAnswer;
          let className = "kalinga-font text-sm py-1.5 px-3 rounded-lg flex items-center gap-2 ";
          if (isCorrectOpt) className += "bg-[#138808]/10 text-[#138808] border border-[#138808]/20";
          else if (isUserOpt) className += "bg-red-50 text-red-800 border border-red-200";
          else className += "text-slate-500";
          return (
            <div key={opt.letter} className={className}>
              <span className="font-bold text-xs">{opt.letter}.</span>
              <span className="kalinga-font">{opt.text}</span>
              {isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-[#138808] ml-auto flex-shrink-0" />}
              {isUserOpt && !isCorrectOpt && <X className="w-4 h-4 text-red-600 ml-auto flex-shrink-0" />}
            </div>
          );
        })}
      </div>

      <div className="ml-10 mt-2">
        {isUnanswered ? <p className="text-xs text-slate-400 italic">Not answered</p>
        : isCorrect ? <p className="text-xs text-[#138808] font-medium">Correct</p>
        : <p className="text-xs text-red-600 font-medium">Incorrect</p>}
      </div>
    </div>
  );
}
