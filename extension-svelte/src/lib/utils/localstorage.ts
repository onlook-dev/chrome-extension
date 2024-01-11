import { getBucket } from '@extend-chrome/storage'
import type { UserImpl } from '$lib/models/user'

interface ExtensionState {
	visbugActive: boolean
}

interface AuthUserState {
	authUser: string
}

interface UserState {
	user: UserImpl
}

export const stateBucket = getBucket<ExtensionState>('EXTENSION_STATE')
export const authUserBucket = getBucket<AuthUserState>('AUTH_USER_STATE')
export const userBucket = getBucket<UserState>('USER_STATE')
