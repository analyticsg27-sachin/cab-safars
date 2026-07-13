"use client";

import { useState } from "react";
import { Star, CheckCircle2, XCircle, Clock, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";

const mockSubscriptions = [
  { id: "SUB001", userId: "v001", userName: "Rajesh Patel", userRole: "vendor", plan: "Premium Monthly", amount: 199, startDate: "2025-07-01", endDate: "2025-08-01", status: "active", autoRenew: true, paymentsCount: 7 },
  { id: "SUB002", userId: "d001", userName: "Harshad Bhatt", userRole: "driver", plan: "Premium Monthly", amount: 199, startDate: "2025-07-01", endDate: "2025-08-01", status: "active", autoRenew: true, paymentsCount: 6 },
  { id: "SUB003", userId: "v002", userName: "Sunita Shah", userRole: "vendor", plan: "Premium Monthly", amount: 199, startDate: "2025-07-02", endDate: "2025-08-02", status: "active", autoRenew: false, paymentsCount: 5 },
  { id: "SUB004", userId: "d002", userName: "Kiran Patel", userRole: "driver", plan: "Premium Monthly", amount: 199, startDate: "2025-07-03", endDate: "2025-08-03", status: "active", autoRenew: true, paymentsCount: 5 },
  { id: "SUB005", userId: "v005", userName: "Anil Kumar", userRole: "vendor", plan: "Premium Monthly", amount: 199, startDate: "2025-06-01", endDate: "2025-07-01", status: "expired", autoRenew: false, paymentsCount: 6 },
  { id: "SUB006", userId: "d005", userName: "Sunil Maurya", userRole: "driver", plan: "Premium Monthly", amount: 199, startDate: "2025-07-04", endDate: "2025-08-04", status: "active", autoRenew: true, paymentsCount: 3 },
  { id: "SUB007", userId: "v007", userName: "Ravi Sharma", userRole: "vendor", plan: "Premium Monthly", amount: 199, startDate: "2025-05-15", endDate: "2025-06-15", status: "cancelled", autoRenew: false, paymentsCount: 2 },
  { id: "SUB008", userId: "d008", userName: "Gopal Sharma", userRole: "driver", plan: "Premium Monthly", amount: 199, startDate: "2025-06-20", endDate: "2025-07-20", status: "active", autoRenew: true, paymentsCount: 1 },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active:    { label: "Active",    color: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20", icon: CheckCircle2 },
  expired:   { label: "Expired",   color: "text-[#8B949E] bg-[#8B949E]/10 border-[#8B949E]/20", icon: Clock },
  cancelled: { label: "Cancelled", color: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20", icon: XCircle },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SubscriptionsPage() {
  const [tab, setTab] = useState("all");

  const activeCount = mockSubscriptions.filter(s => s.status === "active").length;
  const expiredCount = mockSubscriptions.filter(s => s.status === "expired").length;
  const cancelledCount = mockSubscriptions.filter(s => s.status === "cancelled").length;
  const monthlyRevenue = activeCount * 199;

  const filtered = mockSubscriptions.filter(s => tab === "all" || s.status === tab);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F0F6FC]">Subscriptions</h1>
        <p className="text-[#8B949E] mt-1 text-sm">Manage premium subscriptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active", value: activeCount, icon: CheckCircle2, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
          { label: "Expired", value: expiredCount, icon: Clock, color: "text-[#8B949E]", bg: "bg-[#8B949E]/10" },
          { label: "Cancelled", value: cancelledCount, icon: XCircle, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
          { label: "Monthly Revenue", value: `₹${monthlyRevenue.toLocaleString("en-IN")}`, icon: Star, color: "text-[#F5A623]", bg: "bg-[#F5A623]/10" },
        ].map(s => (
          <div key={s.label} className="bg-[#161B22] border border-[#30363D] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#8B949E]">{s.label}</p>
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", s.bg)}>
                <s.icon className={cn("w-4 h-4", s.color)} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#F0F6FC]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl">
        <div className="p-4 border-b border-[#30363D] flex gap-1 flex-wrap">
          {["all", "active", "expired", "cancelled"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
                tab === t
                  ? "bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/30"
                  : "text-[#8B949E] hover:bg-[#21262D] hover:text-[#F0F6FC]"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#30363D]">
                {["User", "Role", "Plan", "Start Date", "End Date", "Status", "Auto-Renew", "Payments", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-[#8B949E]">No subscriptions found</td></tr>
              ) : filtered.map(s => {
                const sc = statusConfig[s.status];
                const SI = sc.icon;
                return (
                  <tr key={s.id} className="border-b border-[#30363D]/50 hover:bg-[#21262D]/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-[#F0F6FC] font-medium">{s.userName}</p>
                      <p className="text-xs text-[#8B949E]">{s.userId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize",
                        s.userRole === "vendor" ? "text-[#F5A623] bg-[#F5A623]/10" : "text-[#2D6BE4] bg-[#2D6BE4]/10"
                      )}>{s.userRole}</span>
                    </td>
                    <td className="px-4 py-3 text-[#8B949E] whitespace-nowrap">{s.plan}</td>
                    <td className="px-4 py-3 text-[#8B949E] whitespace-nowrap text-xs">{fmtDate(s.startDate)}</td>
                    <td className="px-4 py-3 text-[#8B949E] whitespace-nowrap text-xs">{fmtDate(s.endDate)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border", sc.color)}>
                        <SI className="w-3 h-3" />{sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.autoRenew
                        ? <span className="inline-flex items-center gap-1 text-xs text-[#22C55E]"><ToggleRight className="w-4 h-4" />On</span>
                        : <span className="inline-flex items-center gap-1 text-xs text-[#8B949E]"><ToggleLeft className="w-4 h-4" />Off</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-[#8B949E]">
                        <RefreshCw className="w-3 h-3" />{s.paymentsCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-[#F5A623] hover:underline">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
