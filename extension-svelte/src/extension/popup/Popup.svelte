<!-- Router.svelte -->
<script>
	import { userStore } from '$lib/popup/store'
	import { onMount } from 'svelte'
	import AuthPage from './AuthPage.svelte'
	import ProjectsPage from './ProjectsPage.svelte'

	onMount(() => {
		// Get user from local storage
		const user = localStorage.getItem('user')
		if (user) {
			userStore.set(JSON.parse(user))
		}
	})
</script>

<div class="h-58">
	{#if $userStore}
		<ProjectsPage />
	{:else}
		<!-- Navigate to auth if user is not set -->
		<AuthPage />
	{/if}
</div>
