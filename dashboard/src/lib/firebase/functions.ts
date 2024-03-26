import { httpsCallable } from 'firebase/functions';
import { functions } from '.';

interface StoreImageUriData {
	dataUri: string;
}

interface InstallationData {
	installationId: string;
}

export const storeImageUri = httpsCallable<StoreImageUriData, string>(functions, 'storeImageUri');
