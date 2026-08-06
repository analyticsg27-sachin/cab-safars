'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle, Clock, XCircle, Upload, CheckCircle } from 'lucide-react';
import type { AppUser } from '@/lib/app-types';
import { useTranslation } from '@/lib/useTranslation';

interface Props {
  user: AppUser;
}

export default function AccountStatusBanner({ user }: Props) {
  const router = useRouter();
  const { t } = useTranslation();

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
          <p className="text-xs font-semibold" style={{ color: '#F5A623' }}>{t('reg_under_review')}</p>
          <p className="text-xs mt-0.5" style={{ color: '#8B949E' }}>{t('reg_review_desc')}</p>
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
          <p className="text-xs font-semibold" style={{ color: '#EF4444' }}>{t('reg_rejected')}</p>
          {user.rejectionReason && (
            <p className="text-xs mt-0.5" style={{ color: '#8B949E' }}>
              {t('reason_prefix')} {user.rejectionReason}
            </p>
          )}
          <p className="text-xs mt-1" style={{ color: '#8B949E' }}>{t('reg_rejected_note')}</p>
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
          <p className="text-xs font-semibold" style={{ color: '#2D6BE4' }}>{t('approved_upload_docs')}</p>
          <p className="text-xs mt-0.5" style={{ color: '#8B949E' }}>{t('approved_upload_desc')}</p>
          <p className="text-xs mt-1 font-semibold" style={{ color: '#2D6BE4' }}>{t('tap_to_upload')}</p>
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
          <p className="text-xs font-semibold" style={{ color: '#F5A623' }}>{t('docs_under_review')}</p>
          <p className="text-xs mt-0.5" style={{ color: '#8B949E' }}>{t('docs_review_desc')}</p>
          <p className="text-xs mt-1 font-semibold" style={{ color: '#F5A623' }}>{t('view_status_arrow')}</p>
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
          <p className="text-xs font-semibold" style={{ color: '#EF4444' }}>{t('doc_issue_title')}</p>
          <p className="text-xs mt-0.5" style={{ color: '#8B949E' }}>{t('doc_issue_desc')}</p>
          <p className="text-xs mt-1 font-semibold" style={{ color: '#EF4444' }}>{t('fix_now')}</p>
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
  const { t } = useTranslation();

  let icon = <Clock size={32} style={{ color: '#F5A623' }} />;
  let title = t('feature_locked');
  let body = t('complete_setup');
  let btnLabel = '';
  let btnAction = () => {};
  let btnColor = '#F5A623';

  if (user.status === 'pending') {
    icon = <Clock size={32} style={{ color: '#F5A623' }} />;
    title = t('reg_under_review');
    body = t('reg_review_feature');
  } else if (user.status === 'rejected') {
    icon = <XCircle size={32} style={{ color: '#EF4444' }} />;
    title = t('reg_rejected');
    body = user.rejectionReason ?? t('reg_rejected_note');
    btnColor = '#EF4444';
  } else if (!user.docStatus || user.docStatus === 'none') {
    icon = <Upload size={32} style={{ color: '#2D6BE4' }} />;
    title = t('upload_docs_first');
    body = `${t('upload_docs_for_feature')} ${feature}.`;
    btnLabel = t('btn_upload_documents');
    btnAction = () => router.push('/app/documents');
    btnColor = '#2D6BE4';
  } else if (user.docStatus === 'pending') {
    icon = <Clock size={32} style={{ color: '#F5A623' }} />;
    title = t('docs_under_review');
    body = t('docs_verify_feature');
    btnLabel = t('btn_view_status');
    btnAction = () => router.push('/app/documents');
  } else if (user.docStatus === 'rejected') {
    icon = <AlertCircle size={32} style={{ color: '#EF4444' }} />;
    title = t('doc_action_required');
    body = t('doc_action_desc');
    btnLabel = t('btn_fix_documents');
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
