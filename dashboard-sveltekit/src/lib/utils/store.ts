import type { Project } from '$shared/models/project';
import type { User } from '$shared/models/user';
import type { Team } from '$shared/models/team';
import { writable, type Writable } from 'svelte/store';

export const userStore = <Writable<User | null>>writable(null);
export const usersMapStore = <Writable<Map<string, User>>>writable(new Map());
export const teamsMapStore = <Writable<Map<string, Team>>>writable(new Map());
export const projectsMapStore = <Writable<Map<string, Project>>>writable(new Map());
