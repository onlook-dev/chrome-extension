<!-- Router.svelte -->
<script>
	import { onMount } from 'svelte'
	import { userBucket, popupStateBucket } from '$lib/utils/localstorage'
	import { PopupRoutes } from '$lib/utils/constants'

	import DashboardPage from './dashboard/DashboardPage.svelte'
	import AuthPage from './auth/AuthPage.svelte'
	import NewProjectPage from './new-project/NewProjectPage.svelte'

	let authenticated = false
	let route = PopupRoutes.AUTH

	onMount(() => {
		// Get user from local storage
		userBucket.valueStream.subscribe(({ user }) => {
			authenticated = user ? true : false
		})

		popupStateBucket.valueStream.subscribe(({ route: stateRoute }) => {
			if (!stateRoute) {
				route = PopupRoutes.DASHBOARD
				return
			}
			route = stateRoute
		})
	})
</script>

<div class="h-58">
	{#if !authenticated}
		<!-- Navigate to auth if user is not set -->
		<AuthPage />
	{:else if route === PopupRoutes.NEW_PROJECT}
		<!-- Navigate to dashboard if user is set -->
		<NewProjectPage />
	{:else}
		<DashboardPage />
	{/if}
</div>
