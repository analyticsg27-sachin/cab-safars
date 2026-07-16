"use client";

// Professional semi-truck SVG — COE cab, air fairing, proper proportions
// Designed for dark backgrounds: white/light body, green speed lines, amber headlight
function TruckSVG({ width = 110 }: { width?: number }) {
  const h = Math.round(width * 58 / 110);
  return (
    <svg width={width} height={h} viewBox="0 0 110 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Speed lines — fan from back-left of trailer */}
      <line x1="0" y1="8"  x2="34" y2="15" stroke="#22C55E" strokeWidth="2.6" strokeLinecap="round" opacity="0.95"/>
      <line x1="0" y1="14" x2="34" y2="19" stroke="#22C55E" strokeWidth="1.9" strokeLinecap="round" opacity="0.65"/>
      <line x1="0" y1="20" x2="34" y2="23" stroke="#22C55E" strokeWidth="1.3" strokeLinecap="round" opacity="0.35"/>

      {/* Trailer body */}
      <rect x="32" y="14" width="46" height="26" rx="2" fill="#F1F5F9"/>
      {/* Trailer top green accent stripe */}
      <rect x="32" y="14" width="46" height="2.2" rx="1.1" fill="#22C55E" opacity="0.5"/>

      {/* Amber cargo stripes */}
      <rect x="37"  y="18" width="2.8" height="19" rx="1.4" fill="#F5A623" opacity="0.9"/>
      <rect x="43.5" y="18" width="2.8" height="19" rx="1.4" fill="#F5A623" opacity="0.55"/>
      <rect x="50"  y="18" width="2.8" height="19" rx="1.4" fill="#F5A623" opacity="0.9"/>
      <rect x="56.5" y="18" width="2.8" height="19" rx="1.4" fill="#F5A623" opacity="0.55"/>
      <rect x="63"  y="18" width="2.8" height="19" rx="1.4" fill="#F5A623" opacity="0.9"/>
      <rect x="69.5" y="18" width="2.8" height="19" rx="1.4" fill="#F5A623" opacity="0.55"/>

      {/* Air fairing — slopes from trailer roof up to cab roof */}
      <path d="M 78,14 Q 81,14 84,10 L 86,10 L 86,14 Z" fill="#E2E8F0"/>

      {/* Cab body — COE style, distinctly taller than trailer */}
      <rect x="79" y="7" width="30" height="33" rx="5" fill="#E8EEF4"/>
      {/* Cab top green stripe */}
      <rect x="79" y="7" width="30" height="2" rx="2" fill="#22C55E" opacity="0.4"/>

      {/* Windshield — large, vertical, takes up most of front face */}
      <rect x="82" y="11" width="22" height="21" rx="3.5" fill="#1A3356" opacity="0.88"/>
      {/* Glass centre pillar */}
      <line x1="93" y1="11" x2="93" y2="32" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.25"/>
      {/* Subtle reflection on glass */}
      <rect x="84" y="13" width="7" height="5" rx="1" fill="#FFFFFF" opacity="0.1"/>

      {/* Headlight */}
      <rect x="107" y="24" width="3"  height="8"  rx="1.5" fill="#F5A623" opacity="0.95"/>
      <rect x="110" y="25" width="7"  height="6"  rx="1.5" fill="#F5A623" opacity="0.18"/>

      {/* Front bumper */}
      <rect x="107" y="36" width="4" height="4" rx="2" fill="#CBD5E1"/>

      {/* Road/ground line */}
      <line x1="30" y1="50" x2="112" y2="50" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" opacity="0.28"/>

      {/* Wheels — rear pair */}
      <circle cx="50" cy="48" r="9"   fill="#111827"/>
      <circle cx="50" cy="48" r="5.8" fill="#1E293B"/>
      <circle cx="50" cy="48" r="2.5" fill="#374151"/>
      <circle cx="48.5" cy="46" r="1.5" fill="#64748B" opacity="0.45"/>

      <circle cx="67" cy="48" r="9"   fill="#111827"/>
      <circle cx="67" cy="48" r="5.8" fill="#1E293B"/>
      <circle cx="67" cy="48" r="2.5" fill="#374151"/>
      <circle cx="65.5" cy="46" r="1.5" fill="#64748B" opacity="0.45"/>

      {/* Wheel — front/cab */}
      <circle cx="92" cy="48" r="9"   fill="#111827"/>
      <circle cx="92" cy="48" r="5.8" fill="#1E293B"/>
      <circle cx="92" cy="48" r="2.5" fill="#374151"/>
      <circle cx="90.5" cy="46" r="1.5" fill="#64748B" opacity="0.45"/>
    </svg>
  );
}

type BrandLogoVariant = 'full' | 'icon' | 'wordmark';
type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  className?: string;
  showTagline?: boolean;
}

export function BrandLogo({
  variant = 'wordmark',
  size = 'md',
  className = '',
  showTagline = false,
}: BrandLogoProps) {

  const fontFam = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  // ── icon only ──────────────────────────────────────────────────────────────
  if (variant === 'icon') {
    const w = { xs: 55, sm: 70, md: 90, lg: 110, xl: 140 }[size];
    return <div className={className}><TruckSVG width={w} /></div>;
  }

  // ── full layout — matches the PNG: text left, truck right ──────────────────
  if (variant === 'full') {
    const cab  = { xs: '22px', sm: '28px', md: '36px', lg: '46px', xl: '58px' }[size];
    const saf  = { xs: '26px', sm: '34px', md: '44px', lg: '56px', xl: '70px' }[size];
    const tag  = { xs: '8px',  sm: '9px',  md: '10px', lg: '11px', xl: '12px' }[size];
    const trW  = { xs: 75,     sm: 96,     md: 120,    lg: 150,    xl: 190    }[size];
    const gap  = { xs: -6,     sm: -8,     md: -10,    lg: -14,    xl: -18    }[size];

    return (
      <div className={`inline-flex flex-col ${className}`} style={{ userSelect: 'none' }}>
        {/* Top row: CAB text + truck overlapping to the right */}
        <div className="flex items-end" style={{ gap: 0 }}>
          <div style={{ fontFamily: fontFam, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 0.9 }}>
            <div style={{ fontSize: cab, color: '#FFFFFF' }}>CAB</div>
            <div style={{ fontSize: saf, color: '#22C55E' }}>SAFARS</div>
          </div>
          <div style={{ marginLeft: gap, marginBottom: 2, flexShrink: 0 }}>
            <TruckSVG width={trW} />
          </div>
        </div>

        {/* Location pin + tagline */}
        {showTagline && (
          <div className="flex flex-col items-start" style={{ marginTop: 6 }}>
            <svg width="12" height="14" viewBox="0 0 12 16" fill="none" style={{ marginLeft: 4 }}>
              <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5Z" fill="#22C55E"/>
              <circle cx="6" cy="5" r="2" fill="#0B1220"/>
            </svg>
            <span style={{ fontFamily: fontFam, fontSize: tag, color: '#64748B', letterSpacing: '0.12em', textTransform: 'uppercase' as const, fontWeight: 500, marginLeft: 1, marginTop: 2 }}>
              Safe Loads. Smart Journeys.
            </span>
          </div>
        )}
      </div>
    );
  }

  // ── wordmark — horizontal, for sidebar / nav ───────────────────────────────
  const trW = { xs: 52, sm: 62, md: 76, lg: 92, xl: 110 }[size];
  const cab  = { xs: '12px', sm: '14px', md: '16px', lg: '20px', xl: '24px' }[size];
  const saf  = { xs: '14px', sm: '17px', md: '20px', lg: '24px', xl: '29px' }[size];

  return (
    <div className={`inline-flex items-center ${className}`} style={{ gap: 10, userSelect: 'none' }}>
      <TruckSVG width={trW} />
      <div style={{ fontFamily: fontFam, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 0.88 }}>
        <div style={{ fontSize: cab, color: '#FFFFFF' }}>CAB</div>
        <div style={{ fontSize: saf, color: '#22C55E' }}>SAFARS</div>
      </div>
    </div>
  );
}

export default BrandLogo;
