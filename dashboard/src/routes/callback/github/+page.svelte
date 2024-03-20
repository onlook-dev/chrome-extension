<script lang="ts">
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import type { Project } from '$shared/models/project';
	import { baseUrl } from '$lib/utils/env';
	import { FirebaseService } from '$lib/storage';
	import { FirestoreCollections } from '$shared/constants';

	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);
	let installationId = $page.url.searchParams.get('installation_id') as string;
	let projectId = $page.url.searchParams.get('state') as string;
	let errorMessage = 'Saving project state failed';
	let project: Project;
	let unsubscribe = () => {};

	enum CallbackState {
		loading,
		success,
		error
	}

	let state = CallbackState.loading;

	onMount(async () => {
		if (!installationId) {
			state = CallbackState.error;
			errorMessage = 'Invalid installation id';
			return;
		}

		if (!projectId) {
			state = CallbackState.error;
			errorMessage = 'Invalid project id';
			return;
		}

		project = await projectService.get(projectId);
		project.installationId = installationId;

		await projectService.post(project);
		openProject();
	});

	onDestroy(() => {
		unsubscribe();
	});

	function openProject() {
		const dashboardUrl = `${baseUrl}/dashboard/projects/${projectId}`;
		window.location.href = dashboardUrl;
	}
</script>

<div
	class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-sky-200 via-indigo-200 to-pink-200"
>
	<div class="card border w-96 bg-base-100 shadow-xl">
		<div class="card-body space-y-4">
			{#if state === CallbackState.loading}
				<div class="flex flex-row gap-4">
					<span class="loading loading-spinner loading-lg"></span>
					<h1 class="card-title">Authenticating with Github</h1>
				</div>
			{:else if state === CallbackState.error}
				<h1 class="card-title">Error: {errorMessage}</h1>
			{:else}
				<h1 class="card-title">Github authenticated!<br /></h1>
			{/if}
		</div>
	</div>
</div>
