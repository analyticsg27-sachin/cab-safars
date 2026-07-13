'use client';

import { ArrowLeft, Crown } from 'lucide-react';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  isPremium?: boolean;
}

export default function AppHeader({
  title,
  showBack = false,
  onBack,
  rightAction,
  isPremium = false,
}: AppHeaderProps) {
  return (
    <header
      className="flex items-center px-4 shrink-0 z-10"
      style={{
        height: '56px',
        backgroundColor: '#161B22',
        borderBottom: '1px solid #30363D',
      }}
    >
      {/* Left */}
      <div className="w-10 flex items-center">
        {showBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-full transition-colors"
            style={{ color: '#F0F6FC' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#21262D')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
      </div>

      {/* Center */}
      <div className="flex-1 flex items-center justify-center gap-2">
        <span
          className="text-base font-semibold truncate"
          style={{ color: '#F0F6FC' }}
        >
          {title}
        </span>
        {isPremium && (
          <Crown size={14} style={{ color: '#F5A623' }} />
        )}
      </div>

      {/* Right */}
      <div className="w-10 flex items-center justify-end">
        {rightAction}
      </div>
    </header>
  );
}
