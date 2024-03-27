import {
	collection,
	addDoc,
	doc,
	where,
	getDocs,
	query,
	setDoc,
	onSnapshot,
	getDoc
} from 'firebase/firestore';
import { store } from '.';

export async function postObjectToCollection(
	collectionId: string,
	object: unknown,
	objectId?: string,
	merge: boolean | undefined = true
) {
	try {
		const jsonObj = JSON.parse(JSON.stringify(object));
		if (objectId) {
			// Preset ID
			await setDoc(doc(store, collectionId, objectId), jsonObj, { merge: merge });
			return objectId;
		} else {
			// Auto-generate ID
			const docRef = await addDoc(collection(store, collectionId), jsonObj);
			return docRef.id;
		}
	} catch (e) {
		console.error(`Error adding document to collection ${collectionId}`, e);
	}
}

export async function getObjectFromCollection(collectionId: string, objectId: string) {
	const docRef = await doc(store, collectionId, objectId);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		console.error(`No such document with ID: ${objectId} in collection ${collectionId}`);
	}
}

export async function getObjectFromCollectionWhere(collectionId: string, key: string, value: any) {
	const q = query(collection(store, collectionId), where(key, '==', value));
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		console.error(`No document found with ${key} = ${value} in collection ${collectionId}`);
		return undefined;
	} else if (querySnapshot.size > 1) {
		console.warn(
			`Multiple documents found with ${key} = ${value} in collection ${collectionId}, returning the first one.`
		);
	}

	const firstDoc = querySnapshot.docs[0];
	return firstDoc.data();
}

export async function deleteObjectFromCollection(
	collectionId: string,
	objectId: string
): Promise<void> {
	const docRef = doc(store, collectionId, objectId);
	return await setDoc(docRef, {});
}

export async function subscribeToDocument(
	collectionId: string,
	objectId: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback: (data: any) => void
) {
	const docRef = doc(store, collectionId, objectId);
	const unsubscribe = onSnapshot(docRef, (docSnap) => {
		if (docSnap.exists()) {
			callback(docSnap.data());
		} else {
			console.error(`No such document with ID: ${objectId} in collection ${collectionId}`);
		}
	});
	return unsubscribe;
}
