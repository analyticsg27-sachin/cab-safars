'use client';

import { useEffect, useState } from 'react';
import { asset } from '@/lib/basepath';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    const exitTimer = setTimeout(() => setPhase('exit'), 3200);
    const doneTimer = setTimeout(onComplete, 3900);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <>
      <style>{`
        @keyframes cs-bg-in {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes cs-glow-pulse {
          0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
          50%       { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
        }
        @keyframes cs-logo-in {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes cs-breathe {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.02); }
        }
        @keyframes cs-tagline-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cs-road-in {
          from { opacity: 0; transform: scaleX(0); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        @keyframes cs-car-drive {
          0%   { left: -120px; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: calc(100% + 120px); opacity: 0; }
        }
        @keyframes cs-headlight {
          0%   { left: -60px; opacity: 0; width: 60px; }
          8%   { opacity: 0.7; }
          92%  { opacity: 0.7; }
          100% { left: calc(100% + 10px); opacity: 0; }
        }
        @keyframes cs-particle-float {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          20%  { opacity: 0.5; }
          80%  { opacity: 0.2; }
          100% { transform: translateY(-70px) translateX(8px); opacity: 0; }
        }
        @keyframes cs-splash-exit {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.03); }
        }

        .cs-bg       { animation: cs-bg-in 0.7s ease forwards; }
        .cs-glow     { animation: cs-bg-in 0.5s 0.3s ease forwards, cs-glow-pulse 2.8s 0.8s ease-in-out infinite; opacity: 0; }
        .cs-logo     { animation: cs-logo-in 0.8s 0.5s cubic-bezier(0.34,1.4,0.64,1) forwards, cs-breathe 2.5s 1.3s ease-in-out infinite; opacity: 0; }
        .cs-tagline  { animation: cs-tagline-in 0.6s 1.4s ease forwards; opacity: 0; }
        .cs-road     { animation: cs-road-in 0.6s 1.8s ease forwards; opacity: 0; transform-origin: left center; }
        .cs-car      { animation: cs-car-drive 2.2s 2.0s linear forwards; opacity: 0; position: absolute; bottom: 4px; }
        .cs-light    { animation: cs-headlight 2.2s 2.0s linear forwards; opacity: 0; position: absolute; bottom: 2px; height: 14px; }
        .cs-exit     { animation: cs-splash-exit 0.7s ease forwards; }
      `}</style>

      <div
        className={phase === 'exit' ? 'cs-exit' : ''}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#060D1A',
        }}
      >
        {/* Background gradient */}
        <div
          className="cs-bg"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 55% at 50% 30%, rgba(245,166,35,0.08) 0%, transparent 65%),' +
              'radial-gradient(ellipse 50% 35% at 80% 85%, rgba(45,107,228,0.05) 0%, transparent 55%),' +
              'linear-gradient(180deg, #060D1A 0%, #0B1525 50%, #060D1A 100%)',
          }}
        />

        {/* Ambient glow behind logo */}
        <div
          className="cs-glow"
          style={{
            position: 'absolute',
            top: '22%',
            left: '50%',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,166,35,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating particles */}
        {[
          { x: '18%', y: '38%', delay: '0.9s', dur: 2.8 },
          { x: '72%', y: '42%', delay: '1.2s', dur: 3.1 },
          { x: '38%', y: '55%', delay: '1.6s', dur: 2.6 },
          { x: '58%', y: '35%', delay: '1.0s', dur: 3.3 },
          { x: '82%', y: '48%', delay: '1.4s', dur: 2.9 },
          { x: '12%', y: '50%', delay: '1.8s', dur: 3.0 },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: i % 2 === 0 ? 3 : 2,
              height: i % 2 === 0 ? 3 : 2,
              borderRadius: '50%',
              backgroundColor: '#F5A623',
              animation: `cs-particle-float ${p.dur}s ${p.delay} ease-in-out infinite`,
              opacity: 0,
            }}
          />
        ))}

        {/* Subtle grid texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(245,166,35,0.02) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(245,166,35,0.02) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            pointerEvents: 'none',
          }}
        />

        {/* ── Center: logo + tagline ── */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            className="cs-logo"
            style={{
              filter: 'drop-shadow(0 0 24px rgba(245,166,35,0.4)) drop-shadow(0 0 48px rgba(245,166,35,0.12))',
              marginBottom: 22,
            }}
          >
            <img
              src={asset('/logo-v2.png')}
              alt="CAB SAFARS"
              style={{ height: 88, width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </div>

          <p
            className="cs-tagline"
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#CBD5E1',
              textShadow: '0 0 18px rgba(245,166,35,0.3)',
            }}
          >
            Safe Trips. Smart Journeys.
          </p>
        </div>

        {/* ── Full-width road + car — absolutely positioned below center ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '28%',
            left: 0,
            right: 0,
            height: 36,
          }}
        >
          {/* Road base line */}
          <div
            className="cs-road"
            style={{
              position: 'absolute',
              bottom: 10,
              left: '5%',
              right: '5%',
              height: 2,
              borderRadius: 1,
              background: 'linear-gradient(90deg, transparent 0%, rgba(245,166,35,0.2) 15%, rgba(245,166,35,0.5) 50%, rgba(245,166,35,0.2) 85%, transparent 100%)',
            }}
          />
          {/* Road dashes */}
          <div
            className="cs-road"
            style={{
              position: 'absolute',
              bottom: 9,
              left: '5%',
              right: '5%',
              height: 1,
              background: 'repeating-linear-gradient(90deg, rgba(245,166,35,0.3) 0px, rgba(245,166,35,0.3) 18px, transparent 18px, transparent 32px)',
            }}
          />

          {/* Headlight beam ahead of car */}
          <div
            className="cs-light"
            style={{
              background: 'linear-gradient(90deg, rgba(245,166,35,0.5) 0%, rgba(245,166,35,0.05) 100%)',
              borderRadius: '0 8px 8px 0',
              width: 70,
            }}
          />

          {/* Car SVG — full size, clearly visible */}
          <div className="cs-car">
            <svg width="72" height="28" viewBox="0 0 72 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Headlight glow */}
              <ellipse cx="68" cy="16" rx="8" ry="4" fill="#F5A623" opacity="0.25" />
              {/* Body lower */}
              <rect x="4" y="14" width="60" height="10" rx="3" fill="#1C2430" />
              {/* Cabin roof */}
              <path d="M18 14 C21 5 51 5 54 14 Z" fill="#1E2A3A" />
              {/* Windshield front */}
              <path d="M47 14 C49 7 53 6 54 14 Z" fill="#1E3A5F" opacity="0.9" />
              {/* Windshield rear */}
              <path d="M18 14 C19 6 23 5 25 14 Z" fill="#1E3A5F" opacity="0.9" />
              {/* Side windows */}
              <path d="M27 14 C27 7 37 6 37 14 Z" fill="#1E3A5F" opacity="0.7" />
              {/* Window divider */}
              <line x1="38" y1="6" x2="38" y2="14" stroke="#2D6BE4" strokeWidth="1" opacity="0.4" />
              <path d="M39 14 C39 6 45 7 46 14 Z" fill="#1E3A5F" opacity="0.7" />
              {/* Roof accent */}
              <path d="M22 9 C26 6 46 6 50 9" stroke="#F5A623" strokeWidth="1" opacity="0.15" fill="none" strokeLinecap="round" />
              {/* Body gold stripe */}
              <rect x="4" y="14" width="60" height="1.5" rx="0.5" fill="#F5A623" opacity="0.2" />
              {/* Headlights */}
              <rect x="62" y="16" width="8" height="4" rx="2" fill="#F5A623" opacity="0.95" />
              {/* Tail lights */}
              <rect x="4" y="16" width="5" height="4" rx="2" fill="#EF4444" opacity="0.75" />
              {/* Wheel front */}
              <circle cx="54" cy="24" r="5" fill="#0F172A" />
              <circle cx="54" cy="24" r="3" fill="#1E293B" />
              <circle cx="54" cy="24" r="1.5" fill="#374151" />
              {/* Wheel rear */}
              <circle cx="18" cy="24" r="5" fill="#0F172A" />
              <circle cx="18" cy="24" r="3" fill="#1E293B" />
              <circle cx="18" cy="24" r="1.5" fill="#374151" />
              {/* Speed lines */}
              <line x1="1" y1="17" x2="8" y2="17" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              <line x1="1" y1="20" x2="6" y2="20" stroke="#F5A623" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
