"use client";

import { useState, useEffect } from "react";
import { BP } from "@/lib/basepath";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/ui/BrandLogo";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Premium", href: "#premium" },
  { label: "FAQ", href: "#faq" },
  { label: "App Preview", href: "/app", external: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0B1220]/96 backdrop-blur-xl border-b border-[#243042] shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav
        className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        style={{ maxWidth: "1400px" }}
      >
        {/* Logo — left */}
        <a href="#home" className="flex items-center shrink-0">
          <BrandLogo variant="wordmark" size="sm" />
        </a>

        {/* Desktop Links — center */}
        <ul className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <li key={link.href} className="relative group">
              <a
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={cn(
                  "relative px-3 py-2 rounded-lg text-sm font-medium font-['Inter',sans-serif] transition-colors duration-200",
                  activeLink === link.href
                    ? "text-white bg-[#1A2332]"
                    : link.external
                    ? "text-[#F5A623] hover:text-[#FFD580] hover:bg-[#1A2332]"
                    : "text-[#8B949E] hover:text-white hover:bg-[#1A2332]"
                )}
              >
                {link.label}
                {/* smooth underline animation */}
                <span
                  className={cn(
                    "absolute bottom-0.5 left-3 right-3 h-px bg-[#F5A623] transition-transform duration-300 origin-left",
                    activeLink === link.href
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs — right */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <a href={`${BP}/app/login/`}>
            <Button
              variant="outline"
              size="sm"
              className="border-[#243042] text-[#C9D1D9] hover:text-white hover:border-[#3A4F66] hover:bg-[#1A2332] transition-all"
            >
              Sign In
            </Button>
          </a>
          <a href={`${BP}/app/register/`}>
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#F5A623] to-[#E8920F] text-[#0B1220] font-semibold hover:from-[#FFB84D] hover:to-[#F5A623] shadow-md shadow-[#F5A623]/20 transition-all"
            >
              Get Started
            </Button>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#8B949E] hover:text-white hover:bg-[#1A2332] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 bg-[#0B1220]/98 backdrop-blur-xl border-t border-[#243042]",
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-5 flex flex-col gap-1">
          {/* Logo at top of mobile menu */}
          <div className="flex items-center mb-4 pb-4 border-b border-[#243042]">
            <BrandLogo variant="wordmark" size="sm" />
          </div>

          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => {
                setActiveLink(link.href);
                setOpen(false);
              }}
              className={cn(
                "px-3 py-2.5 rounded-lg text-sm font-medium font-['Inter',sans-serif] transition-colors duration-200",
                activeLink === link.href
                  ? "text-white bg-[#1A2332]"
                  : link.external
                  ? "text-[#F5A623] hover:text-[#FFD580] hover:bg-[#1A2332]"
                  : "text-[#8B949E] hover:text-white hover:bg-[#1A2332]"
              )}
            >
              {link.label}
            </a>
          ))}

          <div className="flex gap-2 mt-4 pt-4 border-t border-[#243042]">
            <a href={`${BP}/app/login/`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-[#243042] text-[#C9D1D9] hover:text-white hover:border-[#3A4F66] hover:bg-[#1A2332]"
              >
                Sign In
              </Button>
            </a>
            <a href={`${BP}/app/register/`} className="flex-1">
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-[#F5A623] to-[#E8920F] text-[#0B1220] font-semibold hover:from-[#FFB84D] hover:to-[#F5A623] shadow-md shadow-[#F5A623]/20"
              >
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
