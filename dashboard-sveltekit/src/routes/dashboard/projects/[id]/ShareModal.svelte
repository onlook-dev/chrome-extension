<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import { teamsMapStore, usersMapStore } from '$lib/utils/store';
	import { onMount } from 'svelte';
	import type { Team } from '$shared/models/team';
	import { getTeamFromFirebase } from '$lib/storage/team';
	import type { User } from '$shared/models/user';
	import { getUserFromFirebase } from '$lib/storage/user';
	import CopyIcon from '~icons/mdi/content-copy';

	export let teamId: string;

	const modalId = 'share-modal';
	let team: Team | undefined;
	let users: DiplayUser[] = [];

	interface DiplayUser {
		userId: string;
		role: string;
		userName: string;
		profileImageUrl: string | undefined;
	}

	onMount(async () => {
		team = $teamsMapStore.get(teamId);
		// If not in map, get from firebase
		if (!team) {
			const firebaseTeam = await getTeamFromFirebase(teamId);
			if (firebaseTeam) {
				team = firebaseTeam;
				teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
			}
		}
		Object.entries(team?.users ?? {}).forEach(async ([userId, role]) => {
			const user = await getUser(userId);
			if (user) {
				users = [
					...users,
					{
						userId,
						role: role,
						userName: user.name,
						profileImageUrl: user.profileImage
					}
				];
			}
		});
	});

	async function getUser(userId: string): Promise<User | undefined> {
		let user = $usersMapStore.get(userId);
		if (!user) {
			const firebaseUser = await getUserFromFirebase(userId);
			if (firebaseUser) {
				user = firebaseUser;
				usersMapStore.update((map) => map.set(userId, firebaseUser));
			}
		}
		return user;
	}

	function closeModal() {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (modal) {
			modal.close();
		}
	}
</script>

<button
	class="btn btn-outline"
	on:click={() => {
		// @ts-ignore - showModal() does not exist on HTMLElement
		document?.getElementById(modalId)?.showModal();
	}}>Share</button
>
<dialog id={modalId} class="modal">
	<div class="modal-box w-4/12">
		<h3 class="font-bold text-lg">Share project</h3>

		<div class="flex flex-row space-x-2">
			<button
				class="modal-action btn btn-outline mb-2"
				on:click={async () => {
					try {
						await navigator.clipboard.writeText(window.location.href);
						closeModal();
						toast.push('Link copied to clipboard');
					} catch (err) {
						toast.push('Failed to copy text: ' + err);
					}
				}}
			>
				<span>copy link to share project</span><CopyIcon class="w-5 h-5" />
			</button>
		</div>

		<label for="access-input" class="label cursor-pointer">
			<span class="label-text">Anyone with the link can access this file</span>
		</label>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style>
	#share-modal {
		transition: none !important;
		animation: none !important;
	}
</style>
