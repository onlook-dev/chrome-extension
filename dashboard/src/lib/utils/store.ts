import { writable, type Writable } from 'svelte/store';
import type { Project, User, Team, Payment, GithubHistory } from '$shared/models';


export const userStore = <Writable<User | undefined>>writable(undefined);
export const usersMapStore = <Writable<Map<string, User>>>writable(new Map());
export const teamsMapStore = <Writable<Map<string, Team>>>writable(new Map());
export const projectsMapStore = <Writable<Map<string, Project>>>writable(new Map());
export const githubHistoryMapStore = <Writable<Map<string, GithubHistory[]>>>writable(new Map());
export const paymentsMapStore = <Writable<Map<string, Payment>>>writable(new Map());
