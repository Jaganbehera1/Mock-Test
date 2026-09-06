import { FormEvent, useState, useEffect } from "react";
import { GraduationCap, Shield, Home, LockKeyhole, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { LandingPage } from "@/components/LandingPage";
import { StudentFlow } from "@/components/StudentFlow";
import { AdminPanel } from "@/components/AdminPanel";
import { firebaseAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import logo from "@/images/JJLogo.jpeg";

type View = "landing" | "student" | "admin";

function App() {
  const [view, setView] = useState<View>("landing");
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "admin") setView("admin");
    else if (hash === "student") setView("student");
  }, []);

  const navigate = (v: View) => {
    setView(v);
    if (v !== "admin") setAdminAuthenticated(false);
    window.location.hash = v === "landing" ? "" : v;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (view === "student") {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopBar onHome={() => navigate("landing")} />
        <StudentFlow onExit={() => navigate("landing")} />
      </div>
    );
  }

  if (view === "admin") {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopBar onHome={() => navigate("landing")} />
        {adminAuthenticated ? <AdminPanel /> : <AdminLogin onAuthenticated={() => setAdminAuthenticated(true)} />}
      </div>
    );
  }

  return <LandingPage onStudent={() => navigate("student")} onAdmin={() => navigate("admin")} />;
}

function AdminLogin({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      setError("");
      onAuthenticated();
    } catch {
      setError("Incorrect email or password.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-57px)] flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-5">
          <LockKeyhole className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 text-center">Admin Sign In</h1>
        <p className="text-sm text-slate-500 text-center mt-2 mb-6">Enter your credentials to manage the test platform.</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                required
                className="kalinga-font w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="kalinga-font w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3 mt-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-bold hover:bg-slate-700 transition-colors mt-6">
          <Shield className="w-4 h-4" />
          Sign In
        </button>
      </form>
    </main>
  );
}

function TopBar({ onHome }: { onHome: () => void }) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <button onClick={onHome} className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors">
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium">Home</span>
        </button>
        <div className="flex items-center gap-2">
          <img src={logo} alt="Jitan logo" className="w-7 h-7 rounded-md object-cover" />
          <span className="text-sm font-bold text-slate-800">Jitan Online Test</span>
        </div>
      </div>
    </div>
  );
}

export default App;
