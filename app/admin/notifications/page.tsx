"use client";

import { useState } from "react";
import {
  Bell, Send, CheckCircle2, CreditCard, ShieldOff, Clock,
  Info, AlertTriangle, CheckCircle, AlertCircle, X, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const systemNotifs = [
  { id: "SN1", type: "approval", message: "Priya Mehta (Vendor) approved", sentTo: "v004", time: "2025-07-10T14:00:00Z", status: "sent" },
  { id: "SN2", type: "payment", message: "Payment confirmed: Rajesh Patel ₹199", sentTo: "v001", time: "2025-07-01T10:30:00Z", status: "sent" },
  { id: "SN3", type: "suspension", message: "Account suspended: Deepa Nair (Vendor)", sentTo: "v006", time: "2025-05-20T09:00:00Z", status: "sent" },
  { id: "SN4", type: "expiry", message: "Premium expiry reminder sent to 12 users", sentTo: "all", time: "2025-07-08T08:00:00Z", status: "sent" },
];

const typeIconMap: Record<string, { icon: React.ElementType; color: string }> = {
  approval:  { icon: CheckCircle2, color: "text-[#22C55E]" },
  payment:   { icon: CreditCard,   color: "text-[#F5A623]" },
  suspension:{ icon: ShieldOff,    color: "text-[#EF4444]" },
  expiry:    { icon: Clock,        color: "text-[#F59E0B]" },
};

const notifTypes = [
  { value: "info",    label: "Info",    icon: Info,         color: "text-[#2D6BE4]" },
  { value: "success", label: "Success", icon: CheckCircle,  color: "text-[#22C55E]" },
  { value: "warning", label: "Warning", icon: AlertTriangle, color: "text-[#F59E0B]" },
  { value: "alert",   label: "Alert",   icon: AlertCircle,  color: "text-[#EF4444]" },
];

const targetOptions = [
  "All Users", "All Vendors", "All Drivers",
  "Premium Users", "Free Users", "Specific User (enter ID)",
];

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function NotificationsPage() {
  const [tab, setTab] = useState<"system" | "send">("system");
  const [target, setTarget] = useState(targetOptions[0]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifType, setNotifType] = useState("info");
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(false);

  function handleSend() {
    setShowConfirm(false);
    setToast(true);
    setTitle("");
    setMessage("");
    setTimeout(() => setToast(false), 3500);
  }

  const selectedType = notifTypes.find(t => t.value === notifType)!;
  const TypeIcon = selectedType.icon;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Notifications</h1>
          <p className="text-[#8B949E] mt-1 text-sm">Manage system and manual notifications</p>
        </div>
        <button
          onClick={() => setTab("send")}
          className="flex items-center gap-2 px-4 py-2 bg-[#F5A623] text-[#0D1117] text-sm font-semibold rounded-lg hover:bg-[#F5A623]/90 transition-colors"
        >
          <Send className="w-4 h-4" /> Send Notification
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#30363D]">
        {(["system", "send"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors -mb-px",
              tab === t
                ? "border-[#F5A623] text-[#F5A623]"
                : "border-transparent text-[#8B949E] hover:text-[#F0F6FC]"
            )}
          >
            {t === "system" ? "System Notifications" : "Send New"}
          </button>
        ))}
      </div>

      {tab === "system" && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#30363D]">
            <p className="text-sm font-medium text-[#F0F6FC]">Recent System Events</p>
            <p className="text-xs text-[#8B949E] mt-0.5">Auto-generated notifications triggered by platform actions</p>
          </div>
          <div className="divide-y divide-[#30363D]/50">
            {systemNotifs.map(n => {
              const { icon: NIcon, color } = typeIconMap[n.type] ?? { icon: Bell, color: "text-[#8B949E]" };
              return (
                <div key={n.id} className="flex items-start gap-4 px-5 py-4 hover:bg-[#21262D]/40 transition-colors">
                  <div className={cn("w-9 h-9 rounded-lg bg-[#21262D] flex items-center justify-center shrink-0 mt-0.5", color)}>
                    <NIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#F0F6FC]">{n.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#8B949E]">To: <span className="text-[#F0F6FC]">{n.sentTo}</span></span>
                      <span className="text-xs text-[#8B949E]">{fmt(n.time)}</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full shrink-0 mt-0.5 capitalize">{n.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "send" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#F0F6FC]">Compose Notification</h3>

            <div>
              <label className="block text-xs text-[#8B949E] mb-1.5">Target Audience</label>
              <select
                value={target}
                onChange={e => setTarget(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#21262D] border border-[#30363D] rounded-lg text-[#F0F6FC] focus:outline-none focus:border-[#F5A623]/50"
              >
                {targetOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#8B949E] mb-1.5">Notification Type</label>
              <div className="grid grid-cols-2 gap-2">
                {notifTypes.map(nt => {
                  const NTIcon = nt.icon;
                  return (
                    <button
                      key={nt.value}
                      onClick={() => setNotifType(nt.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors",
                        notifType === nt.value
                          ? "border-[#F5A623]/40 bg-[#F5A623]/10 text-[#F0F6FC]"
                          : "border-[#30363D] text-[#8B949E] hover:bg-[#21262D]"
                      )}
                    >
                      <NTIcon className={cn("w-3.5 h-3.5", nt.color)} />{nt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#8B949E] mb-1.5">Title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Notification title..."
                className="w-full px-3 py-2 text-sm bg-[#21262D] border border-[#30363D] rounded-lg text-[#F0F6FC] placeholder:text-[#8B949E] focus:outline-none focus:border-[#F5A623]/50"
              />
            </div>

            <div>
              <label className="block text-xs text-[#8B949E] mb-1.5">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                placeholder="Write your message here..."
                className="w-full px-3 py-2 text-sm bg-[#21262D] border border-[#30363D] rounded-lg text-[#F0F6FC] placeholder:text-[#8B949E] focus:outline-none focus:border-[#F5A623]/50 resize-none"
              />
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={!title.trim() || !message.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#F5A623] text-[#0D1117] text-sm font-semibold rounded-lg hover:bg-[#F5A623]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" /> Send Notification
            </button>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <p className="text-xs text-[#8B949E] font-medium uppercase tracking-wider">Preview</p>
            <div className="bg-[#1C2128] border border-[#30363D] rounded-xl p-4">
              <div className={cn("flex items-start gap-3 p-3 rounded-lg border",
                notifType === "info"    ? "bg-[#2D6BE4]/10 border-[#2D6BE4]/20" :
                notifType === "success" ? "bg-[#22C55E]/10 border-[#22C55E]/20" :
                notifType === "warning" ? "bg-[#F59E0B]/10 border-[#F59E0B]/20" :
                                          "bg-[#EF4444]/10 border-[#EF4444]/20"
              )}>
                <TypeIcon className={cn("w-5 h-5 shrink-0 mt-0.5", selectedType.color)} />
                <div>
                  <p className="text-sm font-semibold text-[#F0F6FC]">{title || "Notification Title"}</p>
                  <p className="text-xs text-[#8B949E] mt-1">{message || "Your notification message will appear here..."}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-[#8B949E]">
                <Users className="w-3.5 h-3.5" />
                <span>To: {target}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-[#161B22] border border-[#30363D] rounded-xl p-6 w-full max-w-sm space-y-4">
            <button onClick={() => setShowConfirm(false)} className="absolute top-4 right-4 text-[#8B949E] hover:text-[#F0F6FC]">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5A623]/10 flex items-center justify-center">
                <Send className="w-5 h-5 text-[#F5A623]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F0F6FC]">Confirm Send</p>
                <p className="text-xs text-[#8B949E]">This will queue the notification for delivery</p>
              </div>
            </div>
            <div className="bg-[#21262D] rounded-lg p-3 text-xs text-[#8B949E] space-y-1">
              <p><span className="text-[#F0F6FC]">To:</span> {target}</p>
              <p><span className="text-[#F0F6FC]">Title:</span> {title}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 rounded-lg border border-[#30363D] text-sm text-[#8B949E] hover:bg-[#21262D] transition-colors">Cancel</button>
              <button onClick={handleSend} className="flex-1 py-2 rounded-lg bg-[#F5A623] text-[#0D1117] text-sm font-semibold hover:bg-[#F5A623]/90 transition-colors">Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#161B22] border border-[#22C55E]/30 rounded-xl px-4 py-3 shadow-xl">
          <CheckCircle className="w-5 h-5 text-[#22C55E]" />
          <p className="text-sm text-[#F0F6FC]">Notification queued for delivery</p>
        </div>
      )}
    </div>
  );
}
