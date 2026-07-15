import { Truck } from 'lucide-react';
import { asset } from '@/lib/basepath';

type BrandLogoVariant = 'full' | 'icon' | 'wordmark';
type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  className?: string;
  showTagline?: boolean;
}

const sizeMap: Record<BrandLogoSize, { img: string; icon: number; text: string; tagline: string }> = {
  xs: { img: 'h-6',  icon: 16, text: 'text-sm',  tagline: 'text-[9px]' },
  sm: { img: 'h-8',  icon: 20, text: 'text-base', tagline: 'text-[10px]' },
  md: { img: 'h-12', icon: 28, text: 'text-xl',   tagline: 'text-xs' },
  lg: { img: 'h-16', icon: 36, text: 'text-2xl',  tagline: 'text-sm' },
  xl: { img: 'h-24', icon: 48, text: 'text-4xl',  tagline: 'text-base' },
};

export function BrandLogo({
  variant = 'wordmark',
  size = 'md',
  className = '',
  showTagline = false,
}: BrandLogoProps) {
  const s = sizeMap[size];

  if (variant === 'full') {
    return (
      <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
        <div className={`${s.img} overflow-hidden rounded-lg`}>
          <img
            src={asset('/logo.png')}
            alt="CAB SAFARS"
            className="h-full w-auto object-contain"
          />
        </div>
        {showTagline && (
          <span className={`${s.tagline} font-medium tracking-wide`} style={{ color: '#94A3B8' }}>
            Safe Loads. Smart Journeys.
          </span>
        )}
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: s.icon + 16,
            height: s.icon + 16,
            background: 'linear-gradient(135deg, #16A34A, #15803D)',
          }}
        >
          <Truck size={s.icon} color="#FFFFFF" strokeWidth={2} />
        </div>
        {showTagline && (
          <span className={`${s.tagline} font-medium tracking-wide`} style={{ color: '#94A3B8' }}>
            Safe Loads. Smart Journeys.
          </span>
        )}
      </div>
    );
  }

  // wordmark variant (default)
  return (
    <div className={`inline-flex flex-col items-start gap-0.5 ${className}`}>
      <div className="inline-flex items-center gap-2">
        <div
          className="flex items-center justify-center rounded-md flex-shrink-0"
          style={{
            width: s.icon + 8,
            height: s.icon + 8,
            background: 'linear-gradient(135deg, #16A34A, #15803D)',
          }}
        >
          <Truck size={s.icon} color="#FFFFFF" strokeWidth={2} />
        </div>
        <div className={`${s.text} leading-none`}>
          <span className="font-black tracking-tight" style={{ color: '#FFFFFF' }}>CAB </span>
          <span className="font-black tracking-tight" style={{ color: '#22C55E' }}>SAFARS</span>
        </div>
      </div>
      {showTagline && (
        <span className={`${s.tagline} font-medium tracking-wide ml-1`} style={{ color: '#94A3B8' }}>
          Safe Loads. Smart Journeys.
        </span>
      )}
    </div>
  );
}

export default BrandLogo;
