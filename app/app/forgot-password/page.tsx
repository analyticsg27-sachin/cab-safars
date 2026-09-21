'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X } from 'lucide-react';
import { asset } from '@/lib/basepath';
import AuthService from '@/lib/services/auth.service';
import AppShell from '@/components/app/AppShell';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugOtp, setDebugOtp] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) { setError('Please enter your registered mobile number.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await AuthService.forgotPassword(phone.trim());
      // Store phone for reset page, show OTP for testing
      sessionStorage.setItem('fp_phone', phone.trim());
      if (res.debug_otp) {
        setDebugOtp(res.debug_otp);
      } else {
        router.push('/app/reset-password');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (debugOtp) {
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
              onClick={() => router.push('/app/login')}
              className="flex items-center justify-center w-10 h-10 rounded-2xl transition-all active:scale-90"
              style={{ backgroundColor: '#111827', border: '1px solid #243042', color: '#94A3B8' }}
            >
              <ArrowLeft size={18} />
            </button>
          </div>
          <div className="px-6 pt-4 pb-2 flex flex-col items-center">
            <img src={asset('/logo-v2.png')} alt="CAB SAFARS" style={{ height: 50 }} className="w-auto object-contain mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-1">OTP Sent</h1>
            <p className="text-sm text-center" style={{ color: '#94A3B8' }}>Use the OTP below to reset your password</p>
          </div>
          <div className="mx-4 mt-6 mb-4 rounded-3xl p-6 shadow-2xl" style={{ backgroundColor: '#111827', border: '1px solid #243042' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#94A3B8' }}>Your OTP (testing only)</p>
            <div
              className="w-full text-center text-4xl font-bold tracking-[0.4em] py-4 rounded-2xl mb-4"
              style={{ backgroundColor: '#1A2332', color: '#F5A623', border: '1px solid #243042' }}
            >
              {debugOtp}
            </div>
            <p className="text-xs text-center mb-5" style={{ color: '#64748B' }}>This OTP is valid for 10 minutes. In production, it will be sent via SMS.</p>
            <button
              onClick={() => router.push('/app/reset-password')}
              className="w-full py-4 rounded-2xl text-base font-bold transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #F5A623 0%, #D4891E 100%)', color: '#000000' }}
            >
              Enter OTP & Reset Password
            </button>
          </div>
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
            onClick={() => router.push('/app/login')}
            className="flex items-center justify-center w-10 h-10 rounded-2xl transition-all active:scale-90"
            style={{ backgroundColor: '#111827', border: '1px solid #243042', color: '#94A3B8' }}
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="px-6 pt-4 pb-2 flex flex-col items-center">
          <img src={asset('/logo-v2.png')} alt="CAB SAFARS" style={{ height: 50 }} className="w-auto object-contain mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-1">Forgot Password</h1>
          <p className="text-sm text-center" style={{ color: '#94A3B8' }}>Enter your registered mobile number to receive an OTP</p>
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
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>
                Mobile Number
              </label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-base font-bold mt-1 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #F5A623 0%, #D4891E 100%)', color: '#000000' }}
            >
              {loading ? (
                <><span className="inline-block w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />Please wait...</>
              ) : 'Send OTP'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/app/login')}
              className="w-full text-center text-sm transition-colors"
              style={{ color: '#94A3B8' }}
            >
              Back to Sign In
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
