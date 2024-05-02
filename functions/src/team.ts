import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { FirestoreCollections } from "../../shared/constants";
import { Team } from "../../shared/models/team";

export const createTeam = functions.firestore
  .document(`${FirestoreCollections.TEAMS}/{teamId}`)
  .onCreate(async (snapshot, context) => {
    const teamData = snapshot.data() as Team;

    // Add team id to each user
    const userIds: string[] = Object.keys(teamData.users);
    userIds.forEach((userId) => {
      const userRef = admin
        .firestore()
        .collection(FirestoreCollections.USERS)
        .doc(userId);

      userRef.update({
        teamIds: admin.firestore.FieldValue.arrayUnion(context.params.teamId),
      });
    });
  });

export const deleteTeam = functions.firestore
  .document(`${FirestoreCollections.TEAMS}/{teamId}`)
  .onDelete(async (snapshot, context) => {
    const teamData = snapshot.data() as Team;

    // Delete team from each user
    const userIds: string[] = Object.keys(teamData.users);
    userIds.forEach((userId) => {
      const userRef = admin
        .firestore()
        .collection(FirestoreCollections.USERS)
        .doc(userId);

      userRef.update({
        teamIds: admin.firestore.FieldValue.arrayRemove(context.params.teamId),
      });
    });
  });

export const addUserToTeam = functions.https.onCall(async (data) => {
  const { userId, teamId, role } = data;

  // Update team with user id and role
  const teamRef = admin
    .firestore()
    .collection(FirestoreCollections.TEAMS)
    .doc(teamId);
  const teamUpdate = {
    [`users.${userId}`]: role,
  };

  teamUpdate[`users.${userId}`] = role;
  await teamRef.update(teamUpdate);

  // Update user with team id
  const userRef = admin
    .firestore()
    .collection(FirestoreCollections.USERS)
    .doc(userId);
  await userRef.update({
    teamIds: admin.firestore.FieldValue.arrayUnion(teamId),
  });
});
