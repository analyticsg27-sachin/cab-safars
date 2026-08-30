import { AppStateProvider } from '@/lib/app-state';
import PushNotificationSetup from '@/components/app/PushNotificationSetup';

export const metadata = {
  title: 'Cab Safars',
  description: 'Vendor & Driver Network',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <PushNotificationSetup />
      <div className="flex justify-center bg-[#070B10] min-h-dvh">
        <div className="relative w-full bg-[#0D1117]" style={{ maxWidth: 430, minHeight: '100dvh', boxShadow: '0 0 0 1px #21262D' }}>
          {children}
        </div>
      </div>
    </AppStateProvider>
  );
}
