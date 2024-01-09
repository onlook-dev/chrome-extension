import type { ProjectImpl } from '$lib/models/project';
import type { UserImpl } from '$lib/models/user';
import { writable, type Writable } from 'svelte/store';

export const userStore = <Writable<UserImpl | null>>writable(null);
export const projectsMapStore = <Writable<Map<string, ProjectImpl>>>writable(new Map());
