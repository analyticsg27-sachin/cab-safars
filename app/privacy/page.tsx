import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Cab Safars",
  description: "Privacy Policy for the Cab Safars platform.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly when you register for a Cab Safars account, including:

• Full name, mobile number, and email address
• Profile information (city, vehicle details for drivers, company name for vendors)
• Documents required for account verification
• Trip posting details (pickup/destination locations, dates, vehicle requirements)
• Payment information processed securely through our payment gateway (Razorpay)
• Device information and usage data to improve our services`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:

• Create and manage your Cab Safars account
• Facilitate connections between vendors and drivers
• Process subscription payments and manage Premium memberships
• Send notifications about trips, contacts, account status, and platform updates
• Verify user identities and prevent fraud
• Improve our platform and develop new features
• Comply with legal obligations`,
  },
  {
    title: "3. Information Sharing",
    content: `We share your information only as described below:

• Vendor contact information (phone number) is shared with Premium drivers when they choose to contact a vendor through the platform. This contact action is logged.
• We do not sell your personal information to third parties.
• We share data with service providers who assist in operating our platform (payment processing, push notifications).
• We may disclose information when required by law or to protect the rights, property, or safety of our users.`,
  },
  {
    title: "4. Premium Subscription & Payments",
    content: `Premium subscriptions are processed through Razorpay, a PCI-DSS compliant payment gateway. Cab Safars does not store your full card details.

Your subscription auto-renews monthly at ₹199 unless you cancel. You will receive an expiry reminder before renewal. You may cancel your subscription at any time through the app or by contacting support.`,
  },
  {
    title: "5. Data Security",
    content: `We implement industry-standard security measures to protect your information, including:

• HTTPS encryption for all data transmission
• Secure password hashing (we never store plain-text passwords)
• Regular security audits
• Access controls limiting who can view user data

No system is completely secure. We encourage you to use a strong password and keep your account credentials confidential.`,
  },
  {
    title: "6. Contact Information Visibility",
    content: `Your mobile number is used for account authentication. For drivers: your contact details are only accessible to vendors whose trips you have contacted. For vendors: your contact details are only accessible to Premium drivers who choose to contact your trips through the platform.`,
  },
  {
    title: "7. Data Retention",
    content: `We retain your account information for as long as your account is active. If you request account deletion, we will delete your personal data within 30 days, except where retention is required by law.

Trip records and contact activity logs may be retained in anonymised form for analytics purposes.`,
  },
  {
    title: "8. Your Rights",
    content: `You have the right to:

• Access the personal information we hold about you
• Correct inaccurate information
• Request deletion of your account and data
• Opt out of marketing communications
• Lodge a complaint with relevant data protection authorities

To exercise these rights, contact us at privacy@cabsafars.com`,
  },
  {
    title: "9. Cookies",
    content: `Our web platform uses cookies and similar technologies to maintain your session, remember your preferences, and analyse platform usage. You may disable cookies in your browser settings, though some features may not function correctly.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of material changes via the app or email. Your continued use of Cab Safars after changes take effect constitutes acceptance of the updated policy.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Header */}
      <div className="border-b border-[#30363D] bg-[#0D1117]/90 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[#8B949E] hover:text-[#F0F6FC] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="text-[#30363D]">/</span>
          <span className="text-sm text-[#F0F6FC]">Privacy Policy</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Title */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#F5A623] flex items-center justify-center">
              <span className="text-[#0D1117] font-bold text-xs">CS</span>
            </div>
            <span className="text-[#8B949E] text-sm">Cab Safars</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F0F6FC] mb-3">Privacy Policy</h1>
          <p className="text-[#8B949E]">
            Effective Date: July 13, 2025 &nbsp;·&nbsp; Last Updated: July 13, 2025
          </p>
          <p className="text-[#8B949E] mt-4 text-sm leading-relaxed">
            This Privacy Policy describes how Cab Safars ("we," "our," or "us") collects, uses, and shares information
            about you when you use our mobile application, website, or any related services. By using Cab Safars, you
            agree to the collection and use of information as described in this policy.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="bg-[#161B22] border border-[#30363D] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-[#F0F6FC] mb-3">{section.title}</h2>
              <div className="text-[#8B949E] text-sm leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 p-6 bg-[#F5A623]/8 border border-[#F5A623]/20 rounded-xl">
          <h3 className="text-[#F5A623] font-semibold mb-2">Questions about this policy?</h3>
          <p className="text-[#8B949E] text-sm">
            Contact our privacy team at{" "}
            <a href="mailto:privacy@cabsafars.com" className="text-[#F5A623] hover:underline">
              privacy@cabsafars.com
            </a>{" "}
            or write to Cab Safars, India.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-[#30363D] text-center">
          <p className="text-xs text-[#8B949E]">
            © 2025 Cab Safars. All rights reserved. &nbsp;·&nbsp;
            <Link href="/terms" className="hover:text-[#F0F6FC] transition-colors">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
