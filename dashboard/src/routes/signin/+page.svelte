<script>
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import BackgroundImage from '$lib/assets/signin-bg.png';
	import { DashboardRoutes } from '$shared/constants';
	import { signInWithGoogle } from '$lib/firebase/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userStore } from '$lib/utils/store';
	import Google from '~icons/devicon/google';

	let loading = false;

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
	style="background-image: url({BackgroundImage}); background-size: cover; background-position: center;"
>
	<Card.Root class="w-2/3 max-w-[26rem] rounded-none px-4">
		<Card.Header class="text-light">
			<h1 class="text-2xl">Onlook</h1>
			<h2 class="text-xl text-tertiary">Where Creativity meets Code</h2>
		</Card.Header>

		<Card.Content class="space-y-4">
			<Button
				class="w-full space-x-2 h-10 font-normal bg-surface text-state-default rounded-none border-none"
				variant="outline"
				on:click={() => {
					loading = true;
					signInWithGoogle();
				}}
			>
				{#if loading}
					<div class="loading"></div>
					<span> Signing in... </span>
				{:else}
					<Google class="w-4 h-4" />
					<span>Sign in with Google</span>
				{/if}</Button
			>
			<p class="text-sm text-red">
				If you have a GitHub email associated with your Gmail, be sure to sign in with it. If not,
				no worries.
			</p>
		</Card.Content>
		<Card.Footer>
			<p class="text-sm font-light">
				<span class="text-tertiary">By clicking on Sign-In, you agree to Onlook’s</span>
				<!-- TODO: Add terms of service -->
				<a href={DashboardRoutes.PRIVACY} target="_blank">Terms of Service </a>
				<span class="text-tertiary">and</span>
				<a href={DashboardRoutes.PRIVACY} target="_blank">Privacy Policy</a>.
			</p>
		</Card.Footer>
	</Card.Root>
</div>
