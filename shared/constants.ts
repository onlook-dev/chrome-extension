// Firestore collections
export const FIREBASE_COLLECTION_PROJECTS = "projects";
export const FIREBASE_COLLECTION_USERS = "users";
export const FIREBASE_COLLECTION_TEAMS = "teams";
export const FIREBASE_FOLDER_IMAGES = "images";
export const FIREBASE_COLLECTION_PAYMENTS = "payments";
export const FIREBASE_COLLECTION_GITHUB = "github";
export const FIREBASE_COLLECTION_GITHUB_HISTORY = "github_history";

// Settings
export const MAX_TITLE_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 250;

// Messaging
export const DASHBOARD_AUTH = "DASHBOARD_AUTH";
export const STYLE_CHANGE = "STYLE_CHANGE";
export const UNDO_STYLE_CHANGE = "UNDO_STYLE_CHANGE";
export const REDO_STYLE_CHANGE = "REDO_STYLE_CHANGE";
export const OPEN_PROJECT = "OPEN_PROJECT";

// Links
export const SUPPORT_LINK = "mailto:support@onlook.dev";

// Editor
export const ONLOOK_TOOLBAR = "onlook-toolbar";

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

export enum DashboardSearchParams {
  PROJECT = "project",
  TEAM = "team",
  ACTIVITY = "activity",
}

export enum MouseEvent {
  CLICK = "click",
  MOUSEMOVE = "mousemove",
}
