<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { FirebaseService } from '$lib/storage';
	import { FirestoreCollections } from '$shared/constants';
	import { TourName, type User } from '$shared/models';
	import { onMount } from 'svelte';
	import TourStep from './TourStep.svelte';

	export let pickActivity: (activityId?: string) => void;
	export let user: User;

	let userService = new FirebaseService<User>(FirestoreCollections.USERS);
	let tourVisible = false;
	let stage = 0;
	let maxStage = 4;

	onMount(() => {
		// Show if tour not completed
		if (!user.toursCompleted?.[TourName.PROJECT]) tourVisible = true;
	});

	function finishTour() {
		tourVisible = false;

		// Update the user object with the new tour status
		const updatedTours = {
			...user.toursCompleted,
			[TourName.PROJECT]: true
		};
		user = { ...user, toursCompleted: updatedTours };
		userService.post(user);
	}
</script>

<div
	class="{tourVisible ? 'visible' : 'invisible'} 
        fixed z-50 w-screen h-screen flex {stage === 0 ? 'bg-black/40' : ''}"
>
	{#if stage === 0}
		<Card.Root class="bg-blue-600 border-blue-900 w-[40rem] max-w-2/3 m-auto">
			<Card.Header class="text-xl">Welcome to your Project Page</Card.Header>
			<Card.Content class="text-base px-6 text-blue-1000">
				<div>
					This is where you can review and publish the changes you made to your site.
					<br />
					Share the link to this page with your teammates to collaborate.
				</div>
			</Card.Content>
			<Card.Footer class="flex flex-row gap-2">
				<Button
					class="ml-auto text-blue-700 rounded hover:bg-blue-400"
					variant="ghost"
					on:click={finishTour}>Skip</Button
				>
				<Button class="rounded text-blue-300" on:click={() => (stage += 1)}>Start tour</Button>
			</Card.Footer>
		</Card.Root>
	{:else if stage === 1}
		<TourStep
			bind:stage
			{maxStage}
			classes="mt-[18rem] ml-[15rem] rounded-tl-none"
			headerText="View your activities"
			callback={pickActivity}
		>
			<div>
				Each activity represents a component you changed in your site. <br /> <br /> Click on an activity
				to see details of the change.
			</div>
		</TourStep>
	{:else if stage === 2}
		<TourStep
			bind:stage
			{maxStage}
			classes="mt-[5rem] mr-[17rem] rounded-tr-none"
			headerText="Activity details"
		>
			<div>
				Here you can see what changes were made and by whom.<br /> <br />
				If your codebase is attached, you will also see where the code change should go.
			</div>
		</TourStep>
	{:else if stage === 3}
		<TourStep
			bind:stage
			{maxStage}
			classes="mt-[2rem] mr-[18rem] rounded-tr-none"
			headerText="Resume editing"
		>
			<div>
				You can resume editing the project, even if the page was closed.
				<br /> <br />
				This is also useful to see the change in context.
			</div>
		</TourStep>
	{:else if stage === 4}
		<TourStep
			bind:stage
			{maxStage}
			classes="mt-[2rem] mr-[13rem] rounded-tr-none"
			buttonText="Finish"
			headerText="Connect your codebase"
			callback={finishTour}
		>
			<div>
				Our most powerful feature, connect your codebase to see the changes in context.
				<br /> <br /> Our AI agent can even implement the change for you in a pull request.
			</div>
		</TourStep>
	{/if}
</div>
