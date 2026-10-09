"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How do I register as a vendor or driver?",
    a: "Choose a role, enter the requested information, and follow the account setup steps in the app. Access can depend on account status.",
  },
  {
    q: "What is the difference between a free and premium account?",
    a: "Available features and contact options depend on your account type, status, and current service availability. See the account area for options available to you.",
  },
  {
    q: "How can I find trip listings?",
    a: "Sign in with a driver account and browse the listings available to your account.",
  },
  {
    q: "Where can I see account options?",
    a: "Open the account area in the app to review the options currently available to your account.",
  },
  {
    q: "What trip details can I include?",
    a: "Available fields are shown in the trip form. They can include route, date, vehicle, capacity, and fare information.",
  },
  {
    q: "What information may be requested during account setup?",
    a: "The app may request information relevant to your selected account type. Follow the prompts shown during registration.",
  },
  {
    q: "Where is CAB SAFARS intended to be used?",
    a: "Cab Safar is intended for users in India. Available listings and service access depend on location and account status.",
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
