'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, X } from 'lucide-react';
import { useAppState } from '@/lib/app-state';
import { IS_API_MODE } from '@/lib/services';
import AuthService from '@/lib/services/auth.service';
import type { AppUser } from '@/lib/app-types';
import { asset } from '@/lib/basepath';
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

const STATES: Record<string, string> = {
  Ahmedabad: 'Gujarat', Surat: 'Gujarat', Vadodara: 'Gujarat', Rajkot: 'Gujarat', Gandhinagar: 'Gujarat',
  Mumbai: 'Maharashtra', Pune: 'Maharashtra', Nashik: 'Maharashtra',
  Jaipur: 'Rajasthan', Jodhpur: 'Rajasthan',
  Delhi: 'Delhi', Noida: 'UP', Gurugram: 'Haryana',
  Hyderabad: 'Telangana',
  Bangalore: 'Karnataka',
  Chennai: 'Tamil Nadu',
};

const inputStyle = {
  backgroundColor: '#1A2332',
  border: '1px solid #243042',
  color: '#F1F5F9',
  caretColor: '#F5A623',
} as React.CSSProperties;

function InputField({
  label, type = 'text', value, onChange, placeholder, required = true,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
        style={inputStyle}
        onFocus={(e) => { e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.1)'; }}
        onBlur={(e) => { e.target.style.borderColor = '#243042'; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, options, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>
        {label} <span style={{ color: '#EF4444' }}>*</span>
      </label>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all appearance-none"
        style={{ ...inputStyle, color: value ? '#F1F5F9' : '#6B7280' }}
        onFocus={(e) => { e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.1)'; }}
        onBlur={(e) => { e.target.style.borderColor = '#243042'; e.target.style.boxShadow = 'none'; }}
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
    if (!city) return 'City is required.';
    if (role === 'driver' && !vehicleType) return 'Vehicle type is required.';
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);

    if (IS_API_MODE) {
      try {
        await AuthService.register({
          role,
          name: name.trim(),
          phone: phone.trim(),
          password,
          city,
          state: STATES[city] ?? city,
          email: email.trim() || undefined,
          company_name: role === 'vendor' && companyName ? companyName.trim() : undefined,
          vehicle_type: role === 'driver' ? vehicleType : undefined,
          vehicle_number: role === 'driver' && vehicleNumber ? vehicleNumber.trim() : undefined,
        });
        const newUser: AppUser = {
          id: `pending-${Date.now()}`,
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
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Registration failed';
        setError(msg);
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        const newUser: AppUser = {
          id: `user-${Date.now()}`,
          name: name.trim(), phone: phone.trim(), email: email.trim(), role,
          status: 'pending', isPremium: false, city,
          ...(role === 'vendor' && companyName ? { companyName: companyName.trim() } : {}),
          ...(role === 'driver' ? { vehicleType } : {}),
        };
        dispatch({ type: 'SET_USER', payload: { user: newUser, trips: [], notifications: [] } });
        router.push('/app/pending');
      }, 700);
    }
  }

  return (
    <AppShell>
      <div
        className="flex flex-col flex-1 overflow-y-auto"
        style={{
          backgroundColor: '#0B1220',
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 60%)',
          minHeight: '100%',
        }}
      >
        {/* Back button */}
        <div className="px-4 pt-12 pb-2">
          <button
            onClick={() => router.push('/app')}
            className="flex items-center justify-center w-10 h-10 rounded-2xl transition-all active:scale-90"
            style={{ backgroundColor: '#111827', border: '1px solid #243042', color: '#94A3B8' }}
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* Logo + heading */}
        <div className="px-6 pt-4 pb-2 flex flex-col items-center">
          <img
            src={asset('/logo-v2.png')}
            alt="CAB SAFARS"
            className="h-14 w-auto object-contain mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-sm" style={{ color: '#94A3B8' }}>Join the Cab Safars network</p>
        </div>

        {/* Card */}
        <div
          className="mx-4 mt-6 mb-4 rounded-3xl p-6 shadow-2xl"
          style={{ backgroundColor: '#111827', border: '1px solid #243042' }}
        >
          {/* Error banner */}
          {error && (
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-5"
              style={{ backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <X size={16} style={{ color: '#EF4444', flexShrink: 0 }} />
              <p className="text-sm flex-1" style={{ color: '#FCA5A5' }}>{error}</p>
              <button onClick={() => setError('')} style={{ color: '#EF4444' }}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* Role chip toggle */}
          <div className="mb-6">
            <label className="block text-xs font-semibold mb-2" style={{ color: '#94A3B8' }}>
              I am a <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div className="flex gap-2">
              {(['vendor', 'driver'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                  style={
                    role === r
                      ? { backgroundColor: '#F5A623', color: '#000000' }
                      : { backgroundColor: 'transparent', border: '1px solid #243042', color: '#94A3B8' }
                  }
                >
                  {r === 'vendor' ? 'Trip Provider' : 'Driver'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <InputField label="Full Name" value={name} onChange={setName} placeholder="Your full name" />

            {role === 'vendor' && (
              <InputField
                label="Company Name"
                value={companyName}
                onChange={setCompanyName}
                placeholder="e.g. Patel Travels (optional)"
                required={false}
              />
            )}

            {role === 'driver' && (
              <>
                <SelectField
                  label="Vehicle Type"
                  value={vehicleType}
                  onChange={setVehicleType}
                  options={VEHICLE_TYPES}
                  placeholder="Select vehicle type"
                />
                <InputField
                  label="Vehicle Number"
                  value={vehicleNumber}
                  onChange={setVehicleNumber}
                  placeholder="GJ01 AB 1234"
                />
              </>
            )}

            {/* Phone with +91 prefix */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>
                Mobile Number <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div className="flex gap-2">
                <div
                  className="flex items-center px-3 rounded-xl text-sm font-semibold flex-shrink-0"
                  style={{ backgroundColor: '#1A2332', border: '1px solid #243042', color: '#94A3B8', minWidth: '68px' }}
                >
                  ðŸ‡®ðŸ‡³ +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98XXX XXXXX"
                  className="flex-1 px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#243042'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required={false}
            />

            <SelectField
              label="City"
              value={city}
              onChange={setCity}
              options={CITIES}
              placeholder="Select your city"
            />

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>
                Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#243042'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#94A3B8' }}
                >
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>
                Confirm Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showCpwd ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#243042'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowCpwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#94A3B8' }}
                >
                  {showCpwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-base font-bold mt-1 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #F5A623 0%, #D4891E 100%)', color: '#000000' }}
            >
              {loading ? (
                <>
                  <span
                    className="inline-block w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin"
                  />
                  Please wait...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <p className="text-sm text-center py-4" style={{ color: '#94A3B8' }}>
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
    </AppShell>
  );
}

