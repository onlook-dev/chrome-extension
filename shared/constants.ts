// Firestore collections
export const FIREBASE_COLLECTION_PROJECTS = "projects";
export const FIREBASE_COLLECTION_USERS = "users";
export const FIREBASE_COLLECTION_TEAMS = "teams";

// Messaging
export const DASHBOARD_AUTH = "DASHBOARD_AUTH";

// Links
export const LINK_DISCORD = "https://discord.gg/vrEkdkj7";

// Dashboard routes
export enum DashboardRoutes {
  HOME = "/",
  SIGNIN = "/signin",
  SHARE = "/share",
  DASHBOARD = "/dashboard",
  PROJECTS = `/dashboard/projects`,
  PRIVACY = "/privacy",
}

// Just swap this out for testing
// export const DASHBOARD_URL = 'https://app.onlook.dev'
export const DASHBOARD_URL = "http://localhost:5173";