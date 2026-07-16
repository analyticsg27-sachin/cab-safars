'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, CheckCircle } from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';

export default function RatePage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [done, setDone] = useState(false);

  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

  return (
    <AppShell>
      <AppHeader title="Rate the App" showBack onBack={() => router.back()} />
      <main className="flex-1 overflow-y-auto px-4 pb-10 pt-10">
        {done ? (
          <div className="flex flex-col items-center pt-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
              <CheckCircle size={32} style={{ color: '#22C55E' }} />
            </div>
            <p className="text-lg font-bold mb-2" style={{ color: '#F0F6FC' }}>Thanks for your feedback!</p>
            <p className="text-sm text-center mb-6" style={{ color: '#8B949E' }}>Your review helps us improve Cab Safars.</p>
            <button className="px-8 py-3 rounded-2xl text-sm font-bold" style={{ backgroundColor: '#F5A623', color: '#0D1117' }} onClick={() => router.back()}>Done</button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-lg font-bold mb-1 text-center" style={{ color: '#F0F6FC' }}>Enjoying Cab Safars?</p>
            <p className="text-sm text-center mb-8" style={{ color: '#8B949E' }}>Tap a star to rate your experience</p>

            <div className="flex gap-3 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}>
                  <Star size={40} fill={(hover || rating) >= s ? '#F5A623' : 'none'} style={{ color: (hover || rating) >= s ? '#F5A623' : '#30363D' }} />
                </button>
              ))}
            </div>

            {(hover || rating) > 0 && (
              <p className="text-sm font-semibold mb-6" style={{ color: '#F5A623' }}>{labels[hover || rating]}</p>
            )}

            <div className="w-full mb-5">
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Tell us more (optional)..."
                rows={4}
                className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none"
                style={{ backgroundColor: '#161B22', border: '1px solid #30363D', color: '#F0F6FC' }}
              />
            </div>

            <button
              disabled={rating === 0}
              className="w-full py-4 rounded-2xl text-sm font-bold"
              style={{ backgroundColor: rating > 0 ? '#F5A623' : '#21262D', color: rating > 0 ? '#0D1117' : '#8B949E' }}
              onClick={() => rating > 0 && setDone(true)}
            >
              Submit Review
            </button>
          </div>
        )}
      </main>
    </AppShell>
  );
}
