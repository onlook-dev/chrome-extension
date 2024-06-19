<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { DrawingPinFilled } from 'svelte-radix';
	import { onMount } from 'svelte';
	import { FirebaseService } from '$lib/storage';
	import { FirestoreCollections } from '$shared/constants';
	import type { User } from '$shared/models';
	import Pin from '$lib/assets/welcome-pin.gif';

	export let createProjectModelOpen = false;
	export let user: User;
	let tourVisible = false;
	let userService = new FirebaseService<User>(FirestoreCollections.USERS);

	onMount(() => {
		if (user?.tourCompleted) return;
		tourVisible = true;
	});

	function finishTour() {
		tourVisible = false;
		createProjectModelOpen = true;

		// Update user tour status
		user = { ...user, tourCompleted: true };
		userService.post(user);
	}
</script>

<div
	class="{tourVisible ? 'visible' : 'invisible'} 
        fixed inset-0 z-50 bg-black/90 flex flex-col justify-center items-center"
>
	<div class="text-primary space-y-8 text-center">
		<h1 class="text-xl">Pin the extension</h1>
		<img class="h-auto max-w-md rounded-lg" src={Pin} alt="Pin extension tip" />
		<Button variant="primary" on:click={finishTour}
			><DrawingPinFilled class="h-4 w-4 mr-2" /> I pinned the extension and am ready to design</Button
		>
	</div>
</div>
