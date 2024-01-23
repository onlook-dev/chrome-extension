// Firestore collections
export const FIREBASE_COLLECTION_PROJECTS = "projects";
export const FIREBASE_COLLECTION_USERS = "users";
export const FIREBASE_COLLECTION_TEAMS = "teams";
export const FIREBASE_FOLDER_IMAGES = "images";
export const FIREBASE_COLLECTION_PAYMENTS = "payments";

// Settings
export const MAX_PROJECT_NAME_LENGTH = 50;

// Messaging
export const DASHBOARD_AUTH = "DASHBOARD_AUTH";
export const STYLE_CHANGE = "STYLE_CHANGE";

// Links
export const LINK_DISCORD = "mailto:support@onlook.dev";

// Dashboard routes
export enum DashboardRoutes {
  HOME = "/",
  SIGNIN = "/signin",
  SHARE = "/share",
  DASHBOARD = "/dashboard",
  PROJECTS = "/dashboard/projects",
  PRIVACY = "/privacy",
  GITHUB = "/github",
}

export enum MouseEvent {
  CLICK = "click",
  MOUSEMOVE = "mousemove",
}
