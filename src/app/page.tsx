import Link from 'next/link';
import { Database, TrendingUp, BrainCircuit, ArrowRight, Code2 } from 'lucide-react';
import CursorGlow from '@/components/CursorGlow';

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
            <span className="font-bold text-lg tracking-tight text-slate-800">SQL Trainer</span>
          </div>
          <nav className="flex gap-6 items-center">
            <Link href="#features" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">How it Works</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative px-6 pt-24 pb-32 overflow-hidden">
          {/* Light Grid & Gradient Backgrounds */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03] invert pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-indigo-600 mb-8 hover:shadow-md transition-shadow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v1.0 is live
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter mb-6 leading-[1.1] text-slate-800 relative z-10">
              Master SQL with <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700">
                Adaptive Intelligence
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed font-medium">
              Practice queries in sandboxed datasets. Our CAT-style engine adapts to your skill level, while AI provides personalized coaching on query optimization and performance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/workspace" 
                className="group flex flex-1 sm:flex-none items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5"
              >
                Start Practice Session
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#features" 
                className="flex flex-1 sm:flex-none items-center justify-center px-8 py-3.5 rounded-full font-semibold border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors text-slate-600 shadow-sm"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 px-6 bg-white border-y border-slate-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Built for Serious Learners</h2>
              <p className="text-slate-500 max-w-xl mx-auto font-medium">Stop writing queries in a void. Get deterministic feedback and performance analysis.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl hover:bg-slate-100/50 hover:shadow-sm transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200/60 shadow-inner">
                  <Database className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">Real Datasets</h3>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">
                  Practice with fully populated schemas across diverse domains like Retail, HR, and Aviation. View ER diagrams to understand relationships.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl hover:bg-slate-100/50 hover:shadow-sm transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 border border-emerald-200/60 shadow-inner">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">Adaptive Difficulty</h3>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">
                  The engine models Computerized Adaptive Testing (CAT). Ace a question and face a harder one; stumble and we'll ease the curve.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl hover:bg-slate-100/50 hover:shadow-sm transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 border border-purple-200/60 shadow-inner">
                  <BrainCircuit className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">AI Coach</h3>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">
                  Beyond pass/fail. Get OpenRouter-powered explanations on optimal queries, execution plans, and why your approach could be improved.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-12 bg-slate-50 text-center text-slate-500 text-sm relative z-10 font-medium">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-600">Anonymous Practice Engine</span>
        </div>
        <p>&copy; {new Date().getFullYear()} SQL CAT-Style Trainer. Built for the advanced learner.</p>
      </footer>
    </div>
  );
}
