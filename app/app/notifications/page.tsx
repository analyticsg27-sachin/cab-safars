'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Truck, CheckCircle, Crown, User, Check, Bell, RefreshCw,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';
import { useTranslation } from '@/lib/useTranslation';
import NotificationsService from '@/lib/services/notifications.service';
import type { Notification } from '@/lib/services/notifications.service';
import { isApiMode } from '@/lib/services';

// --- Icon + color per type ---
function getNotifStyle(type: string): { icon: React.ElementType; iconColor: string; iconBg: string } {
  if (type.includes('trip_posted') || type.includes('route_match') || type.includes('new_trip'))
    return { icon: Truck, iconColor: '#F5A623', iconBg: 'rgba(245,166,35,0.12)' };
  if (type.includes('approved') || type.includes('document'))
    return { icon: CheckCircle, iconColor: '#22C55E', iconBg: 'rgba(34,197,94,0.12)' };
  if (type.includes('premium') || type.includes('subscription'))
    return { icon: Crown, iconColor: '#F5A623', iconBg: 'rgba(245,166,35,0.12)' };
  if (type.includes('driver') || type.includes('contact'))
    return { icon: User, iconColor: '#2D6BE4', iconBg: 'rgba(45,107,228,0.12)' };
  if (type.includes('rejected') || type.includes('suspend'))
    return { icon: Check, iconColor: '#EF4444', iconBg: 'rgba(239,68,68,0.12)' };
  return { icon: Bell, iconColor: '#8B949E', iconBg: 'rgba(139,148,158,0.12)' };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

function NotifCard({ notif, onMarkRead }: { notif: Notification; onMarkRead: (id: string) => void }) {
  const { icon: Icon, iconColor, iconBg } = getNotifStyle(notif.type);
  const isRead = notif.is_read;

  return (
    <div
      className="flex gap-3 px-4 py-4 transition-colors"
      style={{
        backgroundColor: isRead ? '#161B22' : '#1C2128',
        borderLeft: isRead ? 'none' : '3px solid #F5A623',
        borderBottom: '1px solid #30363D',
        cursor: isRead ? 'default' : 'pointer',
      }}
      onClick={() => !isRead && onMarkRead(notif.id)}
    >
      <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-0.5"
        style={{ backgroundColor: iconBg }}>
        <Icon size={18} style={{ color: iconColor }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm ${isRead ? '' : 'font-semibold'}`} style={{ color: '#F0F6FC' }}>
            {notif.title}
          </p>
          <span className="shrink-0 text-xs" style={{ color: '#8B949E' }}>
            {timeAgo(notif.created_at)}
          </span>
        </div>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#8B949E' }}>
          {notif.body}
        </p>
      </div>

      {!isRead && (
        <div className="shrink-0 w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#F5A623' }} />
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  async function fetchNotifications() {
    if (!isApiMode()) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await NotificationsService.getAll(1, false);
      setNotifications((res.data as unknown as Notification[]) ?? []);
    } catch {
      // silently fail — show empty state
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchNotifications(); }, []);

  async function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    try { await NotificationsService.markRead(id); } catch { /* ignore */ }
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try { await NotificationsService.markAllRead(); } catch { /* ignore */ }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const displayed = activeTab === 'unread' ? notifications.filter((n) => !n.is_read) : notifications;

  return (
    <AppShell>
      <AppHeader
        title={t('notifications')}
        showBack
        onBack={() => router.back()}
        rightAction={
          unreadCount > 0 ? (
            <button className="text-xs font-semibold" style={{ color: '#F5A623' }} onClick={markAllRead}>
              {t('mark_all_read')}
            </button>
          ) : undefined
        }
      />

      <main className="flex-1 overflow-y-auto pb-6">
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#30363D' }}>
          <div className="flex gap-2">
            {(['all', 'unread'] as const).map((tab) => (
              <button
                key={tab}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
                style={{
                  backgroundColor: activeTab === tab ? '#F5A623' : '#21262D',
                  color: activeTab === tab ? '#0D1117' : '#8B949E',
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' ? t('tab_all') : t('tab_unread')}
                {tab === 'unread' && unreadCount > 0 && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: activeTab === 'unread' ? 'rgba(13,17,23,0.3)' : '#EF4444',
                      color: activeTab === 'unread' ? '#0D1117' : '#fff',
                    }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button onClick={fetchNotifications} style={{ color: '#8B949E' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#21262D' }}>
              <Bell size={28} style={{ color: '#8B949E' }} />
            </div>
            <p className="font-semibold mb-1" style={{ color: '#F0F6FC' }}>
              {activeTab === 'unread' ? t('no_unread_notifs') : t('no_notifs')}
            </p>
            <p className="text-sm" style={{ color: '#8B949E' }}>
              {activeTab === 'unread' ? t('all_caught_up') : t('notifs_appear_here')}
            </p>
          </div>
        ) : (
          <div>
            {displayed.map((notif) => (
              <NotifCard key={notif.id} notif={notif} onMarkRead={markRead} />
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
