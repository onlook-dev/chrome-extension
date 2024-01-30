import { getBucket } from '@extend-chrome/storage'
import type { User } from '../../../../shared/models/user'
import type { Team } from '../../../../shared/models/team'
import type { Project } from '../../../../shared/models/project'
import type { PopupRoutes } from './constants'

// Maps that get shared across the whole extension using local storage
// https://github.com/extend-chrome/storage

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

export interface VisbugState {
	projectId: string
	state: InjectState
}

export enum InjectState {
	injected = 'injected',
	loaded = 'loaded',
	none = 'none',
	creating = 'creating'
}

// Objects
export const authUserBucket = getBucket<AuthUserState>('AUTH_USER_STATE')
export const userBucket = getBucket<UserState>('USER_STATE')
export const popupStateBucket = getBucket<PopupState>('POPUP_STATE')

// Maps
export const teamsMapBucket = getBucket<Map<string, Team>>('TEAMS_MAP')
export const projectsMapBucket = getBucket<Map<string, Project>>('PROJECTS_MAP')
export const usersMapBucket = getBucket<Map<string, User>>('USERS_MAP')
export const tabsMapBucket = getBucket<Map<string, VisbugState>>('TABS_MAP')

export const getActiveUser = async (): Promise<User> => {
	const { user } = await userBucket.get()
	return user
}

export const getActiveProject = async (): Promise<Project> => {
	const { activeProjectId } = await popupStateBucket.get()
	return getProjectById(activeProjectId)
}

export const getProjectById = async (projectId: string): Promise<Project> => {
	const projectsMap = new Map(Object.entries(await projectsMapBucket.get()))
	return projectsMap.get(projectId)
}

export const getTeamById = async (teamId: string): Promise<Team> => {
	const teamMap = new Map(Object.entries(await teamsMapBucket.get()))
	return teamMap.get(teamId)
}

export async function getTabState(tabId: number): Promise<VisbugState> {
	let stateMap: Map<string, VisbugState> = new Map(Object.entries(await tabsMapBucket.get()))
	return (
		stateMap.get(tabId.toString()) ?? {
			projectId: '',
			state: InjectState.none
		}
	)
}

export async function saveTabState(tabId: number, tabState: VisbugState) {
	if (tabState.state === InjectState.none) {
		console.log('removing tab state', tabId)
		tabsMapBucket.remove(tabId.toString())
	} else {
		console.log('saving tab state', tabId, tabState)
		tabsMapBucket.set({ [tabId.toString()]: tabState })
	}
}
