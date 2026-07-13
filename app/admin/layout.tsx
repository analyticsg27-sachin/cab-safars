import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: "CAB SAFARS — Admin Panel",
  description: "Admin dashboard for managing CAB SAFARS platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0D1117] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between px-6 shrink-0">
          <div />
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8B949E]">CAB SAFARS Admin</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" title="Online" />
          </div>
        </header>
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
