"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How do I register as a vendor or driver?",
    a: "Registration is completely free. Click 'Join Free' on the homepage, choose your role (Vendor or Driver), fill in your details, and submit for verification. Our team reviews applications within 24 hours.",
  },
  {
    q: "What is the difference between a free and premium account?",
    a: "Free accounts can post trips (vendors) or browse trips (drivers) with limited contact access. Premium accounts unlock direct contact with drivers/vendors, priority search listing, smart route matching for drivers, and detailed analytics — all for ₹199/month.",
  },
  {
    q: "How does smart route matching work for drivers?",
    a: "When you search for trips, our engine detects your location and the destination. It then suggests open trips near your destination, so you can book a return-trip fare and earn more on every journey instead of returning empty.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. All payments are processed through Razorpay, India's leading payment gateway. We never store card or banking details. Transactions are 256-bit SSL encrypted.",
  },
  {
    q: "Can I cancel my premium subscription anytime?",
    a: "Absolutely. You can cancel your subscription at any point from your account settings. Your premium benefits continue until the end of the current billing period, after which it reverts to the free plan.",
  },
  {
    q: "What types of vehicles can be registered?",
    a: "We support all commercial vehicle types — sedans, hatchbacks, SUVs, MUVs, mini-trucks, tempo travellers, and buses. Select the appropriate category during driver registration.",
  },
  {
    q: "How are vendors and drivers verified?",
    a: "Vendors submit business details and contact information. Drivers submit their driving license and vehicle registration certificate (RC). Our team manually reviews and approves all accounts before they go live.",
  },
  {
    q: "Is CAB SAFARS available across India?",
    a: "We launched with a focus on Gujarat and Maharashtra and are actively expanding across India. Vendors and drivers from all states are welcome to register.",
  },
];

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className={cn(
      "border border-[#30363D] rounded-xl overflow-hidden transition-colors",
      open && "border-[#F5A623]/30"
    )}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left bg-[#161B22] hover:bg-[#1C2128] transition-colors"
      >
        <span className={cn("text-sm font-medium leading-snug", open ? "text-[#F0F6FC]" : "text-[#8B949E]")}>
          {q}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 shrink-0 text-[#8B949E] transition-transform duration-200",
            open && "rotate-180 text-[#F5A623]"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="px-5 pb-5 text-sm text-[#8B949E] leading-relaxed border-t border-[#30363D] pt-4">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-[#0D1117]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-xs font-semibold uppercase tracking-wider mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F0F6FC] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#8B949E] text-lg">
            Everything you need to know about CAB SAFARS.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
