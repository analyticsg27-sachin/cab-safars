import { ClipboardList, Search, Phone, UserCheck, Route, BadgeCheck } from "lucide-react";

const vendorSteps = [
  {
    icon: UserCheck,
    step: "01",
    title: "Register as Vendor",
    description:
      "Create your account and verify your business. Get approved within 24 hours.",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "Post Your Trip",
    description:
      "Add trip details — route, date, vehicle type, and fare. Your listing goes live instantly.",
  },
  {
    icon: Phone,
    step: "03",
    title: "Drivers Contact You",
    description:
      "Interested drivers reach out directly. Premium vendors get priority visibility and more contacts.",
  },
];

const driverSteps = [
  {
    icon: UserCheck,
    step: "01",
    title: "Register as Driver",
    description:
      "Sign up with your vehicle details and license. Quick verification process.",
  },
  {
    icon: Search,
    step: "02",
    title: "Browse Matching Trips",
    description:
      "See trips that match your current location and preferred routes. Smart matching saves time.",
  },
  {
    icon: Route,
    step: "03",
    title: "Contact & Confirm",
    description:
      "Premium drivers unlock direct vendor contact. Confirm trips and maximize every journey.",
  },
];

function StepCard({
  icon: Icon,
  step,
  title,
  description,
  color,
}: {
  icon: React.ElementType;
  step: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="relative flex gap-4">
      {/* Step connector line */}
      <div className="flex flex-col items-center">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
          style={{
            backgroundColor: `${color}15`,
            borderColor: `${color}30`,
            color,
          }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="w-px flex-1 mt-2 bg-[#30363D] last:hidden" />
      </div>
      <div className="pb-8">
        <span className="text-xs font-bold tracking-widest uppercase mb-1 block" style={{ color }}>
          Step {step}
        </span>
        <h4 className="text-base font-semibold text-[#F0F6FC] mb-1.5">{title}</h4>
        <p className="text-sm text-[#8B949E] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-[#0D1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-xs font-semibold uppercase tracking-wider mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F0F6FC] mb-4">
            Simple. Fast. Effective.
          </h2>
          <p className="text-[#8B949E] text-lg max-w-xl mx-auto">
            Whether you&apos;re posting trips or looking for them — get started in minutes.
          </p>
        </div>

        {/* Two-column steps */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vendors */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#2D6BE4]/15 border border-[#2D6BE4]/30 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-[#2D6BE4]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F0F6FC]">For Vendors</h3>
                <p className="text-xs text-[#8B949E]">Post trips, find drivers</p>
              </div>
            </div>
            <div>
              {vendorSteps.map((step, i) => (
                <StepCard key={i} {...step} color="#2D6BE4" />
              ))}
            </div>
          </div>

          {/* Drivers */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#F5A623]/15 border border-[#F5A623]/30 flex items-center justify-center">
                <BadgeCheck className="w-5 h-5 text-[#F5A623]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F0F6FC]">For Drivers</h3>
                <p className="text-xs text-[#8B949E]">Browse trips, earn more</p>
              </div>
            </div>
            <div>
              {driverSteps.map((step, i) => (
                <StepCard key={i} {...step} color="#F5A623" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
