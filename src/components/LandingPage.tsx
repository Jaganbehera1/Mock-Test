import React from "react";
import { BookOpen, Shield, ArrowRight, Clock, Award, Users, FileText, CheckCircle2, PhoneCall, MessageCircle, BarChart3, Trophy, Zap } from "lucide-react";
import logo from "@/images/JJLogo.jpeg";
import heroLogo from "@/images/hbuac.jpg";
import awardsImage from "@/images/awards.png";
import a1Image from "@/images/A1.png";
import testImage from "@/images/test.png";
import f1Image from "@/images/f1.png";
import footerAnimation from "@/images/footer-animation.png";
import climbingStudent from "@/images/boy-Climbing.png";
import readingStudent from "@/images/girl-reading.png";
import heroVideo from "@/images/videoplayback.webm";
import jaganLogo from "@/images/jaganlogo.jpg";

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 text-gray-800 overflow-x-hidden">
      {/* Top Indian Flag Banner */}
      <div className="h-1.5 w-full flex sticky top-0 z-50">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-1.5 z-40 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Jitan logo" className="w-10 h-10 rounded-xl object-cover shadow-md" />
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#FF9933] via-[#138808] to-[#FF9933] bg-clip-text text-transparent">
                JITAN
              </span>
              <span className="text-xl font-bold text-gray-800">'S Online Test</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onStudent}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF9933] text-white font-semibold text-sm hover:bg-[#e68a00] transition-all shadow-md shadow-orange-200"
            >
              <BookOpen className="w-4 h-4" />
              Take Test
            </button>
            <button
              onClick={onAdmin}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#138808] text-white font-semibold text-sm hover:bg-[#0f6d06] transition-all shadow-md shadow-green-200"
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION - BLACK BACKGROUND (THREE COLUMN) ===== */}
      <div className="relative overflow-hidden bg-black">
      {/* <div className="relative overflow-hidden bg-[#000080]"> */}
        {/* Tricolor glow effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF9933]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#138808]/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]"></div>
        </div>

        {/* Ashoka Chakra decorative element */}
        <div className="pointer-events-none absolute right-10 top-20 opacity-[0.02] hidden lg:block">
          <div className="w-80 h-80 rounded-full border-4 border-[#000080] flex items-center justify-center">
            <div className="w-60 h-60 rounded-full border-4 border-[#000080] flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border-4 border-[#000080] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#000080]" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:py-20 lg:py-24">
          {/* Main Heading */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              <span className="text-[#FF9933]">MISSION - </span>
              <span className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent">
                A1 For 10th
              </span>
              <br />
              <span className="text-white">Odisha Board Exam</span>
            </h1>
          </div>

          {/* Badges */}
          <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF9933]/15 text-[#FF9933] text-xs font-bold border border-[#FF9933]/30 backdrop-blur-sm">
              🇮🇳 Made in India
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#138808]/15 text-[#138808] text-xs font-bold border border-[#138808]/30 backdrop-blur-sm">
              Target All Pass
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-400/15 text-sky-300 text-xs font-bold border border-sky-400/30 backdrop-blur-sm">
              🎯 BSE, Odisha
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-400/15 text-red-300 text-xs font-bold border border-red-400/30 backdrop-blur-sm">
              100% Data Secure
            </span>
          </div>

          {/* Logo Grid - LARGER IMAGES */}
          <div className="grid items-center gap-6 lg:gap-10 lg:grid-cols-[1.2fr_auto_1.2fr] mb-12">
            {/* Left Logo - LARGER */}
            <div className="flex justify-center lg:justify-end order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-[#FF9933]/20 blur-3xl scale-90"></div>
                <div className="relative rounded-3xl bg-black p-3 shadow-2xl border-2 border-[#FF9933]/30">
                  <img
                    src={heroLogo}
                    alt="JITAN Online Test Platform"
                    className="landing-float h-auto max-h-[420px] w-auto max-w-[320px] rounded-2xl object-contain sm:max-h-[500px] sm:max-w-[380px] lg:max-h-[580px] lg:max-w-[440px]"
                  />
                </div>
              </div>
            </div>

            {/* Center Content */}
            <div className="text-center order-1 lg:order-2">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                <span className="text-[#FF9933]">JITAN'S</span>
                <br />
                <span className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent">
                  Online Test
                </span>
              </h1>

              {/* Tricolor divider */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="h-1.5 w-12 bg-[#FF9933] rounded-full"></span>
                <span className="h-1.5 w-12 bg-white rounded-full"></span>
                <span className="h-1.5 w-12 bg-[#138808] rounded-full"></span>
              </div>

              <p className="text-[#FF9933] text-lg sm:text-xl font-bold mb-2">
                For Class 10th · 2026–2027 Session
              </p>
              <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                A professional online examination platform for schools — take mock tests,
                track student performance, and manage question banks with ease.
              </p>
            </div>

            {/* Right Logo - LARGER */}
            <div className="flex justify-center lg:justify-start order-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-[#138808]/20 blur-3xl scale-90"></div>
                <div className="relative rounded-3xl bg-black p-3 shadow-2xl border-2 border-[#138808]/30">
                  <img
                    src={jaganLogo}
                    alt="Jagan's Online Test"
                    className="landing-float-delay h-auto max-h-[420px] w-auto max-w-[320px] rounded-2xl object-contain sm:max-h-[500px] sm:max-w-[380px] lg:max-h-[580px] lg:max-w-[440px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto mb-10">
            <button
              onClick={onStudent}
              className="group flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#FF9933] to-[#FF8C00] text-white font-bold text-lg shadow-2xl shadow-[#FF9933]/40 hover:shadow-[#FF9933]/60 hover:scale-105 transition-all active:scale-95"
            >
              <BookOpen className="w-6 h-6" />
              Take a Test
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onAdmin}
              className="flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-[#138808] to-[#0d6605] text-white font-bold text-lg shadow-2xl shadow-[#138808]/40 hover:shadow-[#138808]/60 hover:scale-105 transition-all active:scale-95"
            >
              <Shield className="w-6 h-6" />
              Admin Panel
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#138808]" />
              Secure Platform
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#138808]" />
              Instant Results
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#138808]" />
              Free for Schools
            </span>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="overflow-hidden bg-black py-3 sm:py-4 border-y border-orange-100">
        <div className="landing-video-marquee whitespace-nowrap text-center text-base font-bold uppercase tracking-[0.16em] text-white drop-shadow-sm sm:text-xl lg:text-2xl">
          JITAN'S ONLINE TEST FOR ODISHA 10th BOARD EXAM
          <br />
          For website development contact - 7978966065
        </div>
      </div>
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          aria-label="JITAN educational background video"
        >
          <source src={heroVideo} type="video/webm" />
        </video>
      </div>

      {/* ===== FEATURES SECTION - PATRIOTIC BACKGROUND ===== */}
      <div className="py-20 relative bg-gradient-to-br from-orange-400 via-white to-green-400 border-t border-orange-100">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF9933]/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#138808]/30 to-transparent"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF9933]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#138808]/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid items-center gap-8 mb-12 lg:grid-cols-[minmax(180px,0.8fr)_minmax(0,1.4fr)_minmax(180px,0.8fr)] lg:gap-10 xl:gap-14">
            <div className="flex justify-center">
              <img
                src={awardsImage}
                alt="A1 achievement award"
                className="landing-award-rotate h-64 w-auto max-w-full object-contain drop-shadow-xl sm:h-80"
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF9933]">Learn. Practice. Achieve.</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-3">
                Built to help every student move forward
              </h2>
              <p className="text-gray-600 max-w-2xl leading-relaxed mx-auto">
                Practice with focused mock tests, understand your progress, and build confidence for every exam.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src={a1Image}
                alt="A1 achievement award"
                className="landing-award-rotate h-full w-auto max-w-full object-contain drop-shadow-xl sm:h-80"
              />
            </div>
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
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

      {/* ===== HOW IT WORKS - PATRIOTIC BACKGROUND ===== */}
      <div className="py-20 relative bg-gradient-to-br from-green-400 via-white to-orange-400 border-t border-green-100">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF9933]/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#138808]/30 to-transparent"></div>
          <div className="absolute inset-0 opacity-[0.03]">
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
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              How It <span className="text-[#138808]">Works</span>
            </h2>
            <p className="text-gray-600">Three simple steps to start your online test</p>
          </div>
          <div className="grid items-center gap-8 md:grid-cols-[180px_minmax(0,1fr)_180px] lg:grid-cols-[220px_minmax(0,1fr)_220px] lg:gap-12">
            <div className="flex justify-center">
              <img src={climbingStudent} alt="Student reaching a goal" className="landing-float h-64 w-full max-w-[180px] object-contain sm:h-80 sm:max-w-[210px] lg:h-96 lg:max-w-[220px]" />
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
            <div className="flex justify-center">
              <img src={readingStudent} alt="Student studying for an exam" className="landing-float-delay h-56 w-full max-w-[170px] object-contain sm:h-72 sm:max-w-[200px] lg:h-80 lg:max-w-[210px]" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS SECTION - PATRIOTIC BACKGROUND ===== */}
      <div className="py-20 relative bg-gradient-to-br from-orange-400 via-white to-green-400 border-t border-orange-100">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF9933]/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#138808]/30 to-transparent"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-2xl bg-white border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-[#FF9933]" />
              </div>
              <div className="text-3xl font-bold text-gray-800">500+</div>
              <div className="text-sm text-gray-600">Tests Created</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white border border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-[#138808]" />
              </div>
              <div className="text-3xl font-bold text-gray-800">10K+</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white border border-sky-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-sky-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800">98%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER - PATRIOTIC BACKGROUND ===== */}
      <div className="bg-gradient-to-br from-green-400 via-white to-orange-400 border-t-2 border-[#FF9933]/30 py-8 relative">
        <div className="max-w-6xl mx-auto px-4 text-center relative">
          <div className="grid items-center gap-6 lg:grid-cols-[180px_minmax(0,1fr)_180px] lg:gap-10">
            <div className="flex justify-center">
              <img src={f1Image} alt="Student taking an online test" className="landing-float-soft mx-auto mb-5 h-full w-auto max-w-full object-contain sm:h-full md:h-full" />
            </div>
            <div>
              <img
                src={footerAnimation}
                alt="Student ready to learn"
                className="landing-float-soft mx-auto mb-5 h-56 w-auto max-w-full object-contain sm:h-72 md:h-80"
              />
              <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              🇮🇳
            </div>
            <span className="text-sm text-gray-700 font-medium">Proudly Indian · Made for Indian Education</span>
              </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700 mb-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#138808]" />
              Question Prepared By: ASTARANG HIGH SCHOOL, ASTARANG
            </span>
          </div>
          
          <p className="text-xs text-gray-500 mb-4">
            © 2026 Jitan's Online Test Platform · Developed by{" "}
            <a
              href="https://jaganwebsolutions.netlify.app"
              target="_blank"
              rel="noreferrer"
              className="text-[#FF9933] hover:text-[#e68a00] transition-colors font-medium"
            >
              Jagan Web Solutions
            </a>
          </p>
          
              <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`tel:+91${CONTACT_NUMBER}`}
              aria-label="Call Jagan Web Solutions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-orange-200 text-sm font-semibold text-[#FF9933] hover:bg-orange-50 transition-colors shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              Call {CONTACT_NUMBER}
            </a>
            <a
              href={`https://wa.me/91${CONTACT_NUMBER}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Contact Jagan Web Solutions on WhatsApp"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-green-200 text-sm font-semibold text-[#25D366] hover:bg-green-50 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
              </div>
            </div>
            <div className="flex justify-center">
              <img src={testImage} alt="Student pointing toward success" className="landing-float-soft mx-auto mb-5 h-56 w-auto max-w-full object-contain sm:h-72 md:h-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tricolor Bar */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
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
    orange: "from-orange-50 to-white border-orange-200 text-[#FF9933]",
    green: "from-green-50 to-white border-green-200 text-[#138808]",
    blue: "from-sky-50 to-white border-sky-200 text-sky-600",
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
          boxShadow: `0 8px 25px ${color}40`
        }}
      >
        {number}
      </div>
      <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">{description}</p>
    </div>
  );
}