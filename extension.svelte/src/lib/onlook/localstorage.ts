import { getBucket } from '@extend-chrome/storage'

interface ExtensionState {
	visbugActive: boolean
}

export const stateBucket = getBucket<ExtensionState>('EXTENSION_STATE')
