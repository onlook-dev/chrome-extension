import { initializeApp, type FirebaseApp, getApps } from 'firebase/app'
import { firebaseConfig } from '../utils/env'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Initialize Firebase only if it hasn't been initialized yet.
// Don't export this to enforce initalization.
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth: Auth = getAuth(app)
export const store: Firestore = getFirestore(app)
export const storage = getStorage(app)
