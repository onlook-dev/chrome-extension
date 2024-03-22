import { doc, setDoc, collection, addDoc, getDoc, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { a as store } from "./firebase.js";
async function postObjectToCollection(collectionId, object, objectId) {
  try {
    const jsonObj = JSON.parse(JSON.stringify(object));
    if (objectId) {
      await setDoc(doc(store, collectionId, objectId), jsonObj, { merge: true });
      return objectId;
    } else {
      const docRef = await addDoc(collection(store, collectionId), jsonObj);
      return docRef.id;
    }
  } catch (e) {
    console.error(`Error adding document to collection ${collectionId}`, e);
  }
}
async function getObjectFromCollection(collectionId, objectId) {
  const docRef = await doc(store, collectionId, objectId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.error(`No such document with ID: ${objectId} in collection ${collectionId}`);
  }
}
async function getObjectFromCollectionWhere(collectionId, key, value) {
  const q = query(collection(store, collectionId), where(key, "==", value));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.error(`No document found with ${key} = ${value} in collection ${collectionId}`);
    return void 0;
  } else if (querySnapshot.size > 1) {
    console.warn(
      `Multiple documents found with ${key} = ${value} in collection ${collectionId}, returning the first one.`
    );
  }
  const firstDoc = querySnapshot.docs[0];
  return firstDoc.data();
}
async function deleteObjectFromCollection(collectionId, objectId) {
  const docRef = doc(store, collectionId, objectId);
  return await setDoc(docRef, {});
}
async function subscribeToDocument(collectionId, objectId, callback) {
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
class FirebaseService {
  constructor(collection2) {
    this.collection = collection2;
  }
  async get(id) {
    const data = await getObjectFromCollection(this.collection, id);
    return data;
  }
  async post(object) {
    const objectId = await postObjectToCollection(this.collection, object, object.id);
    console.log(`Posted object to ${this.collection}`);
    return objectId;
  }
  async subscribe(id, callback) {
    const unsubscribe = await subscribeToDocument(this.collection, id, callback);
    return unsubscribe;
  }
  async delete(id) {
    await deleteObjectFromCollection(this.collection, id);
  }
}
export {
  FirebaseService as F,
  getObjectFromCollectionWhere as g
};
