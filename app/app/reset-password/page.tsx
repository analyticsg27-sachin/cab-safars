'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, X, CheckCircle } from 'lucide-react';
import { asset } from '@/lib/basepath';
import AuthService from '@/lib/services/auth.service';
import AppShell from '@/components/app/AppShell';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('fp_phone');
    if (saved) setPhone(saved);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) { setError('Mobile number is required.'); return; }
    if (!otp.trim() || otp.length !== 6) { setError('Please enter the 6-digit OTP.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      await AuthService.resetPassword(phone.trim(), otp.trim(), password);
      sessionStorage.removeItem('fp_phone');
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid OTP or expired. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AppShell>
        <div
          className="flex flex-col flex-1 items-center justify-center overflow-y-auto px-6"
          style={{ backgroundColor: '#0B1220', minHeight: '100%' }}
        >
          <CheckCircle size={56} style={{ color: '#22C55E' }} className="mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Password Reset!</h1>
          <p className="text-sm text-center mb-8" style={{ color: '#94A3B8' }}>
            Your password has been updated. Please sign in with your new password.
          </p>
          <button
            onClick={() => router.push('/app/login')}
            className="w-full max-w-xs py-4 rounded-2xl text-base font-bold transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #F5A623 0%, #D4891E 100%)', color: '#000000' }}
          >
            Go to Sign In
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div
        className="flex flex-col flex-1 overflow-y-auto"
        style={{
          backgroundColor: '#0B1220',
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 60%)',
          minHeight: '100%',
        }}
      >
        <div className="px-4 pt-12 pb-2">
          <button
            onClick={() => router.push('/app/forgot-password')}
            className="flex items-center justify-center w-10 h-10 rounded-2xl transition-all active:scale-90"
            style={{ backgroundColor: '#111827', border: '1px solid #243042', color: '#94A3B8' }}
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="px-6 pt-4 pb-2 flex flex-col items-center">
          <img src={asset('/logo-v2.png')} alt="CAB SAFARS" style={{ height: 50 }} className="w-auto object-contain mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-1">Reset Password</h1>
          <p className="text-sm text-center" style={{ color: '#94A3B8' }}>Enter the OTP sent to your mobile and choose a new password</p>
        </div>

        <div className="mx-4 mt-6 mb-4 rounded-3xl p-6 shadow-2xl" style={{ backgroundColor: '#111827', border: '1px solid #243042' }}>
          {error && (
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-5"
              style={{ backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <X size={16} style={{ color: '#EF4444', flexShrink: 0 }} />
              <p className="text-sm flex-1" style={{ color: '#FCA5A5' }}>{error}</p>
              <button onClick={() => setError('')} style={{ color: '#EF4444' }}><X size={14} /></button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98XXX XXXXX"
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                style={{ backgroundColor: '#1A2332', border: '1px solid #243042', color: '#F1F5F9', caretColor: '#F5A623' }}
                onFocus={(e) => { e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#243042'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>6-Digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter OTP"
                inputMode="numeric"
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all tracking-[0.3em] text-center font-bold"
                style={{ backgroundColor: '#1A2332', border: '1px solid #243042', color: '#F5A623', caretColor: '#F5A623' }}
                onFocus={(e) => { e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#243042'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{ backgroundColor: '#1A2332', border: '1px solid #243042', color: '#F1F5F9', caretColor: '#F5A623' }}
                  onFocus={(e) => { e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#243042'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#94A3B8' }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-base font-bold mt-1 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #F5A623 0%, #D4891E 100%)', color: '#000000' }}
            >
              {loading ? (
                <><span className="inline-block w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />Please wait...</>
              ) : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
