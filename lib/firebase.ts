import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, type Messaging } from 'firebase/messaging';

// Firebase web config — public keys, safe to commit (restricted by domain in Firebase console)
const firebaseConfig = {
  apiKey:            'AIzaSyDejRu9O4cReOL6WimmePW25svmyyLnhxQ',
  authDomain:        'cab-safars.firebaseapp.com',
  projectId:         'cab-safars',
  storageBucket:     'cab-safars.firebasestorage.app',
  messagingSenderId: '157397651545',
  appId:             '1:157397651545:web:9afbf207a6a8526c53a148',
};

export const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

let messagingInstance: Messaging | null = null;

export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') return null;
  if (!('serviceWorker' in navigator)) return null;
  if (!messagingInstance) {
    messagingInstance = getMessaging(firebaseApp);
  }
  return messagingInstance;
}
