<script>
	import { Button } from '$lib/components/ui/button';
	import { DashboardRoutes } from '$shared/constants';
	import { signInWithGoogle } from '$lib/firebase/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userStore } from '$lib/utils/store';

	import * as Card from '$lib/components/ui/card';
	import Google from '~icons/devicon/google';
	import Spinner from '$lib/components/ui/spinner';
	import BackgroundImage from '$lib/assets/signin-bg.png';
	import LogoText from '$lib/assets/logo-text.png';

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
	class="flex flex-col items-center justify-center min-h-screen"
	style="background-image: url({BackgroundImage}); background-size: cover; background-position: center;"
>
	<Card.Root
		class="w-2/3 h-2/3 max-w-[24rem] max-h-[20rem] rounded-lg p-2 bg-transparent/90 shadow"
	>
		<Card.Header class="text-light gap-4">
			<img src={LogoText} alt="Onlook Logo" class="object-contain h-3" />
			<h2 class="text-tertiary text-center text-sm">
				Sign in to design on any site for free –<br /> No credit card required
			</h2>
		</Card.Header>

		<Card.Content class="space-y-4">
			<Button
				class="border w-full space-x-2 h-10 font-normal bg-surface text-state-default rounded-none"
				variant="outline"
				on:click={() => {
					loading = true;
					signInWithGoogle();
				}}
			>
				{#if loading}
					<Spinner />
					<span> Signing in... </span>
				{:else}
					<Google class="w-4 h-4" />
					<span>Sign in with Google</span>
				{/if}</Button
			>
		</Card.Content>
		<Card.Footer>
			<p class="text-xs font-light text-tertiary">
				<span class="">By clicking on Sign-In, you agree to Onlook’s</span>
				<!-- TODO: Add terms of service -->
				<a class="text-stone-300/80" href={DashboardRoutes.PRIVACY} target="_blank"
					>Terms of Service
				</a>
				<span class="text-tertiary">and</span>
				<a class="text-stone-300/80" href={DashboardRoutes.PRIVACY} target="_blank"
					>Privacy Policy</a
				>.
			</p>
		</Card.Footer>
	</Card.Root>
</div>
