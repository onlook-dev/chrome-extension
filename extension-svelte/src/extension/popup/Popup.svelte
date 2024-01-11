<!-- Router.svelte -->
<script>
	import { onMount } from 'svelte'
	import AuthPage from './auth/AuthPage.svelte'
	import { authUserBucket } from '$lib/utils/localstorage'
	import DashboardPage from './dashboard/DashboardPage.svelte'

	let authenticated = false
	onMount(() => {
		// Get user from local storage
		authUserBucket.get().then(user => {
			authenticated = user ? true : false
		})
	})
</script>

<div class="h-58">
	{#if !authenticated}
		<!-- Navigate to auth if user is not set -->
		<AuthPage />
	{:else}
		<DashboardPage />
	{/if}
</div>
