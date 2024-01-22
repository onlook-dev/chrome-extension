<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import { teamsMapStore, usersMapStore } from '$lib/utils/store';
	import { onMount } from 'svelte';
	import type { Team } from '$shared/models/team';
	import { getTeamFromFirebase } from '$lib/storage/team';
	import type { User } from '$shared/models/user';
	import { getUserFromFirebase } from '$lib/storage/user';

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
</script>

<button
	class="btn btn-outline"
	on:click={() => {
		// @ts-ignore - showModal() does not exist on HTMLElement
		document?.getElementById(modalId)?.showModal();
	}}>Share</button
>
<dialog id={modalId} class="modal">
	<div class="modal-box relative space-y-2">
		<h3 class="font-bold text-lg mb-4">Share project</h3>

		<div class="flex flex-row space-x-2">
			<input type="text" placeholder="Email, comma separated" class="input input-bordered w-full" />
			<button class="btn btn-primary">Invite</button>
		</div>

		<label for="access-input" class="label cursor-pointer">
			<span class="label-text"
				>Everyone at
				<b>{team?.name ?? 'this team'}</b>
				can access this file</span
			>
		</label>
		<div class="divider"></div>

		<!-- Users with access -->
		<div class="flex flex-col items-center">
			<!-- TODO: Use team's access -->
			{#each users as { userId, role, userName, profileImageUrl }, i}
				<div class="flex flex-row items-center pb-4 w-full">
					<div class="avatar">
						<div class="skeleton w-6 mask mask-circle">
							<img src={profileImageUrl} alt="Avatar of {userName}" />
						</div>
					</div>
					<div class="px-2">{userName}</div>
					<div class="ml-auto">
						<button class="text-xs p-2 hover:shadow-sm hover:bg-gray-50 rounded">
							{role.toLocaleLowerCase()}
						</button>
					</div>
				</div>
			{/each}
		</div>
		<button
			class="modal-action btn btn-outline"
			on:click={() => toast.push('Link copied to clipboard')}
		>
			Copy link
		</button>
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
