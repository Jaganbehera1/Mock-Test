import { GraduationCap, BookOpen, Shield, ArrowRight, Clock, Award, Users, FileText, CheckCircle2, PhoneCall, MessageCircle } from "lucide-react";

const CONTACT_NUMBER = "7978966065";
const whatsappMessage = encodeURIComponent("I want to develop one application please contact me");

export function LandingPage({
  onStudent,
  onAdmin,
}: {
  onStudent: () => void;
  onAdmin: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-20 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
              <GraduationCap className="w-11 h-11 text-white" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-3">
            JITAN ONLINE TEST
          </h1>
          <p className="text-blue-200 text-base sm:text-xl font-medium mb-2">
            FOR CLASS 10TH &middot; 2026–2027 Session
          </p>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            A professional online examination platform for schools — take mock tests,
            track student performance, and manage question banks with ease.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <button
              onClick={onStudent}
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-base shadow-lg hover:bg-blue-500 hover:shadow-blue-500/30 transition-all active:scale-95"
            >
              <BookOpen className="w-5 h-5" />
              Take a Test
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onAdmin}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-all active:scale-95"
            >
              <Shield className="w-5 h-5" />
              Admin Panel
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            icon={<FileText className="w-6 h-6" />}
            title="Question Bank"
            description="Teachers create tests with custom questions, options, and correct answers."
          />
          <FeatureCard
            icon={<Clock className="w-6 h-6" />}
            title="Timed Tests"
            description="Each test has its own timer. Auto-submits when time runs out."
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Student Tracking"
            description="Students register with name, roll number, and school before testing."
          />
          <FeatureCard
            icon={<Award className="w-6 h-6" />}
            title="Instant Results"
            description="Scores, grades, and full answer review immediately after submission."
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Step
              number="1"
              title="Register"
              description="Students enter their name, roll number, and school name."
            />
            <Step
              number="2"
              title="Take the Test"
              description="Choose a test, answer multiple-choice questions within the time limit."
            />
            <Step
              number="3"
              title="Get Results"
              description="See the score, grade, and review correct answers instantly."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-sm text-slate-400">Question Prepared By: ASTARANG HIGH SCHOOL, ASTARANG</span>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 Jitan Online Test Platform · Developed by{" "}
            <a
              href="https://jaganwebsolutions.netlify.app"
              target="_blank"
              rel="noreferrer"
              className="text-blue-300 hover:text-white transition-colors"
            >
              Jagan Web Solutions
            </a>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <a
              href={`tel:+91${CONTACT_NUMBER}`}
              aria-label="Call Jagan Web Solutions"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              Call {CONTACT_NUMBER}
            </a>
            <a
              href={`https://wa.me/91${CONTACT_NUMBER}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Contact Jagan Web Solutions on WhatsApp"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-sm font-semibold text-white hover:bg-green-500 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 hover:bg-white/10 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-300 mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-white text-sm mb-2">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
        {number}
      </div>
      <h3 className="font-bold text-white text-sm mb-2">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
