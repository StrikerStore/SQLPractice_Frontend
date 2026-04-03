import Link from 'next/link';
import { Database, Terminal, FileCode2, Network, ArrowRight, Code2, BookOpen, Layers, BrainCircuit } from 'lucide-react';
import CursorGlow from '@/components/CursorGlow';
import DotGrid from '@/components/DotGrid';
import MagneticButton from '@/components/MagneticButton';

const TRACKS = [
  {
    icon: Database,
    label: 'SQL',
    title: 'SQL Fundamentals',
    description: '10 structured levels from basic SELECT to window functions and CTEs — on real Retail & HR datasets.',
    meta: '10 Levels · 120 Questions',
    color: 'indigo',
    href: '/workspace',
    available: true,
  },
  {
    icon: Terminal,
    label: 'Python',
    title: 'Python Programming',
    description: 'Core Python from variables and loops to OOP, file I/O, and standard library essentials.',
    meta: 'Coming Soon',
    color: 'emerald',
    href: null,
    available: false,
  },
  {
    icon: FileCode2,
    label: 'JavaScript',
    title: 'JavaScript & DOM',
    description: 'Modern JS from ES6+ fundamentals to async patterns, closures, and browser APIs.',
    meta: 'Coming Soon',
    color: 'amber',
    href: null,
    available: false,
  },
  {
    icon: Network,
    label: 'DSA',
    title: 'Data Structures & Algorithms',
    description: 'Arrays, trees, graphs, sorting, and dynamic programming — built for interview prep.',
    meta: 'Coming Soon',
    color: 'rose',
    href: null,
    available: false,
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; icon: string; badge: string; btn: string }> = {
  indigo: {
    bg:     'bg-indigo-50',
    border: 'border-indigo-200/70',
    icon:   'bg-indigo-100 text-indigo-600',
    badge:  'bg-indigo-100 text-indigo-700 border-indigo-200',
    btn:    'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_4px_18px_rgba(79,70,229,0.4)]',
  },
  emerald: {
    bg:     'bg-emerald-50/60',
    border: 'border-emerald-200/60',
    icon:   'bg-emerald-100 text-emerald-600',
    badge:  'bg-slate-100 text-slate-500 border-slate-200',
    btn:    'bg-slate-200 text-slate-400 cursor-not-allowed',
  },
  amber: {
    bg:     'bg-amber-50/60',
    border: 'border-amber-200/60',
    icon:   'bg-amber-100 text-amber-600',
    badge:  'bg-slate-100 text-slate-500 border-slate-200',
    btn:    'bg-slate-200 text-slate-400 cursor-not-allowed',
  },
  rose: {
    bg:     'bg-rose-50/60',
    border: 'border-rose-200/60',
    icon:   'bg-rose-100 text-rose-600',
    badge:  'bg-slate-100 text-slate-500 border-slate-200',
    btn:    'bg-slate-200 text-slate-400 cursor-not-allowed',
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/20 relative overflow-x-hidden">
      <CursorGlow />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUpIn {
          0%   { opacity: 0; transform: translateY(15px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0);    filter: blur(0px); }
        }
        .fade-up { animation: fadeUpIn 0.6s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.15s; }
        .fade-up-3 { animation-delay: 0.25s; }
        .fade-up-4 { animation-delay: 0.35s; }
      `}} />

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <header className="px-6 py-4 border-b border-slate-200/60 backdrop-blur-md sticky top-0 z-50 bg-white/70">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">LearnMyCode</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="#tracks"  className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Tracks</Link>
            <Link href="#how"     className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">How it Works</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10">

        {/* =========================================
            DESKTOP VIEW
        ========================================= */}
        <div className="hidden md:block w-full">

          {/* Hero */}
          <section className="relative px-6 pt-24 pb-28 overflow-hidden w-full">
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              <DotGrid className="opacity-90" />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-indigo-600 mb-8 hover:shadow-md transition-shadow fade-up fade-up-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
                SQL track is live — more coming soon
              </div>

              <h1 className="text-7xl font-bold tracking-tighter mb-6 leading-[1.12] text-slate-800 fade-up fade-up-2">
                Learn tech skills
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-700">
                  by actually doing.
                </span>
              </h1>

              <p className="text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed font-medium fade-up fade-up-3">
                LearnMyCode is an interactive, curriculum-based practice platform. Pick a track, work through structured levels, and build real understanding — one concept at a time.
              </p>

              <div className="flex flex-row gap-4 fade-up fade-up-4">
                <MagneticButton strength={0.36} radius={120}>
                  <Link
                    href="/workspace"
                    className="group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-semibold transition-colors shadow-[0_4px_18px_0_rgba(79,70,229,0.42)] hover:shadow-[0_6px_24px_rgba(79,70,229,0.30)]"
                  >
                    Start with SQL
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.30} radius={110}>
                  <Link
                    href="#tracks"
                    className="flex items-center justify-center px-8 py-4 rounded-full font-semibold border border-slate-200 bg-white hover:bg-slate-50 hover:border-indigo-200 transition-colors text-slate-600 shadow-sm hover:shadow-md"
                  >
                    Browse Tracks
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </section>

          {/* Learning Tracks */}
          <section id="tracks" className="py-24 px-6 bg-white border-y border-slate-200 w-full">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Learning Tracks</h2>
                <p className="text-slate-500 max-w-lg mx-auto font-medium">
                  Each track is a structured curriculum — not a random question bank. Build foundational knowledge that sticks.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-5">
                {TRACKS.map((track) => {
                  const Icon = track.icon;
                  const c = COLOR_MAP[track.color];
                  return (
                    <div
                      key={track.label}
                      className={`relative flex flex-col border ${c.border} ${c.bg} rounded-3xl p-7 transition-all duration-200 ${track.available ? 'hover:-translate-y-1 hover:shadow-md' : 'opacity-75'}`}
                    >
                      {!track.available && (
                        <div className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-slate-100 border border-slate-200 rounded-full px-2.5 py-0.5">
                          Soon
                        </div>
                      )}
                      <div className={`w-12 h-12 ${c.icon} rounded-2xl flex items-center justify-center mb-5 shadow-inner`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className={`text-xs font-bold tracking-widest uppercase border rounded-full px-2.5 py-0.5 w-fit mb-3 ${c.badge}`}>
                        {track.meta}
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">{track.title}</h3>
                      <p className="text-slate-500 leading-relaxed text-sm font-medium flex-1">{track.description}</p>
                      <div className="mt-6">
                        {track.available ? (
                          <Link
                            href={track.href!}
                            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all group ${c.btn}`}
                          >
                            Open Track
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        ) : (
                          <div className={`flex items-center justify-center w-full py-2.5 rounded-xl font-semibold text-sm ${c.btn}`}>
                            Coming Soon
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how" className="py-24 px-6 w-full">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">How LearnMyCode Works</h2>
                <p className="text-slate-500 max-w-lg mx-auto font-medium">A deliberate loop designed to build lasting understanding, not just pass rates.</p>
              </div>
              <div className="grid grid-cols-3 gap-8">
                {[
                  { icon: Layers,       color: 'bg-indigo-100 text-indigo-600', title: 'Work Through Levels', body: 'Each track is split into curriculum levels. Concepts build on each other — no jumping ahead, no gaps.' },
                  { icon: BrainCircuit, color: 'bg-purple-100 text-purple-600', title: 'Build Your Mental Model', body: 'Stuck? The Build Concept guide reveals your thought process step by step — without giving away the answer.' },
                  { icon: BookOpen,     color: 'bg-emerald-100 text-emerald-600', title: 'Get Instant Feedback', body: 'Your solution is compared against the canonical answer on real data. Pass/fail is instant and deterministic.' },
                ].map(({ icon: Icon, color, title, body }) => (
                  <div key={title} className="text-center">
                    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* =========================================
            MOBILE VIEW
        ========================================= */}
        <div className="block md:hidden w-full pb-12">

          {/* Mobile Hero */}
          <section className="px-5 pt-12 pb-10 relative w-full overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-[11px] font-semibold text-indigo-600 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              SQL track live • more coming soon
            </div>

            <h1 className="text-5xl font-bold tracking-tighter mb-5 leading-[1.05] text-slate-800">
              Learn by <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-500">
                actually doing.
              </span>
            </h1>
            <p className="text-base text-slate-500 mb-8 leading-relaxed font-medium pr-4">
              Curriculum-based learning tracks for tech skills — practice in your browser with real data and instant feedback.
            </p>

            <div className="flex flex-col gap-3 w-full relative z-20">
              <Link
                href="/workspace"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 active:bg-indigo-700 text-white py-4 rounded-2xl font-semibold shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]"
              >
                Start SQL Track
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#mobile-tracks"
                className="w-full flex items-center justify-center py-4 rounded-2xl font-semibold border border-slate-200 bg-white active:bg-slate-50 text-slate-600 shadow-[0_2px_8px_0_rgba(0,0,0,0.03)]"
              >
                Browse Tracks
              </Link>
            </div>
          </section>

          {/* Mobile Track Cards */}
          <section id="mobile-tracks" className="w-full pt-10 pb-6 bg-slate-100/50 border-t border-slate-200">
            <div className="px-5 mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Learning Tracks</h2>
              <p className="text-sm text-slate-500 font-medium">Swipe to explore &rarr;</p>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-5 pb-6 hide-scrollbar cursor-grab active:cursor-grabbing w-full">
              {TRACKS.map((track) => {
                const Icon = track.icon;
                const c = COLOR_MAP[track.color];
                return (
                  <div key={track.label} className={`snap-center shrink-0 w-[80vw] bg-white border ${c.border} p-6 rounded-[2rem] shadow-sm flex flex-col ${!track.available ? 'opacity-75' : ''}`}>
                    <div className={`w-12 h-12 ${c.icon} rounded-2xl flex items-center justify-center mb-4 shadow-inner`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className={`text-[10px] font-bold tracking-widest uppercase border rounded-full px-2 py-0.5 w-fit mb-3 ${c.badge}`}>
                      {track.meta}
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-2 tracking-tight">{track.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm font-medium flex-1">{track.description}</p>
                    {track.available && (
                      <Link href={track.href!} className="mt-4 flex items-center gap-1.5 text-indigo-600 font-semibold text-sm">
                        Open Track <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>

      <footer className="px-6 py-12 bg-white border-t border-slate-200 text-center text-slate-500 text-sm relative z-10 font-medium">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-slate-700">LearnMyCode</span>
        </div>
        <p>&copy; {new Date().getFullYear()} LearnMyCode. Built for people who learn by doing.</p>
      </footer>
    </div>
  );
}
