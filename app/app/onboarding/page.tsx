'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { asset } from '@/lib/basepath';

// Slide 1 — Trip card mockup (real demo data, no toy car)
function Slide1Icon() {
  return (
    <div className="w-full max-w-[300px] mx-auto flex flex-col gap-2.5">
      {/* Trip card 1 */}
      <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: '#161B22', border: '1px solid rgba(245,166,35,0.35)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>★ Priority</span>
          <span className="text-[10px]" style={{ color: '#8B949E' }}>Innova Crysta</span>
        </div>
        <p className="text-base font-bold mb-1" style={{ color: '#F0F6FC' }}>Ahmedabad → Mumbai</p>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#8B949E' }}>25 Jul · 4 seats</span>
          <span className="text-base font-bold" style={{ color: '#F5A623' }}>₹14,000</span>
        </div>
      </div>
      {/* Trip card 2 */}
      <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px]" style={{ color: '#8B949E' }}>Tempo Travel</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>Open</span>
        </div>
        <p className="text-base font-bold mb-1" style={{ color: '#F0F6FC' }}>Surat → Rajkot</p>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#8B949E' }}>28 Jul · 12 seats</span>
          <span className="text-base font-bold" style={{ color: '#F5A623' }}>₹8,500</span>
        </div>
      </div>
    </div>
  );
}

// Slide 2 — Post trip form mockup
function Slide2Icon() {
  return (
    <div className="w-full max-w-[300px] mx-auto rounded-2xl p-4" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
      <p className="text-xs font-bold mb-3" style={{ color: '#F5A623' }}>Post a New Trip</p>
      <div className="flex flex-col gap-2">
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ backgroundColor: '#0D1117', border: '1px solid #30363D' }}>
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#22C55E' }} />
          <span className="text-xs" style={{ color: '#F0F6FC' }}>From: Ahmedabad</span>
        </div>
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ backgroundColor: '#0D1117', border: '1px solid #30363D' }}>
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#EF4444' }} />
          <span className="text-xs" style={{ color: '#F0F6FC' }}>To: Delhi</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl px-3 py-2.5" style={{ backgroundColor: '#0D1117', border: '1px solid #30363D' }}>
            <span className="text-xs" style={{ color: '#F0F6FC' }}>SUV · 4 seats</span>
          </div>
          <div className="flex-1 rounded-xl px-3 py-2.5" style={{ backgroundColor: '#0D1117', border: '1px solid #30363D' }}>
            <span className="text-xs" style={{ color: '#F0F6FC' }}>₹12,000</span>
          </div>
        </div>
        <div className="rounded-xl py-2.5 flex items-center justify-center mt-1" style={{ backgroundColor: '#F5A623' }}>
          <span className="text-xs font-bold" style={{ color: '#0D1117' }}>Post Trip</span>
        </div>
      </div>
    </div>
  );
}

// Slide 3 — Driver contact card (real demo data)
function Slide3Icon() {
  return (
    <div className="w-full max-w-[300px] mx-auto flex flex-col gap-2.5">
      <div className="rounded-2xl p-4" style={{ backgroundColor: '#161B22', border: '1px solid rgba(245,166,35,0.3)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#21262D', border: '2px solid rgba(245,166,35,0.4)' }}>
            <span className="text-xl font-bold" style={{ color: '#F5A623' }}>H</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-sm font-bold" style={{ color: '#F0F6FC' }}>Harshad Bhatt</p>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>★ Premium</span>
            </div>
            <p className="text-xs" style={{ color: '#8B949E' }}>Innova Crysta · Ahmedabad</p>
            <p className="text-xs" style={{ color: '#8B949E' }}>⭐ 4.8 · 34 trips</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl" style={{ backgroundColor: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <span className="text-xs font-semibold" style={{ color: '#22C55E' }}>📞 Call</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl" style={{ backgroundColor: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)' }}>
            <span className="text-xs font-semibold" style={{ color: '#25D366' }}>💬 WhatsApp</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl px-3 py-2 flex items-center justify-center gap-1.5" style={{ backgroundColor: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
        <span className="text-[11px] font-medium" style={{ color: '#F5A623' }}>★ Premium unlocks direct contact with drivers</span>
      </div>
    </div>
  );
}

// Slide 4 — Stats / trust badges
function Slide4Icon() {
  return (
    <div className="w-full max-w-[300px] mx-auto flex flex-col gap-2.5">
      <div className="flex gap-2.5">
        <div className="flex-1 rounded-2xl p-3 flex flex-col items-center gap-1" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
          <span className="text-2xl font-black" style={{ color: '#F5A623' }}>500+</span>
          <span className="text-[10px] text-center" style={{ color: '#8B949E' }}>Trips Posted</span>
        </div>
        <div className="flex-1 rounded-2xl p-3 flex flex-col items-center gap-1" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
          <span className="text-2xl font-black" style={{ color: '#22C55E' }}>200+</span>
          <span className="text-[10px] text-center" style={{ color: '#8B949E' }}>Verified Drivers</span>
        </div>
      </div>
      <div className="flex gap-2.5">
        <div className="flex-1 rounded-2xl p-3 flex flex-col items-center gap-1" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
          <span className="text-2xl font-black" style={{ color: '#2D6BE4' }}>50+</span>
          <span className="text-[10px] text-center" style={{ color: '#8B949E' }}>Cities Covered</span>
        </div>
        <div className="flex-1 rounded-2xl p-3 flex flex-col items-center gap-1" style={{ backgroundColor: '#161B22', border: '1px solid rgba(245,166,35,0.3)' }}>
          <span className="text-2xl font-black" style={{ color: '#F5A623' }}>4.8★</span>
          <span className="text-[10px] text-center" style={{ color: '#8B949E' }}>Avg. Rating</span>
        </div>
      </div>
      <div className="rounded-xl px-3 py-2 flex items-center justify-center gap-2" style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <span className="text-xs font-medium" style={{ color: '#22C55E' }}>✓ Verified users &amp; secure direct contact</span>
      </div>
    </div>
  );
}

const SLIDES = [
  {
    icon: <Slide1Icon />,
    title: 'Find Your Ride',
    desc: 'Browse trips posted by Trip Providers across India. Sedan, SUV, Bus, Tempo Travel and more — all in one place.',
    color: '#F5A623',
  },
  {
    icon: <Slide2Icon />,
    title: 'Post a Trip Instantly',
    desc: 'Trip Providers can post trips in seconds. Set your route, vehicle needed, date and fare — drivers will find you.',
    color: '#2D6BE4',
  },
  {
    icon: <Slide3Icon />,
    title: 'Go Premium, Get Connected',
    desc: 'Premium members can directly Call or WhatsApp the other party. Settle your trip your way — no middleman.',
    color: '#22C55E',
  },
  {
    icon: <Slide4Icon />,
    title: 'Safe Trips. Smart Journeys.',
    desc: 'India\'s trusted transport marketplace — verified users, secure contacts, and trips that move on time.',
    color: '#F5A623',
  },
];

const SLIDE_DURATION = 3500; // ms per slide

function finish(router: ReturnType<typeof useRouter>) {
  localStorage.setItem('cs_onboarding_done', '1');
  router.replace('/app/');
}

export default function OnboardingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (current < SLIDES.length - 1) {
        setCurrent(c => c + 1);
      } else {
        setTimeout(() => finish(router), 1200);
      }
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [current, router]);

  function skip() {
    finish(router);
  }

  function goNext() {
    if (current < SLIDES.length - 1) {
      setCurrent(c => c + 1);
    } else {
      finish(router);
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
      <div className="flex-1 flex flex-col items-center justify-center px-5 text-center w-full overflow-y-auto">
        {/* Logo — big and prominent */}
        <div className="mb-5">
          <img src={asset('/logo-v2.png')} alt="CAB SAFARS" style={{ height: 50 }} className="w-auto object-contain mx-auto" />
        </div>

        {/* Illustration */}
        <div className="w-full flex justify-center mb-5 transition-all duration-500">
          {slide.icon}
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold mb-2 leading-tight" style={{ color: '#F0F6FC' }}>
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
