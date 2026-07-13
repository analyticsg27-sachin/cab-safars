"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Car, ClipboardCheck, MapPin,
  CreditCard, Star, Bell, BarChart3, Settings, Car as CarIcon,
  ChevronLeft, ChevronRight, LogOut, Shield, Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/vendors", icon: Users, label: "Vendors" },
  { href: "/admin/drivers", icon: Car, label: "Drivers" },
  { href: "/admin/approvals", icon: ClipboardCheck, label: "Approvals", badge: 7 },
  { href: "/admin/trips", icon: MapPin, label: "Trips" },
  { href: "/admin/payments", icon: CreditCard, label: "Payments" },
  { href: "/admin/subscriptions", icon: Star, label: "Subscriptions" },
  { href: "/admin/contacts", icon: Phone, label: "Contacts" },
  { href: "/admin/notifications", icon: Bell, label: "Notifications" },
  { href: "/admin/reports", icon: BarChart3, label: "Reports" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-[#161B22] border-r border-[#30363D] transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center border-b border-[#30363D] h-16 px-4 gap-3 shrink-0",
        collapsed && "justify-center px-2"
      )}>
        <div className="w-8 h-8 rounded-lg bg-[#F5A623] flex items-center justify-center shrink-0 shadow-lg shadow-[#F5A623]/20">
          <CarIcon className="w-4 h-4 text-[#0D1117]" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-[#F0F6FC] leading-tight">CAB SAFARS</p>
            <p className="text-xs text-[#8B949E]">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                active
                  ? "bg-[#F5A623]/10 text-[#F5A623]"
                  : "text-[#8B949E] hover:bg-[#21262D] hover:text-[#F0F6FC]",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{label}</span>}
              {!collapsed && badge && (
                <span className="text-xs font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/20 rounded-full px-1.5 py-0.5 leading-none">
                  {badge}
                </span>
              )}
              {collapsed && badge && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User / bottom */}
      <div className="p-2 border-t border-[#30363D]">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2.5 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#F5A623]/15 border border-[#F5A623]/30 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-[#F5A623]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#F0F6FC] truncate">Super Admin</p>
              <p className="text-xs text-[#8B949E] truncate">admin@cabsafars.in</p>
            </div>
          </div>
        )}
        <button
          className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-sm text-[#8B949E] hover:bg-[#21262D] hover:text-[#EF4444] transition-colors"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1C2128] border border-[#30363D] flex items-center justify-center text-[#8B949E] hover:text-[#F5A623] hover:border-[#F5A623]/40 transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
}
