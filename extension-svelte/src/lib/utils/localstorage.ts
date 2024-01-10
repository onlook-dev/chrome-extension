import { getBucket } from '@extend-chrome/storage'
import type { UserImpl } from '$lib/models/user'

interface ExtensionState {
	visbugActive: boolean
}

interface UserState {
	user: UserImpl | undefined
	authUser: string
}

export const stateBucket = getBucket<ExtensionState>('EXTENSION_STATE')
export const userBucket = getBucket<UserState>('USER_STATE')
