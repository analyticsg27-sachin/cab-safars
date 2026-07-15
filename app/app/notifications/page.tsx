'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Truck, CheckCircle, Crown, User, Check, Bell,
} from 'lucide-react';
import AppShell from '@/components/app/AppShell';
import AppHeader from '@/components/app/AppHeader';

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type NotifType =
  | 'trip_posted'
  | 'route_match'
  | 'account_approved'
  | 'premium_activated'
  | 'premium_expiring'
  | 'driver_contacted'
  | 'trip_closed';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

// â”€â”€â”€ Demo data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'trip_posted', title: 'New Trip Available', body: 'New trip posted: Ahmedabad â†’ Baroda on Jul 16', read: false, createdAt: '2026-07-15T10:30:00Z' },
  { id: 'n2', type: 'route_match', title: 'Route Match Found', body: 'A trip matches your active route Ahmedabad â†’ Vadodara', read: false, createdAt: '2026-07-15T09:15:00Z' },
  { id: 'n3', type: 'account_approved', title: 'Account Approved âœ“', body: 'Your account has been approved. Start exploring trips!', read: true, createdAt: '2026-07-10T14:00:00Z' },
  { id: 'n4', type: 'premium_activated', title: 'Premium Activated', body: 'Your Premium subscription is active until Aug 20, 2026', read: true, createdAt: '2026-07-01T10:00:00Z' },
  { id: 'n5', type: 'premium_expiring', title: 'Premium Expiring Soon', body: 'Your Premium subscription expires in 7 days. Renew now.', read: false, createdAt: '2026-07-13T08:00:00Z' },
  { id: 'n6', type: 'driver_contacted', title: 'Driver Contacted Your Trip', body: 'Harshad Bhatt contacted your trip TRP12563 via WhatsApp', read: true, createdAt: '2026-07-14T11:30:00Z' },
  { id: 'n7', type: 'trip_closed', title: 'Trip Closed', body: 'Your trip Surat â†’ Mumbai has been closed successfully', read: true, createdAt: '2026-07-14T18:00:00Z' },
];

// â”€â”€â”€ Icon + color per type â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getNotifStyle(type: NotifType): { icon: React.ElementType; iconColor: string; iconBg: string } {
  switch (type) {
    case 'trip_posted':
    case 'route_match':
      return { icon: Truck, iconColor: '#F5A623', iconBg: 'rgba(245,166,35,0.12)' };
    case 'account_approved':
      return { icon: CheckCircle, iconColor: '#22C55E', iconBg: 'rgba(34,197,94,0.12)' };
    case 'premium_activated':
    case 'premium_expiring':
      return { icon: Crown, iconColor: '#F5A623', iconBg: 'rgba(245,166,35,0.12)' };
    case 'driver_contacted':
      return { icon: User, iconColor: '#2D6BE4', iconBg: 'rgba(45,107,228,0.12)' };
    case 'trip_closed':
      return { icon: Check, iconColor: '#8B949E', iconBg: 'rgba(139,148,158,0.12)' };
  }
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

// â”€â”€â”€ Notification Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function NotifCard({
  notif,
  onMarkRead,
}: {
  notif: Notification;
  onMarkRead: (id: string) => void;
}) {
  const { icon: Icon, iconColor, iconBg } = getNotifStyle(notif.type);

  return (
    <div
      className="flex gap-3 px-4 py-4 transition-colors"
      style={{
        backgroundColor: notif.read ? '#161B22' : '#1C2128',
        borderLeft: notif.read ? 'none' : `3px solid #F5A623`,
        borderBottom: '1px solid #30363D',
        cursor: 'pointer',
      }}
      onClick={() => !notif.read && onMarkRead(notif.id)}
    >
      {/* Icon */}
      <div
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-0.5"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={18} style={{ color: iconColor }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm ${notif.read ? '' : 'font-semibold'}`}
            style={{ color: '#F0F6FC' }}
          >
            {notif.title}
          </p>
          <span className="shrink-0 text-xs" style={{ color: '#8B949E' }}>
            {timeAgo(notif.createdAt)}
          </span>
        </div>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#8B949E' }}>
          {notif.body}
        </p>
      </div>

      {/* Unread dot */}
      {!notif.read && (
        <div
          className="shrink-0 w-2 h-2 rounded-full mt-2"
          style={{ backgroundColor: '#F5A623' }}
        />
      )}
    </div>
  );
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed = activeTab === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <AppShell>
      <AppHeader
        title="Notifications"
        showBack
        onBack={() => router.back()}
        rightAction={
          unreadCount > 0 ? (
            <button
              className="text-xs font-semibold"
              style={{ color: '#F5A623' }}
              onClick={markAllRead}
            >
              All read
            </button>
          ) : undefined
        }
      />

      <main className="flex-1 overflow-y-auto pb-6">
        {/* Filter tabs */}
        <div className="flex gap-2 px-4 py-3 border-b" style={{ borderColor: '#30363D' }}>
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
              {tab === 'all' ? 'All' : 'Unread'}
              {tab === 'unread' && unreadCount > 0 && (
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: activeTab === 'unread' ? 'rgba(13,17,23,0.3)' : '#EF4444',
                    color: activeTab === 'unread' ? '#0D1117' : '#fff',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notification list */}
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#21262D' }}
            >
              <Bell size={28} style={{ color: '#8B949E' }} />
            </div>
            <p className="font-semibold mb-1" style={{ color: '#F0F6FC' }}>
              {activeTab === 'unread' ? 'No unread notifications' : 'No notifications'}
            </p>
            <p className="text-sm" style={{ color: '#8B949E' }}>
              {activeTab === 'unread'
                ? 'You\'re all caught up!'
                : 'Notifications will appear here when there\'s activity.'}
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
