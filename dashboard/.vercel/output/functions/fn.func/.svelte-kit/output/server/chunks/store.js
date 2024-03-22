import { w as writable } from "./index.js";
const userStore = writable(void 0);
const usersMapStore = writable(/* @__PURE__ */ new Map());
const teamsMapStore = writable(/* @__PURE__ */ new Map());
const projectsMapStore = writable(/* @__PURE__ */ new Map());
const paymentsMapStore = writable(/* @__PURE__ */ new Map());
export {
  paymentsMapStore as a,
  usersMapStore as b,
  projectsMapStore as p,
  teamsMapStore as t,
  userStore as u
};
