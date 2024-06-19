import { getBucket } from '@extend-chrome/storage'
import type { User, Team, Project } from '$shared/models'
// Maps that get shared across the whole extension using local storage
// https://github.com/extend-chrome/storage

interface AuthUserState {
	authUser: string
}

interface UserState {
	user: User
}

interface AppState {
	shouldTour: boolean
}

export enum InjectState {
	injected = 'injected',
	loaded = 'loaded',
	none = 'none'
}

// Objects
export const authUserBucket = getBucket<AuthUserState>('AUTH_USER_STATE')
export const userBucket = getBucket<UserState>('USER_STATE')
export const stateBucket = getBucket<AppState>('APP_STATE')

// Maps
export const teamsMapBucket = getBucket<Map<string, Team>>('TEAMS_MAP')
export const projectsMapBucket = getBucket<Map<string, Project>>('PROJECTS_MAP')
export const usersMapBucket = getBucket<Map<string, User>>('USERS_MAP')

export const getActiveUser = async (): Promise<User> => {
	const { user } = await userBucket.get()
	return user
}

export const getProjectById = async (projectId: string): Promise<Project> => {
	const projectsMap = new Map(Object.entries(await projectsMapBucket.get()))
	return projectsMap.get(projectId)
}

export const getTeamById = async (teamId: string): Promise<Team> => {
	const teamMap = new Map(Object.entries(await teamsMapBucket.get()))
	return teamMap.get(teamId)
}