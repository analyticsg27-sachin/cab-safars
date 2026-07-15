import { Smartphone, Star, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DownloadSection() {
  return (
    <section className="py-24 bg-[#161B22]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-[#1C2128] to-[#161B22] border border-[#30363D] rounded-3xl overflow-hidden p-8 sm:p-12">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#F5A623]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#2D6BE4]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-xs font-semibold uppercase tracking-wider mb-6">
                <Smartphone className="w-3.5 h-3.5" />
                Mobile App
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F0F6FC] mb-4">
                CAB SAFARS App
                <br />
                <span style={{ background: "linear-gradient(135deg, #F5A623, #FFD580)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Coming to Play Store
                </span>
              </h2>
              <p className="text-[#8B949E] text-lg leading-relaxed mb-8">
                All the power of the platform in your pocket. Manage trips, get instant
                notifications, and contact partners on the go. Launching soon on Android.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className="w-4 h-4 text-[#F5A623] fill-[#F5A623]" />
                    ))}
                  </div>
                  <span className="text-sm text-[#8B949E]">Launching on Android</span>
                </div>
                <span className="text-[#30363D]">|</span>
                <span className="text-sm text-[#8B949E]">Register interest below</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="opacity-90 cursor-not-allowed"
                  disabled
                >
                  <Download className="w-4 h-4" />
                  Download on Play Store
                </Button>
                <span className="flex items-center text-xs text-[#8B949E] px-2">
                  Coming Soon — Register your interest below
                </span>
              </div>
            </div>

            {/* App mockup placeholder */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-52 h-96">
                {/* Phone frame */}
                <div className="absolute inset-0 bg-[#0D1117] rounded-[2.5rem] border-4 border-[#30363D] shadow-2xl overflow-hidden">
                  {/* Screen */}
                  <div className="absolute inset-2 bg-[#161B22] rounded-[2rem] overflow-hidden">
                    {/* Notch */}
                    <div className="h-7 flex items-center justify-center bg-[#0D1117]">
                      <div className="w-16 h-1.5 rounded-full bg-[#30363D]" />
                    </div>
                    {/* App UI mock */}
                    <div className="p-3 flex flex-col gap-2">
                      <div className="bg-[#F5A623]/10 rounded-xl p-3 border border-[#F5A623]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-md bg-[#F5A623] flex items-center justify-center">
                            <Star className="w-3 h-3 text-[#0D1117]" />
                          </div>
                          <span className="text-xs font-semibold text-[#F5A623]">3 New Trips</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#F5A623]/20">
                          <div className="w-3/4 h-full rounded-full bg-[#F5A623]" />
                        </div>
                      </div>
                      {[1,2,3].map((i) => (
                        <div key={i} className="bg-[#1C2128] rounded-xl p-3 border border-[#30363D]">
                          <div className="flex justify-between mb-1.5">
                            <div className="h-2.5 w-20 rounded bg-[#30363D]" />
                            <div className="h-2.5 w-10 rounded bg-[#22C55E]/30" />
                          </div>
                          <div className="h-2 w-28 rounded bg-[#21262D]" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Glow under phone */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#F5A623]/20 blur-xl rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
