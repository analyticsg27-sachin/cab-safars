'use client';

import { useEffect, useState } from 'react';
import { asset } from '@/lib/basepath';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    // At 2.8s begin exit fade, then call onComplete at 3.4s
    const exitTimer = setTimeout(() => setPhase('exit'), 2800);
    const doneTimer = setTimeout(onComplete, 3400);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <>
      <style>{`
        @keyframes cs-bg-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cs-glow-pulse {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50%       { opacity: 0.70; transform: scale(1.06); }
        }
        @keyframes cs-logo-in {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes cs-breathe {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.018); }
        }
        @keyframes cs-tagline-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cs-road-in {
          from { opacity: 0; transform: scaleX(0); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        @keyframes cs-truck-move {
          from { transform: translateX(-60px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          to   { transform: translateX(calc(100vw + 60px)); opacity: 0; }
        }
        @keyframes cs-particle-float {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
          20%  { opacity: 0.6; }
          80%  { opacity: 0.3; }
          100% { transform: translateY(-60px) translateX(10px); opacity: 0; }
        }
        @keyframes cs-road-sweep {
          from { transform: translateX(-100%); }
          to   { transform: translateX(400%); }
        }
        @keyframes cs-splash-exit {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.04); }
        }

        .cs-bg           { animation: cs-bg-in 0.6s ease forwards; }
        .cs-glow         { animation: cs-glow-pulse 3s ease-in-out infinite; animation-delay: 0.3s; opacity: 0; }
        .cs-glow-start   { animation: cs-bg-in 0.5s 0.3s ease forwards, cs-glow-pulse 3s 0.8s ease-in-out infinite; opacity: 0; }
        .cs-logo         { animation: cs-logo-in 0.7s 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards, cs-breathe 2.2s 1.2s ease-in-out infinite; opacity: 0; }
        .cs-tagline      { animation: cs-tagline-in 0.6s 1.4s ease forwards; opacity: 0; }
        .cs-road         { animation: cs-road-in 0.5s 1.8s ease forwards; opacity: 0; transform-origin: left center; }
        .cs-truck        { animation: cs-truck-move 1.0s 2.2s cubic-bezier(0.4,0,0.2,1) forwards; opacity: 0; }
        .cs-sweep        { animation: cs-road-sweep 1.2s 2.2s ease-in-out forwards; }
        .cs-exit         { animation: cs-splash-exit 0.6s ease forwards; }
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
        {/* ── Animated background ── */}
        <div
          className="cs-bg"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(245,166,35,0.07) 0%, transparent 65%),' +
              'radial-gradient(ellipse 60% 40% at 80% 80%, rgba(45,107,228,0.05) 0%, transparent 55%),' +
              'linear-gradient(180deg, #060D1A 0%, #0B1525 50%, #060D1A 100%)',
          }}
        />

        {/* ── Ambient gold glow ── */}
        <div
          className="cs-glow-start"
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Floating particles ── */}
        {[
          { x: '20%', delay: '0.8s', size: 3 },
          { x: '75%', delay: '1.1s', size: 2 },
          { x: '35%', delay: '1.5s', size: 2 },
          { x: '60%', delay: '0.9s', size: 3 },
          { x: '85%', delay: '1.3s', size: 2 },
          { x: '10%', delay: '1.7s', size: 2 },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: '35%',
              left: p.x,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: '#F5A623',
              animation: `cs-particle-float ${2.5 + i * 0.3}s ${p.delay} ease-in-out infinite`,
              opacity: 0,
            }}
          />
        ))}

        {/* ── Grid texture (very subtle) ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(245,166,35,0.025) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(245,166,35,0.025) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* ── Center content ── */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}
        >
          {/* Logo */}
          <div
            className="cs-logo"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(245,166,35,0.35)) drop-shadow(0 0 40px rgba(245,166,35,0.15))',
              marginBottom: 20,
            }}
          >
            <img
              src={asset('/logo-v2.png')}
              alt="CAB SAFARS"
              style={{ height: 90, width: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {/* Tagline */}
          <p
            className="cs-tagline"
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#CBD5E1',
              marginBottom: 32,
              textShadow: '0 0 16px rgba(245,166,35,0.25)',
            }}
          >
            Safe Trips. Smart Journeys.
          </p>

          {/* Road + truck ── */}
          <div style={{ position: 'relative', width: 240, height: 28, overflow: 'hidden' }}>
            {/* Road line */}
            <div
              className="cs-road"
              style={{
                position: 'absolute',
                bottom: 8,
                left: 0,
                right: 0,
                height: 2,
                borderRadius: 1,
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(245,166,35,0.15) 20%, rgba(245,166,35,0.4) 50%, rgba(245,166,35,0.15) 80%, transparent 100%)',
              }}
            />
            {/* Road dashes */}
            <div
              className="cs-road"
              style={{
                position: 'absolute',
                bottom: 7,
                left: 0,
                right: 0,
                height: 1,
                background:
                  'repeating-linear-gradient(90deg, rgba(245,166,35,0.25) 0px, rgba(245,166,35,0.25) 16px, transparent 16px, transparent 28px)',
              }}
            />
            {/* Light sweep on road */}
            <div
              className="cs-road"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 12,
                overflow: 'hidden',
                pointerEvents: 'none',
              }}
            >
              <div
                className="cs-sweep"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '30%',
                  height: '100%',
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(245,166,35,0.18) 50%, transparent 100%)',
                }}
              />
            </div>
            {/* Mini truck SVG */}
            <div className="cs-truck" style={{ position: 'absolute', bottom: 8, left: 0 }}>
              <svg width="36" height="16" viewBox="0 0 36 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Headlight glow */}
                <ellipse cx="33" cy="9" rx="5" ry="2.5" fill="#F5A623" opacity="0.18" />
                {/* Cabin */}
                <path d="M20 4 C21 1 27 1 28 4 L28 12 L20 12 Z" fill="#1E2A3A" />
                <path d="M21 4 C22 2 26 2 27 4 L27 10 L21 10 Z" fill="#1E3A5F" opacity="0.8" />
                {/* Body */}
                <rect x="2" y="5" width="18" height="7" rx="1.5" fill="#1C2430" />
                <rect x="2" y="5" width="18" height="1" rx="0.5" fill="#F5A623" opacity="0.2" />
                {/* Headlight */}
                <rect x="28" y="7" width="5" height="2.5" rx="1" fill="#F5A623" opacity="0.9" />
                {/* Tail */}
                <rect x="1" y="6.5" width="3" height="2" rx="1" fill="#EF4444" opacity="0.6" />
                {/* Wheels */}
                <circle cx="8"  cy="13" r="3" fill="#0F172A" />
                <circle cx="8"  cy="13" r="1.5" fill="#1E293B" />
                <circle cx="23" cy="13" r="3" fill="#0F172A" />
                <circle cx="23" cy="13" r="1.5" fill="#1E293B" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
