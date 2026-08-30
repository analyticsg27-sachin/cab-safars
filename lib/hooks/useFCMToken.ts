'use client';

import { useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { getFirebaseMessaging } from '../firebase';
import { apiClient } from '../services/api-client';

const VAPID_KEY = 'BPDyhc2RTJ3iwmpfJ0L48Cwrei7cbltzZH65a0Jk2t36ZRPizWwfqFh4jELg5JvT8LOEowfqs_JliZ8MbXr1yxw';
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
          apiKey:            'AIzaSyDejRu9O4cReOL6WimmePW25svmyyLnhxQ',
          authDomain:        'cab-safars.firebaseapp.com',
          projectId:         'cab-safars',
          storageBucket:     'cab-safars.firebasestorage.app',
          messagingSenderId: '157397651545',
          appId:             '1:157397651545:web:9afbf207a6a8526c53a148',
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
