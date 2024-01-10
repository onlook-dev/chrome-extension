<script>
	import { sendAuthRequest } from '$lib/utils/messaging'
	import { onMount } from 'svelte'
	let loggingIn = false

	onMount(() => {
		signInWithDashboard()
	})

	function signInWithDashboard() {
		loggingIn = true
		sendAuthRequest()
	}
</script>

<main class="flex flex-col h-screen p-2 space-y-4">
	<div class="flex flex-row items-start">
		<div class="bg-black rounded-full h-4 w-4"></div>
		<p class="ml-2">Onlook</p>
	</div>
	<div class="card-body text-center justify-center items-center space-y-4">
		<!-- Black round -->
		<h2 class="card-title justify-center">Welcome to onlook.dev</h2>

		<div class="form-control space-y-4">
			<button
				class="btn btn-md btn-outline w-52"
				on:click={() => {
					signInWithDashboard()
				}}
			>
				{#if loggingIn}
					<span class="loading loading-spinner"></span>
					Signing in
				{:else}
					Sign in
				{/if}
			</button>
		</div>
	</div>
</main>
