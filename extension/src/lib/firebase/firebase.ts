import { initializeApp, type FirebaseApp, getApps } from 'firebase/app'
import { firebaseConfig, isFirebaseEmulator } from '../utils/env'
import { getAuth, type Auth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'

// Initialize Firebase only if it hasn't been initialized yet.
// Don't export this to enforce initalization.
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth: Auth = getAuth(app)
export const store: Firestore = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

// Check for emulator
if (isFirebaseEmulator) {
	console.log('Using Firebase Emulator')
	// Double check this with functions emulator running
	connectAuthEmulator(auth, 'http://127.0.0.1:9099')
	connectFunctionsEmulator(functions, '127.0.0.1', 5001)
	connectFirestoreEmulator(store, '127.0.0.1', 8080)
}
