'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAdminToken } from '@/lib/services/admin-api-client';
import AdminService from '@/lib/services/admin.service';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace('/admin/login/');
      return;
    }
    AdminService.me()
      .then(() => setVerified(true))
      .catch(() => {
        router.replace('/admin/login/');
      });
  }, [pathname, router]);

  if (!verified) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#8B949E]">Verifying session…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
