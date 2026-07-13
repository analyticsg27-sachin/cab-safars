import { AppStateProvider } from '@/lib/app-state';

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
  return <AppStateProvider>{children}</AppStateProvider>;
}
