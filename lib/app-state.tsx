'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppUser, AppTrip, AppNotification } from './app-types';

const STORAGE_KEY = 'app_auth_state';

export interface AppState {
  currentUser: AppUser | null;
  isAuthenticated: boolean;
  appScreen: string;
  trips: AppTrip[];
  notifications: AppNotification[];
  unreadNotifications: number;
}

export type AppAction =
  | { type: 'SET_USER'; payload: { user: AppUser; trips?: AppTrip[]; notifications?: AppNotification[] } }
  | { type: 'LOGOUT' }
  | { type: 'SET_SCREEN'; payload: string }
  | { type: 'ADD_TRIP'; payload: AppTrip }
  | { type: 'UPDATE_TRIP'; payload: AppTrip }
  | { type: 'CLOSE_TRIP'; payload: { tripId: string; closureType: 'app_driver' | 'outside_driver'; closedDriverId?: string; closureNotes?: string } }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'UPGRADE_PREMIUM'; payload: { premiumExpiry: string } };

const initialState: AppState = {
  currentUser: null,
  isAuthenticated: false,
  appScreen: 'welcome',
  trips: [],
  notifications: [],
  unreadNotifications: 0,
};

function loadPersistedState(): AppState {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (parsed.currentUser && parsed.isAuthenticated) {
      return { ...initialState, ...parsed };
    }
  } catch { /* ignore */ }
  return initialState;
}

function persistState(state: AppState) {
  if (typeof window === 'undefined') return;
  if (state.isAuthenticated && state.currentUser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentUser: state.currentUser,
      isAuthenticated: state.isAuthenticated,
      trips: state.trips,
      notifications: state.notifications,
      unreadNotifications: state.unreadNotifications,
    }));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER': {
      const { user, trips = [], notifications = [] } = action.payload;
      const unread = notifications.filter((n) => !n.read).length;
      return { ...state, currentUser: user, isAuthenticated: true, trips, notifications, unreadNotifications: unread };
    }

    case 'LOGOUT':
      return { ...initialState };

    case 'SET_SCREEN':
      return { ...state, appScreen: action.payload };

    case 'ADD_TRIP':
      return { ...state, trips: [action.payload, ...state.trips] };

    case 'UPDATE_TRIP':
      return { ...state, trips: state.trips.map((t) => t.id === action.payload.id ? action.payload : t) };

    case 'CLOSE_TRIP': {
      const { tripId, closureType, closedDriverId, closureNotes } = action.payload;
      return {
        ...state,
        trips: state.trips.map((t) =>
          t.id === tripId ? { ...t, status: 'closed', closureType, closedDriverId, closureNotes } : t
        ),
      };
    }

    case 'ADD_NOTIFICATION': {
      const notifications = [action.payload, ...state.notifications];
      return { ...state, notifications, unreadNotifications: notifications.filter((n) => !n.read).length };
    }

    case 'MARK_NOTIFICATIONS_READ':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })), unreadNotifications: 0 };

    case 'UPGRADE_PREMIUM': {
      if (!state.currentUser) return state;
      return { ...state, currentUser: { ...state.currentUser, isPremium: true, premiumExpiry: action.payload.premiumExpiry } };
    }

    default:
      return state;
  }
}

interface AppStateContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, loadPersistedState);

  useEffect(() => {
    persistState(state);
  }, [state]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
}
