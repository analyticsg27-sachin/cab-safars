'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { asset } from '@/lib/basepath';

const SLIDES = [
  {
    icon: (
      <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[240px]">
        <ellipse cx="60" cy="88" rx="48" ry="6" fill="#F5A623" opacity="0.08" />
        <rect x="24" y="56" width="72" height="22" fill="#1C2430" rx="6" />
        <path d="M38 56 C42 40 78 40 82 56 Z" fill="#1E2A3A" />
        <path d="M76 56 C78 44 82 41 83 56 Z" fill="#1E3A5F" opacity="0.9" />
        <path d="M37 56 C38 41 42 39 44 56 Z" fill="#1E3A5F" opacity="0.9" />
        <path d="M47 56 C47 41 63 40 63 56 Z" fill="#1E3A5F" opacity="0.7" />
        <path d="M65 56 C65 41 76 42 77 56 Z" fill="#1E3A5F" opacity="0.7" />
        <rect x="24" y="56" width="72" height="2" fill="#F5A623" opacity="0.15" rx="1" />
        <rect x="90" y="61" width="8" height="4" fill="#F5A623" rx="2" opacity="0.9" />
        <rect x="24" y="61" width="7" height="4" fill="#EF4444" rx="2" opacity="0.7" />
        <circle cx="40" cy="78" r="8" fill="#0F172A" /><circle cx="40" cy="78" r="5" fill="#1E293B" /><circle cx="40" cy="78" r="2.5" fill="#374151" />
        <circle cx="80" cy="78" r="8" fill="#0F172A" /><circle cx="80" cy="78" r="5" fill="#1E293B" /><circle cx="80" cy="78" r="2.5" fill="#374151" />
        <circle cx="20" cy="36" r="8" fill="#F5A623" opacity="0.9" /><circle cx="20" cy="36" r="4" fill="#0B1220" />
        <circle cx="100" cy="36" r="8" fill="#F5A623" opacity="0.9" /><circle cx="100" cy="36" r="4" fill="#0B1220" />
        <line x1="20" y1="36" x2="100" y2="36" stroke="#30363D" strokeWidth="1.5" strokeDasharray="5 3" />
        <text x="60" y="20" textAnchor="middle" fontSize="9" fill="#8B949E" fontFamily="sans-serif">Ahmedabad → Delhi</text>
      </svg>
    ),
    title: 'Find Your Ride',
    desc: 'Browse trips posted by Trip Providers across India. Sedan, SUV, Bus, Tempo Travel and more — all in one place.',
    color: '#F5A623',
  },
  {
    icon: (
      <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[240px]">
        <rect x="20" y="20" width="80" height="65" rx="12" fill="#161B22" stroke="#30363D" strokeWidth="1.5" />
        <rect x="32" y="34" width="56" height="6" rx="3" fill="#21262D" />
        <rect x="32" y="46" width="40" height="6" rx="3" fill="#21262D" />
        <rect x="32" y="58" width="48" height="6" rx="3" fill="#21262D" />
        <rect x="32" y="70" width="28" height="6" rx="3" fill="rgba(245,166,35,0.3)" />
        <circle cx="90" cy="28" r="12" fill="#F5A623" />
        <text x="90" y="33" textAnchor="middle" fontSize="14" fill="#0B1220" fontFamily="sans-serif" fontWeight="bold">+</text>
        <text x="60" y="16" textAnchor="middle" fontSize="8" fill="#8B949E" fontFamily="sans-serif">Post a Trip in 30 seconds</text>
      </svg>
    ),
    title: 'Post a Trip Instantly',
    desc: 'Trip Providers can post trips in seconds. Set your route, vehicle needed, date and fare — drivers will find you.',
    color: '#2D6BE4',
  },
  {
    icon: (
      <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[240px]">
        <circle cx="60" cy="42" r="28" fill="#161B22" stroke="rgba(245,166,35,0.3)" strokeWidth="1.5" />
        <circle cx="60" cy="38" r="10" fill="#21262D" />
        <path d="M42 62 C42 52 78 52 78 62" fill="#21262D" />
        <circle cx="60" cy="38" r="6" fill="#F5A623" opacity="0.8" />
        <rect x="82" y="58" width="26" height="18" rx="8" fill="#25D366" />
        <text x="95" y="71" textAnchor="middle" fontSize="11" fill="white" fontFamily="sans-serif">✓✓</text>
        <text x="60" y="86" textAnchor="middle" fontSize="8" fill="#8B949E" fontFamily="sans-serif">Premium unlocks direct contact</text>
        <rect x="22" y="72" width="30" height="14" rx="7" fill="rgba(245,166,35,0.15)" stroke="rgba(245,166,35,0.4)" strokeWidth="1" />
        <text x="37" y="82" textAnchor="middle" fontSize="7" fill="#F5A623" fontFamily="sans-serif">★ Premium</text>
      </svg>
    ),
    title: 'Go Premium, Get Connected',
    desc: 'Premium members can directly Call or WhatsApp the other party. Settle your trip your way — no middleman.',
    color: '#22C55E',
  },
  {
    icon: (
      <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[240px]">
        <rect x="10" y="30" width="44" height="44" rx="10" fill="#161B22" stroke="#30363D" strokeWidth="1.5" />
        <rect x="66" y="30" width="44" height="44" rx="10" fill="#161B22" stroke="#30363D" strokeWidth="1.5" />
        <circle cx="32" cy="48" r="8" fill="#21262D" /><circle cx="32" cy="48" r="4" fill="#F5A623" opacity="0.6" />
        <rect x="18" y="60" width="28" height="4" rx="2" fill="#21262D" />
        <rect x="22" y="67" width="20" height="3" rx="1.5" fill="#21262D" />
        <circle cx="88" cy="48" r="8" fill="#21262D" /><circle cx="88" cy="48" r="4" fill="#2D6BE4" opacity="0.6" />
        <rect x="74" y="60" width="28" height="4" rx="2" fill="#21262D" />
        <rect x="78" y="67" width="20" height="3" rx="1.5" fill="#21262D" />
        <path d="M54 52 L66 52" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
        <path d="M61 47 L66 52 L61 57" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="32" y="84" textAnchor="middle" fontSize="7" fill="#8B949E" fontFamily="sans-serif">Trip Provider</text>
        <text x="88" y="84" textAnchor="middle" fontSize="7" fill="#8B949E" fontFamily="sans-serif">Driver</text>
        <text x="60" y="18" textAnchor="middle" fontSize="8" fill="#F5A623" fontFamily="sans-serif">Safe Trips. Smart Journeys.</text>
      </svg>
    ),
    title: 'Safe Trips. Smart Journeys.',
    desc: 'India\'s trusted transport marketplace — verified users, secure contacts, and trips that move on time.',
    color: '#F5A623',
  },
];

const SLIDE_DURATION = 3500; // ms per slide

export default function OnboardingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (current < SLIDES.length - 1) {
        setCurrent(c => c + 1);
      } else {
        // Auto-finish after last slide
        setTimeout(() => router.replace('/app/'), 1200);
      }
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [current, router]);

  function skip() {
    router.replace('/app/');
  }

  function goNext() {
    if (current < SLIDES.length - 1) {
      setCurrent(c => c + 1);
    } else {
      router.replace('/app/');
    }
  }

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;
  const progress = ((current + 1) / SLIDES.length) * 100;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-between"
      style={{ backgroundColor: '#0D1117', maxWidth: '430px', margin: '0 auto' }}
    >
      {/* Progress bar */}
      <div className="w-full h-1" style={{ backgroundColor: '#21262D' }}>
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${progress}%`, backgroundColor: slide.color }}
        />
      </div>

      {/* Skip button */}
      <div className="w-full flex justify-end px-5 pt-4">
        <button
          onClick={skip}
          className="text-sm px-3 py-1 rounded-full"
          style={{ color: '#8B949E', backgroundColor: '#161B22', border: '1px solid #30363D' }}
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Logo */}
        <div className="mb-6">
          <img src={asset('/logo-v2.png')} alt="CAB SAFARS" className="h-10 w-auto object-contain mx-auto" />
        </div>

        {/* Illustration */}
        <div className="w-full flex justify-center mb-8 transition-all duration-500" style={{ minHeight: 120 }}>
          {slide.icon}
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold mb-3 leading-tight" style={{ color: '#F0F6FC' }}>
          {slide.title}
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#8B949E', maxWidth: 300 }}>
          {slide.desc}
        </p>
      </div>

      {/* Dots + Button */}
      <div className="w-full px-6 pb-10 flex flex-col items-center gap-6">
        {/* Dot indicators */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                backgroundColor: i === current ? slide.color : '#30363D',
              }}
            />
          ))}
        </div>

        {/* Next / Get Started */}
        <button
          onClick={goNext}
          className="w-full py-4 rounded-2xl text-base font-bold transition-all active:scale-[0.98]"
          style={{ backgroundColor: slide.color, color: '#0D1117' }}
        >
          {isLast ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
}
