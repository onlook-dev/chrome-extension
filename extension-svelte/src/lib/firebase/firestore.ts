import { collection, addDoc, doc, getDoc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore'
import { store } from './firebase'

export async function postObjectToCollection(
	collectionId: string,
	object: unknown,
	objectId?: string,
	merge = false
) {
	try {
		const jsonObj = JSON.parse(JSON.stringify(object))
		if (objectId) {
			// Preset ID
			await setDoc(doc(store, collectionId, objectId), jsonObj, { merge })
			return objectId
		} else {
			// Auto-generate ID
			const docRef = await addDoc(collection(store, collectionId), jsonObj)
			return docRef.id
		}
	} catch (e) {
		console.error(`Error adding document to collection ${collectionId}`, e)
	}
}

export async function getObjectFromCollection(collectionId: string, objectId: string) {
	const docRef = doc(store, collectionId, objectId)
	const docSnap = await getDoc(docRef)

	if (docSnap.exists()) {
		return docSnap.data()
	} else {
		console.error(`No such document with ID: ${objectId} in collection ${collectionId}`)
	}
}

export async function deleteObjectFromCollection(
	collectionId: string,
	objectId: string
): Promise<void> {
	const docRef = doc(store, collectionId, objectId)
	await deleteDoc(docRef)
}

export async function subscribeToDocument(
	collectionId: string,
	objectId: string,
	callback: (data: any) => void
) {
	const docRef = doc(store, collectionId, objectId)
	const unsubscribe = onSnapshot(docRef, docSnap => {
		if (docSnap.exists()) {
			callback(docSnap.data())
		} else {
			console.error(`No such document with ID: ${objectId} in collection ${collectionId}`)
		}
	})
	return unsubscribe
}
