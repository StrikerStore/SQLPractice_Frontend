'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Code2, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { apiSignup, saveAuth } from '@/lib/auth';

const COURSES = [
  'B.Tech/B.E. - Computer Science',
  'B.Tech/B.E. - Other Branch',
  'BCA', 'MCA',
  'BSc Computer Science',
  'BA / BCom / BSc (Other)',
  'MBA', 'MSc / MTech',
  'Working Professional',
  'Not Currently Studying',
  'Other',
];

interface FormState {
  full_name: string; email: string; contact: string;
  city: string; course: string; college: string;
  password: string; confirmPw: string;
}

const INIT: FormState = {
  full_name: '', email: '', contact: '', city: '',
  course: '', college: '', password: '', confirmPw: '',
};

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '12px',
  border: '1px solid rgba(0,0,0,0.09)',
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  fontSize: '13.5px',
  color: '#0f172a',
  outline: 'none',
  fontFamily: 'var(--font-inter)',
  transition: 'box-shadow 0.2s',
};

function focusOn(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,132,255,0.18)';
}
function blurOff(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.boxShadow = 'none';
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5" style={{ fontFamily: 'var(--font-inter)' }}>
      {children}
    </label>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [form,    setForm]    = useState<FormState>(INIT);
  const [showPw,  setShowPw]  = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  function update(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPw) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!form.course) { setError('Please select your current course / status.'); return; }

    setLoading(true);
    try {
      const { token, user } = await apiSignup({
        full_name: form.full_name, email: form.email, contact: form.contact,
        city: form.city, course: form.course,
        college: form.college || undefined, password: form.password,
      });
      saveAuth(token, user);
      router.push('/workspace');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const pw = form.password;
  const pwStrength = pw.length === 0 ? 0 : pw.length < 8 ? 1 : pw.length < 12 ? 2 : /[A-Z]/.test(pw) && /\d/.test(pw) ? 4 : 3;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'rgba(248,113,113,1)', 'rgba(251,191,36,1)', 'rgba(52,211,153,1)', 'rgba(16,185,129,1)'];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-14 relative overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-0 left-0 pointer-events-none" style={{ zIndex: 0, width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(96,177,255,0.34) 0%, transparent 68%)', filter: 'blur(90px)', transform: 'translate(-30%, -25%)' }} />
      <div className="absolute pointer-events-none" style={{ zIndex: 0, bottom: '5%', right: '0%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(49,154,255,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
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
            Create your account
          </h1>
          <p className="text-slate-500 text-sm mb-7" style={{ fontFamily: 'var(--font-inter)' }}>
            Join LearnMyCode and start mastering tech skills today — it&apos;s free.
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-[12px] text-sm font-medium" style={{ fontFamily: 'var(--font-inter)', background: 'rgba(255,59,48,0.07)', border: '1px solid rgba(255,59,48,0.18)', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">

            {/* Full Name */}
            <div>
              <Label>Full Name</Label>
              <input type="text" required value={form.full_name} onChange={update('full_name')}
                placeholder="James Smith" style={inputBase} autoComplete="name"
                onFocus={focusOn} onBlur={blurOff} />
            </div>

            {/* Email */}
            <div>
              <Label>Email Address</Label>
              <input type="email" required value={form.email} onChange={update('email')}
                placeholder="you@example.com" style={inputBase} autoComplete="email"
                onFocus={focusOn} onBlur={blurOff} />
            </div>

            {/* Contact + City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Contact / Phone</Label>
                <input type="tel" required value={form.contact} onChange={update('contact')}
                  placeholder="+91 98765 43210" style={inputBase} autoComplete="tel"
                  onFocus={focusOn} onBlur={blurOff} />
              </div>
              <div>
                <Label>City</Label>
                <input type="text" required value={form.city} onChange={update('city')}
                  placeholder="Mumbai" style={inputBase} autoComplete="address-level2"
                  onFocus={focusOn} onBlur={blurOff} />
              </div>
            </div>

            {/* Course */}
            <div>
              <Label>Course / Current Status</Label>
              <select required value={form.course} onChange={update('course')}
                style={inputBase} onFocus={focusOn} onBlur={blurOff}>
                <option value="">Select your course or status…</option>
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* College */}
            <div>
              <Label>College / University <span className="normal-case font-normal text-slate-400">(optional)</span></Label>
              <input type="text" value={form.college} onChange={update('college')}
                placeholder="e.g. IIT Bombay, NMIMS" style={inputBase} autoComplete="organization"
                onFocus={focusOn} onBlur={blurOff} />
            </div>

            {/* Password */}
            <div>
              <Label>Password</Label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required minLength={8}
                  value={form.password} onChange={update('password')}
                  placeholder="Min. 8 characters"
                  style={{ ...inputBase, paddingRight: '44px' }}
                  autoComplete="new-password" onFocus={focusOn} onBlur={blurOff} />
                <button type="button" tabIndex={-1} onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pw.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all"
                        style={{ background: i <= pwStrength ? strengthColors[pwStrength] : 'rgba(0,0,0,0.08)' }} />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400" style={{ fontFamily: 'var(--font-inter)' }}>
                    {strengthLabel[pwStrength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Label>Confirm Password</Label>
              <div className="relative">
                <input type={showCpw ? 'text' : 'password'} required
                  value={form.confirmPw} onChange={update('confirmPw')}
                  placeholder="Repeat your password"
                  style={{ ...inputBase, paddingRight: '44px' }}
                  autoComplete="new-password" onFocus={focusOn} onBlur={blurOff} />
                <button type="button" tabIndex={-1} onClick={() => setShowCpw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                  {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirmPw.length > 0 && form.password === form.confirmPw && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold" style={{ fontFamily: 'var(--font-inter)', color: '#10b981' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                </p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
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
                    Create Account
                    <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                      <ArrowRight className="w-3 h-3 text-[#0084FF]" />
                    </span>
                  </>
              }
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6" style={{ fontFamily: 'var(--font-inter)' }}>
            Already have an account?{' '}
            <Link href="/login" className="text-[#0084FF] font-semibold hover:underline underline-offset-2 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
