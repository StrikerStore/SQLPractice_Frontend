import Link from "next/link";
import { Code2, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata = { title: "Terms & Conditions — LearnMyCode" };

export default function TermsPage() {
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
          <h1 className="text-slate-900 mb-3" style={{ fontFamily: "var(--font-fustat)", fontWeight: 800, fontSize: "48px", letterSpacing: "-2px", lineHeight: 1.05 }}>Terms &amp; Conditions</h1>
          <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-inter)" }}>Last updated: May 2025</p>
        </div>

        <div className="rounded-[24px] p-8 space-y-8" style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.85)", boxShadow: "inset 0px 1px 2px rgba(255,255,255,0.95), 0 4px 28px rgba(0,100,255,0.07)" }}>

          <Section title="1. Acceptance of Terms">
            By accessing or using LearnMyCode (&quot;the Platform&quot;), you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use the Platform. We reserve the right to update these terms at any time with notice via email or an in-app banner.
          </Section>

          <Section title="2. Use of the Platform">
            LearnMyCode is intended for personal, non-commercial educational use. You may not resell, redistribute, or reproduce any course content, questions, or datasets provided on the Platform without explicit written permission from LearnMyCode.
          </Section>

          <Section title="3. User Accounts">
            You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. LearnMyCode is not liable for any loss or damage arising from your failure to secure your account.
          </Section>

          <Section title="4. Intellectual Property">
            All content on LearnMyCode — including but not limited to course material, questions, UI design, and code — is owned by LearnMyCode or its licensors and is protected by applicable intellectual property laws.
          </Section>

          <Section title="5. Prohibited Conduct">
            You agree not to: attempt to scrape or extract course content programmatically; interfere with the platform&apos;s infrastructure; impersonate other users; submit answers obtained from AI models as your own in contexts where this is prohibited.
          </Section>

          <Section title="6. Termination">
            We reserve the right to suspend or terminate your account at our discretion if we determine you have violated these Terms. You may delete your account at any time from your account settings.
          </Section>

          <Section title="7. Limitation of Liability">
            LearnMyCode is provided &quot;as is&quot; without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Platform.
          </Section>

          <Section title="8. Contact">
            Questions about these terms? Email us at <a href="mailto:learnmycode@plexzuu.com" className="text-[#0084FF] underline underline-offset-2">learnmycode@plexzuu.com</a>.
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
