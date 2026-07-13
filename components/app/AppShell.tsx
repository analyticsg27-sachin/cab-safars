'use client';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: '#0D1117' }}>
      {/* Desktop label */}
      <p
        className="hidden md:block mb-2 text-xs font-semibold tracking-widest uppercase"
        style={{ color: '#F5A623' }}
      >
        CAB SAFARS
      </p>

      {/* Phone frame on md+, full-screen on mobile */}
      <div
        className="relative w-full flex flex-col"
        style={{
          maxWidth: '430px',
          minHeight: '100dvh',
          backgroundColor: '#0D1117',
        }}
      >
        {/* md+ frame decoration — rendered via a pseudo-element approach using inline style */}
        <style>{`
          @media (min-width: 768px) {
            .app-shell-frame {
              border: 1px solid #30363D;
              border-radius: 40px;
              box-shadow: 0 0 0 1px #21262D, 0 40px 80px rgba(0,0,0,0.7);
              overflow: hidden;
              min-height: 860px;
            }
          }
        `}</style>
        <div className="app-shell-frame flex flex-col flex-1 w-full"
          style={{ backgroundColor: '#0D1117' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
