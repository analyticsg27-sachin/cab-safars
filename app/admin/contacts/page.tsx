"use client";

import { useState } from "react";
import { Phone, MessageCircle, Route, Users, Repeat2 } from "lucide-react";
import { cn } from "@/lib/utils";

const mockContacts = [
  { id: "C001", driverId: "d001", driverName: "Harshad Bhatt", driverPremium: true, vendorId: "v001", vendorName: "Rajesh Patel", tripId: "TRP12563", tripRoute: "Ahmedabad → Baroda", contactMethod: "whatsapp", contactedAt: "2025-07-15T10:30:00Z" },
  { id: "C002", driverId: "d002", driverName: "Kiran Patel", driverPremium: true, vendorId: "v001", vendorName: "Rajesh Patel", tripId: "TRP12563", tripRoute: "Ahmedabad → Baroda", contactMethod: "call", contactedAt: "2025-07-15T11:15:00Z" },
  { id: "C003", driverId: "d005", driverName: "Sunil Maurya", driverPremium: true, vendorId: "v001", vendorName: "Rajesh Patel", tripId: "TRP12563", tripRoute: "Ahmedabad → Baroda", contactMethod: "whatsapp", contactedAt: "2025-07-15T14:20:00Z" },
  { id: "C004", driverId: "d008", driverName: "Gopal Sharma", driverPremium: true, vendorId: "v002", vendorName: "Sunita Shah", tripId: "TRP12562", tripRoute: "Surat → Mumbai", contactMethod: "call", contactedAt: "2025-07-14T09:00:00Z" },
  { id: "C005", driverId: "d001", driverName: "Harshad Bhatt", driverPremium: true, vendorId: "v002", vendorName: "Sunita Shah", tripId: "TRP12562", tripRoute: "Surat → Mumbai", contactMethod: "whatsapp", contactedAt: "2025-07-14T10:30:00Z" },
  { id: "C006", driverId: "d010", driverName: "Manish Dubey", driverPremium: true, vendorId: "v005", vendorName: "Anil Kumar", tripId: "TRP12560", tripRoute: "Rajkot → Pune", contactMethod: "call", contactedAt: "2025-07-13T08:45:00Z" },
  { id: "C007", driverId: "d013", driverName: "Devendra Solanki", driverPremium: true, vendorId: "v007", vendorName: "Ravi Sharma", tripId: "TRP12559", tripRoute: "Anand → Vadodara", contactMethod: "whatsapp", contactedAt: "2025-07-12T15:30:00Z" },
  { id: "C008", driverId: "d015", driverName: "Jitendra Parmar", driverPremium: true, vendorId: "v010", vendorName: "Anita Desai", tripId: "TRP12558", tripRoute: "Mumbai → Pune", contactMethod: "call", contactedAt: "2025-07-11T12:00:00Z" },
];

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ContactsPage() {
  const [tab, setTab] = useState("all");

  const todayStr = "2025-07-15";
  const todayContacts = mockContacts.filter(c => c.contactedAt.startsWith(todayStr)).length;
  const callCount = mockContacts.filter(c => c.contactMethod === "call").length;
  const wpCount = mockContacts.filter(c => c.contactMethod === "whatsapp").length;
  const uniqueTrips = new Set(mockContacts.map(c => c.tripId)).size;

  const filtered = mockContacts.filter(c => tab === "all" || c.contactMethod === tab);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F0F6FC]">Contact Activity</h1>
        <p className="text-[#8B949E] mt-1 text-sm">Track when premium drivers contact vendors via trips</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Contacts Today", value: todayContacts, icon: Users, color: "text-[#F5A623]", bg: "bg-[#F5A623]/10" },
          { label: "Via Call", value: callCount, icon: Phone, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
          { label: "Via WhatsApp", value: wpCount, icon: MessageCircle, color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
          { label: "Unique Trips", value: uniqueTrips, icon: Route, color: "text-[#2D6BE4]", bg: "bg-[#2D6BE4]/10" },
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
          {["all", "call", "whatsapp"].map(t => (
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
              {t === "whatsapp" ? "WhatsApp" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#30363D]">
                {["Driver", "Vendor", "Trip Route", "Contact Method", "Date / Time"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-[#8B949E]">No contact activity found</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="border-b border-[#30363D]/50 hover:bg-[#21262D]/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-[#F0F6FC] font-medium">{c.driverName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-[#8B949E]">{c.driverId}</span>
                      {c.driverPremium && (
                        <span className="text-xs text-[#F5A623] bg-[#F5A623]/10 px-1.5 py-0.5 rounded-full">Premium</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[#F0F6FC]">{c.vendorName}</p>
                    <p className="text-xs text-[#8B949E]">{c.vendorId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Repeat2 className="w-3.5 h-3.5 text-[#8B949E] shrink-0" />
                      <span className="text-[#F0F6FC] text-xs">{c.tripRoute}</span>
                    </div>
                    <p className="text-xs text-[#8B949E] mt-0.5">{c.tripId}</p>
                  </td>
                  <td className="px-4 py-3">
                    {c.contactMethod === "call" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2.5 py-1 rounded-full">
                        <Phone className="w-3 h-3" /> Call
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2.5 py-1 rounded-full">
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">{fmt(c.contactedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
