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
  full_name: string;
  email: string;
  contact: string;
  city: string;
  course: string;
  college: string;
  password: string;
  confirmPw: string;
}

const INIT: FormState = {
  full_name: '', email: '', contact: '', city: '',
  course: '', college: '', password: '', confirmPw: '',
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
      {children}
    </label>
  );
}

const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition";

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

    if (form.password !== form.confirmPw) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!form.course) {
      setError('Please select your current course / status.');
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await apiSignup({
        full_name: form.full_name,
        email:     form.email,
        contact:   form.contact,
        city:      form.city,
        course:    form.course,
        college:   form.college || undefined,
        password:  form.password,
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
  const strengthColor = ['', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
      `}} />

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 fade-up">
        <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-slate-800">LearnMyCode</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-sm p-8 fade-up" style={{animationDelay:'60ms'}}>
        <h1 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Create your account</h1>
        <p className="text-slate-500 text-sm font-medium mb-7">
          Join LearnMyCode and start mastering tech skills today — it&apos;s free.
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <input type="text" required value={form.full_name} onChange={update('full_name')}
              placeholder="James Smith" className={inputCls} />
          </div>

          {/* Email */}
          <div>
            <FieldLabel>Email Address</FieldLabel>
            <input type="email" required value={form.email} onChange={update('email')}
              placeholder="you@example.com" className={inputCls} />
          </div>

          {/* Contact + City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Contact / Phone</FieldLabel>
              <input type="tel" required value={form.contact} onChange={update('contact')}
                placeholder="+91 98765 43210" className={inputCls} />
            </div>
            <div>
              <FieldLabel>City</FieldLabel>
              <input type="text" required value={form.city} onChange={update('city')}
                placeholder="Mumbai" className={inputCls} />
            </div>
          </div>

          {/* Course */}
          <div>
            <FieldLabel>Course / Current Status</FieldLabel>
            <select required value={form.course} onChange={update('course')} className={inputCls}>
              <option value="">Select your course or status…</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* College (optional) */}
          <div>
            <FieldLabel>College / University <span className="normal-case font-normal text-slate-400">(optional)</span></FieldLabel>
            <input type="text" value={form.college} onChange={update('college')}
              placeholder="e.g. IIT Bombay, NMIMS, Any College Name" className={inputCls} />
          </div>

          {/* Password */}
          <div>
            <FieldLabel>Password</FieldLabel>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} required minLength={8}
                value={form.password} onChange={update('password')}
                placeholder="Min. 8 characters" className={`${inputCls} pr-12`} />
              <button type="button" tabIndex={-1}
                onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Strength bar */}
            {pw.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? strengthColor[pwStrength] : 'bg-slate-200'}`} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-500">{strengthLabel[pwStrength]}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <FieldLabel>Confirm Password</FieldLabel>
            <div className="relative">
              <input type={showCpw ? 'text' : 'password'} required
                value={form.confirmPw} onChange={update('confirmPw')}
                placeholder="Repeat your password" className={`${inputCls} pr-12`} />
              <button type="button" tabIndex={-1}
                onClick={() => setShowCpw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.confirmPw.length > 0 && form.password === form.confirmPw && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
              </p>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-[0_4px_14px_rgba(79,70,229,0.35)] mt-2">
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <>Create Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 font-medium mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
