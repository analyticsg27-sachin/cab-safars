'use client';

import { useRouter } from 'next/navigation';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';

const SECTIONS = [
  {
    title: '1. About CAB SAFARS',
    body: `CAB SAFARS provides tools for Trip Providers to create listings and for Drivers to browse listings available to their accounts.`,
  },
  {
    title: '2. User Roles',
    body: `The app displays account types, available listing actions, and contact options according to current account status and service availability.`,
  },
  {
    title: '3. Trip Settlement & Pricing',
    body: `All trip fares, rates, pickup times, and conditions are settled directly between the Driver and the Trip Provider. CAB SAFARS is not a party to any financial or contractual agreement between users. We do not guarantee any specific fare, route, or outcome. Any dispute arising from a trip must be resolved between the Driver and Trip Provider directly.`,
  },
  {
    title: '4. Trip Closure',
    body: `It is the sole responsibility of the Trip Provider to close a trip once a driver has been confirmed. If a trip remains open after completion, CAB SAFARS or its admin may close it after verification. Failure to close completed trips may result in account warnings.`,
  },
  {
    title: '5. Subscription & Payments',
    body: `Review the current membership price, payment method, duration, and renewal terms shown in the app before purchasing.`,
  },
  {
    title: '6. No Refund Policy',
    body: `Review the refund terms shown with any purchase option before completing a transaction.`,
  },
  {
    title: '7. No Cancellation Policy',
    body: `CAB SAFARS does not mediate, track, or enforce trip cancellations. All cancellation terms are agreed upon directly between the Driver and Trip Provider before or during the trip. CAB SAFARS holds no liability for cancellations, no-shows, or changes in trip plans.`,
  },
  {
    title: '8. Document Verification',
    body: `The app may request information or documents based on account type and service requirements. Follow the status and instructions shown in your account.`,
  },
  {
    title: '9. Premium Contact Unlock',
    body: `Contact options, where available, are displayed in the app according to account status and service availability.`,
  },
  {
    title: '10. Prohibited Activities',
    body: `Users must not post false, misleading, or fraudulent trips. Users must not use the platform for any illegal transportation activity. Spam, abuse, or harassment of other users is strictly prohibited and will result in permanent ban.`,
  },
  {
    title: '11. Privacy',
    body: `See the Privacy Policy for information about personal data collected and how it is used.`,
  },
  {
    title: '12. Limitation of Liability',
    body: `CAB SAFARS is a marketplace platform only. We are not responsible for any loss, damage, theft, accident, or dispute arising from trips arranged through our platform. Use of the platform is at your own risk. Our maximum liability in any case is limited to the subscription amount paid in the last billing cycle.`,
  },
  {
    title: '13. Changes to Terms',
    body: `We reserve the right to update these terms at any time. Continued use of the app after changes constitutes acceptance of the updated terms. Major changes will be notified via push notification.`,
  },
  {
    title: '14. Contact Us',
    body: `CAB SAFARS Support\nPhone / WhatsApp: +91 9574816765\nEmail: support@cabsafars.in\nAddress: F-18, Janki Apartment, Opp Fojdar Ni Chali, Saijpur Bogha, Naroda, Ahmedabad\nSupport Hours: Monday to Saturday, 9 AM – 6 PM IST`,
  },
];

export default function TermsPage() {
  const router = useRouter();

  return (
    <AppShell>
      <AppHeader title="Terms & Privacy Policy" showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-5">
        <div className="rounded-xl px-4 py-3 mb-5" style={{ backgroundColor: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)' }}>
          <p className="text-xs" style={{ color: '#F5A623' }}>Effective Date: July 2026 · Last Updated: July 2026</p>
          <p className="text-xs mt-1" style={{ color: '#8B949E' }}>By using CAB SAFARS, you agree to the following terms.</p>
        </div>

        <div className="flex flex-col gap-4">
          {SECTIONS.map(({ title, body }) => (
            <div key={title} className="rounded-2xl border px-4 py-4" style={{ backgroundColor: '#161B22', borderColor: '#30363D' }}>
              <p className="text-sm font-bold mb-2" style={{ color: '#F0F6FC' }}>{title}</p>
              <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: '#8B949E' }}>{body}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#374151' }}>
          © 2026 CAB SAFARS. All rights reserved.
        </p>
      </main>
    </AppShell>
  );
}
