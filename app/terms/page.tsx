import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — Cab Safars",
  description: "Terms and Conditions for using the Cab Safars platform.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By registering for or using Cab Safars (the "Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Platform.

Cab Safars is a transport marketplace that connects vendors who post trips with drivers who fulfil those trips. We are not a transport operator, carrier, or logistics company. We provide a technology platform that facilitates connections between independent vendors and drivers.`,
  },
  {
    title: "2. Eligibility & Registration",
    content: `To use Cab Safars, you must:

• Be at least 18 years of age
• Provide accurate and complete registration information
• Have a valid Indian mobile number
• For drivers: possess a valid driving licence and vehicle registration
• Agree to submit to our account verification process

Your account is subject to approval by Cab Safars. We reserve the right to reject or suspend accounts at our discretion. You are responsible for maintaining the confidentiality of your login credentials.`,
  },
  {
    title: "3. User Roles",
    content: `Cab Safars has two user roles:

VENDOR: A person or business that posts transport trips seeking drivers. Vendors are responsible for the accuracy of trip details including pickup, destination, date, and cargo information.

DRIVER: A person who seeks trips to fulfil using their own vehicle. Drivers are responsible for their own conduct, compliance with traffic laws, and the safe handling of cargo.

Neither vendors nor drivers are employees or agents of Cab Safars.`,
  },
  {
    title: "4. Premium Subscription",
    content: `Cab Safars offers a Premium subscription at ₹199 per month.

Premium Drivers: Can view vendor contact information and initiate Call or WhatsApp communication with vendors.

Premium Vendors: Receive priority listing placement and a Premium badge on their trip posts.

Subscriptions auto-renew monthly unless cancelled. No refund is provided for the remaining subscription period after a mid-cycle cancellation, except where required by applicable law. Failed payments result in loss of Premium features until payment is successful.`,
  },
  {
    title: "5. Trip Posting & Matching",
    content: `Vendors may post trips for drivers to discover. Trip posts must be genuine — false, misleading, or spam trips are prohibited.

Contact activity (calls and WhatsApp messages initiated through the Platform) is logged for platform integrity purposes. The contact information shared is the vendor's registered mobile number.

Cab Safars does not guarantee that any trip will be fulfilled or that any driver will contact a vendor. The Platform facilitates discovery and connection; all commercial arrangements are made directly between vendors and drivers.`,
  },
  {
    title: "6. Prohibited Conduct",
    content: `You may not:

• Create multiple accounts or impersonate another person
• Post false, misleading, or fraudulent trip information
• Use the Platform to harass, abuse, or harm other users
• Attempt to access contact information through circumventing Premium restrictions
• Use the Platform for any illegal purpose
• Scrape, copy, or distribute Platform content without permission
• Attempt to reverse-engineer or interfere with the Platform

Violations may result in immediate account suspension.`,
  },
  {
    title: "7. Payments",
    content: `All payments on Cab Safars are processed through Razorpay, a third-party payment gateway. By making a payment, you agree to Razorpay's terms and conditions.

Cab Safars is not responsible for payment processing failures caused by your bank or card issuer. In case of a payment dispute, contact us at billing@cabsafars.com.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `Cab Safars provides the Platform on an "as-is" basis. We do not guarantee uninterrupted availability, accuracy of search results, or successful trip fulfilment.

To the maximum extent permitted by law, Cab Safars shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform, including but not limited to loss of revenue, loss of data, or disputes between vendors and drivers.

Our total liability to you shall not exceed the amount you paid to Cab Safars in the 12 months preceding the claim.`,
  },
  {
    title: "9. Intellectual Property",
    content: `The Cab Safars name, logo, and all Platform content are the intellectual property of Cab Safars. You may not use our branding, copy our Platform design, or reproduce our content without written permission.

You retain ownership of the content you post (trip details, profile information), but grant Cab Safars a licence to use that content to operate and promote the Platform.`,
  },
  {
    title: "10. Termination",
    content: `We may suspend or terminate your account at any time for violations of these Terms. You may delete your account at any time from within the app.

Upon termination, your right to use the Platform ceases. Active subscription payments are not refunded upon account termination for policy violations.`,
  },
  {
    title: "11. Governing Law",
    content: `These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Gujarat, India.`,
  },
  {
    title: "12. Changes to Terms",
    content: `We may update these Terms from time to time. We will notify you of material changes via the app or email. Your continued use of Cab Safars after the effective date of changes constitutes acceptance.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0D1117]">
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
          <span className="text-sm text-[#F0F6FC]">Terms of Service</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#F5A623] flex items-center justify-center">
              <span className="text-[#0D1117] font-bold text-xs">CS</span>
            </div>
            <span className="text-[#8B949E] text-sm">Cab Safars</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F0F6FC] mb-3">Terms of Service</h1>
          <p className="text-[#8B949E]">
            Effective Date: July 13, 2025 &nbsp;·&nbsp; Last Updated: July 13, 2025
          </p>
          <p className="text-[#8B949E] mt-4 text-sm leading-relaxed">
            Please read these Terms of Service carefully before using Cab Safars. These terms constitute a legally binding
            agreement between you and Cab Safars.
          </p>
        </div>

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

        <div className="mt-10 p-6 bg-[#F5A623]/8 border border-[#F5A623]/20 rounded-xl">
          <h3 className="text-[#F5A623] font-semibold mb-2">Contact Us</h3>
          <p className="text-[#8B949E] text-sm">
            Questions about these terms? Email{" "}
            <a href="mailto:legal@cabsafars.com" className="text-[#F5A623] hover:underline">
              legal@cabsafars.com
            </a>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-[#30363D] text-center">
          <p className="text-xs text-[#8B949E]">
            © 2025 Cab Safars. All rights reserved. &nbsp;·&nbsp;
            <Link href="/privacy" className="hover:text-[#F0F6FC] transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
