import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as nanoid from "nanoid";

import {FirestoreCollections} from "../../shared/constants";
import {Team, Role} from "../../shared/models/team";
import {addProjectsToTeam, duplicateProject} from "../utils/helpers";
import type {User} from "../../shared/models/user";

const isProd = admin.instanceId().app.options.projectId === "onlook-prod";

const DEV_PORTFOLIO_DEMO = "R9P9ESZDSJEotGheG7Tmg";
const DEV_DASHBOARD_DEMO = "fSbhXa18h1eTp4l_H29P3";

const PROD_PORTFOLIO_DEMO = "G6f9dpFk-4gpCnHpRUZSi";
const PROD_DASHBOARD_DEMO = "UT4qBdpFQtqzTzMRQEE20";

const DEMO_PORTFOLIO = isProd ? PROD_PORTFOLIO_DEMO : DEV_PORTFOLIO_DEMO;
const DEMO_DASHBOARD = isProd ? PROD_DASHBOARD_DEMO : DEV_DASHBOARD_DEMO;

const demos = [DEMO_PORTFOLIO, DEMO_DASHBOARD];

export const createUser = functions.auth.user().onCreate(async (user) => {
  const demoProjects: string[] = [];
  const defaultTeam = {
    id: nanoid.nanoid(),
    name: `${user.displayName}'s Team`,
    tier: "Free",
    users: {
      [user.uid]: Role.ADMIN,
    },
    projectIds: [],
    createdAt: new Date().toISOString(),
  } as Team;

  // Duplicate demo projects
  demos.forEach(async (demoId) => {
    // Create new project id
    const newProjectId = nanoid.nanoid();

    // Duplicate project
    const demoProject = await duplicateProject(
      demoId,
      newProjectId,
      defaultTeam.id
    );

    // Write to database
    if (demoProject) {
      await admin
        .firestore()
        .collection(FirestoreCollections.PROJECTS)
        .doc(demoProject.id)
        .set(demoProject);
      demoProjects.push(demoProject.id);
    }
  });

  // Create default team
  await admin
    .firestore()
    .collection(FirestoreCollections.TEAMS)
    .doc(defaultTeam.id)
    .set(defaultTeam);

  // Create user
  await admin
    .firestore()
    .collection(FirestoreCollections.USERS)
    .doc(user.uid)
    .set({
      id: user.uid,
      name: user.displayName,
      email: user.email,
      profileImage: user.photoURL,
      teamIds: [defaultTeam.id],
    });

  await addProjectsToTeam(defaultTeam.id, demoProjects);
});

export const deleteUser = functions.auth.user().onDelete(async (user) => {
  const userRef = admin
    .firestore()
    .collection(FirestoreCollections.USERS)
    .doc(user.uid);
  const userData: User = (await userRef.get()).data() as User;

  if (userData) {
    const teamIds: string[] = userData.teamIds;
    teamIds.forEach(async (teamId) => {
      const teamRef = admin
        .firestore()
        .collection(FirestoreCollections.TEAMS)
        .doc(teamId);
      const teamData = (await teamRef.get()).data();

      if (!teamData) return;

      // Delete team if user is the only member
      if (teamData && teamData.users[user.uid] &&
        Object.keys(teamData.users).length === 1
      ) {
        await teamRef.delete();
      } else {
        // Remove user from team
        delete teamData.users[user.uid];
        await teamRef.update(teamData);
      }
    });
  }

  await userRef.delete();
});
