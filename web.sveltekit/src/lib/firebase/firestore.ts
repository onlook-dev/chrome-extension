import { collection, addDoc, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

export async function postObjectToCollection(
	collectionId: string,
	object: unknown,
	objectId?: string
) {
	const firestore = getFirestore();
	try {
		const jsonObj = JSON.parse(JSON.stringify(object));
		if (objectId) {
			// Preset ID
			await setDoc(doc(firestore, collectionId, objectId), jsonObj, { merge: true });
			return objectId;
		} else {
			// Auto-generate ID
			const docRef = await addDoc(collection(firestore, collectionId), jsonObj);
			return docRef.id;
		}
	} catch (e) {
		console.error(`Error adding document to collection ${collectionId}`, e);
	}
}

export async function getObjectFromCollection(collectionId: string, objectId: string) {
	const firestore = getFirestore();
	const docRef = doc(firestore, collectionId, objectId);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		console.error(`No such document with ID: ${objectId} in collection ${collectionId}`);
	}
}
