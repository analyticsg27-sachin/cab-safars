"use client";

import { ArrowRight, Truck, Users, Route, Star, MapPin, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const pillars = [
  { label: "Post Trips Instantly", icon: Truck, color: "#F5A623" },
  { label: "Smart Route Matching", icon: Route, color: "#2D6BE4" },
  { label: "Verified Network", icon: Users, color: "#22C55E" },
  { label: "Premium — ₹199/mo", icon: Star, color: "#F5A623" },
];

const stats = [
  { label: "Active Trips", value: "247", icon: TrendingUp, color: "#F5A623" },
  { label: "Drivers Online", value: "1,280", icon: Users, color: "#22C55E" },
  { label: "Routes", value: "50+ Cities", icon: MapPin, color: "#2D6BE4" },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{
        background: "#0B1220",
      }}
    >
      {/* Radial glow top-right — gold */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 85% 5%, rgba(245,166,35,0.12) 0%, transparent 60%)",
        }}
      />
      {/* Radial glow bottom-left — brand green */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 5% 90%, rgba(22,163,74,0.08) 0%, transparent 55%)",
        }}
      />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(240,246,252,0.55) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          opacity: 0.025,
        }}
      />

      {/* Ambient glow orbs */}
      <div className="absolute top-20 right-[8%] w-80 h-80 rounded-full bg-[#F5A623]/[0.07] blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 left-[3%] w-64 h-64 rounded-full bg-[#16A34A]/[0.07] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Left column ── */}
          <div className="flex-1 max-w-2xl w-full">

            {/* Premium animated pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/25 text-[#22C55E] text-xs font-semibold mb-8 uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.08)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
              </span>
              🏆 India&apos;s #1 Transport Marketplace
            </div>

            {/* Headline */}
            <h1
              className="font-extrabold text-[#F0F6FC] leading-[1.04] tracking-[-0.03em] mb-5"
              style={{ fontSize: "clamp(2.6rem, 5vw, 4.25rem)" }}
            >
              Connect.{" "}
              <br className="hidden sm:block" />
              Move.{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #F5A623 0%, #FFD580 60%, #F5A623 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Grow.
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-[#8B949E] text-base font-medium mb-3 tracking-wide uppercase text-xs">
              India&apos;s most efficient freight matching platform
            </p>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-[#8B949E] max-w-xl leading-relaxed mb-10">
              The dedicated marketplace for{" "}
              <span className="text-[#F0F6FC] font-medium">trip providers</span> to post trips
              and for{" "}
              <span className="text-[#F0F6FC] font-medium">drivers</span> to discover relevant
              opportunities — with smart route matching built in.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-14">
              <a href="/app">
                <Button
                  variant="primary"
                  size="xl"
                  className="group relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #F5A623 0%, #E8960F 100%)",
                    color: "#0B1220",
                    fontWeight: 700,
                    border: "none",
                    boxShadow: "0 4px 24px rgba(245,166,35,0.28)",
                  }}
                >
                  Start as Trip Provider
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </a>
              <a href="/app">
                <Button
                  variant="secondary"
                  size="xl"
                  className="group"
                  style={{
                    background: "transparent",
                    border: "1.5px solid rgba(240,246,252,0.18)",
                    color: "#F0F6FC",
                  }}
                >
                  I&apos;m a Driver
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </a>
            </div>

            {/* Platform pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {pillars.map(({ label, icon: Icon, color }) => (
                <div
                  key={label}
                  className="bg-[#111827]/80 backdrop-blur-sm border border-white/[0.06] rounded-xl p-4 flex flex-col gap-2 hover:border-white/[0.12] transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}18`, color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-[#E6EDF3] leading-snug">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column — Hero visual (desktop only) ── */}
          <div className="hidden lg:flex flex-shrink-0 items-center justify-center">
            {/* Phone mockup frame */}
            <div
              className="relative"
              style={{ width: 290, height: 590 }}
            >
              {/* Phone outer shell */}
              <div
                className="absolute inset-0 rounded-[44px] border-[7px] border-[#2A3347] shadow-[0_32px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]"
                style={{ background: "#141C2E" }}
              />
              {/* Notch */}
              <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-[#0B1220] border border-[#2A3347] z-10" />
              {/* Screen content */}
              <div className="absolute inset-[7px] rounded-[38px] overflow-hidden bg-[#0F1827] flex flex-col pt-10 px-4 pb-4 gap-3">

                {/* App header */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-[#F0F6FC] tracking-wide">CAB SAFARS</span>
                  <span className="text-[10px] text-[#22C55E] font-semibold">● Live</span>
                </div>

                {/* Dashboard card */}
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: "linear-gradient(135deg, #1A2640 0%, #1E2D4A 100%)",
                    border: "1px solid rgba(245,166,35,0.15)",
                  }}
                >
                  <p className="text-[10px] text-[#8B949E] mb-3 uppercase tracking-widest font-medium">Platform Stats</p>
                  <div className="flex flex-col gap-3">
                    {stats.map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: `${color}20`, color }}
                          >
                            <Icon className="w-3 h-3" />
                          </div>
                          <span className="text-[11px] text-[#8B949E]">{label}</span>
                        </div>
                        <span className="text-[12px] font-bold text-[#F0F6FC]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trip card */}
                <div
                  className="rounded-2xl p-4 flex-1"
                  style={{
                    background: "linear-gradient(135deg, #1A2640 0%, #1E2D4A 100%)",
                    border: "1px solid rgba(34,197,94,0.12)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-[#8B949E] uppercase tracking-widest font-medium">Active Trip</span>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}
                    >
                      OPEN
                    </span>
                  </div>
                  <div className="flex items-start gap-2 mb-3">
                    <div className="flex flex-col items-center gap-0.5 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#F5A623]" />
                      <div className="w-0.5 h-8 bg-gradient-to-b from-[#F5A623] to-[#22C55E]" />
                      <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    </div>
                    <div className="flex flex-col justify-between h-12">
                      <span className="text-[11px] font-semibold text-[#F0F6FC]">Mumbai, MH</span>
                      <span className="text-[11px] font-semibold text-[#F0F6FC]">Pune, MH</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8B949E]" />
                      <span className="text-[10px] text-[#8B949E]">6h est.</span>
                    </div>
                    <div
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(245,166,35,0.15)", color: "#F5A623" }}
                    >
                      ₹4,500
                    </div>
                  </div>
                </div>

                {/* CTA inside phone */}
                <div
                  className="rounded-xl py-3 flex items-center justify-center gap-1.5 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #F5A623 0%, #E8960F 100%)",
                  }}
                >
                  <span className="text-[12px] font-bold text-[#0B1220]">Find My Trip</span>
                  <ArrowRight className="w-3 h-3 text-[#0B1220]" />
                </div>

              </div>
              {/* Home indicator */}
              <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-[#2A3347]" />
            </div>

            {/* Floating stat badges around phone */}
            <div className="absolute right-[calc(50%-260px)] top-[30%] hidden xl:block">
              <div
                className="px-3 py-2 rounded-xl shadow-xl"
                style={{
                  background: "rgba(17,24,39,0.92)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <p className="text-[10px] text-[#8B949E]">Drivers Online</p>
                <p className="text-base font-bold text-[#22C55E]">1,280</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B1220] to-transparent pointer-events-none" />
    </section>
  );
}
