<script>
	import { sendAuthRequest } from '$lib/onlook/messaging'
	let loggingIn = false
</script>

<main class="flex flex-col h-screen py-2">
	<div class="justify-center items-center h-96 flex flex-col text-center space-y-1">
		<div class="bg-black rounded-full w-8 h-8" />
		<h1 class="text-sm font-semibold">Get started with Onlook</h1>
	</div>

	<button
		class="btn btn-outline"
		on:click={() => {
			loggingIn = true
			sendAuthRequest()
		}}
	>
		{#if loggingIn}
			<span class="loading loading-spinner"></span>
		{/if}
		Sign in
	</button>
</main>
