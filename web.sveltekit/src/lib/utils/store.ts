import type { UserImpl } from '$lib/models/user';
import type { User } from 'firebase/auth';
import { writable, type Writable } from 'svelte/store';

export const authUserStore = <Writable<User | null>>writable(null);
export const userStore = <Writable<UserImpl | null>>writable(null);
