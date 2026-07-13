"use client";

import { useState } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, MapPin, Star, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const revenueData = [
  { month: "Feb", revenue: 23800 },
  { month: "Mar", revenue: 29800 },
  { month: "Apr", revenue: 33400 },
  { month: "May", revenue: 37200 },
  { month: "Jun", revenue: 35800 },
  { month: "Jul", revenue: 39800 },
];

const userGrowthData = [
  { month: "Feb", vendors: 580, drivers: 470 },
  { month: "Mar", vendors: 610, drivers: 495 },
  { month: "Apr", vendors: 630, drivers: 510 },
  { month: "May", vendors: 648, drivers: 530 },
  { month: "Jun", vendors: 660, drivers: 548 },
  { month: "Jul", vendors: 678, drivers: 567 },
];

const tripData = [
  { month: "Feb", closed: 22, open: 7 },
  { month: "Mar", closed: 31, open: 9 },
  { month: "Apr", closed: 28, open: 8 },
  { month: "May", closed: 35, open: 10 },
  { month: "Jun", closed: 26, open: 6 },
  { month: "Jul", closed: 14, open: 7 },
];

const topRoutes = [
  { route: "Ahmedabad → Mumbai", trips: 47, contactRate: "82%", closedRate: "68%" },
  { route: "Surat → Ahmedabad", trips: 38, contactRate: "76%", closedRate: "61%" },
  { route: "Ahmedabad → Baroda", trips: 34, contactRate: "71%", closedRate: "58%" },
  { route: "Mumbai → Pune", trips: 28, contactRate: "85%", closedRate: "72%" },
  { route: "Rajkot → Ahmedabad", trips: 22, contactRate: "68%", closedRate: "54%" },
];

const pieData = [
  { name: "Premium", value: 145 },
  { name: "Free", value: 1100 },
];
const PIE_COLORS = ["#F5A623", "#21262D"];

const dateRanges = ["Last 7 days", "Last 30 days", "Last 3 months", "This Year"];

const tooltipStyle = {
  backgroundColor: "#1C2128",
  border: "1px solid #30363D",
  borderRadius: "8px",
  color: "#F0F6FC",
  fontSize: "12px",
};

export default function ReportsPage() {
  const [range, setRange] = useState("Last 30 days");

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Reports & Analytics</h1>
          <p className="text-[#8B949E] mt-1 text-sm">Platform performance overview</p>
        </div>
        <div className="flex gap-1 flex-wrap">
          {dateRanges.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                range === r
                  ? "bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/30"
                  : "text-[#8B949E] bg-[#161B22] border border-[#30363D] hover:text-[#F0F6FC]"
              )}
            >
              <Calendar className="w-3 h-3" />{r}
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Revenue */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#8B949E] mb-1 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" />Revenue Overview</p>
            <p className="text-3xl font-bold text-[#F0F6FC]">₹1,99,800</p>
            <p className="text-sm text-[#8B949E] mt-0.5">This Month: <span className="text-[#22C55E] font-semibold">₹39,800</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#8B949E]">Total Transactions</p>
            <p className="text-xl font-bold text-[#F0F6FC]">1,003</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F5A623" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
            <XAxis dataKey="month" tick={{ fill: "#8B949E", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8B949E", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]} />
            <Area type="monotone" dataKey="revenue" stroke="#F5A623" strokeWidth={2} fill="url(#revGrad)" dot={{ fill: "#F5A623", r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Section 2: User Growth */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#8B949E] flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />User Growth</p>
          <div className="flex gap-4 text-sm">
            <span className="text-[#F0F6FC] font-bold">678 <span className="text-xs font-normal text-[#F5A623]">Vendors</span></span>
            <span className="text-[#F0F6FC] font-bold">567 <span className="text-xs font-normal text-[#2D6BE4]">Drivers</span></span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={userGrowthData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
            <XAxis dataKey="month" tick={{ fill: "#8B949E", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8B949E", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#8B949E" }} />
            <Line type="monotone" dataKey="vendors" stroke="#F5A623" strokeWidth={2} dot={{ r: 3 }} name="Vendors" />
            <Line type="monotone" dataKey="drivers" stroke="#2D6BE4" strokeWidth={2} dot={{ r: 3 }} name="Drivers" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Section 3: Trip Analytics */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-[#8B949E] flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />Trip Analytics</p>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Total", value: 234, color: "text-[#F0F6FC]" },
              { label: "Open", value: 47, color: "text-[#F5A623]" },
              { label: "Closed", value: 156, color: "text-[#22C55E]" },
              { label: "Cancelled", value: 31, color: "text-[#EF4444]" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
                <p className="text-xs text-[#8B949E]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={tripData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
            <XAxis dataKey="month" tick={{ fill: "#8B949E", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8B949E", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#8B949E" }} />
            <Bar dataKey="closed" fill="#22C55E" radius={[3, 3, 0, 0]} name="Closed" />
            <Bar dataKey="open" fill="#F5A623" radius={[3, 3, 0, 0]} name="Open" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Section 4: Top Routes */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#30363D]">
          <p className="text-sm font-semibold text-[#F0F6FC]">Top Routes</p>
          <p className="text-xs text-[#8B949E] mt-0.5">Most popular routes by trip count</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#30363D]">
                {["#", "Route", "Trips", "Contact Rate", "Closed Rate"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topRoutes.map((r, i) => (
                <tr key={r.route} className="border-b border-[#30363D]/50 hover:bg-[#21262D]/40 transition-colors">
                  <td className="px-4 py-3 text-[#8B949E] text-xs">{i + 1}</td>
                  <td className="px-4 py-3 text-[#F0F6FC] font-medium whitespace-nowrap">{r.route}</td>
                  <td className="px-4 py-3 text-[#F5A623] font-semibold">{r.trips}</td>
                  <td className="px-4 py-3 text-[#22C55E]">{r.contactRate}</td>
                  <td className="px-4 py-3 text-[#2D6BE4]">{r.closedRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 5: Subscription Metrics */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4">
        <p className="text-xs text-[#8B949E] flex items-center gap-1.5"><Star className="w-3.5 h-3.5" />Subscription Metrics</p>
        <div className="grid sm:grid-cols-3 gap-4 mb-2">
          {[
            { label: "Active Premium", value: "145" },
            { label: "Monthly Conversion", value: "21.4%" },
            { label: "Avg. Renewal Rate", value: "78%" },
          ].map(m => (
            <div key={m.label} className="bg-[#21262D] rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-[#F5A623]">{m.value}</p>
              <p className="text-xs text-[#8B949E] mt-1">{m.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-sm text-[#F0F6FC]">{d.name}</span>
                <span className="text-sm font-bold text-[#F0F6FC]">{d.value}</span>
                <span className="text-xs text-[#8B949E]">({((d.value / (145 + 1100)) * 100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
