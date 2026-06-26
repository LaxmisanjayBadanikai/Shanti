import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let db: any = null;
let auth: any = null;
let isRealFirebase = false;

// Attempt to load the configuration
try {
  // We use standard require or import mechanisms that compile well in Vite.
  // Since firebase-applet-config.json is in the root src directory, let's check
  // if we can resolve it.
  
  // For safety, we can define a default or attempt import
  // @ts-ignore
  const firebaseConfig = await import('./firebase-applet-config.json');
  
  if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    isRealFirebase = true;
    console.log('PeaceOS successfully connected to Cloud Firestore.');
  }
} catch (e) {
  // Graceful fallback for local development preview
  console.log('PeaceOS starting in high-fidelity local coordination mode. (Cloud persistence can be activated via set_up_firebase).');
}

export { db, auth, isRealFirebase };
export const OperationType = {
  CREATE: 'create' as const,
  UPDATE: 'update' as const,
  DELETE: 'delete' as const,
  LIST: 'list' as const,
  GET: 'get' as const,
  WRITE: 'write' as const,
};

export interface FirestoreErrorInfo {
  error: string;
  operationType: string;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: string, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
