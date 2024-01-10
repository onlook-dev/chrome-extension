import { routeStore } from './store'

export enum Routes {
	default = '',
	auth = 'auth',
	projects = 'projects',
	newProject = 'new_project',
	activeProject = 'active_project'
}

export function navigate(route: Routes, data?: any) {
	routeStore.set({ route: route, data: data })
}

export enum PopupRoutes {}
