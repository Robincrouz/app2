import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import platformConfig from '../firebase-applet-config.json';

// Helper to get environment variables with fallbacks
const getConfig = () => {
  const env = (import.meta as any).env;
  
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || platformConfig.apiKey,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || platformConfig.authDomain,
    projectId: env.VITE_FIREBASE_PROJECT_ID || platformConfig.projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || platformConfig.storageBucket,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || platformConfig.messagingSenderId,
    appId: env.VITE_FIREBASE_APP_ID || platformConfig.appId,
    databaseId: env.VITE_FIREBASE_DATABASE_ID || platformConfig.firestoreDatabaseId,
  };
};

const firebaseConfig = getConfig();

// Validation
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase configuration is missing key values. Please check your environment variables or firebase-applet-config.json.");
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Exports
export const db = getFirestore(app, firebaseConfig.databaseId);
export const auth = getAuth(app);

export default app;
