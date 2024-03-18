<script lang="ts">
	import { Tier } from '$shared/models/team';
	import { teamsMapStore, userStore } from '$lib/utils/store';
	import { Role, type Team } from '$shared/models/team';
	import { nanoid } from 'nanoid';
	import { FirestoreCollections, MAX_TITLE_LENGTH } from '$shared/constants';
	import { FirebaseService } from '$lib/storage';

	const modalId = 'new-team-modal';
	const teamService = new FirebaseService<Team>(FirestoreCollections.TEAMS);
	let plan = Tier.FREE;
	let teamName = '';
	let nameError = false;

	function createTeam() {
		if (!$userStore) return;
		nameError = !teamName || teamName.length === 0 || teamName.length > MAX_TITLE_LENGTH;
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
		closeModal();

		teamsMapStore.update((map) => map.set(newTeam.id, newTeam));
		userStore.update((user) => {
			if (!user) return user;
			user.teamIds.push(newTeam.id);
			return user;
		});

		// Save to firebase. Firebase function will update user.
		teamService.post(newTeam);
	}

	function showModal() {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (modal) {
			modal.showModal();
			modal.addEventListener(
				'click',
				(event) => {
					if (event.target === modal) {
						closeModal();
					}
				},
				{ once: true }
			);
		}
	}

	function closeModal() {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (modal) {
			modal.close();
		}
	}
</script>

<button on:click={showModal}> + Create new team </button>

<dialog id={modalId} class="modal fixed inset-0 flex items-center justify-center">
	<div class="modal-box space-y-2">
		<h3 class="font-bold text-lg mb-4">Create a new team</h3>

		<div class="flex flex-col space-y-4">
			<div class="space-y-2">
				<span class="label-text">Team name</span>
				<input
					bind:value={teamName}
					type="text"
					placeholder="Team name"
					class="input input-bordered w-full {nameError && 'input-error'}"
					maxlength={MAX_TITLE_LENGTH}
				/>

				{#if nameError}
					<p class="text-xs text-error">Team name is required</p>
				{/if}
			</div>

			<div class="modal-action">
				<form method="dialog">
					<!-- if there is a button in form, it will close the modal -->
					<button class="btn" on:click={closeModal}>Cancel</button>
					<button class="btn btn-primary" on:click|preventDefault={createTeam}>Create</button>
				</form>
			</div>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style>
	#new-team-modal {
		transition: none !important;
		animation: none !important;
	}
</style>
