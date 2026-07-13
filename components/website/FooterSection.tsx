import { Car, Mail, Phone, MapPin } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Premium", href: "#premium" },
  { label: "FAQ", href: "#faq" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "App Preview", href: "/app" },
  { label: "Admin Panel", href: "/admin" },
];

export default function FooterSection() {
  return (
    <footer className="bg-[#161B22] border-t border-[#30363D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#F5A623] flex items-center justify-center">
                <Car className="w-4 h-4 text-[#0D1117]" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-[#F0F6FC] text-lg tracking-tight">
                CAB <span className="text-[#F5A623]">SAFARS</span>
              </span>
            </div>
            <p className="text-sm text-[#8B949E] leading-relaxed max-w-sm mb-6">
              India&apos;s premier vendor-driver transport marketplace. Connecting vendors with
              reliable drivers through smart technology and transparent processes.
            </p>
            <div className="flex flex-col gap-2">
              <a href="mailto:support@cabsafars.in" className="flex items-center gap-2 text-sm text-[#8B949E] hover:text-[#F5A623] transition-colors">
                <Mail className="w-4 h-4" /> support@cabsafars.in
              </a>
              <a href="tel:+918888888888" className="flex items-center gap-2 text-sm text-[#8B949E] hover:text-[#F5A623] transition-colors">
                <Phone className="w-4 h-4" /> +91 88888 88888
              </a>
              <span className="flex items-center gap-2 text-sm text-[#8B949E]">
                <MapPin className="w-4 h-4" /> Ahmedabad, Gujarat, India
              </span>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-xs font-bold text-[#F0F6FC] uppercase tracking-widest mb-5">Platform</h4>
            <ul className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-[#8B949E] hover:text-[#F5A623] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold text-[#F0F6FC] uppercase tracking-widest mb-5">Legal</h4>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-[#8B949E] hover:text-[#F5A623] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#30363D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#8B949E]">
            © {new Date().getFullYear()} CAB SAFARS. All rights reserved.
          </p>
          <p className="text-xs text-[#8B949E]">
            Made with ♥ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
