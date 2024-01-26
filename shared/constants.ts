// Firestore collections
export const FIREBASE_COLLECTION_PROJECTS = "projects";
export const FIREBASE_COLLECTION_USERS = "users";
export const FIREBASE_COLLECTION_TEAMS = "teams";
export const FIREBASE_FOLDER_IMAGES = "images";
export const FIREBASE_COLLECTION_PAYMENTS = "payments";
export const FIREBASE_COLLECTION_GITHUB = "github";

// Settings
export const MAX_TITLE_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 250;

// Messaging
export const DASHBOARD_AUTH = "DASHBOARD_AUTH";
export const STYLE_CHANGE = "STYLE_CHANGE";

// Links
export const LINK_DISCORD = "mailto:support@onlook.dev";
export const GITHUB_APP_URL = "https://github.com/apps/onlook-dev";

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
