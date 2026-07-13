"use client";

import { ArrowRight, Users, Car, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Active Vendors", value: "5,000+", icon: Users },
  { label: "Registered Drivers", value: "15,000+", icon: Car },
  { label: "Trips Matched", value: "50,000+", icon: MapPin },
  { label: "Premium Plan", value: "₹199/mo", icon: Star },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 65% 0%, rgba(245,166,35,0.12) 0%, transparent 55%), radial-gradient(ellipse at 5% 85%, rgba(45,107,228,0.09) 0%, transparent 50%), #0D1117",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#F0F6FC 1px, transparent 1px), linear-gradient(90deg, #F0F6FC 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-24 right-[10%] w-72 h-72 rounded-full bg-[#F5A623]/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-[5%] w-56 h-56 rounded-full bg-[#2D6BE4]/8 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-4xl">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-xs font-semibold mb-8 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
            India's #1 Transport Matching Platform
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#F0F6FC] leading-[1.05] tracking-tight mb-6">
            Connect.{" "}
            <br className="hidden sm:block" />
            Transport.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #F5A623, #FFD580)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Earn.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-[#8B949E] max-w-2xl leading-relaxed mb-10">
            The smarter way for{" "}
            <span className="text-[#F0F6FC] font-medium">transport vendors</span> to find
            reliable drivers and for{" "}
            <span className="text-[#F0F6FC] font-medium">drivers</span> to discover
            high-paying trips — powered by smart route matching.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-16">
            <Button variant="primary" size="xl" className="group">
              I&apos;m a Vendor
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button variant="secondary" size="xl" className="group">
              I&apos;m a Driver
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="bg-[#161B22]/80 backdrop-blur-sm border border-[#30363D] rounded-xl p-4 flex flex-col gap-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#21262D] flex items-center justify-center text-[#F5A623]">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-[#F0F6FC]">{value}</span>
                <span className="text-xs text-[#8B949E]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D1117] to-transparent pointer-events-none" />
    </section>
  );
}
