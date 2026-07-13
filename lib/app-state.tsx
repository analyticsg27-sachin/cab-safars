'use client';

import React, { createContext, useContext, useReducer } from 'react';
import type { AppUser, AppTrip, AppNotification } from './app-types';

// ─── State Shape ─────────────────────────────────────────────────────────────

export interface AppState {
  currentUser: AppUser | null;
  isAuthenticated: boolean;
  appScreen: string;
  trips: AppTrip[];
  notifications: AppNotification[];
  unreadNotifications: number;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

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

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: AppState = {
  currentUser: null,
  isAuthenticated: false,
  appScreen: 'welcome',
  trips: [],
  notifications: [],
  unreadNotifications: 0,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER': {
      const { user, trips = [], notifications = [] } = action.payload;
      const unread = notifications.filter((n) => !n.read).length;
      return {
        ...state,
        currentUser: user,
        isAuthenticated: true,
        trips,
        notifications,
        unreadNotifications: unread,
      };
    }

    case 'LOGOUT':
      return { ...initialState };

    case 'SET_SCREEN':
      return { ...state, appScreen: action.payload };

    case 'ADD_TRIP':
      return { ...state, trips: [action.payload, ...state.trips] };

    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'CLOSE_TRIP': {
      const { tripId, closureType, closedDriverId, closureNotes } = action.payload;
      return {
        ...state,
        trips: state.trips.map((t) =>
          t.id === tripId
            ? { ...t, status: 'closed', closureType, closedDriverId, closureNotes }
            : t
        ),
      };
    }

    case 'ADD_NOTIFICATION': {
      const notifications = [action.payload, ...state.notifications];
      const unreadNotifications = notifications.filter((n) => !n.read).length;
      return { ...state, notifications, unreadNotifications };
    }

    case 'MARK_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadNotifications: 0,
      };

    case 'UPGRADE_PREMIUM': {
      if (!state.currentUser) return state;
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          isPremium: true,
          premiumExpiry: action.payload.premiumExpiry,
        },
      };
    }

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppStateContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used inside <AppStateProvider>');
  }
  return ctx;
}
