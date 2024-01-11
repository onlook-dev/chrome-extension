import { getBucket } from '@extend-chrome/storage'
import type { User } from '$models/user'

interface ExtensionState {
	visbugActive: boolean
}

interface AuthUserState {
	authUser: string
}

interface UserState {
	user: User
}

export const stateBucket = getBucket<ExtensionState>('EXTENSION_STATE')
export const authUserBucket = getBucket<AuthUserState>('AUTH_USER_STATE')
export const userBucket = getBucket<UserState>('USER_STATE')
