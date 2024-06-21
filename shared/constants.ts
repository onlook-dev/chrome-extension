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

// Links
export enum ExternalLinks {
  SUPPORT_LINK = "mailto:support@onlook.dev",
  FEEDBACK_LINK = "https://i6u7z7qkhxw.typeform.com/to/X4CeiAVd",
  DEMO_LINK_PORTFOLIO = "https://portfolio-nextjs-onlook.vercel.app/",
  DEMO_LINK_DASHBOARD = "https://next-demo-onlook.vercel.app/",
}

// Editor
export enum EditorAttributes {
  ONLOOK_TOOLBAR = "onlook-toolbar",
  ONLOOK_RECT_ID = "onlook-rect",
  ONLOOK_GLOBAL_STYLES = "onlook-global-styles",

  DATA_ONLOOK_ID = "data-onlook-id",
  DATA_ONLOOK_IGNORE = "data-onlook-ignore",
  DATA_ONLOOK_SAVED = "data-onlook-saved",
  DATA_ONLOOK_SNAPSHOT = "data-onlook-snapshot",
  DATA_ONLOOK_OLD_VALS = "data-onlook-old-vals",
  DATA_ONLOOK_COMPONENT_ID = "data-onlook-component-id",
}

// Dashboard routes
export enum DashboardRoutes {
  HOME = "/",
  SIGNIN = "/signin",
  SHARE = "/share",
  DASHBOARD = "/dashboard",
  PROJECTS = "/dashboard/projects",
  PRIVACY = "/privacy",
  GITHUB = "/github",
  WELCOME = "/welcome",
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
