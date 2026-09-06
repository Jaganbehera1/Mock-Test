import React from "react";
import { GraduationCap, BookOpen, Shield, ArrowRight, Clock, Award, Users, FileText, CheckCircle2, PhoneCall, MessageCircle, Sparkles, BarChart3, Trophy, Zap } from "lucide-react";
import logo from "@/images/JJLogo.jpeg";

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
    <div className="min-h-screen bg-white">
      {/* Top Indian Flag Banner */}
      <div className="h-1.5 w-full flex sticky top-0 z-50">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-1.5 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Jitan logo" className="w-10 h-10 rounded-xl object-cover shadow-md" />
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#FF9933] via-[#138808] to-[#FF9933] bg-clip-text text-transparent">
                JITAN
              </span>
              <span className="text-xl font-bold text-gray-800"> Online Test</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onStudent}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF9933] text-white font-semibold text-sm hover:bg-[#e68a00] transition-all shadow-md hover:shadow-lg"
            >
              <BookOpen className="w-4 h-4" />
              Take Test
            </button>
            <button
              onClick={onAdmin}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#138808] text-white font-semibold text-sm hover:bg-[#0f6d06] transition-all shadow-md hover:shadow-lg"
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Light Patriotic Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-green-50">
        {/* Decorative circles in light tricolor */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF9933]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#138808]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#FF9933]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-10 w-48 h-48 bg-[#138808]/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/3 left-10 w-48 h-48 bg-[#FF9933]/5 rounded-full blur-2xl"></div>
        </div>

        {/* Light Ashoka Chakra-inspired decoration */}
        <div className="absolute right-10 top-20 opacity-5 hidden lg:block">
          <div className="w-64 h-64 rounded-full border-4 border-[#000080]/20 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-4 border-[#000080]/20 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-[#000080]/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#000080]/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="px-4 py-1.5 rounded-full bg-[#FF9933]/10 text-[#FF9933] text-xs font-semibold border border-[#FF9933]/20">
              🇮🇳 Made in India
            </span>
            <span className="px-4 py-1.5 rounded-full bg-[#138808]/10 text-[#138808] text-xs font-semibold border border-[#138808]/20">
              For Indian Students
            </span>
            <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-200">
              🎯 CBSE Pattern
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
            <span className="text-[#FF9933]">JITAN</span>
            <span className="text-gray-800"> Online</span>
            <br />
            <span className="bg-gradient-to-r from-[#FF9933] via-[#138808] to-[#FF9933] bg-clip-text text-transparent">
              Test Platform
            </span>
          </h1>
          
          <p className="text-[#FF9933] text-base sm:text-lg font-semibold mb-2">
            For Class 10th &middot; 2026–2027 Session
          </p>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            A professional online examination platform for schools — take mock tests,
            track student performance, and manage question banks with ease.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <button
              onClick={onStudent}
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF9933] to-[#FF8C00] text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              <BookOpen className="w-5 h-5" />
              Take a Test
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onAdmin}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#138808] to-[#0d6605] text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              <Shield className="w-5 h-5" />
              Admin Panel
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#138808]" />
              Secure Platform
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#138808]" />
              Instant Results
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#138808]" />
              Free for Schools
            </span>
          </div>
        </div>
      </div>

      {/* Features Grid - Light Theme */}
      <div className="py-20 relative bg-white">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF9933]/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#138808]/20 to-transparent"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Choose <span className="text-[#FF9933]">JITAN</span> Online Test?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need for a seamless online examination experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="Question Bank"
              description="Teachers create tests with custom questions, options, and correct answers."
              color="orange"
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Timed Tests"
              description="Each test has its own timer. Auto-submits when time runs out."
              color="green"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Student Tracking"
              description="Students register with name, roll number, and school before testing."
              color="blue"
            />
            <FeatureCard
              icon={<Award className="w-6 h-6" />}
              title="Instant Results"
              description="Scores, grades, and full answer review immediately after submission."
              color="orange"
            />
          </div>
        </div>
      </div>

      {/* How It Works - Light Tricolor Background */}
      <div className="py-20 relative bg-gradient-to-br from-orange-50/50 via-white to-green-50/50">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF9933]/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#138808]/20 to-transparent"></div>
          {/* Light Ashoka Chakra dots pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-[#000080]"></div>
            <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-[#000080]"></div>
            <div className="absolute bottom-10 left-20 w-2 h-2 rounded-full bg-[#000080]"></div>
            <div className="absolute bottom-20 right-10 w-2 h-2 rounded-full bg-[#000080]"></div>
            <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-[#000080]"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-[#000080]"></div>
          </div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              How It <span className="text-[#138808]">Works</span>
            </h2>
            <p className="text-gray-600">Three simple steps to start your online test</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Step
              number="1"
              title="Register"
              description="Students enter their name, roll number, and school name."
              color="#FF9933"
            />
            <Step
              number="2"
              title="Take the Test"
              description="Choose a test, answer multiple-choice questions within the time limit."
              color="#138808"
            />
            <Step
              number="3"
              title="Get Results"
              description="See the score, grade, and review correct answers instantly."
              color="#FF9933"
            />
          </div>
        </div>
      </div>

      {/* Stats Section - Light Cards */}
      <div className="py-20 relative bg-white">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF9933]/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#138808]/20 to-transparent"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/30 border border-orange-200/30 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#FF9933]/10 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-[#FF9933]" />
              </div>
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Tests Created</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/30 border border-green-200/30 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#138808]/10 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-[#138808]" />
              </div>
              <div className="text-3xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-200/30 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/30 border border-purple-200/30 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Light Indian Theme */}
      <div className="bg-gray-50 border-t-2 border-[#FF9933]/30 py-8 relative">
        <div className="max-w-6xl mx-auto px-4 text-center relative">
          {/* Indian Flag Footer */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              🇮🇳
            </div>
            <span className="text-sm text-gray-600 font-medium">Proudly Indian · Made for Indian Education</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#138808]" />
              Question Prepared By: ASTARANG HIGH SCHOOL, ASTARANG
            </span>
          </div>
          
          <p className="text-xs text-gray-400 mb-4">
            © 2026 Jitan Online Test Platform · Developed by{" "}
            <a
              href="https://jaganwebsolutions.netlify.app"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              Jagan Web Solutions
            </a>
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`tel:+91${CONTACT_NUMBER}`}
              aria-label="Call Jagan Web Solutions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF9933]/10 border border-[#FF9933]/20 text-sm font-semibold text-[#FF9933] hover:bg-[#FF9933]/20 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              Call {CONTACT_NUMBER}
            </a>
            <a
              href={`https://wa.me/91${CONTACT_NUMBER}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Contact Jagan Web Solutions on WhatsApp"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-sm font-semibold text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
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
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorStyles = {
    orange: "from-[#FF9933]/5 to-orange-50/80 border-[#FF9933]/20 text-[#FF9933]",
    green: "from-[#138808]/5 to-green-50/80 border-[#138808]/20 text-[#138808]",
    blue: "from-blue-50/50 to-blue-100/30 border-blue-200/30 text-blue-600",
  };

  return (
    <div className={`bg-gradient-to-br ${colorStyles[color as keyof typeof colorStyles]} rounded-2xl border p-6 hover:shadow-lg transition-all hover:-translate-y-1`}>
      <div className={`w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center mb-4`}>
        <div className="text-current">{icon}</div>
      </div>
      <h3 className="font-bold text-gray-800 text-base mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
  color,
}: {
  number: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="text-center group">
      <div 
        className="w-16 h-16 rounded-full text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-transform group-hover:scale-110"
        style={{ 
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          boxShadow: `0 8px 25px ${color}30`
        }}
      >
        {number}
      </div>
      <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">{description}</p>
    </div>
  );
}