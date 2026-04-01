import Link from 'next/link';
import { Database, TrendingUp, BrainCircuit, ArrowRight, Code2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      {/* Navbar Minimal */}
      <header className="px-6 py-4 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">SQL Trainer</span>
          </div>
          <nav className="flex gap-6 items-center">
            <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How it Works</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-24 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent_40%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v1.0 is live
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">
              <span className="inline-block animate-text-reveal opacity-0 text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Master SQL with
              </span>
              <br className="hidden sm:block" />
              <span 
                className="inline-block animate-blur-reveal opacity-0"
                style={{ animationDelay: '300ms' }}
              >
                <span className="inline-block text-transparent bg-clip-text bg-[length:200%_auto] bg-[linear-gradient(110deg,#e4e4e7,42%,#a5b4fc,50%,#e4e4e7,58%)] animate-gradient-shift pb-2">
                  Adaptive Intelligence
                </span>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed font-light">
              Practice queries in sandboxed datasets. Our CAT-style engine adapts to your skill level, while AI provides personalized coaching on query optimization and performance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/workspace" 
                className="group flex flex-1 sm:flex-none items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
              >
                Start Practice Session
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#features" 
                className="flex flex-1 sm:flex-none items-center justify-center px-8 py-3.5 rounded-full font-medium border border-white/10 hover:bg-white/5 transition-colors text-zinc-300"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 px-6 bg-zinc-950/50 border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Built for Serious Learners</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">Stop writing queries in a void. Get deterministic feedback and performance analysis.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-3xl hover:bg-zinc-900 transition-colors">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
                  <Database className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real Datasets</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Practice with fully populated schemas across diverse domains like Retail, HR, and Aviation. View ER diagrams to understand relationships.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-3xl hover:bg-zinc-900 transition-colors">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Adaptive Difficulty</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  The engine models Computerized Adaptive Testing (CAT). Ace a question and face a harder one; stumble and we'll ease the curve.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-3xl hover:bg-zinc-900 transition-colors">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                  <BrainCircuit className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Coach</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Beyond pass/fail. Get OpenRouter-powered explanations on optimal queries, execution plans, and why your approach could be improved.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-12 border-t border-white/10 text-center text-zinc-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Code2 className="w-4 h-4" />
          <span>Anonymous Practice Engine</span>
        </div>
        <p>&copy; {new Date().getFullYear()} SQL CAT-Style Trainer. Built for the advanced learner.</p>
      </footer>
    </div>
  );
}
