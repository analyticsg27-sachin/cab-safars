'use client';

import { Home, MapPin, PlusCircle, Bell, User, Search, Navigation } from 'lucide-react';

interface BottomNavProps {
  role: 'vendor' | 'driver';
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadNotifications?: number;
}

const vendorTabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'trips', label: 'My Trips', icon: MapPin },
  { id: 'post', label: 'Post Trip', icon: PlusCircle, isCenter: true },
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
];

const driverTabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'trips', label: 'Find Trips', icon: Search },
  { id: 'route', label: 'Route', icon: Navigation },
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
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
      className="shrink-0 flex items-center px-1 safe-pb"
      style={{
        backgroundColor: '#161B22',
        borderTop: '1px solid #30363D',
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isNotif = tab.id === 'notifications';

        // Center "Post Trip" button for vendor
        if ('isCenter' in tab && tab.isCenter) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center flex-1 gap-0.5 relative"
              aria-label={tab.label}
            >
              <div
                className="flex items-center justify-center w-12 h-12 rounded-full -mt-6 shadow-lg transition-transform active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #F5A623, #D4891E)',
                  boxShadow: '0 4px 16px rgba(245,166,35,0.4)',
                }}
              >
                <Icon size={22} color="#0D1117" strokeWidth={2.5} />
              </div>
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? '#F5A623' : '#8B949E' }}
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
            className="flex flex-col items-center justify-center flex-1 gap-0.5 relative py-2 transition-colors"
            style={{ color: isActive ? '#F5A623' : '#8B949E' }}
            aria-label={tab.label}
          >
            <div className="relative">
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {isNotif && unreadNotifications > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex items-center justify-center text-[9px] font-bold rounded-full"
                  style={{
                    backgroundColor: '#EF4444',
                    color: '#fff',
                    minWidth: '14px',
                    height: '14px',
                    padding: '0 3px',
                  }}
                >
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
