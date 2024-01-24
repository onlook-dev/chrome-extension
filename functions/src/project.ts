import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import {
  FIREBASE_COLLECTION_PROJECTS,
  FIREBASE_COLLECTION_TEAMS,
} from "../../shared/constants";
import type {Project} from "../../shared/models/project";

export const createProject = functions.firestore
  .document(`${FIREBASE_COLLECTION_PROJECTS}/{projectId}`)
  .onCreate(async (snapshot, context) => {
    const projectData = snapshot.data() as Project;
    const teamRef = admin
      .firestore()
      .collection(FIREBASE_COLLECTION_TEAMS)
      .doc(projectData.teamId);

    await teamRef.update({
      projectIds: admin.firestore.FieldValue.arrayUnion(
        context.params.projectId
      ),
    });
  });

export const deleteProject = functions.firestore
  .document(`${FIREBASE_COLLECTION_PROJECTS}/{projectId}`)
  .onDelete(async (snapshot, context) => {
    const projectData = snapshot.data() as Project;

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
