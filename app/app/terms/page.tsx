'use client';

import { useRouter } from 'next/navigation';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';

const SECTIONS = [
  {
    title: '1. About CAB SAFARS',
    body: `CAB SAFARS is a transport marketplace platform that connects Trip Providers (who post trips) with Drivers (who fulfill trips). We provide the platform only — we are not a transport operator, travel agent, or party to any trip agreement.`,
  },
  {
    title: '2. User Roles',
    body: `Free Driver: Can browse available trips. Cannot contact Trip Providers.
Premium Driver: Can directly contact Trip Providers via Call and WhatsApp to discuss and confirm trips.
Free Trip Provider: Can post trips for drivers to see.
Premium Trip Provider: Can post trips AND directly contact/discover available drivers.`,
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
    body: `Premium subscription is ₹199 per month. Payment is processed securely via Razorpay. Subscription activates immediately upon successful payment and is valid for 30 days from the date of purchase.`,
  },
  {
    title: '6. No Refund Policy',
    body: `All subscription payments are non-refundable. Once a Premium subscription is activated, no refund will be issued — whether partial or full — regardless of usage. This policy applies without exception. By purchasing a subscription, you agree to this no-refund policy.`,
  },
  {
    title: '7. No Cancellation Policy',
    body: `CAB SAFARS does not mediate, track, or enforce trip cancellations. All cancellation terms are agreed upon directly between the Driver and Trip Provider before or during the trip. CAB SAFARS holds no liability for cancellations, no-shows, or changes in trip plans.`,
  },
  {
    title: '8. Document Verification',
    body: `Users are required to submit valid identity and vehicle documents for verification. Approval is done manually by our admin team within 24–48 hours. Submitting false or forged documents will result in permanent account suspension and may be reported to authorities.`,
  },
  {
    title: '9. Premium Contact Unlock',
    body: `Premium members unlock direct contact (Call and WhatsApp) to the other party. CAB SAFARS does not monitor or record these communications. Users are responsible for their own conduct during all communications made through the platform.`,
  },
  {
    title: '10. Prohibited Activities',
    body: `Users must not post false, misleading, or fraudulent trips. Users must not use the platform for any illegal transportation activity. Spam, abuse, or harassment of other users is strictly prohibited and will result in permanent ban.`,
  },
  {
    title: '11. Privacy',
    body: `We collect your name, phone number, city, and documents for verification and platform functionality. Your contact details are never shared with non-Premium users. We do not sell or share your data with third parties. Data is stored securely and used only for platform operation.`,
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
