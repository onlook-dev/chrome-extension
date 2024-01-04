import type { UserImpl } from '$lib/models/user';
import { writable, type Writable } from 'svelte/store';

export const userStore = <Writable<UserImpl | null>>writable(null);
