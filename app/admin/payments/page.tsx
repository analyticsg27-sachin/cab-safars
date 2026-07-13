"use client";

import { useState } from "react";
import {
  CreditCard, Search, Eye, X, TrendingUp, CheckCircle2,
  Clock, XCircle, RotateCcw, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockPayments = [
  { id: "PAY001", userId: "v001", userName: "Rajesh Patel", userRole: "vendor", amount: 199, status: "paid", plan: "Premium Monthly", gateway: "Razorpay", transactionId: "pay_QxT8mK2nP4rYsL", gatewayOrderId: "order_QxT8mK", createdAt: "2025-07-01T10:30:00Z" },
  { id: "PAY002", userId: "d001", userName: "Harshad Bhatt", userRole: "driver", amount: 199, status: "paid", plan: "Premium Monthly", gateway: "Razorpay", transactionId: "pay_RyU9nL3oQ5sZtM", gatewayOrderId: "order_RyU9nL", createdAt: "2025-07-01T11:00:00Z" },
  { id: "PAY003", userId: "v002", userName: "Sunita Shah", userRole: "vendor", amount: 199, status: "paid", plan: "Premium Monthly", gateway: "Razorpay", transactionId: "pay_SzV0oM4pR6tAuN", gatewayOrderId: "order_SzV0oM", createdAt: "2025-07-02T09:15:00Z" },
  { id: "PAY004", userId: "d002", userName: "Kiran Patel", userRole: "driver", amount: 199, status: "paid", plan: "Premium Monthly", gateway: "Razorpay", transactionId: "pay_TaW1pN5qS7uBvO", gatewayOrderId: "order_TaW1pN", createdAt: "2025-07-03T14:20:00Z" },
  { id: "PAY005", userId: "v004", userName: "Priya Mehta", userRole: "vendor", amount: 199, status: "failed", plan: "Premium Monthly", gateway: "Razorpay", transactionId: "pay_UbX2qO6rT8vCwP", gatewayOrderId: "order_UbX2qO", createdAt: "2025-07-04T16:45:00Z" },
  { id: "PAY006", userId: "d005", userName: "Sunil Maurya", userRole: "driver", amount: 199, status: "paid", plan: "Premium Monthly", gateway: "Razorpay", transactionId: "pay_VcY3rP7sU9wDxQ", gatewayOrderId: "order_VcY3rP", createdAt: "2025-07-04T08:30:00Z" },
  { id: "PAY007", userId: "v007", userName: "Ravi Sharma", userRole: "vendor", amount: 199, status: "refunded", plan: "Premium Monthly", gateway: "Razorpay", transactionId: "pay_WdZ4sQ8tV0xEyR", gatewayOrderId: "order_WdZ4sQ", createdAt: "2025-06-15T12:00:00Z" },
  { id: "PAY008", userId: "d008", userName: "Gopal Sharma", userRole: "driver", amount: 199, status: "paid", plan: "Premium Monthly", gateway: "Razorpay", transactionId: "pay_XeA5tR9uW1yFzS", gatewayOrderId: "order_XeA5tR", createdAt: "2025-06-20T15:30:00Z" },
  { id: "PAY009", userId: "v005", userName: "Anil Kumar", userRole: "vendor", amount: 199, status: "pending", plan: "Premium Monthly", gateway: "Razorpay", transactionId: "pay_YfB6uS0vX2zGaT", gatewayOrderId: "order_YfB6uS", createdAt: "2025-07-05T10:00:00Z" },
  { id: "PAY010", userId: "d010", userName: "Manish Dubey", userRole: "driver", amount: 199, status: "paid", plan: "Premium Monthly", gateway: "Razorpay", transactionId: "pay_ZgC7vT1wY3aHbU", gatewayOrderId: "order_ZgC7vT", createdAt: "2025-07-06T09:45:00Z" },
];

type Payment = typeof mockPayments[number];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  paid:     { label: "Paid",     color: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20", icon: CheckCircle2 },
  pending:  { label: "Pending",  color: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20", icon: Clock },
  failed:   { label: "Failed",   color: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20", icon: XCircle },
  refunded: { label: "Refunded", color: "text-[#2D6BE4] bg-[#2D6BE4]/10 border-[#2D6BE4]/20", icon: RotateCcw },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function PaymentsPage() {
  const [tab, setTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Payment | null>(null);

  const paidCount = mockPayments.filter(p => p.status === "paid").length;
  const pendingFailed = mockPayments.filter(p => p.status === "pending" || p.status === "failed").length;
  const totalRevenue = paidCount * 199;

  const filtered = mockPayments.filter(p => {
    const matchTab = tab === "all" || p.status === tab;
    const matchSearch = p.userName.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabs = ["all", "paid", "pending", "failed", "refunded"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F0F6FC]">Payment Management</h1>
        <p className="text-[#8B949E] mt-1 text-sm">Track all subscription payments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-[#F5A623]", bg: "bg-[#F5A623]/10" },
          { label: "Total Payments", value: mockPayments.length, icon: CreditCard, color: "text-[#2D6BE4]", bg: "bg-[#2D6BE4]/10" },
          { label: "Successful", value: paidCount, icon: CheckCircle2, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
          { label: "Pending / Failed", value: pendingFailed, icon: Clock, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10" },
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

      {/* Filters */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl">
        <div className="p-4 border-b border-[#30363D] flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 flex-wrap">
            {tabs.map(t => (
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
          <div className="relative sm:ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B949E]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or transaction ID..."
              className="w-full sm:w-72 pl-9 pr-3 py-1.5 text-sm bg-[#21262D] border border-[#30363D] rounded-lg text-[#F0F6FC] placeholder:text-[#8B949E] focus:outline-none focus:border-[#F5A623]/50"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#30363D]">
                {["Transaction ID", "User", "Plan", "Amount", "Status", "Date", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-[#8B949E]">No payments found</td></tr>
              ) : filtered.map(p => {
                const sc = statusConfig[p.status];
                const SI = sc.icon;
                return (
                  <tr key={p.id} className="border-b border-[#30363D]/50 hover:bg-[#21262D]/40 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-[#8B949E] bg-[#21262D] px-2 py-0.5 rounded">
                        {p.transactionId.slice(0, 18)}…
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#F0F6FC] font-medium">{p.userName}</p>
                      <span className={cn("text-xs px-1.5 py-0.5 rounded-full capitalize",
                        p.userRole === "vendor" ? "text-[#F5A623] bg-[#F5A623]/10" : "text-[#2D6BE4] bg-[#2D6BE4]/10"
                      )}>{p.userRole}</span>
                    </td>
                    <td className="px-4 py-3 text-[#8B949E] whitespace-nowrap">{p.plan}</td>
                    <td className="px-4 py-3 text-[#F0F6FC] font-semibold">₹{p.amount}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border", sc.color)}>
                        <SI className="w-3 h-3" />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#8B949E] text-xs whitespace-nowrap">{fmt(p.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(p)}
                        className="p-1.5 rounded-lg text-[#8B949E] hover:text-[#F5A623] hover:bg-[#F5A623]/10 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="w-full max-w-md bg-[#161B22] border-l border-[#30363D] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#30363D]">
              <h2 className="text-base font-semibold text-[#F0F6FC]">Payment Details</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-[#8B949E] hover:bg-[#21262D]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-[#F0F6FC]">₹{selected.amount}</p>
                  <p className="text-sm text-[#8B949E]">{selected.plan}</p>
                </div>
                {(() => { const sc = statusConfig[selected.status]; const SI = sc.icon; return (
                  <span className={cn("inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border", sc.color)}>
                    <SI className="w-3.5 h-3.5" />{sc.label}
                  </span>
                ); })()}
              </div>

              {[
                ["Payment ID", selected.id],
                ["User", selected.userName],
                ["User ID", selected.userId],
                ["Role", selected.userRole],
                ["Gateway", selected.gateway],
                ["Date", fmt(selected.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-[#30363D]/50">
                  <span className="text-xs text-[#8B949E]">{k}</span>
                  <span className="text-xs text-[#F0F6FC] font-medium capitalize">{v}</span>
                </div>
              ))}

              <div className="bg-[#21262D] rounded-lg p-3 space-y-2">
                <p className="text-xs text-[#8B949E] font-medium">Transaction IDs</p>
                <div>
                  <p className="text-xs text-[#8B949E]">Transaction ID</p>
                  <p className="font-mono text-xs text-[#F0F6FC] break-all">{selected.transactionId}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B949E]">Gateway Order ID</p>
                  <p className="font-mono text-xs text-[#F0F6FC] break-all">{selected.gatewayOrderId}</p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#30363D] text-sm text-[#8B949E] hover:bg-[#21262D] transition-colors">
                <ExternalLink className="w-4 h-4" /> View on Razorpay Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
