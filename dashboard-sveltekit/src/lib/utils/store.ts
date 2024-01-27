import type { Project } from '$shared/models/project';
import type { User } from '$shared/models/user';
import type { Team } from '$shared/models/team';
import type { Payment } from '$shared/models/payment';
import { writable, type Writable } from 'svelte/store';
import type { GithubHistory } from '$shared/models/github';

export const userStore = <Writable<User | undefined>>writable(undefined);
export const usersMapStore = <Writable<Map<string, User>>>writable(new Map());
export const teamsMapStore = <Writable<Map<string, Team>>>writable(new Map());
export const projectsMapStore = <Writable<Map<string, Project>>>writable(new Map());
export const githubHistoryMapStore = <Writable<Map<string, GithubHistory[]>>>writable(new Map());
export const paymentsMapStore = <Writable<Map<string, Payment>>>writable(new Map());
