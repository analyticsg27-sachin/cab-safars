import { ArrowRight, Zap, MapPin, TrendingUp } from "lucide-react";

export default function SmartRouteSection() {
  return (
    <section id="features" className="py-24 bg-[#0D1117] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D6BE4]/10 border border-[#2D6BE4]/20 text-[#2D6BE4] text-xs font-semibold uppercase tracking-wider mb-6">
              <Zap className="w-3.5 h-3.5" />
              Smart Route Matching
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F0F6FC] mb-6 leading-tight">
              Never Return Empty-Handed
            </h2>
            <p className="text-[#8B949E] text-lg leading-relaxed mb-8">
              Our intelligent routing engine finds you trips on your return journey too.
              Driving Ahmedabad → Vadodara? We&apos;ll show you vendors looking for drivers
              from Vadodara and nearby areas — maximizing your earnings on every trip.
            </p>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: MapPin,
                  title: "Location-Aware Matching",
                  desc: "Automatically finds trips near your destination city.",
                  color: "#F5A623",
                },
                {
                  icon: ArrowRight,
                  title: "Return Route Optimization",
                  desc: "Fill your cab on the way back. Earn twice per trip.",
                  color: "#22C55E",
                },
                {
                  icon: TrendingUp,
                  title: "Earn 40% More",
                  desc: "Drivers using smart matching earn significantly more monthly.",
                  color: "#2D6BE4",
                },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F0F6FC] mb-0.5">{title}</h4>
                    <p className="text-sm text-[#8B949E]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Route diagram mockup */}
          <div className="relative">
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-semibold text-[#F0F6FC]">Smart Route Finder</h4>
                <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-xs border border-[#22C55E]/20">
                  Live
                </span>
              </div>

              {/* Your trip */}
              <div className="bg-[#21262D] rounded-xl p-4 mb-4">
                <p className="text-xs text-[#8B949E] mb-2 uppercase tracking-wide font-medium">Your Trip</p>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#2D6BE4] ring-4 ring-[#2D6BE4]/20" />
                    <div className="w-0.5 h-8 bg-gradient-to-b from-[#2D6BE4] to-[#F5A623]" />
                    <div className="w-3 h-3 rounded-full bg-[#F5A623] ring-4 ring-[#F5A623]/20" />
                  </div>
                  <div className="flex flex-col justify-between h-full gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#F0F6FC]">Ahmedabad</p>
                      <p className="text-xs text-[#8B949E]">Starting point</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#F0F6FC]">Vadodara</p>
                      <p className="text-xs text-[#8B949E]">Destination</p>
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-lg font-bold text-[#F0F6FC]">₹2,200</p>
                    <p className="text-xs text-[#8B949E]">Est. fare</p>
                  </div>
                </div>
              </div>

              {/* Return matches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-3.5 h-3.5 text-[#F5A623]" />
                  <p className="text-xs font-semibold text-[#F5A623] uppercase tracking-wide">
                    3 Return Trips Found Near Vadodara
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    { from: "Vadodara", to: "Surat", fare: "₹3,400", vendor: "Patel Travels", premium: false },
                    { from: "Bharuch", to: "Ahmedabad", fare: "₹2,800", vendor: "Desai Carriers", premium: true },
                    { from: "Anand", to: "Rajkot", fare: "₹3,800", vendor: "Shah Logistics", premium: false },
                  ].map((trip) => (
                    <div
                      key={trip.vendor}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#1C2128] border border-[#30363D] hover:border-[#F5A623]/30 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#F0F6FC]">
                          {trip.from} <ArrowRight className="w-3 h-3 inline text-[#8B949E]" /> {trip.to}
                        </p>
                        <p className="text-xs text-[#8B949E]">{trip.vendor}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {trip.premium && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20">
                            Premium
                          </span>
                        )}
                        <span className="text-sm font-bold text-[#22C55E]">{trip.fare}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total earnings */}
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-[#F5A623]/10 to-[#22C55E]/10 border border-[#F5A623]/20">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#8B949E]">Potential total earnings today</p>
                  <p className="text-lg font-bold text-[#F5A623]">₹6,000+</p>
                </div>
              </div>
            </div>

            {/* Decorative blur */}
            <div className="absolute -inset-4 bg-[#F5A623]/5 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
