import * as admin from "firebase-admin";

import {FirestoreCollections} from "../../shared/constants";
import {Project, ProjectStatus, Team} from "../../shared/models";

export async function duplicateProject(
  projectId: string,
  newProjectId: string,
  teamId: string
): Promise<Project | undefined> {
  const originalProject = await admin
    .firestore()
    .collection(FirestoreCollections.PROJECTS)
    .doc(projectId)
    .get();

  if (!originalProject.exists) {
    console.error("Original project not found");
    return undefined;
  }

  const originalProjectData = originalProject.data();

  return {
    ...originalProjectData,
    id: newProjectId,
    teamId: teamId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: ProjectStatus.PUBLISHED,
  } as Project;
}

export async function addProjectsToTeam(
  teamId: string,
  projectIds: string[]
): Promise<Team | undefined> {
  const team = admin
    .firestore()
    .collection(FirestoreCollections.TEAMS)
    .doc(teamId)
    .get();

  if (!team) {
    console.error("Team not found");
    return;
  }

  const teamData = (await team).data() as Team;

  if (!teamData) {
    console.error("Team data not found");
    return;
  }

  const currentProjects = teamData.projectIds;

  // Filter out projects already in the team
  const newProjects = projectIds.filter(
    (projectId) => !currentProjects.includes(projectId)
  );

  if (newProjects.length === 0) {
    console.error("No new projects");
    return;
  }

  await admin
    .firestore()
    .collection(FirestoreCollections.TEAMS)
    .doc(teamId)
    .update({
      projectIds: [...currentProjects, ...newProjects],
    });

  return {
    ...teamData,
    projectIds: [...currentProjects, ...newProjects],
  } as Team;
}
