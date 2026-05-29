import Link from 'next/link';
import { Database, Terminal, FileCode2, Network, ArrowRight, Code2, BookOpen, Layers, BrainCircuit } from 'lucide-react';
import Footer from '@/components/Footer';
import HeroCard from '@/components/HeroCard';
import MarqueeScroller from '@/components/MarqueeScroller';

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
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/20 relative overflow-x-hidden">

      {/* ── Page-level glow blobs — sit behind navbar + hero seamlessly ── */}
      <div className="absolute top-0 left-0 pointer-events-none" style={{ zIndex: 0, width: '820px', height: '820px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(96,177,255,0.36) 0%, transparent 68%)', filter: 'blur(90px)', transform: 'translate(-28%, -22%)' }} />
      <div className="absolute pointer-events-none" style={{ zIndex: 0, top: '4%', left: '6%', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(49,154,255,0.18) 0%, transparent 70%)', filter: 'blur(72px)' }} />

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
      <header className="sticky top-0 z-50 flex justify-center px-4 pt-[30px] pb-0 pointer-events-none">
        <nav
          className="pointer-events-auto hidden md:flex items-center gap-1 px-2 py-2"
          style={{
            backdropFilter: 'blur(50px)',
            WebkitBackdropFilter: 'blur(50px)',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.25)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 py-1.5 mr-2">
            <div className="bg-[#0084FF] p-1.5 rounded-lg shadow-sm">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span
              className="font-bold text-[15px] text-slate-800 tracking-tight"
              style={{ fontFamily: 'var(--font-fustat)' }}
            >
              LearnMyCode
            </span>
          </div>

          {/* Nav links */}
          <Link href="#tracks" className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-[10px] hover:bg-white/50">Tracks</Link>
          <Link href="#how"    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-[10px] hover:bg-white/50">How it Works</Link>
          <Link href="/login"  className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-[10px] hover:bg-white/50">Sign In</Link>

          {/* Sign Up CTA */}
          <Link
            href="/signup"
            className="ml-2 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{
              background: 'rgba(0,132,255,0.85)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
              borderRadius: '12px',
              boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.35)',
            }}
          >
            Sign Up Free
            <span className="flex items-center justify-center w-5 h-5 bg-white rounded-full">
              <ArrowRight className="w-3 h-3 text-[#0084FF]" />
            </span>
          </Link>
        </nav>

        {/* Mobile nav placeholder */}
        <div className="pointer-events-auto md:hidden flex items-center justify-between w-full px-4 py-3 rounded-[16px]"
          style={{
            backdropFilter: 'blur(50px)',
            WebkitBackdropFilter: 'blur(50px)',
            background: 'rgba(255,255,255,0.3)',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.25)',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="bg-[#0084FF] p-1 rounded-lg">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-slate-800" style={{ fontFamily: 'var(--font-fustat)' }}>LearnMyCode</span>
          </div>
          <Link href="/signup" className="text-xs font-semibold text-white px-3 py-1.5 rounded-[10px]"
            style={{ background: 'rgba(0,132,255,0.85)' }}>
            Sign Up
          </Link>
        </div>
      </header>

      <main className="flex-1 relative z-10 bg-transparent">

        {/* =========================================
            DESKTOP VIEW
        ========================================= */}
        <div className="hidden md:block w-full">

          {/* Hero */}
          <HeroCard />

          {/* Learning Tracks */}
          <section id="tracks" className="py-20 px-6 w-full">
            <div className="max-w-7xl mx-auto">

              {/* Section header */}
              <div className="text-center mb-12">
                <h2
                  className="text-slate-900 mb-4"
                  style={{ fontFamily: 'var(--font-fustat)', fontWeight: 800, fontSize: '42px', letterSpacing: '-1.5px', lineHeight: 1.1 }}
                >
                  Learning Tracks
                </h2>
                <p className="text-slate-500 max-w-lg mx-auto" style={{ fontFamily: 'var(--font-inter)', fontSize: '16px' }}>
                  Each track is a structured curriculum — not a random question bank. Build foundational knowledge that sticks.
                </p>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-4 gap-4">
                {TRACKS.map((track) => {
                  const Icon = track.icon;
                  const c = COLOR_MAP[track.color];
                  return (
                    <div
                      key={track.label}
                      className={`relative flex flex-col rounded-[24px] p-6 transition-all duration-300 ${track.available ? 'hover:-translate-y-1.5' : 'opacity-80'}`}
                      style={{
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        background: 'rgba(255,255,255,0.58)',
                        border: track.available
                          ? '1px solid rgba(0,132,255,0.18)'
                          : '1px solid rgba(255,255,255,0.8)',
                        boxShadow: track.available
                          ? 'inset 0px 1px 2px rgba(255,255,255,0.95), 0 4px 28px rgba(0,100,255,0.09)'
                          : 'inset 0px 1px 2px rgba(255,255,255,0.9), 0 2px 16px rgba(0,0,0,0.04)',
                      }}
                    >
                      {/* Soon badge */}
                      {!track.available && (
                        <div
                          className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase px-2.5 py-0.5 rounded-full"
                          style={{
                            backdropFilter: 'blur(10px)',
                            background: 'rgba(255,255,255,0.7)',
                            border: '1px solid rgba(0,0,0,0.07)',
                          }}
                        >
                          Soon
                        </div>
                      )}

                      {/* Icon */}
                      <div
                        className={`w-11 h-11 ${c.icon} rounded-[14px] flex items-center justify-center mb-5`}
                        style={{ boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.8)' }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Meta badge */}
                      <div
                        className="text-[10px] font-bold tracking-widest uppercase w-fit mb-3 px-2.5 py-1 rounded-full"
                        style={{
                          fontFamily: 'var(--font-inter)',
                          backdropFilter: 'blur(8px)',
                          background: track.available ? 'rgba(0,132,255,0.08)' : 'rgba(0,0,0,0.04)',
                          border: track.available ? '1px solid rgba(0,132,255,0.15)' : '1px solid rgba(0,0,0,0.07)',
                          color: track.available ? '#0084FF' : '#94a3b8',
                        }}
                      >
                        {track.meta}
                      </div>

                      <h3
                        className="text-slate-800 mb-2 tracking-tight"
                        style={{ fontFamily: 'var(--font-fustat)', fontWeight: 700, fontSize: '18px' }}
                      >
                        {track.title}
                      </h3>
                      <p
                        className="text-slate-500 leading-relaxed flex-1"
                        style={{ fontFamily: 'var(--font-inter)', fontSize: '13.5px' }}
                      >
                        {track.description}
                      </p>

                      {/* CTA */}
                      <div className="mt-6">
                        {track.available ? (
                          <Link
                            href={track.href!}
                            className="flex items-center justify-center gap-2.5 w-full py-3 text-white font-semibold text-sm transition-transform hover:scale-[1.02]"
                            style={{
                              fontFamily: 'var(--font-inter)',
                              background: 'rgba(0,132,255,0.85)',
                              backdropFilter: 'blur(2px)',
                              WebkitBackdropFilter: 'blur(2px)',
                              borderRadius: '14px',
                              boxShadow: 'inset 0px 3px 4px rgba(255,255,255,0.35), 0 4px 16px rgba(0,132,255,0.25)',
                            }}
                          >
                            Open Track
                            <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                              <ArrowRight className="w-3 h-3 text-[#0084FF]" />
                            </span>
                          </Link>
                        ) : (
                          <div
                            className="flex items-center justify-center w-full py-3 text-slate-400 font-semibold text-sm rounded-[14px]"
                            style={{
                              fontFamily: 'var(--font-inter)',
                              background: 'rgba(255,255,255,0.5)',
                              border: '1px solid rgba(0,0,0,0.06)',
                            }}
                          >
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
          <section id="how" className="py-20 px-6 w-full">
            <div className="max-w-5xl mx-auto">

              {/* Header */}
              <div className="text-center mb-14">
                <h2
                  className="text-slate-900 mb-4"
                  style={{ fontFamily: 'var(--font-fustat)', fontWeight: 800, fontSize: '42px', letterSpacing: '-1.5px', lineHeight: 1.1 }}
                >
                  How LearnMyCode Works
                </h2>
                <p className="text-slate-500 max-w-lg mx-auto" style={{ fontFamily: 'var(--font-inter)', fontSize: '16px' }}>
                  A deliberate loop designed to build lasting understanding, not just pass rates.
                </p>
              </div>

              {/* Step cards */}
              <div className="grid grid-cols-3 gap-5">
                {[
                  {
                    icon: Layers,
                    step: '01',
                    iconColor: 'rgba(99,102,241,0.12)',
                    iconText: '#6366F1',
                    accent: 'rgba(99,102,241,0.12)',
                    accentBorder: 'rgba(99,102,241,0.2)',
                    title: 'Work Through Levels',
                    body: 'Each track is split into curriculum levels. Concepts build on each other — no jumping ahead, no gaps.',
                  },
                  {
                    icon: BrainCircuit,
                    step: '02',
                    iconColor: 'rgba(168,85,247,0.12)',
                    iconText: '#A855F7',
                    accent: 'rgba(168,85,247,0.08)',
                    accentBorder: 'rgba(168,85,247,0.18)',
                    title: 'Build Your Mental Model',
                    body: 'Stuck? The Build Concept guide reveals your thought process step by step — without giving away the answer.',
                  },
                  {
                    icon: BookOpen,
                    step: '03',
                    iconColor: 'rgba(16,185,129,0.12)',
                    iconText: '#10B981',
                    accent: 'rgba(16,185,129,0.08)',
                    accentBorder: 'rgba(16,185,129,0.18)',
                    title: 'Get Instant Feedback',
                    body: 'Your solution is compared against the canonical answer on real data. Pass/fail is instant and deterministic.',
                  },
                ].map(({ icon: Icon, step, iconColor, iconText, accentBorder, title, body }, i) => (
                  <div
                    key={title}
                    className="relative flex flex-col gap-5 p-7 rounded-[24px] transition-all duration-300 hover:-translate-y-1"
                    style={{
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      background: 'rgba(255,255,255,0.58)',
                      border: `1px solid ${accentBorder}`,
                      boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.95), 0 2px 20px rgba(0,0,0,0.04)',
                    }}
                  >
                    {/* Step number */}
                    <span
                      className="absolute top-6 right-6 text-[11px] font-bold tracking-widest"
                      style={{
                        fontFamily: 'var(--font-inter)',
                        color: iconText,
                        opacity: 0.5,
                      }}
                    >
                      {step}
                    </span>

                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-[14px] flex items-center justify-center"
                      style={{
                        background: iconColor,
                        boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.8)',
                        color: iconText,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Text */}
                    <div>
                      <h3
                        className="text-slate-800 mb-2"
                        style={{ fontFamily: 'var(--font-fustat)', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.3px' }}
                      >
                        {title}
                      </h3>
                      <p
                        className="text-slate-500 leading-relaxed"
                        style={{ fontFamily: 'var(--font-inter)', fontSize: '13.5px' }}
                      >
                        {body}
                      </p>
                    </div>

                    {/* Connector line (except last) */}
                    {i < 2 && (
                      <div
                        className="absolute -right-[11px] top-1/2 -translate-y-1/2 w-[22px] h-[1px] z-10"
                        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.08), transparent)' }}
                      />
                    )}
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

          {/* ── Mobile Hero ── */}
          <section className="px-5 pt-10 pb-8 relative w-full">

            {/* Social proof badge */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6"
              style={{
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.8)',
              }}
            >
              <span className="flex gap-0.5">
                {[0,1,2,3,4].map(i => (
                  <svg key={i} width="11" height="11" viewBox="0 0 14 14" fill="#FF801E"><path d="M7 0.5L8.56 5.18H13.5L9.47 7.91L11.03 12.59L7 9.86L2.97 12.59L4.53 7.91L0.5 5.18H5.44L7 0.5Z" /></svg>
                ))}
              </span>
              <span className="text-[11px] font-semibold text-slate-600" style={{ fontFamily: 'var(--font-inter)' }}>
                Rated 4.9/5 by 2,700+ learners
              </span>
            </div>

            {/* Headline */}
            <h1
              className="mb-4 leading-[1.05]"
              style={{
                fontFamily: 'var(--font-fustat)',
                fontWeight: 800,
                fontSize: 'clamp(38px, 10vw, 52px)',
                letterSpacing: '-2px',
                color: '#0a1b33',
              }}
            >
              Learn tech skills
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #0084FF 0%, #3B82F6 50%, #6366F1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                by actually doing.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-500 mb-5 leading-relaxed pr-2" style={{ fontFamily: 'var(--font-inter)', fontSize: '15px' }}>
              Curriculum-based learning tracks — practice in your browser with real data and instant feedback.
            </p>

            {/* Live badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7"
              style={{
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(0,132,255,0.15)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              <span className="text-[11px] font-semibold text-blue-600" style={{ fontFamily: 'var(--font-inter)' }}>
                SQL track is live — more coming soon
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 w-full">
              <Link
                href="/workspace"
                className="w-full flex items-center justify-center gap-3 py-4 text-white font-semibold text-[15px] active:scale-[0.98] transition-transform"
                style={{
                  fontFamily: 'var(--font-inter)',
                  background: 'rgba(0,132,255,0.88)',
                  backdropFilter: 'blur(2px)',
                  borderRadius: '16px',
                  boxShadow: 'inset 0px 3px 4px rgba(255,255,255,0.35), 0 4px 18px rgba(0,132,255,0.28)',
                }}
              >
                Get Started Free
                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0084FF]" />
                </span>
              </Link>
              <Link
                href="#mobile-tracks"
                className="w-full flex items-center justify-center py-4 font-semibold text-slate-600 text-[15px] active:scale-[0.98] transition-transform"
                style={{
                  fontFamily: 'var(--font-inter)',
                  borderRadius: '16px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                Browse Tracks
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex gap-2.5 mt-7 flex-wrap">
              {[
                { value: '120+', label: 'Questions' },
                { value: '10', label: 'Levels' },
                { value: '4.9★', label: 'Rating' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3.5 py-2"
                  style={{
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    background: 'rgba(255,255,255,0.55)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.07)',
                    boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.8)',
                  }}
                >
                  <span className="text-[13px] font-bold text-slate-800" style={{ fontFamily: 'var(--font-fustat)' }}>{value}</span>
                  <span className="text-[11px] text-slate-400 font-medium" style={{ fontFamily: 'var(--font-inter)' }}>{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Mobile Track Cards ── */}
          <section id="mobile-tracks" className="w-full pt-8 pb-4">
            <div className="px-5 mb-5">
              <h2 className="text-slate-900 mb-1" style={{ fontFamily: 'var(--font-fustat)', fontWeight: 800, fontSize: '26px', letterSpacing: '-1px' }}>
                Learning Tracks
              </h2>
              <p className="text-sm text-slate-400" style={{ fontFamily: 'var(--font-inter)' }}>Swipe to explore →</p>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 px-5 pb-5 hide-scrollbar w-full">
              {TRACKS.map((track) => {
                const Icon = track.icon;
                const c = COLOR_MAP[track.color];
                return (
                  <div
                    key={track.label}
                    className={`snap-center shrink-0 w-[78vw] flex flex-col p-6 ${!track.available ? 'opacity-80' : ''}`}
                    style={{
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      background: 'rgba(255,255,255,0.6)',
                      borderRadius: '24px',
                      border: track.available ? '1px solid rgba(0,132,255,0.18)' : '1px solid rgba(255,255,255,0.8)',
                      boxShadow: track.available
                        ? 'inset 0px 1px 2px rgba(255,255,255,0.95), 0 4px 24px rgba(0,100,255,0.09)'
                        : 'inset 0px 1px 2px rgba(255,255,255,0.9), 0 2px 12px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div
                      className={`w-11 h-11 ${c.icon} rounded-[13px] flex items-center justify-center mb-4`}
                      style={{ boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.8)' }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div
                      className="text-[10px] font-bold tracking-widest uppercase w-fit mb-3 px-2.5 py-1 rounded-full"
                      style={{
                        fontFamily: 'var(--font-inter)',
                        background: track.available ? 'rgba(0,132,255,0.08)' : 'rgba(0,0,0,0.04)',
                        border: track.available ? '1px solid rgba(0,132,255,0.15)' : '1px solid rgba(0,0,0,0.07)',
                        color: track.available ? '#0084FF' : '#94a3b8',
                      }}
                    >
                      {track.meta}
                    </div>

                    <h3 className="text-slate-800 mb-2" style={{ fontFamily: 'var(--font-fustat)', fontWeight: 700, fontSize: '17px', letterSpacing: '-0.3px' }}>
                      {track.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed flex-1" style={{ fontFamily: 'var(--font-inter)', fontSize: '13px' }}>
                      {track.description}
                    </p>

                    {track.available ? (
                      <Link
                        href={track.href!}
                        className="mt-5 flex items-center justify-center gap-2 py-3 text-white font-semibold text-sm"
                        style={{
                          fontFamily: 'var(--font-inter)',
                          background: 'rgba(0,132,255,0.85)',
                          backdropFilter: 'blur(2px)',
                          borderRadius: '13px',
                          boxShadow: 'inset 0px 2px 3px rgba(255,255,255,0.35), 0 3px 12px rgba(0,132,255,0.25)',
                        }}
                      >
                        Open Track
                        <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                          <ArrowRight className="w-3 h-3 text-[#0084FF]" />
                        </span>
                      </Link>
                    ) : (
                      <div
                        className="mt-5 flex items-center justify-center py-3 text-slate-400 font-semibold text-sm rounded-[13px]"
                        style={{ fontFamily: 'var(--font-inter)', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)' }}
                      >
                        Coming Soon
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Mobile How it Works ── */}
          <section className="px-5 pt-8 pb-8">
            <h2 className="text-slate-900 mb-1" style={{ fontFamily: 'var(--font-fustat)', fontWeight: 800, fontSize: '26px', letterSpacing: '-1px' }}>
              How it Works
            </h2>
            <p className="text-sm text-slate-400 mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
              A deliberate loop built for real understanding.
            </p>

            <div className="flex flex-col gap-3">
              {[
                { icon: Layers,       step: '01', iconColor: 'rgba(99,102,241,0.12)',  iconText: '#6366F1', accentBorder: 'rgba(99,102,241,0.18)',  title: 'Work Through Levels',      body: 'Each track is split into curriculum levels. Concepts build on each other — no jumping ahead, no gaps.' },
                { icon: BrainCircuit, step: '02', iconColor: 'rgba(168,85,247,0.12)', iconText: '#A855F7', accentBorder: 'rgba(168,85,247,0.18)', title: 'Build Your Mental Model',   body: 'Stuck? The Build Concept guide reveals your thought process step by step — without giving away the answer.' },
                { icon: BookOpen,     step: '03', iconColor: 'rgba(16,185,129,0.12)', iconText: '#10B981', accentBorder: 'rgba(16,185,129,0.18)', title: 'Get Instant Feedback',     body: 'Your solution is compared against the canonical answer on real data. Pass/fail is instant and deterministic.' },
              ].map(({ icon: Icon, step, iconColor, iconText, accentBorder, title, body }) => (
                <div
                  key={title}
                  className="relative flex items-start gap-4 p-5 rounded-[20px]"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    background: 'rgba(255,255,255,0.6)',
                    border: `1px solid ${accentBorder}`,
                    boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.95), 0 2px 16px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: iconColor, color: iconText, boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.8)' }}
                  >
                    <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-slate-800 font-bold text-[15px]" style={{ fontFamily: 'var(--font-fustat)', letterSpacing: '-0.2px' }}>
                        {title}
                      </h3>
                      <span className="text-[10px] font-bold tracking-widest" style={{ fontFamily: 'var(--font-inter)', color: iconText, opacity: 0.5 }}>
                        {step}
                      </span>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-[13px]" style={{ fontFamily: 'var(--font-inter)' }}>
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Marquee on mobile */}
          <div className="pb-4">
            <MarqueeScroller />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
