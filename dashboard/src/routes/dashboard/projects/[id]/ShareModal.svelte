<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import { teamsMapStore, usersMapStore } from '$lib/utils/store';
	import { onMount } from 'svelte';
	import { FirebaseService } from '$lib/storage';
	import { FirestoreCollections } from '$shared/constants';
	import type { Team } from '$shared/models/team';
	import type { User } from '$shared/models/user';
	import CopyIcon from '~icons/mdi/content-copy';
	import Share from '~icons/solar/share-outline';
	import { trackMixpanelEvent } from '$lib/mixpanel/client';

	export let teamId: string;
	const userService = new FirebaseService<User>(FirestoreCollections.USERS);
	const teamService = new FirebaseService<Team>(FirestoreCollections.TEAMS);
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
			const firebaseTeam = await teamService.get(teamId);
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
			const firebaseUser = await userService.get(userId);
			if (firebaseUser) {
				user = firebaseUser;
				usersMapStore.update((map) => map.set(userId, firebaseUser));
			}
		}
		return user;
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

<div>
	<button class="flex flex-row justify-center" on:click={showModal}>
		<Share class="h-4 w-4 mr-2" /> Share project
	</button>

	<dialog id={modalId} class="modal">
		<div class="modal-box w-2/3 min-w-96">
			<h2 class="font-bold text-lg">Share project</h2>

			<div class="flex flex-row space-x-2">
				<button
					class="modal-action btn btn-outline mb-2"
					on:click={async () => {
						try {
							await navigator.clipboard.writeText(window.location.href);
							closeModal();
							toast.push('Link copied to clipboard');
							trackMixpanelEvent('Copy Project Link', { teamId });
						} catch (err) {
							toast.push('Failed to copy text: ' + err);
						}
					}}
				>
					<span>Copy link to share project</span><CopyIcon class="w-5 h-5" />
				</button>
			</div>

			<label for="access-input" class="label cursor-pointer">
				<span class="label-text">Anyone with the link can access this project</span>
			</label>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</div>

<style>
	#share-modal {
		transition: none !important;
		animation: none !important;
	}
</style>
