import { ArrowRight, ClipboardList, MapPin, Search } from "lucide-react";

const steps = [
  { icon: MapPin, label: "Review pickup and destination details" },
  { icon: ClipboardList, label: "Check vehicle, date, and fare information" },
  { icon: Search, label: "Browse listings available to your account" },
];

export default function SmartRouteSection() {
  return (
    <section id="features" className="py-24 bg-[#0D1117] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D6BE4]/10 border border-[#2D6BE4]/20 text-[#2D6BE4] text-xs font-semibold uppercase tracking-wider mb-6">
              <Search className="w-3.5 h-3.5" />
              Browse trip listings
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F0F6FC] mb-6 leading-tight">
              Review trip information
            </h2>
            <p className="text-[#8B949E] text-lg leading-relaxed mb-8">
              Trip listings include details such as pickup, destination, date, vehicle, and fare. Browse the information available to your account.
            </p>
            <div className="flex flex-col gap-4">
              {steps.map(({ icon: Icon, label }, index) => (
                <div key={label} className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#F5A623]/10 text-[#F5A623]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-[#8B949E]">{index + 1}. {label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-2xl">
              <h4 className="text-sm font-semibold text-[#F0F6FC] mb-6">Example trip details</h4>
              <div className="bg-[#21262D] rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#F5A623]" />
                  <div>
                    <p className="text-sm font-semibold text-[#F0F6FC]">Pickup → Destination</p>
                    <p className="text-xs text-[#8B949E]">Route</p>
                  </div>
                </div>
                <div className="border-t border-[#30363D] my-4" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8B949E]">Date · Vehicle · Fare</span>
                  <ArrowRight className="w-4 h-4 text-[#F5A623]" />
                </div>
              </div>
              <p className="text-xs text-[#8B949E] mt-4">Illustrative details only; actual listings vary.</p>
            </div>
            <div className="absolute -inset-4 bg-[#F5A623]/5 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
