import { getFunctions, httpsCallable } from 'firebase/functions'

const functions = getFunctions()

interface StoreImageUriData {
	dataUri: string
}
export const storeImageUri = httpsCallable<StoreImageUriData, string>(functions, 'storeImageUri')
