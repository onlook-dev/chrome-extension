import { getBucket } from '@extend-chrome/storage'
import type { User } from '$models/user'
import type { Team } from '$models/team'
import type { Project } from '$models/project'
import type { PopupRoutes } from './constants'

// Maps that get shared across the whole extension using local storage
// https://github.com/extend-chrome/storage

interface ExtensionState {
	visbugActive: boolean
}

interface AuthUserState {
	authUser: string
}

interface UserState {
	user: User
}

interface PopupState {
	activeTeamId: string
	activeProjectId: string
	activeRoute: PopupRoutes
}

// Objects
export const stateBucket = getBucket<ExtensionState>('EXTENSION_STATE')
export const authUserBucket = getBucket<AuthUserState>('AUTH_USER_STATE')
export const userBucket = getBucket<UserState>('USER_STATE')
export const popupStateBucket = getBucket<PopupState>('POPUP_STATE')

// Maps
export const teamsMapBucket = getBucket<Map<string, Team>>('TEAMS_MAP')
export const projectsMapBucket = getBucket<Map<string, Project>>('PROJECTS_MAP')
