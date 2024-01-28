<script>
	import { LINK_DISCORD, DashboardRoutes } from '$shared/constants';
	import { signInWithGoogle, signInWithGithub } from '$lib/firebase/auth';
	import Google from '~icons/devicon/google';
	import GitHub from '~icons/mdi/github';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userStore } from '$lib/utils/store';

	onMount(() => {
		userStore.subscribe((user) => {
			if (user) {
				goto(DashboardRoutes.DASHBOARD);
			}
		});
	});
</script>

<div
	class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-sky-200 via-indigo-200 to-pink-200"
>
	<div class="card border w-96 bg-base-100 shadow-xl">
		<div class="card-body space-y-4">
			<!-- Black round -->
			<div class="flex flex-row items-center">
				<div class="bg-black rounded-full h-4 w-4"></div>
				<p class="ml-2">Onlook</p>
			</div>
			<h2 class="card-title justify-center">Sign in</h2>

			<div class="form-control space-y-4">
				<button class="btn btn-outline" on:click={signInWithGoogle}>
					<Google class="w-4 h-4" />
					Continue with Google</button
				>
				<button class="btn btn-outline" on:click={signInWithGithub}>
					<GitHub class="w-4 h-4" />
					Continue with GitHub</button
				>
			</div>
		</div>
	</div>
	<div class="flex justify-between p-4 space-x-4">
		<a href={LINK_DISCORD} target="_blank" class="link link-hover text-sm">Support</a>
		<a href={DashboardRoutes.PRIVACY} target="_blank" class="link link-hover text-sm">Privacy</a>
	</div>
</div>
