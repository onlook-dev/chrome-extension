<script>
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import BackgroundImage from '$lib/assets/signin-bg.png';
	import { DashboardRoutes } from '$shared/constants';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
</script>

<div
	class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-sky-200 via-indigo-200 to-pink-200"
	style="background-image: url({BackgroundImage}); background-size: cover; background-position: center;"
>
	<div class="flex flex-col w-2/3 items-center">
		<h1 class="text-[20px] mb-4 text-white text-start w-full">Let's push some pixels</h1>
		<div class="flex flex-row w-full">
			<Card.Root class="border-none w-1/2 h-1/2 rounded-none px-4">
				<Card.Header class="pb-6">
					<h1 class="text-tertiary">Step 1</h1>
					<h2 class="text-primary">Pin Onlook in your browser</h2>
				</Card.Header>
				<Card.Content class="space-y-4">
					<div class="w-full h-40 bg-stone-800"></div>
				</Card.Content>
				<Card.Footer class="flex flex-col text-tertiary w-full items-start">
					<p>1. Click extensions in the upper right corner</p>
					<p>2. Pin Onlook</p>
				</Card.Footer>
			</Card.Root>
			<Card.Root class="border-none w-1/2 h-1/2 rounded-none px-4">
				<Card.Header class="pb-6">
					<h1 class="text-tertiary">Step 2</h1>
					<h2 class="text-primary">Start editing any page</h2>
				</Card.Header>
				<Card.Content class="space-y-4">
					<div class="w-full h-40 bg-stone-800"></div>
				</Card.Content>
				<Card.Footer class="flex flex-col text-tertiary w-full items-start">
					<p>1. Go to any page you want to design</p>
					<p>2. Click the extension and start designing</p>
				</Card.Footer>
			</Card.Root>
		</div>

		<Card.Root class="border-none w-full h-1/2 rounded-none px-4">
			<Card.Header class="pb-6">
				<h1 class="text-2xl">Onlook</h1>
				<h2 class="text-xl text-tertiary">Where Creativity meets Code</h2>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="w-full h-12 bg-stone-800"></div>
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
</div>
