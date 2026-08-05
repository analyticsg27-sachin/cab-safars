'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle, Clock, XCircle, Upload, CheckCircle } from 'lucide-react';
import type { AppUser } from '@/lib/app-types';

interface Props {
  user: AppUser;
}

export default function AccountStatusBanner({ user }: Props) {
  const router = useRouter();

  // Fully active — no banner
  if (user.status === 'active' && (user.docStatus === 'approved' || user.docStatus === 'direct')) {
    return null;
  }

  // Registration pending
  if (user.status === 'pending') {
    return (
      <div className="mx-4 mt-3 mb-1 rounded-xl px-4 py-3 flex items-start gap-3"
        style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.25)' }}>
        <Clock size={16} style={{ color: '#F5A623', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="text-xs font-semibold" style={{ color: '#F5A623' }}>Registration Under Review</p>
          <p className="text-xs mt-0.5" style={{ color: '#8B949E' }}>
            Admin is reviewing your registration. You&apos;ll get a notification once approved.
          </p>
        </div>
      </div>
    );
  }

  // Registration rejected
  if (user.status === 'rejected') {
    return (
      <div className="mx-4 mt-3 mb-1 rounded-xl px-4 py-3 flex items-start gap-3"
        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
        <XCircle size={16} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="text-xs font-semibold" style={{ color: '#EF4444' }}>Registration Rejected</p>
          {user.rejectionReason && (
            <p className="text-xs mt-0.5" style={{ color: '#8B949E' }}>
              Reason: {user.rejectionReason}
            </p>
          )}
          <p className="text-xs mt-1" style={{ color: '#8B949E' }}>
            Please contact support or register again with correct details.
          </p>
        </div>
      </div>
    );
  }

  // Approved but docs not uploaded yet
  if (user.status === 'active' && (!user.docStatus || user.docStatus === 'none')) {
    return (
      <button
        onClick={() => router.push('/app/documents')}
        className="mx-4 mt-3 mb-1 w-[calc(100%-32px)] rounded-xl px-4 py-3 flex items-start gap-3 text-left active:scale-[0.99] transition-transform"
        style={{ background: 'rgba(45,107,228,0.10)', border: '1px solid rgba(45,107,228,0.3)' }}>
        <Upload size={16} style={{ color: '#2D6BE4', flexShrink: 0, marginTop: 1 }} />
        <div className="flex-1">
          <p className="text-xs font-semibold" style={{ color: '#2D6BE4' }}>
            Account Approved — Upload Documents
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#8B949E' }}>
            Your registration is approved! Upload your documents to start posting and finding trips.
          </p>
          <p className="text-xs mt-1 font-semibold" style={{ color: '#2D6BE4' }}>Tap to upload →</p>
        </div>
      </button>
    );
  }

  // Docs pending review
  if (user.status === 'active' && user.docStatus === 'pending') {
    return (
      <button
        onClick={() => router.push('/app/documents')}
        className="mx-4 mt-3 mb-1 w-[calc(100%-32px)] rounded-xl px-4 py-3 flex items-start gap-3 text-left active:scale-[0.99] transition-transform"
        style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)' }}>
        <Clock size={16} style={{ color: '#F5A623', flexShrink: 0, marginTop: 1 }} />
        <div className="flex-1">
          <p className="text-xs font-semibold" style={{ color: '#F5A623' }}>Documents Under Review</p>
          <p className="text-xs mt-0.5" style={{ color: '#8B949E' }}>
            Your documents are being verified by the team. Trip features will unlock once approved.
          </p>
          <p className="text-xs mt-1 font-semibold" style={{ color: '#F5A623' }}>View status →</p>
        </div>
      </button>
    );
  }

  // Some docs rejected
  if (user.status === 'active' && user.docStatus === 'rejected') {
    return (
      <button
        onClick={() => router.push('/app/documents')}
        className="mx-4 mt-3 mb-1 w-[calc(100%-32px)] rounded-xl px-4 py-3 flex items-start gap-3 text-left active:scale-[0.99] transition-transform"
        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
        <AlertCircle size={16} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }} />
        <div className="flex-1">
          <p className="text-xs font-semibold" style={{ color: '#EF4444' }}>Document Issue — Action Required</p>
          <p className="text-xs mt-0.5" style={{ color: '#8B949E' }}>
            One or more documents were rejected. Please re-upload the correct files.
          </p>
          <p className="text-xs mt-1 font-semibold" style={{ color: '#EF4444' }}>Fix now →</p>
        </div>
      </button>
    );
  }

  // All approved (fallback)
  if (user.status === 'active' && user.docStatus === 'approved') {
    return null;
  }

  return null;
}

/** Returns true only when the user has full app access (can post/find trips) */
export function isFullyActive(user: AppUser): boolean {
  if (user.status !== 'active') return false;
  return user.docStatus === 'approved' || user.docStatus === 'direct';
}

/** Locked gate overlay — shown inside feature pages when user can't access yet */
export function LockedFeature({ user, feature }: { user: AppUser; feature: string }) {
  const router = useRouter();

  let icon = <Clock size={32} style={{ color: '#F5A623' }} />;
  let title = 'Feature Locked';
  let body = 'Complete your account setup to access this feature.';
  let btnLabel = '';
  let btnAction = () => {};
  let btnColor = '#F5A623';

  if (user.status === 'pending') {
    icon = <Clock size={32} style={{ color: '#F5A623' }} />;
    title = 'Registration Under Review';
    body = 'Admin is reviewing your registration. This feature will unlock once approved.';
  } else if (user.status === 'rejected') {
    icon = <XCircle size={32} style={{ color: '#EF4444' }} />;
    title = 'Registration Rejected';
    body = user.rejectionReason ?? 'Your registration was not approved. Contact support for help.';
    btnColor = '#EF4444';
  } else if (!user.docStatus || user.docStatus === 'none') {
    icon = <Upload size={32} style={{ color: '#2D6BE4' }} />;
    title = 'Upload Documents First';
    body = `To ${feature}, you need to upload and verify your documents.`;
    btnLabel = 'Upload Documents';
    btnAction = () => router.push('/app/documents');
    btnColor = '#2D6BE4';
  } else if (user.docStatus === 'pending') {
    icon = <Clock size={32} style={{ color: '#F5A623' }} />;
    title = 'Documents Under Review';
    body = 'Your documents are being verified. This usually takes 24–48 hours.';
    btnLabel = 'View Status';
    btnAction = () => router.push('/app/documents');
  } else if (user.docStatus === 'rejected') {
    icon = <AlertCircle size={32} style={{ color: '#EF4444' }} />;
    title = 'Document Action Required';
    body = 'Some documents need to be re-uploaded before you can access this feature.';
    btnLabel = 'Fix Documents';
    btnAction = () => router.push('/app/documents');
    btnColor = '#EF4444';
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 py-12 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)' }}>
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-2" style={{ color: '#F0F6FC' }}>{title}</h3>
      <p className="text-sm leading-relaxed mb-5" style={{ color: '#8B949E', maxWidth: 280 }}>{body}</p>
      {btnLabel && (
        <button
          onClick={btnAction}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
          style={{ background: `rgba(${btnColor === '#2D6BE4' ? '45,107,228' : btnColor === '#EF4444' ? '239,68,68' : '245,166,35'},0.15)`, color: btnColor, border: `1px solid ${btnColor}40` }}>
          {btnLabel}
        </button>
      )}
    </div>
  );
}
