const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';
const TOKEN_KEY = 'lmc_token';
const USER_KEY  = 'lmc_user';

export interface AuthUser {
  user_id: number;
  full_name: string;
  email: string;
}

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // Also set a cookie so Next.js middleware can read it
  document.cookie = `lmc_token=${token}; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`;
}

export function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  try { return raw ? (JSON.parse(raw) as AuthUser) : null; } catch { return null; }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = 'lmc_token=; path=/; max-age=0';
}

export async function apiSignup(data: {
  full_name: string; email: string; contact: string;
  city: string; course: string; college?: string; password: string;
}): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Signup failed');
  return json;
}

export async function apiLogin(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Login failed');
  return json;
}
