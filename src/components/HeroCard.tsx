"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarqueeScroller from "@/components/MarqueeScroller";

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="#FF801E" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 0.5L8.56 5.18H13.5L9.47 7.91L11.03 12.59L7 9.86L2.97 12.59L4.53 7.91L0.5 5.18H5.44L7 0.5Z" />
    </svg>
  );
}


export default function HeroCard() {
  return (
    <section className="relative bg-transparent">

      {/* Main content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-16 pt-10 pb-0">

        {/* Hero grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 items-center min-h-[640px]">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-6 py-12 md:py-16">

            {/* Social proof badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full w-fit"
              style={{
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <span className="flex gap-0.5">
                {[0,1,2,3,4].map(i => <StarIcon key={i} />)}
              </span>
              <span
                className="text-sm text-slate-700 font-medium"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Rated 4.9/5 by 2,700+ learners
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-fustat)',
                fontWeight: 800,
                fontSize: 'clamp(44px, 5.5vw, 75px)',
                lineHeight: 1.05,
                letterSpacing: '-2px',
                color: '#0a1b33',
              }}
            >
              Learn tech skills
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #0084FF 0%, #3B82F6 50%, #6366F1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                by actually doing.
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="max-w-[520px] leading-relaxed text-slate-500"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '18px',
                letterSpacing: '-0.5px',
              }}
            >
              LearnMyCode is an interactive, curriculum-based practice platform. Pick a track, work through structured levels, and build real understanding — one concept at a time.
            </p>

            {/* Live badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit"
              style={{
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(99,102,241,0.2)',
                boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              <span
                className="text-xs font-semibold text-blue-600"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                SQL track is live — more coming soon
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-row gap-3 mt-1">
              {/* Primary CTA */}
              <Link
                href="/signup"
                className="flex items-center gap-3 font-semibold text-white text-[15px] px-6 py-3.5 transition-transform hover:scale-[1.02]"
                style={{
                  fontFamily: 'var(--font-inter)',
                  background: 'rgba(0,132,255,0.85)',
                  backdropFilter: 'blur(2px)',
                  WebkitBackdropFilter: 'blur(2px)',
                  borderRadius: '16px',
                  boxShadow: 'inset 0px 4px 4px 0px rgba(255,255,255,0.35), 0 4px 20px rgba(0,132,255,0.3)',
                  transition: 'transform 0.2s ease',
                }}
              >
                Get Started Free
                <span
                  className="flex items-center justify-center w-6 h-6 bg-white rounded-full flex-shrink-0"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#0084FF]" />
                </span>
              </Link>

              {/* Secondary CTA */}
              <Link
                href="/login"
                className="flex items-center justify-center px-6 py-3.5 font-semibold text-slate-600 text-[15px] transition-all hover:bg-slate-50"
                style={{
                  fontFamily: 'var(--font-inter)',
                  borderRadius: '16px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: 'rgba(255,255,255,0.7)',
                }}
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* ── Right column: orb ── */}
          <div className="relative flex items-center justify-center overflow-visible">
            <div className="relative w-full max-w-[620px] mx-auto overflow-visible">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full scale-125 pointer-events-none"
                style={{
                  mixBlendMode: 'screen',
                  filter: 'hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)',
                }}
              >
                <source
                  src="https://future.co/images/homepage/glassy-orb/orb-purple.webm"
                  type="video/webm"
                />
              </video>
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="pb-10 pt-2 flex items-center justify-center gap-3 flex-wrap">
          {[
            { value: '120+', label: 'Practice Questions' },
            { value: '10',   label: 'Structured Levels' },
            { value: '4.9★', label: 'Average Rating' },
            { value: '2.7k', label: 'Active Learners' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-5 py-3"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                background: 'rgba(255,255,255,0.55)',
                borderRadius: '14px',
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: 'inset 0px 2px 4px rgba(255,255,255,0.6), 0 2px 12px rgba(0,100,255,0.06)',
              }}
            >
              <span
                className="text-[15px] font-bold text-slate-800"
                style={{ fontFamily: 'var(--font-fustat)' }}
              >
                {value}
              </span>
              <span
                className="text-[13px] text-slate-400 font-medium"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Marquee scroller */}
      <MarqueeScroller />
    </section>
  );
}
