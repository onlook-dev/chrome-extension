<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import type { GithubAuth } from '$shared/models/github';
	import { userStore } from '$lib/utils/store';
	import { postUserToFirebase } from '$lib/storage/user';
	import { nanoid } from 'nanoid';

	let installationId = $page.url.searchParams.get('installation_id');
	let errorMessage = 'Saving project state failed';

	enum CallbackState {
		loading,
		success,
		error
	}

	let state = CallbackState.loading;

	onMount(async () => {
		state = CallbackState.loading;
		if (!installationId) {
			state = CallbackState.error;
			errorMessage = 'Missing parameters';
			return;
		}
		userStore.subscribe((user) => {
			if (!user) {
				return;
			} else {
				if (user.github) {
					setTimeout(() => {
						window.close();
					}, 1000);
					return;
				}
				const githubAuth = {
					id: nanoid(),
					installationId: installationId
				} as GithubAuth;

				user.github = githubAuth;
				postUserToFirebase(user).finally(() => {
					state = CallbackState.success;
					userStore.set(user);
					// Wait 1 second
					setTimeout(() => {
						window.close();
					}, 1000);
				});
			}
		});
	});
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
