// The Firebase Admin SDK to access Firestore.
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as nanoid from "nanoid";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

import {
  FIREBASE_COLLECTION_PROJECTS,
  FIREBASE_COLLECTION_USERS,
  FIREBASE_COLLECTION_TEAMS,
} from "../../shared/constants";
import { Team, Role } from "../../shared/models/team";
import type { Project } from "../../shared/models/project";
import type { User } from "../../shared/models/user";

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const createUser = functions.auth.user().onCreate(async (user) => {
  const defaultTeam = {
    id: nanoid.nanoid(),
    name: `${user.displayName}'s Team`,
    users: {
      [user.uid]: Role.ADMIN,
    },
    projectIds: [],
  } as Team;

  // Create default team
  await admin
    .firestore()
    .collection(FIREBASE_COLLECTION_TEAMS)
    .doc(defaultTeam.id)
    .set(defaultTeam);

  // Create user
  await admin
    .firestore()
    .collection(FIREBASE_COLLECTION_USERS)
    .doc(user.uid)
    .set({
      id: user.uid,
      name: user.displayName,
      email: user.email,
      profileImage: user.photoURL,
      teams: [defaultTeam.id],
    });
});

export const deleteUser = functions.auth.user().onDelete(async (user: any) => {
  const userRef = admin
    .firestore()
    .collection(FIREBASE_COLLECTION_USERS)
    .doc(user.uid);
  const userData: User = (await userRef.get()).data() as User;

  if (userData) {
    const teams: string[] = userData.teams;
    teams.forEach(async (teamId) => {
      const teamRef = admin
        .firestore()
        .collection(FIREBASE_COLLECTION_TEAMS)
        .doc(teamId);
      const teamData = (await teamRef.get()).data();

      if (!teamData) return;

      if (teamData && Object.keys(teamData.users).length === 1) {
        // Delete team if user is the only member
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

export const createProject = onDocumentCreated(
  `${FIREBASE_COLLECTION_PROJECTS}/{projectId}`,
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with the event");
      return;
    }
    const projectData = snapshot.data() as Project;

    await admin
      .firestore()
      .collection(FIREBASE_COLLECTION_TEAMS)
      .doc(projectData.teamId)
      .update({
        projectIds: admin.firestore.FieldValue.arrayUnion(projectData.id),
      });
  }
);

export const deleteProject = functions.firestore
  .document(`${FIREBASE_COLLECTION_PROJECTS}/{projectId}`)
  .onDelete(async (snapshot: any, context: any) => {
    const projectData = snapshot.data();

    // Delete project from team
    const teamRef = admin
      .firestore()
      .collection(FIREBASE_COLLECTION_TEAMS)
      .doc(projectData.teamId);

    await teamRef.update({
      projectIds: admin.firestore.FieldValue.arrayRemove(
        context.params.projectId
      ),
    });
  });

export const addUserToTeam = functions.https.onCall(
  async (data: any, context: any) => {
    const { userId, teamId, role } = data;

    // Update team with user id and role
    const teamRef = admin
      .firestore()
      .collection(FIREBASE_COLLECTION_TEAMS)
      .doc(teamId);
    const teamUpdate = {
      [`users.${userId}`]: role,
    };

    teamUpdate[`users.${userId}`] = role;
    await teamRef.update(teamUpdate);

    // Update user with team id
    const userRef = admin
      .firestore()
      .collection(FIREBASE_COLLECTION_USERS)
      .doc(userId);
    await userRef.update({
      teams: admin.firestore.FieldValue.arrayUnion(teamId),
    });
  }
);
