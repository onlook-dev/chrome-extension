import { writable } from 'svelte/store'
import { Routes } from './routes'
import type { UserImpl } from '$lib/models/user'

export const routeStore = writable({ route: Routes.default, data: {} })
export const userStore = writable<UserImpl | undefined>(undefined)
