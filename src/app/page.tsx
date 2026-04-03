import Link from 'next/link';
import { Database, TrendingUp, BrainCircuit, ArrowRight, Code2 } from 'lucide-react';
import CursorGlow from '@/components/CursorGlow';
import DotGrid from '@/components/DotGrid';
import MagneticButton from '@/components/MagneticButton';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/20 relative overflow-x-hidden">
      {/* Background Effect & Mouse Tracking */}
      <CursorGlow />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUpIn {
          0% { opacity: 0; transform: translateY(15px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        @keyframes blurReveal {
          0% { opacity: 0; filter: blur(10px); transform: scale(0.98); }
          100% { opacity: 1; filter: blur(0px); transform: scale(1); }
        }
        @keyframes shimmerSlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />

      {/* Navbar Minimal - Light Mode */}
      <header className="px-6 py-4 border-b border-slate-200/60 backdrop-blur-md sticky top-0 z-50 bg-white/70">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">LearnMyCode – SQL</span>
          </div>
          <nav className="flex gap-6 items-center">
            <Link href="#features" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">How it Works</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* =========================================
            DESKTOP VIEW (hidden on mobile)
        ========================================= */}
        <div className="hidden md:block w-full">
          {/* Hero Section */}
          <section className="relative px-6 pt-24 pb-32 overflow-hidden w-full">
            {/* Dot grid — interactive canvas background (desktop only) */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              <DotGrid className="opacity-90" />
            </div>
            {/* Subtle radial tint over grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_50%)] pointer-events-none" />
            
            <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-indigo-600 mb-8 hover:shadow-md transition-shadow">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                v1.0 is live
              </div>
              
              <h1 className="text-7xl font-bold tracking-tighter mb-6 leading-[1.15] text-slate-800 relative z-10">
                Master SQL with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700">
                  Adaptive Intelligence
                </span>
              </h1>
              
              <p className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed font-medium">
                Practice queries on real Retail and HR datasets across 10 structured levels — from basic SELECT to window functions. Step-by-step thinking guides help you build the right mental model before you write a line of SQL.
              </p>
              
              <div className="flex flex-row gap-4 w-auto">
                <MagneticButton strength={0.36} radius={120}>
                  <Link
                    href="/workspace"
                    className="group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-semibold transition-colors shadow-[0_4px_18px_0_rgba(79,70,229,0.42)] hover:shadow-[0_6px_24px_rgba(79,70,229,0.30)]"
                  >
                    Start Practice Session
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.30} radius={110}>
                  <Link
                    href="#features"
                    className="flex items-center justify-center px-8 py-4 rounded-full font-semibold border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-200 transition-colors text-slate-600 shadow-sm hover:shadow-md"
                  >
                    Explore Features
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features" className="py-24 px-6 bg-white border-y border-slate-200 relative overflow-hidden w-full">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Built for Serious Learners</h2>
                <p className="text-slate-500 max-w-xl mx-auto font-medium">Stop writing queries in a void. Get deterministic feedback and performance analysis.</p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl hover:bg-slate-100/50 hover:shadow-sm transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200/60 shadow-inner">
                    <Database className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">Real Datasets</h3>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">
                    Practice with fully populated Retail and HR schemas — 6 tables each, 3 500+ rows, real foreign key relationships, and indexed columns.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl hover:bg-slate-100/50 hover:shadow-sm transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 border border-emerald-200/60 shadow-inner">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">Adaptive Difficulty</h3>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">
                    10 curriculum levels from Basic SELECT to Advanced Window Functions and CTEs. Questions are sorted by concept so you build skill progressively.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl hover:bg-slate-100/50 hover:shadow-sm transition-all hover:-translate-y-1">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 border border-purple-200/60 shadow-inner">
                    <BrainCircuit className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">Build Concept Guide</h3>
                  <p className="text-slate-600 leading-relaxed text-sm font-medium">
                    Stuck? Load a step-by-step thinking guide instead of looking up the answer. Each guide walks you through how to reason about the query — one reveal at a time.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* =========================================
            MOBILE VIEW (hidden on desktop)
        ========================================= */}
        <div className="block md:hidden w-full pb-10">
          {/* Mobile Hero */}
          <section className="px-5 pt-12 pb-14 relative w-full overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-[11px] font-semibold text-indigo-600 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v1.0 live
            </div>

            <h1 className="text-5xl font-bold tracking-tighter mb-5 leading-[1.05] text-slate-800">
              Master SQL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-indigo-500">
                step by step.
              </span>
            </h1>
            
            <p className="text-base text-slate-500 mb-8 leading-relaxed font-medium pr-4">
              Practice queries in sandboxed datasets across 10 structured levels — from basic SELECT to window functions.
            </p>

            <div className="flex flex-col gap-3 w-full relative z-20">
              <Link 
                href="/workspace" 
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 active:bg-indigo-700 text-white py-4 rounded-2xl font-semibold shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]"
              >
                Start Practice 
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="#mobile-features" 
                className="w-full flex items-center justify-center py-4 rounded-2xl font-semibold border border-slate-200 bg-white active:bg-slate-50 text-slate-600 shadow-[0_2px_8px_0_rgba(0,0,0,0.03)]"
              >
                Features
              </Link>
            </div>
          </section>

          {/* Mobile Horizontal Snap Features */}
          <section id="mobile-features" className="w-full pt-10 pb-6 bg-slate-100/50 border-t border-slate-200">
            <div className="px-5 mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Serious Analytics</h2>
              <p className="text-sm text-slate-500 font-medium">Swipe to explore platform features &rarr;</p>
            </div>

            {/* Carousel Container */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-5 pb-6 hide-scrollbar cursor-grab active:cursor-grabbing w-full">
              
              <div className="snap-center shrink-0 w-[85vw] bg-white border border-slate-200/80 p-6 rounded-[2rem] shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                  <Database className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">Real Datasets</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                  Practice with fully populated schemas across diverse domains like Retail, HR, and Aviation.
                </p>
              </div>

              <div className="snap-center shrink-0 w-[85vw] bg-white border border-slate-200/80 p-6 rounded-[2rem] shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">Adaptive Difficulty</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                  Models Computerized Adaptive Testing. Ace a question and face harder ones; stumble and we'll ease the curve.
                </p>
              </div>

              <div className="snap-center shrink-0 w-[85vw] bg-white border border-slate-200/80 p-6 rounded-[2rem] shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                  <BrainCircuit className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">Build Concept Guide</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                  Stuck? Reveal step-by-step hints instead of copying an answer. Build the mental model that makes the next question easy.
                </p>
              </div>

            </div>
          </section>
        </div>
      </main>

      <footer className="px-6 py-12 bg-slate-50 text-center text-slate-500 text-sm relative z-10 font-medium">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-600">Anonymous Practice Engine</span>
        </div>
        <p>&copy; {new Date().getFullYear()} LearnMyCode – SQL. Built for the serious learner.</p>
      </footer>
    </div>
  );
}
