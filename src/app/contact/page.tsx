"use client";

import Link from "next/link";
import { Code2, ArrowLeft, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { useState } from "react";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans relative overflow-x-hidden">
      <div className="absolute top-0 left-0 pointer-events-none" style={{ zIndex: 0, width: "700px", height: "700px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(96,177,255,0.32) 0%, transparent 68%)", filter: "blur(90px)", transform: "translate(-28%, -22%)" }} />
      <div className="absolute pointer-events-none" style={{ zIndex: 0, top: "4%", left: "6%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(49,154,255,0.15) 0%, transparent 70%)", filter: "blur(72px)" }} />

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

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-10" style={{ fontFamily: "var(--font-inter)" }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>

        <div className="mb-10">
          <h1 className="text-slate-900 mb-3" style={{ fontFamily: "var(--font-fustat)", fontWeight: 800, fontSize: "48px", letterSpacing: "-2px", lineHeight: 1.05 }}>Contact</h1>
          <p className="text-slate-500 text-lg" style={{ fontFamily: "var(--font-inter)" }}>Questions, feedback, or just want to say hi — we&apos;re here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-5">

          {/* Form */}
          <div className="rounded-[24px] p-8" style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.85)", boxShadow: "inset 0px 1px 2px rgba(255,255,255,0.95), 0 4px 28px rgba(0,100,255,0.07)" }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(0,132,255,0.1)" }}>
                  <MessageSquare className="w-6 h-6 text-[#0084FF]" />
                </div>
                <h3 className="text-slate-800 text-xl font-bold" style={{ fontFamily: "var(--font-fustat)" }}>Message sent!</h3>
                <p className="text-slate-500 text-sm max-w-xs" style={{ fontFamily: "var(--font-inter)" }}>Thanks for reaching out. We&apos;ll get back to you within 1–2 business days.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }} className="mt-2 text-sm text-[#0084FF] font-medium hover:underline" style={{ fontFamily: "var(--font-inter)" }}>Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="text-slate-800 text-lg font-bold mb-1" style={{ fontFamily: "var(--font-fustat)" }}>Send us a message</h3>

                {[
                  { label: "Your name", key: "name", type: "text", placeholder: "Jane Smith" },
                  { label: "Email address", key: "email", type: "email", placeholder: "jane@example.com" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" style={{ fontFamily: "var(--font-inter)" }}>{label}</label>
                    <input
                      required type={type} placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-[12px] text-sm text-slate-800 outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(0,132,255,0.25)]"
                      style={{ fontFamily: "var(--font-inter)", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.09)" }}
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" style={{ fontFamily: "var(--font-inter)" }}>Message</label>
                  <textarea
                    required rows={5} placeholder="How can we help?"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-[12px] text-sm text-slate-800 outline-none resize-none transition-shadow focus:shadow-[0_0_0_2px_rgba(0,132,255,0.25)]"
                    style={{ fontFamily: "var(--font-inter)", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.09)" }}
                  />
                </div>

                <button type="submit" className="mt-1 flex items-center justify-center gap-2.5 w-full py-3 text-white font-semibold text-sm transition-transform hover:scale-[1.02]"
                  style={{ fontFamily: "var(--font-inter)", background: "rgba(0,132,255,0.85)", backdropFilter: "blur(2px)", borderRadius: "14px", boxShadow: "inset 0px 3px 4px rgba(255,255,255,0.35), 0 4px 16px rgba(0,132,255,0.25)" }}>
                  Send Message
                  <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-3 h-3 text-[#0084FF]" />
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-4">
            {[
              {
                icon: Mail,
                title: "Email us",
                body: "For general enquiries, feedback, or partnership requests.",
                link: "mailto:learnmycode@plexzuu.com",
                linkText: "learnmycode@plexzuu.com",
              },
              {
                icon: ExternalLink,
                title: "GitHub",
                body: "Found a bug or want to suggest a feature? Open an issue.",
                link: "#",
                linkText: "github.com/learnmycode",
              },
              {
                icon: MessageSquare,
                title: "Discord",
                body: "Join the community, ask questions, and connect with other learners.",
                link: "#",
                linkText: "Join our server →",
              },
            ].map(({ icon: Icon, title, body, link, linkText }) => (
              <div key={title} className="rounded-[20px] p-6" style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: "rgba(255,255,255,0.58)", border: "1px solid rgba(255,255,255,0.85)", boxShadow: "inset 0px 1px 2px rgba(255,255,255,0.95), 0 2px 16px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: "rgba(0,132,255,0.1)" }}>
                    <Icon className="w-4 h-4 text-[#0084FF]" />
                  </div>
                  <span className="font-bold text-slate-800 text-[15px]" style={{ fontFamily: "var(--font-fustat)" }}>{title}</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-3" style={{ fontFamily: "var(--font-inter)" }}>{body}</p>
                <a href={link} className="text-[#0084FF] text-sm font-medium hover:underline underline-offset-2" style={{ fontFamily: "var(--font-inter)" }}>{linkText}</a>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
