import { getBucket } from '@extend-chrome/storage'
import type { User } from '../../../../shared/models/user'
import type { Team } from '../../../../shared/models/team'
import type { Project } from '../../../../shared/models/project'
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
export const usersMapBucket = getBucket<Map<string, User>>('USERS_MAP')

export const getActiveUser = async (): Promise<User> => {
	const { user } = await userBucket.get()
	return user
}

export const getActiveProject = async (): Promise<Project> => {
	const { activeProjectId } = await popupStateBucket.get()
	const projectsMap = new Map(Object.entries(await projectsMapBucket.get()))
	return projectsMap.get(activeProjectId)
}

export const getTeamById = async (teamId: string): Promise<Team> => {
	const teamMap = new Map(Object.entries(await teamsMapBucket.get()))
	return teamMap.get(teamId)
}
