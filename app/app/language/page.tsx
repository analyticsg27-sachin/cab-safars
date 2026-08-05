'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppState } from '@/lib/app-state';
import AppShell from '@/components/app/AppShell';

const LANGUAGES = [
  {
    key: 'en',
    label: 'English',
    native: 'English',
    flag: '🇬🇧',
    desc: 'Continue in English',
  },
  {
    key: 'hi',
    label: 'Hindi',
    native: 'हिंदी',
    flag: '🇮🇳',
    desc: 'हिंदी में जारी रखें',
  },
  {
    key: 'gu',
    label: 'Gujarati',
    native: 'ગુજરાતી',
    flag: '🏵️',
    desc: 'ગુજરાતીમાં ચાલુ રાખો',
  },
];

export const LANG_KEY = 'cs_language';

function LanguageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useAppState();
  const next = searchParams.get('next') ?? (state.currentUser?.role === 'vendor' ? '/app/vendor/home' : '/app/driver/home');

  function select(key: string) {
    localStorage.setItem(LANG_KEY, key);
    router.replace(next);
  }

  return (
    <AppShell>
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-10"
        style={{ backgroundColor: '#0B1220' }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: 'rgba(245,166,35,0.12)', border: '1.5px solid rgba(245,166,35,0.3)' }}
        >
          <span className="text-3xl">🌐</span>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: '#F0F6FC' }}>
          Choose Language
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: '#8B949E' }}>
          भाषा चुनें · ભાષા પસંદ કરો
        </p>

        <div className="w-full max-w-sm flex flex-col gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.key}
              onClick={() => select(lang.key)}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all active:scale-[0.98]"
              style={{
                backgroundColor: '#161B22',
                border: '1.5px solid #30363D',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,166,35,0.5)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,166,35,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#30363D';
                (e.currentTarget as HTMLButtonElement).style.background = '#161B22';
              }}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1 text-left">
                <p className="text-base font-bold" style={{ color: '#F0F6FC' }}>{lang.native}</p>
                <p className="text-xs" style={{ color: '#8B949E' }}>{lang.desc}</p>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: '#21262D', color: '#8B949E' }}>
                {lang.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => select('en')}
          className="mt-8 text-xs"
          style={{ color: '#8B949E' }}
        >
          Skip — use English
        </button>
      </div>
    </AppShell>
  );
}

export default function LanguagePage() {
  return (
    <Suspense fallback={null}>
      <LanguageContent />
    </Suspense>
  );
}
