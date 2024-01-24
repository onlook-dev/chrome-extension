import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as nanoid from "nanoid";

import {
  FIREBASE_COLLECTION_USERS,
  FIREBASE_COLLECTION_TEAMS,
} from "../../shared/constants";
import { Team, Role } from "../../shared/models/team";
import type { User } from "../../shared/models/user";

export const createUser = functions.auth.user().onCreate(async (user) => {
  const defaultTeam = {
    id: nanoid.nanoid(),
    name: `${user.displayName}'s Team`,
    tier: "Free",
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

export const deleteUser = functions.auth.user().onDelete(async (user) => {
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
