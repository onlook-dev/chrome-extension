// Firestore collections
export enum FirestoreCollections {
  PROJECTS = "projects",
  USERS = "users",
  TEAMS = "teams",
  PAYMENTS = "payments",
  GITHUB = "github",
  GITHUB_HISTORY = "github_history",
  CODE_CHANGE = "code_change",
}

// Settings
export const MAX_TITLE_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 250;

// Messaging
export enum MessageTypes {
  DASHBOARD_AUTH = "DASHBOARD_AUTH",
  EDIT_EVENT = "EDIT_EVENT",
  OPEN_PROJECT = "OPEN_PROJECT",
  EDIT_PROJECT = "EDIT_PROJECT",
}

// Links
export const SUPPORT_LINK = "mailto:support@onlook.dev";

// Editor
export const ONLOOK_TOOLBAR = "onlook-toolbar";
export const DATA_ONLOOK_ID = "data-onlook-id";

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
