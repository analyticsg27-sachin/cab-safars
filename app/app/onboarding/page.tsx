'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { asset } from '@/lib/basepath';

// Slide 1 — neutral trip listing illustration
function Slide1Icon() {
  return (
    <div className="w-full max-w-[300px] mx-auto flex flex-col gap-2.5">
      <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: '#161B22', border: '1px solid rgba(245,166,35,0.35)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(245,166,35,0.12)', color: '#F5A623' }}>Trip listing</span>
          <span className="text-[10px]" style={{ color: '#8B949E' }}>Vehicle details</span>
        </div>
        <p className="text-base font-bold mb-1" style={{ color: '#F0F6FC' }}>Route details</p>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#8B949E' }}>Date · availability</span>
          <span className="text-base font-bold" style={{ color: '#F5A623' }}>Fare</span>
        </div>
      </div>
      <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px]" style={{ color: '#8B949E' }}>Trip information</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>Details</span>
        </div>
        <p className="text-base font-bold mb-1" style={{ color: '#F0F6FC' }}>Pickup → Destination</p>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#8B949E' }}>Vehicle · date</span>
          <span className="text-base font-bold" style={{ color: '#F5A623' }}>Fare</span>
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
          <span className="text-xs" style={{ color: '#F0F6FC' }}>Pickup location</span>
        </div>
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ backgroundColor: '#0D1117', border: '1px solid #30363D' }}>
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#EF4444' }} />
          <span className="text-xs" style={{ color: '#F0F6FC' }}>Destination</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl px-3 py-2.5" style={{ backgroundColor: '#0D1117', border: '1px solid #30363D' }}>
            <span className="text-xs" style={{ color: '#F0F6FC' }}>Vehicle · capacity</span>
          </div>
          <div className="flex-1 rounded-xl px-3 py-2.5" style={{ backgroundColor: '#0D1117', border: '1px solid #30363D' }}>
            <span className="text-xs" style={{ color: '#F0F6FC' }}>Fare</span>
          </div>
        </div>
        <div className="rounded-xl py-2.5 flex items-center justify-center mt-1" style={{ backgroundColor: '#F5A623' }}>
          <span className="text-xs font-bold" style={{ color: '#0D1117' }}>Post Trip</span>
        </div>
      </div>
    </div>
  );
}

// Slide 3 — account options illustration without sample user data
function Slide3Icon() {
  return (
    <div className="w-full max-w-[300px] mx-auto flex flex-col gap-2.5">
      <div className="rounded-2xl p-4" style={{ backgroundColor: '#161B22', border: '1px solid rgba(245,166,35,0.3)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#21262D', border: '2px solid rgba(245,166,35,0.4)' }}>
            <span className="text-xl font-bold" style={{ color: '#F5A623' }}>CS</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-sm font-bold" style={{ color: '#F0F6FC' }}>Account profile</p>
            </div>
            <p className="text-xs" style={{ color: '#8B949E' }}>Profile and membership details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl" style={{ backgroundColor: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <span className="text-xs font-semibold" style={{ color: '#22C55E' }}>📞 Contact options</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl" style={{ backgroundColor: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)' }}>
            <span className="text-xs font-semibold" style={{ color: '#25D366' }}>💬 Trip details</span>
          </div>
        </div>
      </div>
      <div className="rounded-xl px-3 py-2 flex items-center justify-center gap-1.5" style={{ backgroundColor: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
        <span className="text-[11px] font-medium" style={{ color: '#F5A623' }}>Available options depend on your account</span>
      </div>
    </div>
  );
}

// Slide 4 — basic app steps
function Slide4Icon() {
  return (
    <div className="w-full max-w-[300px] mx-auto flex flex-col gap-2.5">
      {['Create an account', 'Browse trip listings', 'Manage trip details'].map((step, index) => (
        <div key={step} className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: '#161B22', border: '1px solid #30363D' }}>
          <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ color: '#0D1117', backgroundColor: index === 1 ? '#22C55E' : '#F5A623' }}>{index + 1}</span>
          <span className="text-sm font-medium" style={{ color: '#F0F6FC' }}>{step}</span>
        </div>
      ))}
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
    title: 'Create a Trip Listing',
    desc: 'Trip Providers can add route, vehicle, date and fare details to a listing.',
    color: '#2D6BE4',
  },
  {
    icon: <Slide3Icon />,
    title: 'Review Trip Details',
    desc: 'View the information and contact options available for a trip in your account.',
    color: '#22C55E',
  },
  {
    icon: <Slide4Icon />,
    title: 'For Trips in India',
    desc: 'Use Cab Safar to browse or manage trip listings, subject to account access and availability.',
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
