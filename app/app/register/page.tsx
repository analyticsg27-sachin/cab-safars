'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAppState } from '@/lib/app-state';
import type { AppUser } from '@/lib/app-types';
import AppShell from '@/components/app/AppShell';

type Role = 'vendor' | 'driver';

const VEHICLE_TYPES = [
  'Hatchback (Swift / Alto)',
  'Sedan (Toyota Etios / Dzire)',
  'SUV (Innova / Ertiga)',
  'Tempo',
  'Mini Truck',
  'Truck 14ft',
  'Truck 22ft',
  'Truck 32ft',
  'Trailer',
];

const CITIES = [
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar',
  'Mumbai', 'Pune', 'Nashik',
  'Jaipur', 'Jodhpur',
  'Delhi', 'Noida', 'Gurugram',
  'Hyderabad',
  'Bangalore',
  'Chennai',
];

function InputField({
  label, type = 'text', value, onChange, placeholder, required = true,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#8B949E' }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={{ backgroundColor: '#21262D', border: '1px solid #30363D', color: '#F0F6FC' }}
        onFocus={(e) => (e.target.style.borderColor = '#F5A623')}
        onBlur={(e) => (e.target.style.borderColor = '#30363D')}
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, options, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#8B949E' }}>
        {label} <span style={{ color: '#EF4444' }}>*</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
        style={{ backgroundColor: '#21262D', border: '1px solid #30363D', color: value ? '#F0F6FC' : '#8B949E' }}
        onFocus={(e) => (e.target.style.borderColor = '#F5A623')}
        onBlur={(e) => (e.target.style.borderColor = '#30363D')}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { dispatch } = useAppState();

  const [role, setRole] = useState<Role>('vendor');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showCpwd, setShowCpwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    if (!name.trim()) return 'Full name is required.';
    if (!phone.trim()) return 'Mobile number is required.';
    if (!email.trim()) return 'Email is required.';
    if (!city) return 'City is required.';
    if (role === 'driver' && !vehicleType) return 'Vehicle type is required.';
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      const newUser: AppUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        role,
        status: 'pending',
        isPremium: false,
        city,
        ...(role === 'vendor' && companyName ? { companyName: companyName.trim() } : {}),
        ...(role === 'driver' ? { vehicleType } : {}),
      };
      dispatch({ type: 'SET_USER', payload: { user: newUser, trips: [], notifications: [] } });
      router.push('/app/pending');
    }, 700);
  }

  return (
    <AppShell>
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ backgroundColor: '#0D1117' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-12 pb-6">
          <button
            onClick={() => router.push('/app')}
            className="flex items-center justify-center w-9 h-9 rounded-full"
            style={{ backgroundColor: '#161B22', color: '#F0F6FC' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#F0F6FC' }}>Create Account</h1>
            <p className="text-xs" style={{ color: '#8B949E' }}>Join the Cab Safars network</p>
          </div>
        </div>

        <div className="flex flex-col px-6 pb-10">
          {/* Role toggle */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ backgroundColor: '#161B22' }}
          >
            {(['vendor', 'driver'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all"
                style={
                  role === r
                    ? { backgroundColor: '#F5A623', color: '#0D1117' }
                    : { backgroundColor: 'transparent', color: '#8B949E' }
                }
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <InputField label="Full Name" value={name} onChange={setName} placeholder="Your full name" />

            {role === 'vendor' && (
              <InputField label="Company Name" value={companyName} onChange={setCompanyName}
                placeholder="e.g. Patel Travels (optional)" required={false} />
            )}

            {role === 'driver' && (
              <>
                <SelectField label="Vehicle Type" value={vehicleType} onChange={setVehicleType}
                  options={VEHICLE_TYPES} placeholder="Select vehicle type" />
                <InputField label="Vehicle Number" value={vehicleNumber} onChange={setVehicleNumber}
                  placeholder="GJ01 AB 1234" />
              </>
            )}

            <InputField label="Mobile Number" type="tel" value={phone} onChange={setPhone}
              placeholder="+91 98XXX XXXXX" />
            <InputField label="Email Address" type="email" value={email} onChange={setEmail}
              placeholder="you@example.com" />

            <SelectField label="City" value={city} onChange={setCity}
              options={CITIES} placeholder="Select your city" />

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#8B949E' }}>
                Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: '#21262D', border: '1px solid #30363D', color: '#F0F6FC' }}
                  onFocus={(e) => (e.target.style.borderColor = '#F5A623')}
                  onBlur={(e) => (e.target.style.borderColor = '#30363D')}
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#8B949E' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#8B949E' }}>
                Confirm Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showCpwd ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: '#21262D', border: '1px solid #30363D', color: '#F0F6FC' }}
                  onFocus={(e) => (e.target.style.borderColor = '#F5A623')}
                  onBlur={(e) => (e.target.style.borderColor = '#30363D')}
                />
                <button type="button" onClick={() => setShowCpwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#8B949E' }}>
                  {showCpwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-base font-bold mt-2 transition-all active:scale-95 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #F5A623, #D4891E)', color: '#0D1117' }}
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-center mt-5" style={{ color: '#8B949E' }}>
            Already have an account?{' '}
            <button
              onClick={() => router.push('/app/login')}
              className="font-semibold"
              style={{ color: '#F5A623' }}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </AppShell>
  );
}
