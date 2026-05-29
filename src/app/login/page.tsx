'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Code2, ArrowRight, Loader2 } from 'lucide-react';
import { apiLogin, saveAuth } from '@/lib/auth';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid rgba(0,0,0,0.09)',
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  fontSize: '14px',
  color: '#0f172a',
  outline: 'none',
  fontFamily: 'var(--font-inter)',
  transition: 'box-shadow 0.2s',
};

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await apiLogin(email.trim(), password);
      saveAuth(token, user);
      router.push('/workspace');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-0 left-0 pointer-events-none" style={{ zIndex: 0, width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(96,177,255,0.34) 0%, transparent 68%)', filter: 'blur(90px)', transform: 'translate(-30%, -25%)' }} />
      <div className="absolute pointer-events-none" style={{ zIndex: 0, bottom: '5%', right: '0%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(49,154,255,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="bg-[#0084FF] p-1.5 rounded-lg shadow-sm">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-[17px] tracking-tight text-slate-800" style={{ fontFamily: 'var(--font-fustat)' }}>
            LearnMyCode
          </span>
        </Link>

        {/* Glass card */}
        <div
          className="w-full p-8"
          style={{
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            background: 'rgba(255,255,255,0.6)',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.88)',
            boxShadow: 'inset 0px 1px 2px rgba(255,255,255,0.95), 0 8px 40px rgba(0,80,200,0.09)',
          }}
        >
          <h1 className="text-slate-900 mb-1" style={{ fontFamily: 'var(--font-fustat)', fontWeight: 800, fontSize: '30px', letterSpacing: '-1px' }}>
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm mb-7" style={{ fontFamily: 'var(--font-inter)' }}>
            Sign in to continue your learning journey.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-[12px] text-sm font-medium" style={{ fontFamily: 'var(--font-inter)', background: 'rgba(255,59,48,0.07)', border: '1px solid rgba(255,59,48,0.18)', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-inter)' }}>
                Email address
              </label>
              <input
                type="email" required autoFocus
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,132,255,0.18)')}
                onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-inter)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,132,255,0.18)')}
                  onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="mt-1 w-full flex items-center justify-center gap-2.5 py-3.5 text-white font-semibold text-sm transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:scale-100"
              style={{
                fontFamily: 'var(--font-inter)',
                background: 'rgba(0,132,255,0.88)',
                backdropFilter: 'blur(2px)',
                borderRadius: '14px',
                boxShadow: 'inset 0px 3px 4px rgba(255,255,255,0.35), 0 4px 18px rgba(0,132,255,0.28)',
              }}
            >
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <>
                    Sign In
                    <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                      <ArrowRight className="w-3 h-3 text-[#0084FF]" />
                    </span>
                  </>
              }
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6" style={{ fontFamily: 'var(--font-inter)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#0084FF] font-semibold hover:underline underline-offset-2 transition">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
