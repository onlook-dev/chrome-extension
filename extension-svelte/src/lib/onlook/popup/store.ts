import { writable } from 'svelte/store'
import { Routes } from './routes'
import { type User } from '$models/user'

export const routeStore = writable({ route: Routes.default, data: {} })
export const userStore = writable<User | undefined>(null as any)
