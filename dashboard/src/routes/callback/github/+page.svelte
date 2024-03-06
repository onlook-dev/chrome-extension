<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import type { GithubAuth } from '$shared/models/github';
	import { userStore } from '$lib/utils/store';
	import { postUserToFirebase } from '$lib/storage/user';
	import { nanoid } from 'nanoid';
	import { postGithubAuthToFirebase } from '$lib/storage/github';
	import { get } from 'svelte/store';

	let installationId = $page.url.searchParams.get('installation_id');
	let errorMessage = 'Saving project state failed';
	let savedAuthId = '';

	enum CallbackState {
		loading,
		success,
		error
	}

	let state = CallbackState.loading;

	onMount(() => {
		state = CallbackState.loading;
	});

	// Only run this if the state is loading, othewise as the store is updated it will rerun
	$: $userStore &&
		state === CallbackState.loading &&
		(async () => {
			const user = $userStore;

			if (!user) {
				state = CallbackState.error;
				errorMessage = 'User not found';
				return;
			}

			if (!installationId) {
				state = CallbackState.error;
				errorMessage = 'Missing parameters';
				return;
			}

			// If the user has a github auth id we can update it with the new instillation id
			if (user.githubAuthId) {
				const githubAuth = {
					id: user.githubAuthId,
					installationId: installationId
				};

				await postGithubAuthToFirebase(githubAuth);

				state = CallbackState.success;

				closeWindow();
				return;
			} else {
				// Otherwise we need to create a new github auth
				const githubAuth = {
					id: nanoid(),
					installationId: installationId
				};

				user.githubAuthId = githubAuth.id;
				try {
					await postGithubAuthToFirebase(githubAuth);
					await postUserToFirebase(user);

					state = CallbackState.success;

					userStore.set(user);

					closeWindow();
				} catch (error) {
					state = CallbackState.error;
					errorMessage = error instanceof Error ? error.message : 'An error occurred';
				}
			}
		})();

	function closeWindow() {
		// Wait 1 second
		setTimeout(() => {
			window.close();
		}, 1000);
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
				<h1 class="card-title">Github authenticated!<br />You can close this tab</h1>
			{/if}
		</div>
	</div>
</div>
