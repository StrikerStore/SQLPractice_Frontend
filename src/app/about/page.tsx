import Link from "next/link";
import { Code2, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = { title: "About — LearnMyCode" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans relative overflow-x-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-0 pointer-events-none" style={{ zIndex: 0, width: "700px", height: "700px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(96,177,255,0.32) 0%, transparent 68%)", filter: "blur(90px)", transform: "translate(-28%, -22%)" }} />
      <div className="absolute pointer-events-none" style={{ zIndex: 0, top: "4%", left: "6%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(49,154,255,0.15) 0%, transparent 70%)", filter: "blur(72px)" }} />

      {/* Navbar */}
      <header className="sticky top-0 z-50 flex justify-center px-4 pt-[30px] pb-0 pointer-events-none">
        <nav className="pointer-events-auto hidden md:flex items-center gap-1 px-2 py-2" style={{ backdropFilter: "blur(50px)", WebkitBackdropFilter: "blur(50px)", background: "rgba(255,255,255,0.3)", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.1)", boxShadow: "inset 0px 4px 4px 0px rgba(255,255,255,0.25)" }}>
          <div className="flex items-center gap-2 px-3 py-1.5 mr-2">
            <div className="bg-[#0084FF] p-1.5 rounded-lg shadow-sm"><Code2 className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-[15px] text-slate-800 tracking-tight" style={{ fontFamily: "var(--font-fustat)" }}>LearnMyCode</span>
          </div>
          <Link href="/#tracks" className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-[10px] hover:bg-white/50">Tracks</Link>
          <Link href="/#how"    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-[10px] hover:bg-white/50">How it Works</Link>
          <Link href="/login"   className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-[10px] hover:bg-white/50">Sign In</Link>
          <Link href="/signup" className="ml-2 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]" style={{ background: "rgba(0,132,255,0.85)", backdropFilter: "blur(2px)", borderRadius: "12px", boxShadow: "inset 0px 4px 4px 0px rgba(255,255,255,0.35)" }}>
            Sign Up Free
          </Link>
        </nav>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-10" style={{ fontFamily: "var(--font-inter)" }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-slate-900 mb-3" style={{ fontFamily: "var(--font-fustat)", fontWeight: 800, fontSize: "48px", letterSpacing: "-2px", lineHeight: 1.05 }}>About</h1>
          <p className="text-slate-500 text-lg" style={{ fontFamily: "var(--font-inter)" }}>What LearnMyCode is, and why we built it.</p>
        </div>

        {/* Content card */}
        <div className="rounded-[24px] p-8 space-y-8" style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.85)", boxShadow: "inset 0px 1px 2px rgba(255,255,255,0.95), 0 4px 28px rgba(0,100,255,0.07)" }}>

          <Section title="Our Mission">
            LearnMyCode is an interactive, curriculum-based practice platform built for developers who want to actually understand what they&apos;re doing — not just copy-paste answers. We believe the best way to learn a technical skill is to use it on real problems, with real data, and get immediate, honest feedback.
          </Section>

          <Section title="How It Works">
            Every track on LearnMyCode is a structured curriculum split into progressive levels. Each level introduces a new concept and challenges you to apply it before moving on. There&apos;s no skipping ahead and no random question banks — just a deliberate, well-sequenced path from beginner to confident practitioner.
          </Section>

          <Section title="What We're Building">
            We launched with SQL as our first track — 10 levels, 120 questions, on real retail and HR datasets. Python, JavaScript, TypeScript, React, and Data Structures &amp; Algorithms are actively in development. Our goal is to be the most structured and honest way to learn core engineering skills online.
          </Section>

          <Section title="Who's Behind This">
            LearnMyCode is built by a small team of developers who got tired of tutorial hell. We&apos;ve felt the frustration of watching hours of video content and still not being able to write a working query from scratch. This platform exists because we wanted it to exist.
          </Section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-slate-800 mb-3" style={{ fontFamily: "var(--font-fustat)", fontWeight: 700, fontSize: "20px", letterSpacing: "-0.3px" }}>{title}</h2>
      <p className="text-slate-500 leading-relaxed" style={{ fontFamily: "var(--font-inter)", fontSize: "15px" }}>{children}</p>
    </div>
  );
}
