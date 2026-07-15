"use client";

import React, { useEffect, useState } from "react";
import {
  Users, Car, MapPin, DollarSign, Star, ClipboardCheck, Phone, TrendingUp,
  CheckCircle, XCircle, Clock, AlertCircle,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminService from "@/lib/services/admin.service";
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

interface DashboardData {
  stats: {
    users: { total: number; vendors: number; drivers: number; pending: number; approved: number };
    trips: { total: number; active: number; closed: number };
    subscriptions: { active: number; total_revenue: number };
    pending_approvals: number;
  };
  recent_users: Array<{ uuid: string; name: string; role: string; status: string; city: string; created_at: string }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  useEffect(() => {
    AdminService.getDashboard()
      .then((res: unknown) => {
        const r = res as { data?: DashboardData };
        setData(r.data ?? null);
      })
      .catch((err: unknown) => {
        const e = err instanceof Error ? err.message : 'Failed to load dashboard';
        setError(e);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#8B949E]">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="w-8 h-8 text-[#EF4444]" />
          <p className="text-sm text-[#EF4444]">{error || 'No data available'}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-[#F5A623] underline"
          >Retry</button>
        </div>
      </div>
    );
  }

  const { stats, recent_users } = data;
  const pendingUsers = recent_users.filter((u) => u.status === 'pending').slice(0, 4);

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium text-[#0D1117] bg-[#22C55E] shadow-lg">
          {toast}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-[#F0F6FC]">Dashboard</h1>
        <p className="text-sm text-[#8B949E] mt-0.5">Live overview of platform activity</p>
      </div>

      {/* KPI row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Trip Providers" value={stats.users.vendors}
          icon={<Users className="w-4.5 h-4.5" />} iconColor="text-[#2D6BE4]" />
        <StatCard title="Total Drivers" value={stats.users.drivers}
          icon={<Car className="w-4.5 h-4.5" />} iconColor="text-[#F5A623]" />
        <StatCard title="Active Trips" value={stats.trips.active}
          icon={<MapPin className="w-4.5 h-4.5" />} iconColor="text-[#22C55E]" />
        <StatCard title="Revenue Total" value={formatCurrency(stats.subscriptions.total_revenue)}
          icon={<DollarSign className="w-4.5 h-4.5" />} iconColor="text-[#F5A623]" />
      </div>

      {/* KPI row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Premium Users" value={stats.subscriptions.active}
          icon={<Star className="w-4.5 h-4.5" />} iconColor="text-[#F5A623]" />
        <StatCard title="Pending Approvals" value={stats.pending_approvals}
          icon={<ClipboardCheck className="w-4.5 h-4.5" />} iconColor="text-[#F59E0B]" />
        <StatCard title="Total Users" value={stats.users.total}
          icon={<Phone className="w-4.5 h-4.5" />} iconColor="text-[#2D6BE4]" />
        <StatCard title="Approved Users" value={stats.users.approved}
          icon={<TrendingUp className="w-4.5 h-4.5" />} iconColor="text-[#22C55E]" />
      </div>

      {/* Recent Users + Stats */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Trips summary */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#F0F6FC] mb-5">Trips Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { name: 'Active', value: stats.trips.active, fill: '#22C55E' },
                { name: 'Closed', value: stats.trips.closed, fill: '#8B949E' },
                { name: 'Total', value: stats.trips.total, fill: '#2D6BE4' },
              ]}
              margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
              <XAxis dataKey="name" tick={{ fill: "#8B949E", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8B949E", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Trips" fill="#F5A623" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Users breakdown */}
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#F0F6FC] mb-5">Users Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { name: 'Trip Providers', value: stats.users.vendors },
                { name: 'Drivers', value: stats.users.drivers },
                { name: 'Pending', value: stats.users.pending },
                { name: 'Approved', value: stats.users.approved },
              ]}
              margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
              <XAxis dataKey="name" tick={{ fill: "#8B949E", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8B949E", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Users" fill="#2D6BE4" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Approvals from recent_users */}
      {pendingUsers.length > 0 && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#30363D]">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#F0F6FC]">Recent Pending Approvals</h3>
              <span className="text-xs font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-full px-2 py-0.5">
                {stats.pending_approvals}
              </span>
            </div>
            <a href="/admin/approvals" className="text-xs text-[#F5A623] hover:underline">View all</a>
          </div>
          <div className="divide-y divide-[#30363D]/50">
            {pendingUsers.map((user) => (
              <div key={user.uuid} className="flex items-center justify-between px-5 py-4 hover:bg-[#1C2128]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#21262D] flex items-center justify-center text-[#8B949E] font-semibold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F0F6FC]">{user.name}</p>
                    <p className="text-xs text-[#8B949E]">{user.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={user.role === "vendor" ? "vendor" : "driver"}>{user.role === "vendor" ? "Trip Provider" : user.role}</Badge>
                  <span className="text-xs text-[#8B949E] hidden sm:flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(user.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
