'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Clock, X } from 'lucide-react';

export interface LocationValue {
  name: string;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
  placeId?: string;
}

interface Props {
  value: string;
  onChange: (loc: LocationValue) => void;
  placeholder?: string;
  pinColor?: string;
  label?: string;
  error?: string;
}

// Prebuilt Indian city list with coordinates (expandable)
const CITIES: LocationValue[] = [
  { name: 'Ahmedabad, Gujarat', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Surat, Gujarat', city: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  { name: 'Vadodara, Gujarat', city: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
  { name: 'Rajkot, Gujarat', city: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
  { name: 'Gandhinagar, Gujarat', city: 'Gandhinagar', state: 'Gujarat', lat: 23.2156, lng: 72.6369 },
  { name: 'Bhavnagar, Gujarat', city: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519 },
  { name: 'Jamnagar, Gujarat', city: 'Jamnagar', state: 'Gujarat', lat: 22.4707, lng: 70.0577 },
  { name: 'Junagadh, Gujarat', city: 'Junagadh', state: 'Gujarat', lat: 21.5222, lng: 70.4579 },
  { name: 'Anand, Gujarat', city: 'Anand', state: 'Gujarat', lat: 22.5645, lng: 72.9289 },
  { name: 'Navsari, Gujarat', city: 'Navsari', state: 'Gujarat', lat: 20.9467, lng: 72.9520 },
  { name: 'Morbi, Gujarat', city: 'Morbi', state: 'Gujarat', lat: 22.8173, lng: 70.8370 },
  { name: 'Mehsana, Gujarat', city: 'Mehsana', state: 'Gujarat', lat: 23.5880, lng: 72.3693 },
  { name: 'Surendranagar, Gujarat', city: 'Surendranagar', state: 'Gujarat', lat: 22.7276, lng: 71.6441 },
  { name: 'Mumbai, Maharashtra', city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Pune, Maharashtra', city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Nashik, Maharashtra', city: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  { name: 'Nagpur, Maharashtra', city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { name: 'Aurangabad, Maharashtra', city: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433 },
  { name: 'Delhi, Delhi', city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Jaipur, Rajasthan', city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Jodhpur, Rajasthan', city: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
  { name: 'Udaipur, Rajasthan', city: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125 },
  { name: 'Kota, Rajasthan', city: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648 },
  { name: 'Bengaluru, Karnataka', city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad, Telangana', city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai, Tamil Nadu', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Indore, Madhya Pradesh', city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { name: 'Bhopal, Madhya Pradesh', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'Kolkata, West Bengal', city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Lucknow, Uttar Pradesh', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Kanpur, Uttar Pradesh', city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
  { name: 'Agra, Uttar Pradesh', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  { name: 'Chandigarh, Punjab', city: 'Chandigarh', state: 'Punjab', lat: 30.7333, lng: 76.7794 },
  { name: 'Amritsar, Punjab', city: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
  { name: 'Ludhiana, Punjab', city: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
];

const RECENT_KEY = 'recent_locations';
const MAX_RECENT = 5;

function saveRecent(loc: LocationValue) {
  try {
    const prev: LocationValue[] = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    const filtered = prev.filter((r) => r.city !== loc.city);
    const updated = [loc, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {}
}

function getRecent(): LocationValue[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function LocationAutocomplete({ value, onChange, placeholder, pinColor = '#F5A623', label, error }: Props) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationValue[]>([]);
  const [recents, setRecents] = useState<LocationValue[]>([]);
  const [locating, setLocating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);

  // Sync external value
  useEffect(() => { setQuery(value); }, [value]);

  // Load recents on open
  useEffect(() => {
    if (open) setRecents(getRecent());
  }, [open]);

  // Filter suggestions on type
  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    const matches = CITIES.filter(
      (c) =>
        c.city.toLowerCase().startsWith(q) ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
    ).slice(0, 8);
    setSuggestions(matches);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function select(loc: LocationValue) {
    setQuery(loc.city);
    setOpen(false);
    saveRecent(loc);
    onChange(loc);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const loc: LocationValue = {
          name: 'Current Location',
          city: 'Current Location',
          state: '',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setQuery('Current Location');
        setOpen(false);
        onChange(loc);
      },
      () => { setLocating(false); }
    );
  }

  const showDropdown = open && (suggestions.length > 0 || recents.length > 0 || true);
  const showSuggestions = suggestions.length > 0;
  const showRecents = !query.trim() && recents.length > 0;
  const showPopular = !query.trim() && !showRecents;

  return (
    <div ref={wrapRef} className="relative w-full">
      {label && <label className="block text-xs text-[#8B949E] mb-1">{label}</label>}
      <div
        className="relative flex items-center"
        style={{
          background: '#161B22',
          border: `1px solid ${error ? '#EF4444' : open ? '#F5A623' : '#30363D'}`,
          borderRadius: '12px',
          transition: 'border-color 0.15s',
        }}
      >
        <MapPin size={16} className="absolute left-3 shrink-0" style={{ color: pinColor }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder ?? 'Search city…'}
          autoComplete="off"
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              setOpen(false);
              if (query.trim()) {
                const exact = CITIES.find(c => c.city.toLowerCase() === query.trim().toLowerCase());
                if (exact) { select(exact); }
                else { onChange({ name: query.trim(), city: query.trim(), state: '' }); }
              }
            }, 150);
          }}
          className="w-full pl-9 pr-8 py-3.5 bg-transparent text-sm outline-none"
          style={{ color: '#F0F6FC' }}
        />
        {query && (
          <button
            type="button"
            className="absolute right-3"
            onClick={() => { setQuery(''); onChange({ name: '', city: '', state: '' }); inputRef.current?.focus(); }}
          >
            <X size={14} style={{ color: '#8B949E' }} />
          </button>
        )}
      </div>

      {error && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{error}</p>}

      {open && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
          style={{ background: '#161B22', border: '1px solid #30363D', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
        >
          {/* Current location */}
          <button
            type="button"
            disabled={locating}
            onClick={useCurrentLocation}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[#21262D] transition-colors"
            style={{ color: '#2D6BE4' }}
          >
            <Navigation size={15} className={locating ? 'animate-pulse' : ''} />
            <span className="font-medium">{locating ? 'Locating…' : 'Use Current Location'}</span>
          </button>

          <div style={{ height: 1, background: '#30363D' }} />

          {showRecents && (
            <>
              <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>Recent</p>
              {recents.map((r, i) => (
                <button key={i} type="button" onClick={() => select(r)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#21262D] transition-colors">
                  <Clock size={13} style={{ color: '#8B949E' }} />
                  <span style={{ color: '#F0F6FC' }}>{r.city}</span>
                  <span className="text-xs ml-auto" style={{ color: '#8B949E' }}>{r.state}</span>
                </button>
              ))}
              <div style={{ height: 1, background: '#30363D', margin: '4px 0' }} />
            </>
          )}

          {showSuggestions && (
            <>
              <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>Suggestions</p>
              {suggestions.map((s, i) => (
                <button key={i} type="button" onClick={() => select(s)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#21262D] transition-colors">
                  <MapPin size={13} style={{ color: '#8B949E' }} />
                  <span style={{ color: '#F0F6FC' }}>{s.city}</span>
                  <span className="text-xs ml-auto" style={{ color: '#8B949E' }}>{s.state}</span>
                </button>
              ))}
            </>
          )}

          {showPopular && (
            <>
              <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>Popular in Gujarat</p>
              {CITIES.filter(c => c.state === 'Gujarat').slice(0, 6).map((c, i) => (
                <button key={i} type="button" onClick={() => select(c)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#21262D] transition-colors">
                  <MapPin size={13} style={{ color: '#8B949E' }} />
                  <span style={{ color: '#F0F6FC' }}>{c.city}</span>
                  <span className="text-xs ml-auto" style={{ color: '#8B949E' }}>{c.state}</span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
