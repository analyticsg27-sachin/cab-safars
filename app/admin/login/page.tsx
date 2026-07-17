'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import AdminService from '@/lib/services/admin.service';
import { getAdminToken } from '@/lib/services/admin-api-client';
import { asset } from '@/lib/basepath';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAdminToken()) {
      AdminService.me()
        .then(() => router.replace('/admin/'))
        .catch(() => { /* token invalid, stay on login */ });
    }
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) { setError('Username is required.'); return; }
    if (!password.trim()) { setError('Password is required.'); return; }
    setError('');
    setLoading(true);
    try {
      await AdminService.login(username.trim(), password);
      router.replace('/admin/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg === 'Invalid credentials' ? 'Invalid username or password.' : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #0F1E38 0%, #0B1220 55%, #070D18 100%)',
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#94A3B8 1px, transparent 1px), linear-gradient(90deg, #94A3B8 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#F5A623]/8 rounded-full blur-3xl pointer-events-none" />

        {/* Card */}
        <div className="relative bg-[#111827]/90 border border-[#243042] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-sm">
          {/* Top accent line */}
          <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, transparent, #F5A623, transparent)' }} />

          <div className="px-8 pt-8 pb-10">
            {/* Logo + badge */}
            <div className="flex flex-col items-center mb-8">
              <div className="mb-5">
                <img
                  src={asset('/logo-v2.png')}
                  alt="CAB SAFARS"
                  className="h-12 w-auto object-contain mx-auto"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <p
                  className="hidden text-2xl font-black tracking-tight text-white text-center"
                  style={{ display: 'none' }}
                >
                  CAB<span className="text-[#F5A623]">SAFARS</span>
                </p>
              </div>

              {/* Admin Access badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/25 mb-3">
                <Lock className="w-3 h-3 text-[#F5A623]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#F5A623]">
                  Admin Access
                </span>
              </div>

              <h1 className="text-xl font-bold text-white">Sign in to your account</h1>
              <p className="text-xs text-[#6B7280] mt-1">Enter your credentials to continue</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold mb-2 text-[#94A3B8] tracking-wide">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all bg-[#0B1220] border border-[#243042] text-white placeholder-[#374151] focus:border-[#F5A623]/60 focus:ring-1 focus:ring-[#F5A623]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-[#94A3B8] tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5563]">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-all bg-[#0B1220] border border-[#243042] text-white placeholder-[#374151] focus:border-[#F5A623]/60 focus:ring-1 focus:ring-[#F5A623]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#94A3B8] transition-colors"
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-[#EF4444] bg-[#EF4444]/8 border border-[#EF4444]/20 rounded-xl px-4 py-3">
                  <span className="mt-0.5 shrink-0">âš </span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-3.5 rounded-xl text-sm font-bold mt-1 transition-all duration-150 active:scale-[0.98] disabled:opacity-60 overflow-hidden"
                style={{
                  background: loading
                    ? 'linear-gradient(135deg, #B07A1A, #9B6A15)'
                    : 'linear-gradient(135deg, #F5A623 0%, #E8941A 50%, #D4891E 100%)',
                  color: '#0B1220',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(245,166,35,0.3)',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing inâ€¦
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#374151] mt-6">
          CAB SAFARS &copy; 2026 &mdash; All rights reserved
        </p>
      </div>
    </div>
  );
}

