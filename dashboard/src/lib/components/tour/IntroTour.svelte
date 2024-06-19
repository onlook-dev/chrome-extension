<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { DrawingPinFilled } from 'svelte-radix';
	import { FirebaseService } from '$lib/storage';
	import { FirestoreCollections } from '$shared/constants';
	import { TourName, type User } from '$shared/models';
	import Pin from '$lib/assets/welcome-pin.gif';

	export let createProjectModelOpen = false;
	export let user: User;

	let userService = new FirebaseService<User>(FirestoreCollections.USERS);
	let tourVisible = false;

	onMount(() => {
		// Show if tour not completed
		if (!user.toursCompleted?.[TourName.INTRO]) tourVisible = true;
	});

	function finishTour() {
		tourVisible = false;
		createProjectModelOpen = true;

		// Update the user object with the new tour status
		const updatedTours = {
			...user.toursCompleted,
			[TourName.INTRO]: true
		};
		user = { ...user, toursCompleted: updatedTours };
		userService.post(user);
	}
</script>

<div
	class="{tourVisible ? 'visible' : 'invisible'} 
        fixed inset-0 z-50 bg-black/90 flex flex-col justify-center items-center"
>
	<div class="text-primary space-y-8 text-center pb-20">
		<div>
			<h1 class="text-xl">Pin the Extension</h1>
			<h2 class="text-base text-tertiary">You will use it to design in the browser</h2>
		</div>
		<img class="h-auto max-w-md rounded-lg" src={Pin} alt="Pin extension tip" />
		<Button variant="primary" on:click={finishTour}
			><DrawingPinFilled class="h-4 w-4 mr-2" /> I pinned the extension and am ready to design</Button
		>
	</div>
</div>
