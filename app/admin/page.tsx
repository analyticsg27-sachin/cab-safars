"use client";

import {
  Users, Car, MapPin, DollarSign, Star, ClipboardCheck, Phone, TrendingUp,
  CheckCircle, XCircle, Clock,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  mockDashboardStats, mockMonthlyStats, mockTrips, mockPayments,
  mockPendingApprovals,
} from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1C2128] border border-[#30363D] rounded-xl p-3 shadow-xl">
      <p className="text-xs text-[#8B949E] mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name === "Revenue" ? formatCurrency(p.value) : p.value.toLocaleString("en-IN")}
          <span className="text-xs text-[#8B949E] font-normal ml-1">{p.name}</span>
        </p>
      ))}
    </div>
  );
}

const stats = mockDashboardStats;
const recentTrips = mockTrips.slice(0, 6);
const recentPayments = mockPayments.slice(0, 5);
const pendingApprovals = mockPendingApprovals.slice(0, 4);

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F0F6FC]">Dashboard</h1>
        <p className="text-sm text-[#8B949E] mt-0.5">Overview of platform activity</p>
      </div>

      {/* KPI row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vendors"
          value={stats.totalVendors}
          change={stats.vendorChange}
          icon={<Users className="w-4.5 h-4.5" />}
          iconColor="text-[#2D6BE4]"
        />
        <StatCard
          title="Total Drivers"
          value={stats.totalDrivers}
          change={stats.driverChange}
          icon={<Car className="w-4.5 h-4.5" />}
          iconColor="text-[#F5A623]"
        />
        <StatCard
          title="Active Trips"
          value={stats.activeTrips}
          change={stats.tripChange}
          icon={<MapPin className="w-4.5 h-4.5" />}
          iconColor="text-[#22C55E]"
        />
        <StatCard
          title="Revenue This Month"
          value={formatCurrency(stats.revenueThisMonth)}
          change={stats.revenueChange}
          icon={<DollarSign className="w-4.5 h-4.5" />}
          iconColor="text-[#F5A623]"
        />
      </div>

      {/* KPI row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Premium Users"
          value={stats.premiumUsers}
          icon={<Star className="w-4.5 h-4.5" />}
          iconColor="text-[#F5A623]"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<ClipboardCheck className="w-4.5 h-4.5" />}
          iconColor="text-[#F59E0B]"
        />
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon={<Phone className="w-4.5 h-4.5" />}
          iconColor="text-[#2D6BE4]"
        />
        <StatCard
          title="Subscription Rate"
          value={stats.subscriptionRate}
          suffix="%"
          icon={<TrendingUp className="w-4.5 h-4.5" />}
          iconColor="text-[#22C55E]"
        />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Revenue line chart */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#F0F6FC] mb-5">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockMonthlyStats} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
              <XAxis dataKey="month" tick={{ fill: "#8B949E", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8B949E", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="revenue" name="Revenue"
                stroke="#F5A623" strokeWidth={2.5} dot={{ fill: "#F5A623", r: 4 }}
                activeDot={{ r: 6, fill: "#F5A623" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Registrations bar chart */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#F0F6FC] mb-5">New Registrations</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockMonthlyStats} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
              <XAxis dataKey="month" tick={{ fill: "#8B949E", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8B949E", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#8B949E" }} />
              <Bar dataKey="vendors" name="Vendors" fill="#2D6BE4" radius={[3, 3, 0, 0]} />
              <Bar dataKey="drivers" name="Drivers" fill="#F5A623" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Trips */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363D]">
            <h3 className="text-sm font-semibold text-[#F0F6FC]">Recent Trips</h3>
            <a href="/admin/trips" className="text-xs text-[#F5A623] hover:underline">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#30363D]">
                  {["ID", "Route", "Vendor", "Status", "Date"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs text-[#8B949E] font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTrips.map((trip) => (
                  <tr key={trip.id} className="border-b border-[#30363D]/50 hover:bg-[#1C2128]/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-[#8B949E] font-mono">{trip.id.toUpperCase()}</td>
                    <td className="px-4 py-3 text-xs text-[#F0F6FC] whitespace-nowrap">
                      {trip.fromCity} → {trip.toCity}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">{trip.vendorName}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={trip.status as "open" | "closed" | "cancelled" | "completed"}
                        dot
                      >
                        {trip.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">
                      {formatDate(trip.departureDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363D]">
            <h3 className="text-sm font-semibold text-[#F0F6FC]">Recent Payments</h3>
            <a href="/admin/payments" className="text-xs text-[#F5A623] hover:underline">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#30363D]">
                  {["User", "Role", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs text-[#8B949E] font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-[#30363D]/50 hover:bg-[#1C2128]/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-[#F0F6FC] whitespace-nowrap">{payment.userName}</td>
                    <td className="px-4 py-3">
                      <Badge variant={payment.userRole as "vendor" | "driver"}>{payment.userRole}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#F0F6FC]">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={payment.status as "paid" | "pending" | "failed" | "refunded"} dot>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">
                      {formatDate(payment.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363D]">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#F0F6FC]">Pending Approvals</h3>
            <span className="text-xs font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-full px-2 py-0.5">
              {pendingApprovals.length}
            </span>
          </div>
          <a href="/admin/approvals" className="text-xs text-[#F5A623] hover:underline">View all</a>
        </div>
        <div className="divide-y divide-[#30363D]/50">
          {pendingApprovals.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-5 py-4 hover:bg-[#1C2128]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#21262D] flex items-center justify-center text-[#8B949E] font-semibold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F0F6FC]">{user.name}</p>
                  <p className="text-xs text-[#8B949E]">{user.city}, {user.state}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={user.role === "vendor" ? "vendor" : "driver"}>{user.role}</Badge>
                <span className="text-xs text-[#8B949E] hidden sm:block flex items-center gap-1">
                  <Clock className="w-3 h-3 inline mr-0.5" />
                  {formatDate(user.createdAt)}
                </span>
                <div className="flex gap-1.5">
                  <Button variant="success" size="xs">
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </Button>
                  <Button variant="danger" size="xs">
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
