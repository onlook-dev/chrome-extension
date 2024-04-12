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
		<h1 class="text-2xl text-white text-start w-full mb-4">Let's push some pixels</h1>
		<div class="flex flex-row w-full">
			<Card.Root class="w-1/2 h-1/2 rounded-none px-4">
				<Card.Header class="text-light">
					<h1 class="">Onlook</h1>
					<h2 class="text-tertiary" style="margin-top: 0px; color: white;">Pin Onlook in your browser</h2>
				</Card.Header>
				<Card.Content class="space-y-4">
					<div class="w-full h-12 bg-stone-100"></div>
				</Card.Content>
				<Card.Footer class="flex flex-col">
					<p style="width: 100%; color: var(--text-tertiary);">Click extensions in the upper right corner</p>
					<p style="width: 100%; color: var(--text-tertiary);">Pin Onlook</p>
				</Card.Footer>
			</Card.Root>
			<Card.Root class="w-1/2 h-1/2 rounded-none px-4">
				<Card.Header class="text-light">
					<h1 class="" style="color: var(--text-tertiary);">Step 2</h1>
					<h2 class="text-tertiary" style="margin-top: 0px; color: white;">Start editing any page</h2>
				</Card.Header>
				<Card.Content class="space-y-4">
					<div class="w-full h-12 bg-stone-100" style="background-color: #222; height: 150px;"></div>
				</Card.Content>
				<Card.Footer class="flex flex-col">
					<p style="width: 100%; color: var(--text-tertiary);">Go to any page you want to edit</p>
					<p style="width: 100%; color: var(--text-tertiary);">2. Click the extension and start editing</p>
				</Card.Footer>
			</Card.Root>
		</div>

		<Card.Root class="w-full h-1/2 rounded-none px-4">
			<Card.Header class="text-light">
				<h1 class="text-2xl">Onlook</h1>
				<h2 class="text-xl text-tertiary">Where Creativity meets Code</h2>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="w-full h-12 bg-stone-100"></div>
			</Card.Content>
			<Card.Footer>
				<p class="text-sm font-light">
					<span class="text-tertiary">By clicking on Sign-In, you agree to Onlookâs</span>
					<!-- TODO: Add terms of service -->
					<a href={DashboardRoutes.PRIVACY} target="_blank">Terms of Service </a>
					<span class="text-tertiary">and</span>
					<a href={DashboardRoutes.PRIVACY} target="_blank">Privacy Policy</a>.
				</p>
			</Card.Footer>
		</Card.Root>
	</div>
</div>
