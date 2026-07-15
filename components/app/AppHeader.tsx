'use client';

import { ArrowLeft, Crown } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  isPremium?: boolean;
  subtitle?: string;
}

export default function AppHeader({
  title,
  showBack = false,
  onBack,
  rightAction,
  isPremium = false,
  subtitle,
}: AppHeaderProps) {
  return (
    <header
      className="flex items-center px-4 shrink-0 z-20"
      style={{
        height: subtitle ? '64px' : '56px',
        backgroundColor: '#0B1220',
        borderBottom: '1px solid #243042',
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Left */}
      <div className="w-10 flex items-center">
        {showBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-all active:scale-95"
            style={{ color: '#FFFFFF', backgroundColor: '#1A2332', border: '1px solid #243042' }}
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
        )}
      </div>

      {/* Center */}
      <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
        <div className="flex items-center gap-1.5">
          <span
            className="text-base font-semibold truncate"
            style={{ color: '#FFFFFF', letterSpacing: '-0.01em' }}
          >
            {title}
          </span>
          {isPremium && <Crown size={14} style={{ color: '#F5A623' }} />}
        </div>
        {subtitle && (
          <span className="text-xs" style={{ color: '#94A3B8' }}>{subtitle}</span>
        )}
      </div>

      {/* Right */}
      <div className="w-10 flex items-center justify-end">
        {rightAction}
      </div>
    </header>
  );
}
