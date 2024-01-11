import { writable } from 'svelte/store'
import { Routes } from './routes'

export const routeStore = writable({ route: Routes.default, data: {} })
