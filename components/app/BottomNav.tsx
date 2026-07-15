'use client';

import { Home, Package, PlusCircle, Search, User, MapPin, Bell } from 'lucide-react';

interface BottomNavProps {
  role: 'vendor' | 'driver';
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadNotifications?: number;
}

const vendorTabs = [
  { id: 'home',    label: 'Home',      icon: Home },
  { id: 'trips',   label: 'Trips',     icon: Package },
  { id: 'post',    label: 'Post Trip', icon: PlusCircle, isCenter: true },
  { id: 'find',    label: 'Find',      icon: Search },
  { id: 'profile', label: 'Profile',   icon: User },
];

const driverTabs = [
  { id: 'home',          label: 'Home',    icon: Home },
  { id: 'trips',         label: 'Search',  icon: Search },
  { id: 'route',         label: 'Route',   icon: MapPin },
  { id: 'notifications', label: 'Alerts',  icon: Bell },
  { id: 'profile',       label: 'Profile', icon: User },
];

export default function BottomNav({
  role,
  activeTab,
  onTabChange,
  unreadNotifications = 0,
}: BottomNavProps) {
  const tabs = role === 'vendor' ? vendorTabs : driverTabs;

  return (
    <nav
      style={{
        backgroundColor: '#111827',
        borderTop: '1px solid #243042',
        height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        paddingLeft: '4px',
        paddingRight: '4px',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isNotif = tab.id === 'notifications';

        if ('isCenter' in tab && tab.isCenter) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                position: 'relative',
              }}
              aria-label={tab.label}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#F5A623',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '-20px',
                  boxShadow: '0 4px 16px rgba(245,166,35,0.45)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'scale(0.93)';
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                }}
                onTouchStart={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'scale(0.93)';
                }}
                onTouchEnd={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                }}
              >
                <Icon size={22} color="#0B1220" strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  color: isActive ? '#F5A623' : '#94A3B8',
                  transition: 'color 0.2s ease',
                  lineHeight: 1,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 0',
              position: 'relative',
              color: isActive ? '#F5A623' : '#94A3B8',
              transition: 'color 0.2s ease',
            }}
            aria-label={tab.label}
          >
            {/* Active indicator dot above icon */}
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: isActive ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                width: '20px',
                height: '3px',
                borderRadius: '0 0 3px 3px',
                backgroundColor: '#F5A623',
                transition: 'transform 0.2s ease',
                transformOrigin: 'center top',
              }}
            />

            <div style={{ position: 'relative' }}>
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 2}
                style={{ transition: 'stroke-width 0.2s ease, transform 0.2s ease', display: 'block', transform: isActive ? 'translateY(-1px)' : 'translateY(0)' }}
              />
              {isNotif && unreadNotifications > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-5px',
                    backgroundColor: '#DC2626',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    minWidth: '15px',
                    height: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                    lineHeight: 1,
                  }}
                >
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </div>

            <span
              style={{
                fontSize: '10px',
                fontWeight: 500,
                lineHeight: 1,
                transition: 'color 0.2s ease',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
