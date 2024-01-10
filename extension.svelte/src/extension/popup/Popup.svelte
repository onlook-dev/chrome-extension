<!-- Router.svelte -->
<script>
	import { userStore, routeStore } from '$lib/onlook/popup/store'
	import AuthPage from './AuthPage.svelte'
	import ProjectsPage from './ProjectsPage.svelte'
</script>

<div class="h-58">
	{#if $userStore}
		<ProjectsPage />
	{:else}
		<!-- Navigate to auth if user is not set -->
		<AuthPage />
	{/if}
</div>
