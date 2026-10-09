import {
  Zap, BarChart3, Shield, Phone, Map, TrendingUp, Eye, Award,
} from "lucide-react";

const vendorBenefits = [
  {
    icon: Zap,
    title: "Create Trip Listings",
    desc: "Add route, date, vehicle type, and fare information to a trip listing.",
    color: "#F5A623",
  },
  {
    icon: Eye,
    title: "Manage Your Listings",
    desc: "Review trip information from your provider account.",
    color: "#2D6BE4",
  },
  {
    icon: Award,
    title: "Account Options",
    desc: "Available tools and access can depend on your account status.",
    color: "#F5A623",
  },
  {
    icon: BarChart3,
    title: "Trip Information",
    desc: "Review the details associated with your trip listings.",
    color: "#22C55E",
  },
];

const driverBenefits = [
  {
    icon: Map,
    title: "Browse Available Trips",
    desc: "View trip listings and their available route and vehicle details.",
    color: "#F5A623",
  },
  {
    icon: Zap,
    title: "Search Trip Details",
    desc: "Browse trip information and review available listings.",
    color: "#2D6BE4",
  },
  {
    icon: Phone,
    title: "Contact Options",
    desc: "Review the contact options available for a trip in your account.",
    color: "#22C55E",
  },
  {
    icon: TrendingUp,
    title: "Manage Trip Details",
    desc: "Use the trip information available in your driver account.",
    color: "#F5A623",
  },
];

function BenefitCard({
  icon: Icon,
  title,
  desc,
  color,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="bg-[#1C2128] border border-[#30363D] rounded-xl p-5 hover:border-[#30363D]/60 transition-all group">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors"
        style={{ backgroundColor: `${color}15`, color }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-[#F0F6FC] mb-2">{title}</h4>
      <p className="text-sm text-[#8B949E] leading-relaxed">{desc}</p>
    </div>
  );
}

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-[#161B22]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vendor benefits */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-[#2D6BE4]/15 border border-[#2D6BE4]/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#2D6BE4]" />
            </div>
            <div>
              <p className="text-xs text-[#8B949E] uppercase tracking-widest font-medium">For Vendors</p>
              <h3 className="text-2xl font-bold text-[#F0F6FC]">Why Vendors Love CAB SAFARS</h3>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vendorBenefits.map((b) => (
              <BenefitCard key={b.title} {...b} />
            ))}
          </div>
        </div>

        {/* Driver benefits */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-[#F5A623]/15 border border-[#F5A623]/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#F5A623]" />
            </div>
            <div>
              <p className="text-xs text-[#8B949E] uppercase tracking-widest font-medium">For Drivers</p>
              <h3 className="text-2xl font-bold text-[#F0F6FC]">Why Drivers Choose CAB SAFARS</h3>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {driverBenefits.map((b) => (
              <BenefitCard key={b.title} {...b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
