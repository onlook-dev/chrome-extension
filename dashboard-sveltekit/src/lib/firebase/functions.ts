import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

interface StoreImageUriData {
	dataUri: string;
}

export const storeImageUri = httpsCallable<StoreImageUriData, string>(functions, 'storeImageUri');
export const getGithubReposByInstallationId = httpsCallable<string, string[]>(
	functions,
	'getGithubReposByInstallationId'
);
