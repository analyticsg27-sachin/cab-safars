'use client';

import { useRouter } from 'next/navigation';
import { CreditCard, ChevronRight } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import { useAppState } from '@/lib/app-state';

const DEMO_PAYMENTS = [
  { date: 'Jun 20, 2026', amount: '₹199.00', txnId: 'CS74628193', plan: 'Premium Monthly', status: 'PAID' },
  { date: 'May 20, 2026', amount: '₹199.00', txnId: 'CS61837462', plan: 'Premium Monthly', status: 'PAID' },
  { date: 'Apr 20, 2026', amount: '₹199.00', txnId: 'CS50293847', plan: 'Premium Monthly', status: 'PAID' },
];

export default function PaymentHistoryPage() {
  const router = useRouter();
  const { state } = useAppState();
  const user = state.currentUser;

  if (!user) { router.replace('/app/'); return null; }

  const isPremium = user.isPremium;

  return (
    <AppShell>
      <AppHeader title="Payment History" showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-6">
        {isPremium ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1" style={{ color: '#8B949E' }}>
              Recent Transactions
            </p>
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
              {DEMO_PAYMENTS.map((p, i) => (
                <div
                  key={p.txnId}
                  className="flex items-center gap-3 px-4 py-4"
                  style={{ borderBottom: i < DEMO_PAYMENTS.length - 1 ? '1px solid #30363D' : 'none' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}
                  >
                    <CreditCard size={16} style={{ color: '#22C55E' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: '#F0F6FC' }}>{p.plan}</p>
                    <p className="text-xs truncate" style={{ color: '#8B949E' }}>
                      {p.date} &nbsp;·&nbsp; <span style={{ fontFamily: 'monospace' }}>{p.txnId}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ color: '#F0F6FC' }}>{p.amount}</p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty state for free users */
          <div className="flex flex-col items-center justify-center pt-20 px-6 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: 'rgba(139,148,158,0.08)', border: '1px solid #30363D' }}
            >
              <CreditCard size={32} style={{ color: '#30363D' }} />
            </div>
            <p className="text-lg font-bold mb-2" style={{ color: '#F0F6FC' }}>No Payments Yet</p>
            <p className="text-sm mb-8" style={{ color: '#8B949E' }}>
              Your payment history will appear here once you subscribe to a Premium plan.
            </p>
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold"
              style={{ backgroundColor: '#F5A623', color: '#0D1117' }}
              onClick={() => router.push('/app/subscription')}
            >
              View Premium Plans <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>
    </AppShell>
  );
}
