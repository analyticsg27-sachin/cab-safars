'use client';

import { ArrowLeft, Crown, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/useTranslation';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  isPremium?: boolean;
  subtitle?: string;
  showLangToggle?: boolean;
}

export default function AppHeader({
  title,
  showBack = false,
  onBack,
  rightAction,
  isPremium = false,
  subtitle,
  showLangToggle = false,
}: AppHeaderProps) {
  const router = useRouter();
  const { lang } = useTranslation();

  const langLabel = { en: 'EN', hi: 'HI', gu: 'GU' }[lang] ?? 'EN';

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
      <div className="w-10 flex items-center justify-end gap-2">
        {showLangToggle && (
          <button
            onClick={() => {
              const path = window.location.pathname;
              router.push(`/app/language?next=${encodeURIComponent(path)}`);
            }}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg active:scale-95 transition-all"
            style={{ backgroundColor: '#1A2332', border: '1px solid #243042' }}
            aria-label="Change language"
          >
            <Globe size={13} style={{ color: '#F5A623' }} />
            <span className="text-[10px] font-bold" style={{ color: '#F5A623' }}>{langLabel}</span>
          </button>
        )}
        {rightAction}
      </div>
    </header>
  );
}
