var FirestoreCollections = /* @__PURE__ */ ((FirestoreCollections2) => {
  FirestoreCollections2["PROJECTS"] = "projects";
  FirestoreCollections2["USERS"] = "users";
  FirestoreCollections2["TEAMS"] = "teams";
  FirestoreCollections2["PAYMENTS"] = "payments";
  FirestoreCollections2["GITHUB"] = "github";
  FirestoreCollections2["GITHUB_HISTORY"] = "github_history";
  FirestoreCollections2["CODE_CHANGE"] = "code_change";
  return FirestoreCollections2;
})(FirestoreCollections || {});
const MAX_TITLE_LENGTH = 50;
const SUPPORT_LINK = "mailto:support@onlook.dev";
var DashboardRoutes = /* @__PURE__ */ ((DashboardRoutes2) => {
  DashboardRoutes2["HOME"] = "/";
  DashboardRoutes2["SIGNIN"] = "/signin";
  DashboardRoutes2["SHARE"] = "/share";
  DashboardRoutes2["DASHBOARD"] = "/dashboard";
  DashboardRoutes2["PROJECTS"] = "/dashboard/projects";
  DashboardRoutes2["PRIVACY"] = "/privacy";
  DashboardRoutes2["GITHUB"] = "/github";
  return DashboardRoutes2;
})(DashboardRoutes || {});
export {
  DashboardRoutes as D,
  FirestoreCollections as F,
  MAX_TITLE_LENGTH as M,
  SUPPORT_LINK as S
};
