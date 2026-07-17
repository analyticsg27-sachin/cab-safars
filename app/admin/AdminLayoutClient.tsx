'use client';

import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import AdminAuthGuard from './AdminAuthGuard';
import AdminService from '@/lib/services/admin.service';
import { Shield, ChevronDown, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

function getSectionName(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1) return 'Dashboard';
  const last = segments[segments.length - 1];
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
}

function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = '';
  for (const seg of segments) {
    path += '/' + seg;
    crumbs.push({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
      href: path,
    });
  }
  return crumbs;
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  async function handleLogout() {
    await AdminService.logout();
    router.replace('/admin/login');
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const breadcrumbs = getBreadcrumbs(pathname);
  const sectionName = getSectionName(pathname);

  return (
    <AdminAuthGuard>
      <div className="flex h-screen bg-[#0B1220] overflow-hidden">
        <Sidebar mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-[#111827] border-b border-[#243042] flex items-center justify-between px-6 shrink-0">
            {/* Left: hamburger (mobile) + breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-[#1A2332] border border-[#243042] shrink-0"
              >
                <Menu className="w-4 h-4 text-[#94A3B8]" />
              </button>
              <nav className="flex items-center gap-1.5 text-xs text-[#6B7280]" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, i) => (
                  <span key={crumb.href} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-[#374151]">/</span>}
                    {i === breadcrumbs.length - 1 ? (
                      <span className="text-[#F5A623] font-semibold">{crumb.label}</span>
                    ) : (
                      <span className="text-[#6B7280] hover:text-[#94A3B8] transition-colors cursor-pointer">
                        {crumb.label}
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            </div>

            {/* Right: status + admin avatar dropdown */}
            <div className="flex items-center gap-4">
              {/* Online indicator */}
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-sm shadow-[#22C55E]/50" />
                <span className="text-xs text-[#6B7280] hidden sm:block">Online</span>
              </div>

              {/* Admin dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1A2332] border border-[#243042] hover:border-[#F5A623]/30 transition-all duration-150 group"
                >
                  <div className="w-7 h-7 rounded-full bg-[#F5A623]/15 border border-[#F5A623]/30 flex items-center justify-center shrink-0">
                    <Shield className="w-3.5 h-3.5 text-[#F5A623]" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-white leading-tight">Super Admin</p>
                    <p className="text-[10px] text-[#6B7280] leading-tight">Administrator</p>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#94A3B8] transition-transform duration-150 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[#111827] border border-[#243042] rounded-xl shadow-2xl shadow-black/40 z-20 overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#243042]">
                        <p className="text-xs font-semibold text-white">Super Admin</p>
                        <p className="text-[11px] text-[#6B7280] mt-0.5">admin@cabsafars.in</p>
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/20 rounded px-1.5 py-0.5 leading-none mt-1.5">
                          Admin
                        </span>
                      </div>
                      <div className="p-1.5">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-all duration-150"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
