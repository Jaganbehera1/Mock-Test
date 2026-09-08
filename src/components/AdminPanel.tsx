import React, { useState, useEffect, useCallback } from "react";
import {
  Shield, BookOpen, Plus, Clock, Users, FileText,
  Trash2, Edit2, X, Check, AlertCircle, Loader2, ArrowLeft,
  Layers, ListChecks, Calendar, Award, Search, Download, ImagePlus,
} from "lucide-react";
import { firebaseDb as supabase, type TestRow, type QuestionRow, type AttemptRow } from "@/firebase";

type AdminTab = "dashboard" | "tests" | "attempts";

export function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [selectedTest, setSelectedTest] = useState<TestRow | null>(null);

  if (selectedTest) {
    return (
      <TestEditor
        test={selectedTest}
        onBack={() => { setSelectedTest(null); setTab("tests"); }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Panel</h1>
            <p className="text-sm text-slate-500 font-medium">Manage tests, questions, and view student results</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200/60 w-full sm:w-auto sm:inline-flex">
        <TabButton active={tab === "dashboard"} onClick={() => setTab("dashboard")} icon={<Layers className="w-4 h-4" />} label="Dashboard" />
        <TabButton active={tab === "tests"} onClick={() => setTab("tests")} icon={<FileText className="w-4 h-4" />} label="Tests" />
        <TabButton active={tab === "attempts"} onClick={() => setTab("attempts")} icon={<Users className="w-4 h-4" />} label="Attempts" />
      </div>

      {tab === "dashboard" && <Dashboard />}
      {tab === "tests" && <TestsManager onEditTest={setSelectedTest} />}
      {tab === "attempts" && <AttemptsViewer />}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 sm:flex-none justify-center ${
        active 
          ? "bg-slate-900 text-white shadow-md" 
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ===================== Dashboard =====================

function Dashboard() {
  const [stats, setStats] = useState({ tests: 0, questions: 0, attempts: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ count: testCount }, { count: qCount }, { count: aCount }] = await Promise.all([
        supabase.from("tests").select("*", { count: "exact", head: true }),
        supabase.from("questions").select("*", { count: "exact", head: true }),
        supabase.from("student_attempts").select("*", { count: "exact", head: true }).eq("status", "completed"),
      ]);

      const { data: attempts } = await supabase
        .from("student_attempts")
        .select("percentage")
        .eq("status", "completed");

      const attemptRows = (attempts || []) as unknown as Array<{ percentage: number }>;
      const avg = attemptRows.length > 0
        ? Math.round(attemptRows.reduce((sum, attempt) => sum + Number(attempt.percentage), 0) / attemptRows.length)
        : 0;

      setStats({
        tests: testCount || 0,
        questions: qCount || 0,
        attempts: aCount || 0,
        avgScore: avg,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <DashCard icon={<FileText className="w-5 h-5" />} label="Total Tests" value={stats.tests} color="blue" />
      <DashCard icon={<ListChecks className="w-5 h-5" />} label="Total Questions" value={stats.questions} color="cyan" />
      <DashCard icon={<Users className="w-5 h-5" />} label="Student Attempts" value={stats.attempts} color="green" />
      <DashCard icon={<Award className="w-5 h-5" />} label="Avg Score" value={`${stats.avgScore}%`} color="amber" />
    </div>
  );
}

function DashCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <div className={`rounded-2xl border-2 p-6 ${colors[color]} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="mb-3">{icon}</div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm font-semibold opacity-80 mt-0.5">{label}</p>
    </div>
  );
}

// ===================== Tests Manager =====================

function TestsManager({ onEditTest }: { onEditTest: (test: TestRow) => void }) {
  const [tests, setTests] = useState<TestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [questionCounts, setQuestionCounts] = useState<Record<string, number>>({});
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});

  const fetchTests = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("tests").select("*").order("created_at", { ascending: false });
    const rows = (data || []) as unknown as TestRow[];
    setTests(rows);

    const qCounts: Record<string, number> = {};
    const aCounts: Record<string, number> = {};
    for (const t of rows) {
      const [{ count: qc }, { count: ac }] = await Promise.all([
        supabase.from("questions").select("*", { count: "exact", head: true }).eq("test_id", t.id),
        supabase.from("student_attempts").select("*", { count: "exact", head: true }).eq("test_id", t.id).eq("status", "completed"),
      ]);
      qCounts[t.id] = qc || 0;
      aCounts[t.id] = ac || 0;
    }
    setQuestionCounts(qCounts);
    setAttemptCounts(aCounts);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  const handleDelete = async (testId: string) => {
    if (!confirm("Delete this test and all its questions? This cannot be undone.")) return;
    await supabase.from("tests").delete().eq("id", testId);
    fetchTests();
  };

  const toggleActive = async (test: TestRow) => {
    await supabase.from("tests").update({ is_active: !test.is_active }).eq("id", test.id);
    fetchTests();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-800">All Tests</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Test
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : tests.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-16 text-center shadow-sm">
          <FileText className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-500 mb-4 font-medium">No tests created yet.</p>
          <button onClick={() => setShowCreate(true)} className="text-sm text-blue-600 font-semibold hover:underline">
            Create your first test
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <button onClick={() => onEditTest(test)} className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <h3 className="font-bold text-slate-800 text-base odia-text">{test.title}</h3>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 ${
                      test.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                    }`}>
                      {test.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><ListChecks className="w-4 h-4" /> {questionCounts[test.id] || 0} questions</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {attemptCounts[test.id] || 0} attempts</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {test.duration_minutes} min</span>
                    {test.subject && <span className="odia-text">{test.subject}</span>}
                  </div>
                </button>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => onEditTest(test)} className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => toggleActive(test)} className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors" title="Toggle active">
                    {test.is_active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(test.id)} className="p-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateTestModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); fetchTests(); }}
        />
      )}
    </div>
  );
}

function CreateTestModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    title: "", subject: "", topic: "", class_name: "Class 10th", session: "2026–2027",
    duration_minutes: 90, prepared_by: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Test title is required"); return; }
    setSaving(true);
    const { error } = await supabase.from("tests").insert({
      title: form.title.trim(),
      subject: form.subject.trim(),
      topic: form.topic.trim(),
      class_name: form.class_name.trim(),
      session: form.session.trim(),
      duration_minutes: form.duration_minutes,
      prepared_by: form.prepared_by.trim(),
      is_active: true,
    });
    setSaving(false);
    if (error) { setError("Could not create test. Please try again."); return; }
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 odia-text">ନୂଆ ଟେଷ୍ଟ ତିଆରି</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <AdminField label="Test Title" placeholder="e.g., English Mock Test — At the High School" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Subject" placeholder="English" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
            <AdminField label="Topic" placeholder="At the High School" value={form.topic} onChange={(v) => setForm({ ...form, topic: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Class" placeholder="Class 10th" value={form.class_name} onChange={(v) => setForm({ ...form, class_name: v })} />
            <AdminField label="Session" placeholder="2026–2027" value={form.session} onChange={(v) => setForm({ ...form, session: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Duration (minutes)</label>
              <input
                type="number"
                min={1}
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 90 })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
            <AdminField label="Prepared By" placeholder="School name" value={form.prepared_by} onChange={(v) => setForm({ ...form, prepared_by: v })} />
          </div>
          {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3"><AlertCircle className="w-4 h-4" />{error}</div>}
        </div>
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-6 py-5 flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-60 shadow-md">
            {saving ? "Creating..." : "Create Test"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="odia-input w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
      />
    </div>
  );
}

// ===================== Test Editor (Questions) =====================

function TestEditor({ test, onBack }: { test: TestRow; onBack: () => void }) {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<QuestionRow | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingTest, setEditingTest] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("questions")
      .select("*")
      .eq("test_id", test.id)
      .order("display_order", { ascending: true });
    setQuestions((data || []) as unknown as QuestionRow[]);
    setLoading(false);
  }, [test.id]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm("Delete this question?")) return;
    await supabase.from("questions").delete().eq("id", qId);
    fetchQuestions();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 bg-slate-50 min-h-screen">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-5 font-semibold transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Tests
      </button>

      {/* Test Info Card */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-slate-800 odia-text">{test.title}</h2>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-500 mt-1.5">
              {test.subject && <span className="flex items-center gap-1.5 odia-text"><BookOpen className="w-4 h-4" /> {test.subject}</span>}
              {test.topic && <span className="odia-text">{test.topic}</span>}
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {test.duration_minutes} min</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {test.session}</span>
            </div>
          </div>
          <button onClick={() => setEditingTest(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors flex-shrink-0">
            <Edit2 className="w-4 h-4" /> Edit
          </button>
        </div>
        <div className="flex items-center gap-4 pt-3 border-t-2 border-slate-100">
          <span className="text-sm text-slate-500 font-medium">{questions.length} questions</span>
          <button
            onClick={() => setShowAddQuestion(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-16 text-center shadow-sm">
          <ListChecks className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-500 mb-4 font-medium">No questions in this test yet.</p>
          <button onClick={() => setShowAddQuestion(true)} className="text-sm text-blue-600 font-semibold hover:underline">
            Add the first question
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="odia-text text-base font-semibold text-slate-800 mb-3">{q.question_text}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[q.option_a, q.option_b, q.option_c, q.option_d].map((opt, i) => (
                      <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                        OPTION_LABELS[i] === q.correct_answer ? "bg-green-50 text-green-700 font-semibold border-2 border-green-200" : "bg-slate-50 text-slate-600"
                      }`}>
                        <span className="font-bold">{OPTION_LABELS[i]}.</span>
                        <span className="odia-text truncate">{opt}</span>
                        {OPTION_LABELS[i] === q.correct_answer && <Check className="w-4 h-4 ml-auto flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => setEditingQuestion(q)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddQuestion && (
        <QuestionModal
          testId={test.id}
          order={questions.length}
          onClose={() => setShowAddQuestion(false)}
          onSaved={() => { setShowAddQuestion(false); fetchQuestions(); }}
        />
      )}

      {editingQuestion && (
        <QuestionModal
          testId={test.id}
          order={editingQuestion.display_order}
          existing={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSaved={() => { setEditingQuestion(null); fetchQuestions(); }}
        />
      )}

      {editingTest && (
        <EditTestModal
          test={test}
          onClose={() => setEditingTest(false)}
          onSaved={() => { setEditingTest(false); onBack(); }}
        />
      )}
    </div>
  );
}

const OPTION_LABELS = ["A", "B", "C", "D"];

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_QUESTION_IMAGE_BYTES = 5 * 1024 * 1024;

async function uploadQuestionImage(file: File): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary image uploads are not configured.");
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST", body: formData,
  });
  const result = await response.json() as { secure_url?: string; error?: { message?: string } };
  if (!response.ok || !result.secure_url) throw new Error(result.error?.message || "Image upload failed.");
  return result.secure_url;
}

function QuestionModal({
  testId, order, existing, onClose, onSaved,
}: {
  testId: string;
  order: number;
  existing?: QuestionRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    question_text: existing?.question_text || "",
    option_a: existing?.option_a || "",
    option_b: existing?.option_b || "",
    option_c: existing?.option_c || "",
    option_d: existing?.option_d || "",
    correct_answer: existing?.correct_answer || "A",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(existing?.image_url || "");
  const [imagePreview, setImagePreview] = useState(existing?.image_url || "");

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > MAX_QUESTION_IMAGE_BYTES) { setError("Image must be 5 MB or smaller."); return; }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImageUrl("");
    setImagePreview("");
  };

  const handleSave = async () => {
    if (!form.question_text.trim()) { setError("Question text is required"); return; }
    if (!form.option_a.trim() || !form.option_b.trim() || !form.option_c.trim() || !form.option_d.trim()) {
      setError("All four options are required"); return;
    }
    setSaving(true);
    let uploadedImageUrl = imageUrl;
    try {
      if (imageFile) {
        setUploading(true);
        uploadedImageUrl = await uploadQuestionImage(imageFile);
      }
    } catch (uploadError) {
      setSaving(false);
      setUploading(false);
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload image.");
      return;
    }
    setUploading(false);
    if (existing) {
      const { error } = await supabase.from("questions").update({
        question_text: form.question_text.trim(),
        option_a: form.option_a.trim(),
        option_b: form.option_b.trim(),
        option_c: form.option_c.trim(),
        option_d: form.option_d.trim(),
        correct_answer: form.correct_answer,
        image_url: uploadedImageUrl || null,
      }).eq("id", existing.id);
      setSaving(false);
      if (error) { setError("Could not save. Try again."); return; }
    } else {
      const { error } = await supabase.from("questions").insert({
        test_id: testId,
        question_text: form.question_text.trim(),
        option_a: form.option_a.trim(),
        option_b: form.option_b.trim(),
        option_c: form.option_c.trim(),
        option_d: form.option_d.trim(),
        correct_answer: form.correct_answer,
        image_url: uploadedImageUrl || "",
        display_order: order + 1,
      });
      setSaving(false);
      if (error) { setError("Could not save. Try again."); return; }
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 odia-text">{existing ? "ପ୍ରଶ୍ନ ସମ୍ପାଦନ" : "ନୂଆ ପ୍ରଶ୍ନ"}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Question Text</label>
            <textarea
              value={form.question_text}
              onChange={(e) => setForm({ ...form, question_text: e.target.value })}
              placeholder="Enter the question..."
              rows={3}
              className="odia-input w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Diagram or Question Image <span className="font-normal text-slate-400">(optional)</span></label>
            {imagePreview ? (
              <div className="rounded-xl border-2 border-slate-200 p-3 bg-slate-50">
                <img src={imagePreview} alt="Question diagram preview" className="max-h-52 w-auto max-w-full rounded-lg object-contain mx-auto" />
                <div className="flex items-center justify-between gap-3 mt-3">
                  <span className="text-xs text-slate-500 truncate">{imageFile?.name || "Current question image"}</span>
                  <button type="button" onClick={removeImage} className="text-xs font-semibold text-red-600 hover:underline">Remove image</button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-6 cursor-pointer hover:border-slate-500 hover:bg-slate-50 transition-colors">
                <ImagePlus className="w-6 h-6 text-slate-400" />
                <span className="text-sm font-semibold text-slate-600">Choose diagram image</span>
                <span className="text-xs text-slate-400">PNG, JPG, or WEBP · maximum 5 MB</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => handleImageChange(e.target.files?.[0])} />
              </label>
            )}
          </div>
          {OPTION_LABELS.map((letter) => (
            <div key={letter}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Option {letter}
                {form.correct_answer === letter && <span className="text-green-600 ml-2">✓ Correct</span>}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form[`option_${letter.toLowerCase()}` as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [`option_${letter.toLowerCase()}`]: e.target.value })}
                  placeholder={`Option ${letter}`}
                  className="odia-input flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
                <button
                  onClick={() => setForm({ ...form, correct_answer: letter })}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex-shrink-0 ${
                    form.correct_answer === letter
                      ? "bg-green-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {form.correct_answer === letter ? <Check className="w-4 h-4" /> : "Set Correct"}
                </button>
              </div>
            </div>
          ))}
          {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3"><AlertCircle className="w-4 h-4" />{error}</div>}
        </div>
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-6 py-5 flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-60 shadow-md">
            {uploading ? "Uploading image..." : saving ? "Saving..." : "Save Question"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditTestModal({ test, onClose, onSaved }: { test: TestRow; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: test.title, subject: test.subject, topic: test.topic,
    class_name: test.class_name, session: test.session,
    duration_minutes: test.duration_minutes, prepared_by: test.prepared_by,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Title is required"); return; }
    setSaving(true);
    const { error } = await supabase.from("tests").update({
      title: form.title.trim(),
      subject: form.subject.trim(),
      topic: form.topic.trim(),
      class_name: form.class_name.trim(),
      session: form.session.trim(),
      duration_minutes: form.duration_minutes,
      prepared_by: form.prepared_by.trim(),
    }).eq("id", test.id);
    setSaving(false);
    if (error) { setError("Could not save. Try again."); return; }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 odia-text">ଟେଷ୍ଟ ସମ୍ପାଦନ</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          <AdminField label="Test Title" placeholder="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Subject" placeholder="English" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
            <AdminField label="Topic" placeholder="Topic" value={form.topic} onChange={(v) => setForm({ ...form, topic: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Class" placeholder="Class 10th" value={form.class_name} onChange={(v) => setForm({ ...form, class_name: v })} />
            <AdminField label="Session" placeholder="2026–2027" value={form.session} onChange={(v) => setForm({ ...form, session: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Duration (minutes)</label>
              <input type="number" min={1} value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 90 })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
            </div>
            <AdminField label="Prepared By" placeholder="School" value={form.prepared_by} onChange={(v) => setForm({ ...form, prepared_by: v })} />
          </div>
          {error && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3"><AlertCircle className="w-4 h-4" />{error}</div>}
        </div>
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-6 py-5 flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-60 shadow-md">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== Attempts Viewer =====================

function AttemptsViewer() {
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [tests, setTests] = useState<Record<string, TestRow>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTest, setFilterTest] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const [{ data: aData }, { data: tData }] = await Promise.all([
        supabase.from("student_attempts").select("*").eq("status", "completed").order("completed_at", { ascending: false }),
        supabase.from("tests").select("*"),
      ]);
      setAttempts((aData || []) as unknown as AttemptRow[]);
      const tMap: Record<string, TestRow> = {};
      for (const t of (tData || []) as unknown as TestRow[]) tMap[t.id] = t;
      setTests(tMap);
      setLoading(false);
    })();
  }, []);

  const filtered = attempts.filter((a) => {
    const matchSearch =
      a.student_name.toLowerCase().includes(search.toLowerCase()) ||
      a.roll_number.toLowerCase().includes(search.toLowerCase()) ||
      a.school_name.toLowerCase().includes(search.toLowerCase());
    const matchTest = filterTest === "all" || a.test_id === filterTest;
    return matchSearch && matchTest;
  });

  const exportCSV = () => {
    const rows = [["Name", "Roll", "School", "Test", "Score", "Total", "Percentage", "Grade", "Completed"]];
    for (const a of filtered) {
      const test = tests[a.test_id];
      const pct = Math.round(a.percentage);
      const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : pct >= 35 ? "E" : "F";
      rows.push([
        a.student_name, a.roll_number, a.school_name,
        test?.title || "Unknown",
        String(a.score), String(a.total_questions), `${pct}%`, grade,
        a.completed_at ? new Date(a.completed_at).toLocaleString() : "",
      ]);
    }
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roll, or school..."
            className="kalinga-font w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>
        <select
          value={filterTest}
          onChange={(e) => setFilterTest(e.target.value)}
          className="px-4 py-3 rounded-xl border-2 border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white"
        >
          <option value="all">All Tests</option>
          {Object.values(tests).map((t) => (
            <option key={t.id} value={t.id} className="odia-text">{t.title}</option>
          ))}
        </select>
        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 flex-shrink-0 shadow-md"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-16 text-center shadow-sm">
          <Users className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-500 font-medium">No student attempts found.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="text-left px-5 py-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Student</th>
                  <th className="text-left px-5 py-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Test</th>
                  <th className="text-center px-5 py-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Score</th>
                  <th className="text-center px-5 py-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">%</th>
                  <th className="text-center px-5 py-4 font-semibold text-slate-700 text-xs uppercase tracking-wider">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => {
                  const test = tests[a.test_id];
                  const pct = Math.round(a.percentage);
                  const passed = pct >= 35;
                  const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : pct >= 35 ? "E" : "F";
                  return (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800 odia-text">{a.student_name}</p>
                        <p className="text-xs text-slate-500">Roll: {a.roll_number} &middot; {a.school_name}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-sm odia-text">{test?.title || "—"}</td>
                      <td className="px-5 py-4 text-center font-semibold text-slate-700">{a.score}/{a.total_questions}</td>
                      <td className={`px-5 py-4 text-center font-bold ${passed ? "text-green-600" : "text-red-600"}`}>{pct}%</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>{grade}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {filtered.map((a) => {
              const test = tests[a.test_id];
              const pct = Math.round(a.percentage);
              const passed = pct >= 35;
              const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : pct >= 35 ? "E" : "F";
              return (
                <div key={a.id} className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-base odia-text">{a.student_name}</p>
                      <p className="text-sm text-slate-500">Roll: {a.roll_number}</p>
                      <p className="text-sm text-slate-500 truncate odia-text">{a.school_name}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>{pct}%</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>{grade}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t-2 border-slate-100 text-sm text-slate-500">
                    <span className="truncate odia-text">{test?.title || "—"}</span>
                    <span className="flex-shrink-0 ml-2 font-semibold">{a.score}/{a.total_questions}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
