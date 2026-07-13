import { ShieldCheck, Clock, Users, TrendingUp } from "lucide-react";

const trustStats = [
  {
    icon: Users,
    value: "20,000+",
    label: "Verified Users",
    desc: "Every vendor and driver is manually verified.",
    color: "#2D6BE4",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Secure Platform",
    desc: "All data encrypted. Payments via Razorpay.",
    color: "#22C55E",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Always Available",
    desc: "Browse and post trips any time of day.",
    color: "#F5A623",
  },
  {
    icon: TrendingUp,
    value: "50K+",
    label: "Trips Matched",
    desc: "And growing by 2,000+ new trips every month.",
    color: "#F59E0B",
  },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-[#0D1117] border-y border-[#30363D]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F0F6FC] mb-3">
            Trusted by Thousands Across India
          </h2>
          <p className="text-[#8B949E]">
            Built for reliability, designed for growth.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustStats.map(({ icon: Icon, value, label, desc, color }) => (
            <div
              key={label}
              className="relative bg-[#161B22] border border-[#30363D] rounded-2xl p-6 text-center overflow-hidden group hover:border-[#30363D]/60 transition-colors"
            >
              {/* Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 0%, ${color}08, transparent 70%)` }}
              />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${color}15`, color }}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-extrabold text-[#F0F6FC] mb-1">{value}</p>
              <p className="text-sm font-semibold text-[#F0F6FC] mb-2">{label}</p>
              <p className="text-xs text-[#8B949E] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
