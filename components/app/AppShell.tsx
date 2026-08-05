'use client';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#0B1220' }}
    >
      <div
        className="flex flex-col flex-1 w-full"
        style={{ backgroundColor: '#0B1220', minHeight: '100dvh', position: 'relative' }}
      >
        {children}
      </div>
    </div>
  );
}

