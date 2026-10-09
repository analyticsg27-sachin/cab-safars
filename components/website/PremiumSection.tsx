import { Check, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_URL } from "@/lib/basepath";

const vendorFeatures = ["Vendor account options", "Trip listing tools", "Trip information access"];

const driverFeatures = ["Driver account options", "Trip listing access", "Available contact options"];

export default function PremiumSection() {
  return (
    <section id="premium" className="py-24 relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 60%), #0D1117",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-xs font-semibold uppercase tracking-wider mb-4">
            <Star className="w-3.5 h-3.5" />
            Premium
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F0F6FC] mb-4">
            Account options
          </h2>
          <p className="text-[#8B949E] text-lg max-w-xl mx-auto">
            See the membership and account options available to you in the app.
          </p>
        </div>

        {/* Pricing card — centered */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#1C2128] to-[#161B22] border border-[#F5A623]/30 rounded-2xl overflow-hidden shadow-2xl shadow-[#F5A623]/5">
            {/* Top gold accent */}
            <div className="h-1 bg-gradient-to-r from-[#F5A623] via-[#FFD580] to-[#F5A623]" />

            <div className="p-8 sm:p-10">
              {/* Price */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#F0F6FC]">Membership</span>
                  </div>
                  <p className="text-[#8B949E] text-sm mt-1">Per account. Vendors and Drivers.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-xs font-medium">
                    Account access varies
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-xs font-medium">
                    Details in app
                  </span>
                </div>
              </div>

              {/* Features grid */}
              <div className="grid sm:grid-cols-2 gap-8 mb-8">
                {/* Vendor features */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#2D6BE4]/15 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-[#2D6BE4]" />
                    </div>
                    <h4 className="text-sm font-bold text-[#F0F6FC] uppercase tracking-wide">
                      Premium Vendor
                    </h4>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {vendorFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[#8B949E]">
                        <Check className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Driver features */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-[#F5A623]/15 flex items-center justify-center">
                      <Star className="w-3.5 h-3.5 text-[#F5A623]" />
                    </div>
                    <h4 className="text-sm font-bold text-[#F0F6FC] uppercase tracking-wide">
                      Premium Driver
                    </h4>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {driverFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[#8B949E]">
                        <Check className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a href={`${APP_URL}/app/`}>
                  <Button variant="primary" size="xl" className="w-full sm:w-auto px-12">
                    View account options
                  </Button>
                </a>
                <p className="text-xs text-[#8B949E] text-center">
                  Options shown in the app depend on account status and availability.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
