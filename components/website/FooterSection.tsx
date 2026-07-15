'use client';

import { Globe, Link2, Hash, Bookmark, Play } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

const platformLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Premium", href: "#premium" },
  { label: "Pricing", href: "#pricing" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const socialLinks = [
  { icon: Globe, label: "Website" },
  { icon: Link2, label: "LinkedIn" },
  { icon: Hash, label: "Twitter / X" },
  { icon: Bookmark, label: "Instagram" },
  { icon: Play, label: "YouTube" },
];

export default function FooterSection() {
  return (
    <footer
      className="border-t"
      style={{ backgroundColor: "#0B1220", borderColor: "#243042" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand */}
          <div>
            <div className="mb-4">
              <BrandLogo />
            </div>
            <p className="text-sm leading-relaxed mb-2" style={{ color: "#94A3B8" }}>
              A dedicated marketplace connecting transport vendors and drivers across India.
            </p>
            <p className="text-sm font-semibold mb-6" style={{ color: "#94A3B8" }}>
              Safe Loads. Smart Journeys.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: "#243042", color: "#94A3B8" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "#FFFFFF" }}
            >
              Platform
            </h4>
            <ul className="flex flex-col gap-3">
              {platformLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm transition-colors"
                    style={{ color: "#94A3B8" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = "#FFFFFF")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = "#94A3B8")
                    }
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "#FFFFFF" }}
            >
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm transition-colors"
                    style={{ color: "#94A3B8" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = "#FFFFFF")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLAnchorElement).style.color = "#94A3B8")
                    }
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Download */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "#FFFFFF" }}
            >
              Download
            </h4>
            <div className="flex flex-col gap-3">
              {/* App Store Badge */}
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-not-allowed"
                style={{ backgroundColor: "#243042", border: "1px solid #243042" }}
              >
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <p className="text-[10px]" style={{ color: "#94A3B8" }}>Download on the</p>
                  <p className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>App Store</p>
                </div>
              </div>
              {/* Play Store Badge */}
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-not-allowed"
                style={{ backgroundColor: "#243042", border: "1px solid #243042" }}
              >
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="white">
                  <path d="M3.18 23.76c.3.17.65.19.97.07l12.49-7.22-2.79-2.79-10.67 9.94zM.54 1.52C.2 1.86 0 2.39 0 3.07v17.86c0 .68.2 1.21.55 1.55l.08.07 10-10v-.23L.62 1.45l-.08.07zM20.46 10.37l-2.8-1.62-3.13 3.13 3.13 3.13 2.82-1.63c.8-.46.8-1.21 0-1.67l-.02.06zM3.18.24l12.49 7.22-2.79 2.79L2.21.31c.32-.14.68-.12.97-.07z" />
                </svg>
                <div>
                  <p className="text-[10px]" style={{ color: "#94A3B8" }}>Get it on</p>
                  <p className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>Google Play</p>
                </div>
              </div>
              <p
                className="text-xs text-center font-medium mt-1"
                style={{ color: "#94A3B8" }}
              >
                Coming Soon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid #243042" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            &copy; {new Date().getFullYear()} CAB SAFARS. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            Made with ❤️ for Indian truckers
          </p>
        </div>
      </div>
    </footer>
  );
}
