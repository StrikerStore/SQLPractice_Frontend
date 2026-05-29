import Link from "next/link";
import { Code2, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = { title: "Privacy Policy — LearnMyCode" };

export default function PrivacyPage() {
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

      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-10" style={{ fontFamily: "var(--font-inter)" }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Back to home
        </Link>

        <div className="mb-10">
          <h1 className="text-slate-900 mb-3" style={{ fontFamily: "var(--font-fustat)", fontWeight: 800, fontSize: "48px", letterSpacing: "-2px", lineHeight: 1.05 }}>Privacy Policy</h1>
          <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-inter)" }}>Last updated: May 2025</p>
        </div>

        <div className="rounded-[24px] p-8 space-y-8" style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.85)", boxShadow: "inset 0px 1px 2px rgba(255,255,255,0.95), 0 4px 28px rgba(0,100,255,0.07)" }}>

          <Section title="1. What We Collect">
            When you create an account we collect your email address, chosen username, and a hashed password. When you use the platform we collect your answer submissions, completion state per level, and general usage patterns (pages visited, time on task). We do not collect payment information — the platform is currently free.
          </Section>

          <Section title="2. How We Use It">
            Your data is used to: authenticate your account, save your progress across sessions, improve the curriculum based on aggregate difficulty data, and send you occasional product updates (only if you opt in). We do not sell your data to third parties.
          </Section>

          <Section title="3. Cookies & Local Storage">
            We use a single session cookie to keep you logged in. We may use localStorage to cache your editor state so your work isn&apos;t lost on refresh. We do not use tracking cookies or third-party advertising pixels.
          </Section>

          <Section title="4. Third-Party Services">
            We use the following third-party services: Supabase (database &amp; auth), Vercel (hosting), and Cloudfront (media delivery). Each of these services has their own privacy policies. We share only the minimum data necessary for these services to function.
          </Section>

          <Section title="5. Data Retention">
            Your account data is retained as long as your account is active. You may request deletion of your account and all associated data by emailing us. We will process deletion requests within 30 days.
          </Section>

          <Section title="6. Your Rights">
            Depending on your jurisdiction you may have the right to access, correct, export, or delete your personal data. To exercise any of these rights, contact us at <a href="mailto:learnmycode@plexzuu.com" className="text-[#0084FF] underline underline-offset-2">learnmycode@plexzuu.com</a>.
          </Section>

          <Section title="7. Changes to This Policy">
            We may update this policy from time to time. When we do, we&apos;ll update the &quot;last updated&quot; date at the top and notify active users via email if changes are material.
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
      <h2 className="text-slate-800 mb-3" style={{ fontFamily: "var(--font-fustat)", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.3px" }}>{title}</h2>
      <p className="text-slate-500 leading-relaxed" style={{ fontFamily: "var(--font-inter)", fontSize: "15px" }}>{children}</p>
    </div>
  );
}
