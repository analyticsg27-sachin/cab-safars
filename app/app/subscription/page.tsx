'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Lock, Check, X, ChevronRight, Calendar, Shield } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import { useAppState } from '@/lib/app-state';
import { useTranslation } from '@/lib/useTranslation';
import { isFullyActive, LockedFeature } from '@/components/app/AccountStatusBanner';

type PaymentState = 'idle' | 'processing' | 'success' | 'failed';

const VENDOR_FEATURES = [
  'Priority listing in search',
  'Premium vendor badge',
  'Higher visibility in driver discovery',
  'Verified profile highlight',
  'Advanced trip analytics',
];

const DRIVER_FEATURES = [
  'Direct Call & WhatsApp to Vendors',
  'Priority trip notifications',
  'Smart route matching',
  'Unlimited trip contacts',
  'Premium badge on profile',
  '24/7 support priority',
];

const DEMO_PAYMENT_HISTORY = [
  { date: 'Jun 20, 2026', amount: '₹199.00', txnId: 'CS74628193', status: 'PAID' },
  { date: 'May 20, 2026', amount: '₹199.00', txnId: 'CS61837462', status: 'PAID' },
  { date: 'Apr 20, 2026', amount: '₹199.00', txnId: 'CS50293847', status: 'PAID' },
];

function randomTxnId() {
  return 'CS' + Math.floor(10000000 + Math.random() * 90000000).toString();
}

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// â"€â"€â"€ Spinner â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function GoldSpinner() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div
        className="w-24 h-24 rounded-full animate-spin"
        style={{
          border: '4px solid rgba(245,166,35,0.15)',
          borderTop: '4px solid #F5A623',
        }}
      />
      <div className="text-center">
        <p className="text-lg font-bold mb-1" style={{ color: '#F0F6FC' }}>{t('processing_payment')}</p>
        <p className="text-sm" style={{ color: '#8B949E' }}>{t('dont_close_screen')}</p>
      </div>
    </div>
  );
}

// â"€â"€â"€ Success â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function PaymentSuccess({ txnId, onContinue }: { txnId: string; onContinue: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 text-center">
      {/* Animated check */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(34,197,94,0.12)',
          border: '2px solid rgba(34,197,94,0.4)',
          animation: 'scaleIn 0.4s ease-out',
        }}
      >
        <Check size={40} style={{ color: '#22C55E' }} strokeWidth={3} />
      </div>
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: '#F0F6FC' }}>{t('payment_successful')}</h2>
        <p className="text-sm" style={{ color: '#8B949E' }}>{t('premium_now_active')}</p>
      </div>

      {/* Transaction details */}
      <div
        className="w-full rounded-2xl border p-4 text-left"
        style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
      >
        {[
          { label: t('label_amount'), value: '₹199.00' },
          { label: t('label_plan'), value: t('premium_monthly') },
          { label: t('label_valid_till'), value: addDays(30) },
          { label: t('label_txn_id'), value: txnId },
          { label: t('label_status'), value: 'PAID' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between py-2.5" style={{ borderBottom: '1px solid #30363D' }}>
            <span className="text-sm" style={{ color: '#8B949E' }}>{label}</span>
            <span
              className="text-sm font-semibold"
              style={{ color: label === 'Status' ? '#22C55E' : '#F0F6FC', fontFamily: label === 'Transaction ID' ? 'monospace' : undefined }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <button
        className="w-full h-14 rounded-xl font-semibold text-base"
        style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
        onClick={onContinue}
      >
        {t('continue_to_app')}
      </button>
    </div>
  );
}

// â"€â"€â"€ Failed â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function PaymentFailed({ onRetry, onContact }: { onRetry: () => void; onContact: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(239,68,68,0.12)', border: '2px solid rgba(239,68,68,0.4)' }}
      >
        <X size={40} style={{ color: '#EF4444' }} strokeWidth={3} />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: '#F0F6FC' }}>{t('payment_failed_title')}</h2>
        <p className="text-sm" style={{ color: '#8B949E' }}>
          {t('payment_failed_desc')}
        </p>
      </div>
      <div className="w-full space-y-3">
        <button
          className="w-full h-14 rounded-xl font-semibold text-base"
          style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
          onClick={onRetry}
        >
          {t('try_again')}
        </button>
        <button
          className="w-full h-14 rounded-xl font-semibold text-base"
          style={{ backgroundColor: '#21262D', color: '#F0F6FC', border: '1px solid #30363D' }}
          onClick={onContact}
        >
          {t('contact_support')}
        </button>
      </div>
      <p className="text-xs" style={{ color: '#8B949E' }}>
        {t('test_payment_failure')}
      </p>
    </div>
  );
}

// â"€â"€â"€ Page â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export default function SubscriptionPage() {
  const router = useRouter();
  const { state, dispatch } = useAppState();
  const currentUser = state.currentUser;
  const isDriver = currentUser?.role === 'driver';

  const { t } = useTranslation();
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');

  if (currentUser && !isFullyActive(currentUser)) {
    return (
      <AppShell>
        <AppHeader title={t('subscription')} showBack onBack={() => router.back()} />
        <LockedFeature user={currentUser} feature="subscribe to Premium" />
      </AppShell>
    );
  }
  const [txnId, setTxnId] = useState('');

  // Read real premium status from app state
  const isPremium = currentUser?.isPremium ?? false;

  function handleSubscribe(simulateFail = false) {
    setPaymentState('processing');
    setTimeout(() => {
      if (simulateFail) {
        setPaymentState('failed');
      } else {
        setTxnId(randomTxnId());
        setPaymentState('success');
      }
    }, 2500);
  }

  function handleSuccess() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    dispatch({ type: 'UPGRADE_PREMIUM', payload: { premiumExpiry: expiry.toISOString().split('T')[0] } });
    setPaymentState('idle');
    router.push(isDriver ? '/app/driver/home' : '/app/vendor/home');
  }

  const features = isDriver ? DRIVER_FEATURES : VENDOR_FEATURES;

  // â"€â"€ Processing overlay â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  if (paymentState === 'processing') {
    return (
      <AppShell>
        <div
          className="flex-1 flex items-center justify-center px-6"
          style={{ backgroundColor: '#0D1117' }}
        >
          <GoldSpinner />
        </div>
      </AppShell>
    );
  }

  // â"€â"€ Success â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  if (paymentState === 'success') {
    return (
      <AppShell>
        <AppHeader title={t('payment_successful')} />
        <main className="flex-1 flex items-center overflow-y-auto px-4 py-8">
          <PaymentSuccess txnId={txnId} onContinue={handleSuccess} />
        </main>
      </AppShell>
    );
  }

  // â"€â"€ Failed â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  if (paymentState === 'failed') {
    return (
      <AppShell>
        <AppHeader title={t('payment_failed_title')} showBack onBack={() => setPaymentState('idle')} />
        <main className="flex-1 flex items-center overflow-y-auto px-4 py-8">
          <PaymentFailed
            onRetry={() => setPaymentState('idle')}
            onContact={() => router.push('/app/support')}
          />
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AppHeader title={t('premium_subscription')} showBack onBack={() => router.back()} />

      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-5">
        {!isPremium ? (
          <>
            {/* Hero */}
            <div className="flex flex-col items-center text-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,166,35,0.2), rgba(245,166,35,0.05))',
                  border: '2px solid rgba(245,166,35,0.3)',
                }}
              >
                <Crown size={36} style={{ color: '#F5A623' }} />
              </div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: '#F0F6FC' }}>{t('go_premium')}</h1>
              <p className="text-sm" style={{ color: '#8B949E' }}>{t('unlock_experience')}</p>
            </div>

            {/* Plan card */}
            <div
              className="rounded-2xl p-5 mb-5"
              style={{
                backgroundColor: '#161B22',
                border: '1px solid rgba(245,166,35,0.4)',
                boxShadow: '0 0 24px rgba(245,166,35,0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-base" style={{ color: '#F0F6FC' }}>{t('premium_trip')}</span>
                <div className="text-right">
                  <span className="text-3xl font-bold" style={{ color: '#F5A623' }}>₹199</span>
                  <span className="text-sm" style={{ color: '#8B949E' }}>/month</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-5">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(245,166,35,0.15)' }}
                    >
                      <Check size={11} style={{ color: '#F5A623' }} strokeWidth={3} />
                    </div>
                    <span className="text-sm" style={{ color: '#F0F6FC' }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Subscribe button */}
              <button
                className="w-full h-14 rounded-xl font-semibold text-base mb-3"
                style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
                onClick={() => handleSubscribe(false)}
              >
                {t('subscribe_now')}
              </button>

              {/* Razorpay note */}
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <Lock size={11} style={{ color: '#8B949E' }} />
                <span className="text-xs" style={{ color: '#8B949E' }}>{t('secure_razorpay')}</span>
              </div>
              <p className="text-center text-xs" style={{ color: '#8B949E' }}>
                {t('auto_renews')}
              </p>
            </div>

            {/* Test failure link */}
            <div className="text-center">
              <button
                className="text-xs underline"
                style={{ color: '#8B949E' }}
                onClick={() => handleSubscribe(true)}
              >
                {t('test_payment_failure')}
              </button>
            </div>
          </>
        ) : (
          /* ── Active Premium State ── */
          <>
            {/* Active badge */}
            <div className="flex flex-col items-center text-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))',
                  border: '2px solid rgba(34,197,94,0.3)',
                }}
              >
                <Crown size={36} style={{ color: '#22C55E' }} />
              </div>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full mb-2"
                style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#22C55E' }}
              >
                {t('active_status_badge')}
              </span>
              <h1 className="text-xl font-bold" style={{ color: '#F0F6FC' }}>{t('premium_member')}</h1>
              <p className="text-sm" style={{ color: '#8B949E' }}>{t('you_have_full_access')}</p>
            </div>

            {/* Current plan info — real dates from state */}
            <div
              className="rounded-2xl border p-4 mb-4"
              style={{ backgroundColor: '#161B22', borderColor: 'rgba(34,197,94,0.3)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} style={{ color: '#22C55E' }} />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>{t('current_plan')}</p>
              </div>
              {(() => {
                const expiry = currentUser?.premiumExpiry ?? addDays(30);
                const expiryDate = new Date(expiry);
                const today = new Date();
                const daysLeft = Math.max(0, Math.ceil((expiryDate.getTime() - today.getTime()) / 86400000));
                const startDate = new Date(expiryDate);
                startDate.setDate(startDate.getDate() - 30);
                const fmtDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                return [
                  { label: t('label_plan'), value: t('premium_monthly') },
                  { label: t('label_price'), value: '₹199/month' },
                  { label: t('label_started_on'), value: fmtDate(startDate) },
                  { label: t('label_valid_till'), value: fmtDate(expiryDate) },
                  { label: t('label_days_remaining'), value: `${daysLeft} day${daysLeft !== 1 ? 's' : ''}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2.5" style={{ borderBottom: '1px solid #30363D' }}>
                    <span className="text-sm" style={{ color: '#8B949E' }}>{label}</span>
                    <span className="text-sm font-medium" style={{ color: label === 'Days remaining' ? '#22C55E' : '#F0F6FC' }}>{value}</span>
                  </div>
                ));
              })()}
              <div className="flex justify-between items-center py-2.5">
                <span className="text-sm" style={{ color: '#8B949E' }}>{t('auto_renew')}</span>
                <div className="w-11 h-6 rounded-full relative" style={{ backgroundColor: '#22C55E' }}>
                  <div className="absolute w-5 h-5 rounded-full top-0.5 right-0.5" style={{ backgroundColor: '#fff' }} />
                </div>
              </div>
            </div>

            {/* Payment history */}
            <div
              className="rounded-2xl border p-4"
              style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8B949E' }}>
                {t('payment_history')}
              </p>
              {DEMO_PAYMENT_HISTORY.map((p, i) => (
                <div
                  key={p.txnId}
                  className="flex items-center justify-between py-3"
                  style={{ borderBottom: i < DEMO_PAYMENT_HISTORY.length - 1 ? '1px solid #30363D' : 'none' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F0F6FC' }}>{p.date}</p>
                    <p className="text-xs font-mono" style={{ color: '#8B949E' }}>{p.txnId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: '#F0F6FC' }}>{p.amount}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </AppShell>
  );
}
