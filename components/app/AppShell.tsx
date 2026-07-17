'use client';

import { asset } from '@/lib/basepath';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: '#0B1220' }}
    >
      {/* Desktop label */}
      <div className="hidden md:flex items-center gap-3 mb-3">
        <img
          src={asset('/logo-v2.png')}
          alt="CAB SAFARS"
          className="h-7 w-auto object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: '#F5A623' }}
        >
          App Preview
        </span>
      </div>

      {/* Phone frame on md+, full-screen on mobile */}
      <div
        className="relative w-full flex flex-col"
        style={{ maxWidth: '430px', minHeight: '100dvh', backgroundColor: '#0B1220' }}
      >
        <style>{`
          @media (min-width: 768px) {
            .app-shell-frame {
              border: 1px solid #243042;
              border-radius: 44px;
              box-shadow:
                0 0 0 8px #0B1220,
                0 0 0 9px #243042,
                0 32px 80px rgba(0,0,0,0.8),
                0 0 80px rgba(245,166,35,0.04);
              overflow: hidden;
              min-height: 880px;
            }
          }
          @media (max-width: 767px) {
            .app-shell-frame {
              min-height: 100dvh;
            }
          }
        `}</style>
        <div
          className="app-shell-frame flex flex-col flex-1 w-full"
          style={{ backgroundColor: '#0B1220' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

