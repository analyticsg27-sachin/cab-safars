'use client';

import { useAppState } from '@/lib/app-state';
import { useFCMToken } from '@/lib/hooks/useFCMToken';

export default function PushNotificationSetup() {
  const { state } = useAppState();
  useFCMToken(state.isAuthenticated);
  return null;
}
