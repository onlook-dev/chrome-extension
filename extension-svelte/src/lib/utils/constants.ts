// Dashboard routes
export const DASHBOARD_AUTH_ROUTE = 'signin'
export const DASHBOARD_SHARE_ROUTE = 'share'

// Just swap this out for testing
// export const DASHBOARD_URL = 'https://app.onlook.dev'
export const DASHBOARD_URL = 'http://localhost:5173'

// Event name
export const DASHBOARD_AUTH = 'DASHBOARD_AUTH' // DO NOT CHANGE UNLESS CORRESPONDING DASHBOARD CODE IS CHANGED
export const IMPORT_PROJECT = 'IMPORT_PROJECT'

// Firestore collections
export const FIREBASE_COLLECTION_PROJECTS = 'projects'
export const FIREBASE_COLLECTION_USERS = 'users'
export const FIREBASE_COLLECTION_TEAMS = 'teams'

// Popup routes
export enum PopupRoutes {
	DASHBOARD = 'dashboard',
	PROJECT = 'project',
	NEW_PROJECT = 'new-project'
}
