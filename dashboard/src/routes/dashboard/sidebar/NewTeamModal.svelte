<script lang="ts">
	import { trackMixpanelEvent } from '$lib/mixpanel/client';
	import { FirebaseService } from '$lib/storage';
	import { teamsMapStore, userStore } from '$lib/utils/store';
	import { FirestoreCollections, LengthSettings } from '$shared/constants';
	import { Role, Tier, type Team } from '$shared/models';
	import { nanoid } from 'nanoid';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';

	const teamService = new FirebaseService<Team>(FirestoreCollections.TEAMS);
	let plan = Tier.FREE;
	let teamName = '';
	let nameError = false;
	let modalOpen = false;

	function createTeam() {
		if (!$userStore) return;
		nameError =
			!teamName || teamName.length === 0 || teamName.length > LengthSettings.MAX_TITLE_LENGTH;
		if (nameError) return;

		const newTeam: Team = {
			id: nanoid(),
			name: teamName,
			tier: plan,
			users: { [$userStore.id]: Role.ADMIN },
			projectIds: [],
			createdAt: new Date().toISOString()
		};

		teamName = '';
		modalOpen = false;

		teamsMapStore.update((map) => map.set(newTeam.id, newTeam));
		userStore.update((user) => {
			if (!user) return user;
			user.teamIds.push(newTeam.id);
			return user;
		});

		// Save to firebase. Firebase function will update user.
		teamService.post(newTeam);
		trackMixpanelEvent('Create Team', { teamId: newTeam.id, teamName: newTeam.name });
	}
</script>

<Dialog.Root bind:open={modalOpen}>
	<Dialog.Trigger>
		<button class="hover:text-white/80"> + Create new team </button>
	</Dialog.Trigger>
	<Dialog.Content class="dark">
		<Dialog.Header>
			<Dialog.Title>Create a new team</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col space-y-4 mt-2">
			<Input
				bind:value={teamName}
				type="text"
				placeholder="Team name"
				maxlength={LengthSettings.MAX_TITLE_LENGTH}
			/>

			{#if nameError}
				<p class="text-xs text-error">Team name is required</p>
			{/if}
			<Button class="ml-auto" type="submit" on:click={createTeam}>Create</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
