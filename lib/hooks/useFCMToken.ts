'use client';

import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { getFirebaseMessaging } from '../firebase';
import { apiClient } from '../services/api-client';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;
const STORED_KEY = 'fcm_token_registered';

export function useFCMToken(isAuthenticated: boolean) {
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!VAPID_KEY) return;

    let cancelled = false;

    async function register() {
      try {
        // Register service worker first
        const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

        // Send firebase config to the SW so it can initialise messaging
        const config = {
          apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        await navigator.serviceWorker.ready;
        reg.active?.postMessage({ type: 'FIREBASE_CONFIG', config });

        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const messaging = getFirebaseMessaging();
        if (!messaging) return;

        const token = await getToken(messaging, {
          vapidKey:            VAPID_KEY,
          serviceWorkerRegistration: reg,
        });

        if (!token || cancelled) return;

        // Only save if token changed
        const stored = localStorage.getItem(STORED_KEY);
        if (stored === token) return;

        await apiClient.post('/notifications/fcm-token', { token });
        localStorage.setItem(STORED_KEY, token);
      } catch {
        // Silently fail — notifications are non-critical
      }
    }

    register();
    return () => { cancelled = true; };
  }, [isAuthenticated]);
}
