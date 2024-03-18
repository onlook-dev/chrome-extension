import {
  getObjectFromCollection,
  postObjectToCollection,
  subscribeToDocument
} from '$lib/firebase/firestore';
import { FIREBASE_COLLECTION_CODE_CHANGE } from '$shared/constants';
import type { CodeChange } from '$shared/models/codeChange';

export async function getCodeChangeFromFirebase(id: string): Promise<CodeChange> {
  const codeChangeData = await getObjectFromCollection(FIREBASE_COLLECTION_CODE_CHANGE, id);
  return codeChangeData as CodeChange;
}

export async function postCodeChangeToFirebase(codeChange: CodeChange) {
  const objectId = await postObjectToCollection(FIREBASE_COLLECTION_CODE_CHANGE, codeChange, codeChange.id);
  console.log('Posted firebase code change');
  return objectId;
}

export async function subscribeTocodeChange(
  id: string,
  callback: (data: CodeChange) => void
): Promise<() => void> {
  const unsubscribe = await subscribeToDocument(FIREBASE_COLLECTION_CODE_CHANGE, id, callback);
  return unsubscribe;
}
