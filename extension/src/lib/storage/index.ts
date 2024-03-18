import {
  deleteObjectFromCollection,
  getObjectFromCollection,
  postObjectToCollection,
  subscribeToDocument
} from '$lib/firebase/firestore';

interface Identifiable {
  id: string;
}

export class FirebaseService<T extends Identifiable> {
  constructor(private collection: string) { }

  async get(id: string): Promise<T> {
    const data = await getObjectFromCollection(this.collection, id);
    return data as T;
  }

  async post(object: T): Promise<string | undefined> {
    const objectId = await postObjectToCollection(this.collection, object, object.id);
    console.log(`Posted object to ${this.collection}`);
    return objectId;
  }

  async subscribe(id: string, callback: (data: T) => void): Promise<() => void> {
    const unsubscribe = await subscribeToDocument(this.collection, id, callback);
    return unsubscribe;
  }

  async delete(id: string): Promise<void> {
    await deleteObjectFromCollection(this.collection, id)
  }
}
