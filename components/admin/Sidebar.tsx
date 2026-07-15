"use client";

import { useState } from "react";
import { asset } from "@/lib/basepath";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Car, ClipboardCheck, MapPin,
  CreditCard, Star, Bell, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut, Shield, Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/admin/vendors", icon: Users, label: "Trip Providers" },
      { href: "/admin/drivers", icon: Car, label: "Drivers" },
      { href: "/admin/approvals", icon: ClipboardCheck, label: "Approvals", badge: 7 },
      { href: "/admin/trips", icon: MapPin, label: "Trips" },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/admin/payments", icon: CreditCard, label: "Payments" },
      { href: "/admin/subscriptions", icon: Star, label: "Subscriptions" },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/contacts", icon: Phone, label: "Contacts" },
      { href: "/admin/notifications", icon: Bell, label: "Notifications" },
      { href: "/admin/reports", icon: BarChart3, label: "Reports" },
      { href: "/admin/settings", icon: Settings, label: "Settings" },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative hidden md:flex flex-col bg-[#0B1220] border-r border-[#243042] transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b border-[#243042] shrink-0 px-4 py-5",
          collapsed && "justify-center px-2 py-4"
        )}
      >
        {!collapsed ? (
          <div>
            <img
              src={asset('/logo.png')}
              alt="CAB SAFARS"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = "block";
              }}
            />
            <span
              className="hidden text-lg font-extrabold tracking-tight text-white"
              style={{ display: "none" }}
            >
              CAB<span className="text-[#F5A623]">SAFARS</span>
            </span>
            <p className="text-xs text-[#94A3B8] mt-1">Admin Panel</p>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/30 flex items-center justify-center">
            <span className="text-[#F5A623] text-xs font-black">CS</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {!collapsed && (
              <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#6B7280]">
                {group.label}
              </p>
            )}
            {collapsed && <div className="my-1 mx-2 border-t border-[#243042]/60" />}
            <div className="flex flex-col gap-0.5 px-2">
              {group.items.map(({ href, icon: Icon, label, badge }) => {
                const active =
                  pathname === href ||
                  (href !== "/admin" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                      active
                        ? "bg-[#F5A623]/10 text-[#F5A623] border-l-[3px] border-[#F5A623] pl-[9px]"
                        : "text-[#94A3B8] hover:bg-[#1A2332] hover:text-white border-l-[3px] border-transparent pl-[9px]",
                      collapsed && "justify-center px-0 pl-0 border-l-0"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="flex-1 truncate">{label}</span>}
                    {!collapsed && badge != null && (
                      <span className="text-[10px] font-bold bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/25 rounded-full px-1.5 py-0.5 leading-none">
                        {badge}
                      </span>
                    )}
                    {collapsed && badge != null && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Admin user info */}
      <div className="shrink-0 border-t border-[#243042] p-2">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 bg-[#0F1929]">
            <div className="w-8 h-8 rounded-full bg-[#F5A623]/15 border border-[#F5A623]/30 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-[#F5A623]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Super Admin</p>
              <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/20 rounded px-1 py-0.5 leading-none mt-0.5">
                Admin
              </span>
            </div>
          </div>
        )}
        <button
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm text-[#94A3B8] hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-all duration-150",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-[#0B1220] border border-[#243042] flex items-center justify-center text-[#94A3B8] hover:text-[#F5A623] hover:border-[#F5A623]/50 transition-all duration-150 z-10 shadow-md"
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
