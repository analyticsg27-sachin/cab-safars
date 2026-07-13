"use client";

import { useState, useEffect } from "react";
import { Menu, X, Car, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
          ? "bg-[#0D1117]/95 backdrop-blur-xl border-b border-[#30363D]/80 shadow-2xl"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#F5A623] flex items-center justify-center shadow-lg shadow-[#F5A623]/30 group-hover:shadow-[#F5A623]/50 transition-shadow">
            <Car className="w-4.5 h-4.5 text-[#0D1117]" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-[#F0F6FC] text-lg tracking-tight">
            CAB <span className="text-[#F5A623]">SAFARS</span>
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  link.label === "App Preview"
                    ? "text-[#F5A623] hover:text-[#FFD580] hover:bg-[#F5A623]/10 font-medium border border-[#F5A623]/20"
                    : "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Smartphone className="w-4 h-4" />
            Get App
          </Button>
          <Button variant="primary" size="sm">
            Join Free
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 bg-[#0D1117]/98 border-t border-[#30363D]/60",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 mt-3 pt-3 border-t border-[#30363D]">
            <Button variant="secondary" size="sm" className="flex-1">
              <Smartphone className="w-4 h-4" /> Get App
            </Button>
            <Button variant="primary" size="sm" className="flex-1">
              Join Free
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
