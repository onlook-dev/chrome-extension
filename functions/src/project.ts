import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import {
  FirestoreCollections.PROJECTS,
  FirestoreCollections.TEAMS,
} from "../../shared/constants";
import type { Project } from "../../shared/models/project";

export const createProject = functions.firestore
  .document(`${FirestoreCollections.PROJECTS}/{projectId}`)
  .onCreate(async (snapshot, context) => {
    const projectData = snapshot.data() as Project;
    const teamRef = admin
      .firestore()
      .collection(FirestoreCollections.TEAMS)
      .doc(projectData.teamId);

    await teamRef.update({
      projectIds: admin.firestore.FieldValue.arrayUnion(
        context.params.projectId
      ),
    });
  });

export const deleteProject = functions.firestore
  .document(`${FirestoreCollections.PROJECTS}/{projectId}`)
  .onDelete(async (snapshot, context) => {
    const projectData = snapshot.data() as Project;

    // Delete project from team
    const teamRef = admin
      .firestore()
      .collection(FirestoreCollections.TEAMS)
      .doc(projectData.teamId);

    await teamRef.update({
      projectIds: admin.firestore.FieldValue.arrayRemove(
        context.params.projectId
      ),
    });
  });
