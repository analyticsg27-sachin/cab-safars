"use client";

import { useState } from "react";
import {
  Globe, CreditCard, Bell, Shield, Info,
  Save, ToggleLeft, ToggleRight, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-2.5 pb-3 border-b border-[#30363D]">
        <div className="w-8 h-8 rounded-lg bg-[#F5A623]/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#F5A623]" />
        </div>
        <h2 className="text-sm font-semibold text-[#F0F6FC]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <label className="text-xs text-[#8B949E] sm:w-44 shrink-0">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, disabled, placeholder }: { value: string; onChange?: (v: string) => void; disabled?: boolean; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className={cn(
        "w-full px-3 py-2 text-sm bg-[#21262D] border border-[#30363D] rounded-lg text-[#F0F6FC] focus:outline-none focus:border-[#F5A623]/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    />
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm bg-[#21262D] border border-[#30363D] rounded-lg text-[#F0F6FC] focus:outline-none focus:border-[#F5A623]/50"
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-[#F0F6FC]">{label}</span>
      <button onClick={() => onChange(!value)} className="shrink-0">
        {value
          ? <ToggleRight className="w-8 h-8 text-[#22C55E]" />
          : <ToggleLeft className="w-8 h-8 text-[#8B949E]" />}
      </button>
    </div>
  );
}

function SaveButton({ label = "Save Changes" }: { label?: string }) {
  const [saved, setSaved] = useState(false);
  function handle() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  return (
    <button
      onClick={handle}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        saved
          ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30"
          : "bg-[#F5A623] text-[#0D1117] hover:bg-[#F5A623]/90"
      )}
    >
      <Save className="w-4 h-4" />
      {saved ? "Saved!" : label}
    </button>
  );
}

export default function SettingsPage() {
  const [platformName, setPlatformName] = useState("Cab Safars");
  const [supportEmail, setSupportEmail] = useState("support@cabsafars.com");
  const [supportPhone, setSupportPhone] = useState("+91 80000 00000");
  const [websiteUrl, setWebsiteUrl] = useState("www.cabsafars.com");

  const [trialPeriod, setTrialPeriod] = useState("None");
  const [autoRenew, setAutoRenew] = useState(true);
  const [gracePeriod, setGracePeriod] = useState("3 days");

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [adminEmail, setAdminEmail] = useState("admin@cabsafars.in");

  const [sessionTimeout, setSessionTimeout] = useState("30 minutes");
  const [maxLogin, setMaxLogin] = useState("5");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F0F6FC]">Settings</h1>
        <p className="text-[#8B949E] mt-1 text-sm">Platform configuration and preferences</p>
      </div>

      {/* General */}
      <SectionCard icon={Globe} title="General">
        <div className="space-y-4">
          <Field label="Platform Name"><TextInput value={platformName} onChange={setPlatformName} /></Field>
          <Field label="Support Email"><TextInput value={supportEmail} onChange={setSupportEmail} /></Field>
          <Field label="Support Phone"><TextInput value={supportPhone} onChange={setSupportPhone} /></Field>
          <Field label="Website URL"><TextInput value={websiteUrl} onChange={setWebsiteUrl} /></Field>
        </div>
        <div className="flex justify-end pt-2"><SaveButton /></div>
      </SectionCard>

      {/* Subscription */}
      <SectionCard icon={CreditCard} title="Subscription">
        <div className="space-y-4">
          <Field label="Premium Price">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#8B949E]">â‚¹</span>
              <TextInput value="199" disabled />
            </div>
          </Field>
          <Field label="Trial Period">
            <SelectInput value={trialPeriod} onChange={setTrialPeriod} options={["None", "7 days", "14 days", "30 days"]} />
          </Field>
          <Field label="Auto-renewal">
            <div className="flex items-center gap-2">
              <button onClick={() => setAutoRenew(!autoRenew)}>
                {autoRenew
                  ? <ToggleRight className="w-8 h-8 text-[#22C55E]" />
                  : <ToggleLeft className="w-8 h-8 text-[#8B949E]" />}
              </button>
              <span className="text-sm text-[#8B949E]">{autoRenew ? "Enabled" : "Disabled"}</span>
            </div>
          </Field>
          <Field label="Grace Period">
            <SelectInput value={gracePeriod} onChange={setGracePeriod} options={["None", "1 day", "3 days", "7 days"]} />
          </Field>
        </div>
        <div className="flex items-start gap-2 p-3 rounded-lg bg-[#F59E0B]/5 border border-[#F59E0B]/20">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
          <p className="text-xs text-[#F59E0B]">Subscription pricing changes require backend update</p>
        </div>
        <div className="flex justify-end pt-2"><SaveButton /></div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard icon={Bell} title="Notifications">
        <div className="space-y-1">
          <Toggle value={emailNotifs} onChange={setEmailNotifs} label="Email Notifications" />
          <Toggle value={smsNotifs} onChange={setSmsNotifs} label="SMS Notifications" />
          <Toggle value={pushNotifs} onChange={setPushNotifs} label="Push Notifications" />
        </div>
        <Field label="Admin Notification Email">
          <TextInput value={adminEmail} onChange={setAdminEmail} placeholder="admin@example.com" />
        </Field>
        <div className="flex justify-end pt-2"><SaveButton /></div>
      </SectionCard>

      {/* Security */}
      <SectionCard icon={Shield} title="Security">
        <div className="space-y-4">
          <Field label="Session Timeout">
            <SelectInput value={sessionTimeout} onChange={setSessionTimeout} options={["15 minutes", "30 minutes", "1 hour", "4 hours"]} />
          </Field>
          <Field label="Max Login Attempts">
            <SelectInput value={maxLogin} onChange={setMaxLogin} options={["3", "5", "10"]} />
          </Field>
        </div>
        <div className="flex items-start gap-2 p-3 rounded-lg bg-[#21262D] border border-[#30363D]">
          <Info className="w-4 h-4 text-[#8B949E] shrink-0 mt-0.5" />
          <p className="text-xs text-[#8B949E]">Security settings apply to admin panel only</p>
        </div>
        <div className="flex justify-end pt-2"><SaveButton /></div>
      </SectionCard>

      {/* About */}
      <SectionCard icon={Info} title="About">
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "Platform Version", value: "v1.0.0 (Phase 1)" },
            { label: "Build Date", value: "2026-07-13" },
            { label: "Current Phase", value: "Phase 1 â€” Frontend Demo" },
            { label: "Next Phase", value: "Phase 2 â€” Backend Integration" },
          ].map(item => (
            <div key={item.label} className="bg-[#21262D] rounded-lg p-3">
              <p className="text-xs text-[#8B949E]">{item.label}</p>
              <p className="text-sm text-[#F0F6FC] font-medium mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
