<!-- Router.svelte -->
<script>
	import { onMount } from 'svelte'
	import { slide } from 'svelte/transition'
	import { userBucket, popupStateBucket } from '$lib/utils/localstorage'
	import { PopupRoutes } from '$lib/utils/constants'

	import DashboardPage from './dashboard/DashboardPage.svelte'
	import AuthPage from './auth/AuthPage.svelte'
	import NewProjectPage from './new-project/NewProjectPage.svelte'
	import ProjectPage from './project/ProjectPage.svelte'

	let authenticated = false
	let route = PopupRoutes.DASHBOARD

	onMount(() => {
		// Get user from local storage
		userBucket.valueStream.subscribe(({ user }) => {
			authenticated = user ? true : false
		})

		popupStateBucket.valueStream.subscribe(({ activeRoute }) => {
			if (!activeRoute) {
				route = PopupRoutes.DASHBOARD
				return
			}
			route = activeRoute
		})
	})
</script>

<div class="h-58">
	{#if !authenticated}
		<!-- Navigate to auth if user is not set -->
		<AuthPage />
	{:else if route === PopupRoutes.NEW_PROJECT}
		<!-- Navigate to dashboard if user is set -->
		<div out:slide>
			<NewProjectPage />
		</div>
	{:else if route === PopupRoutes.PROJECT}
		<div out:slide>
			<ProjectPage />
		</div>
	{:else}
		<div out:slide>
			<DashboardPage />
		</div>
	{/if}
</div>
