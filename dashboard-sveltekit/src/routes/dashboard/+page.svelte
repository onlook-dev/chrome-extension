<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { auth } from '$lib/firebase/firebase';
	import type { User } from '$models/user';
	import { teamsMapStore, userStore } from '$lib/utils/store';
	import { ROUTE_SIGNIN } from '$lib/utils/constants';

	import AvatarDropdown from './AvatarDropdown.svelte';
	import ProjectsView from './ProjectsView.svelte';
	import SideBarLine from '~icons/ri/side-bar-line';
	import { getTeamFromFirebase } from '$lib/storage/team';

	let user: User | null;
	let activeTeamId = '';
	const dashboardDrawerId = 'dashboard-drawer';

	onMount(async () => {
		auth.onAuthStateChanged((user) => {
			if (!user) {
				goto(ROUTE_SIGNIN);
			}
		});

		userStore.subscribe((storeUser) => {
			if (!storeUser) return;
			user = storeUser;
			activeTeamId = user?.teams[0] ?? '';
			user?.teams.forEach((team) => {
				if (!$teamsMapStore.has(team)) {
					getTeamFromFirebase(team).then((firebaseTeam) => {
						teamsMapStore.update((map) => map.set(team, firebaseTeam));
					});
				}
			});
		});
	});
</script>

<div class="drawer lg:drawer-open">
	<input id={dashboardDrawerId} type="checkbox" class="drawer-toggle" />
	<!-- Drawer content -->
	<div class="drawer-content px-4 py-6 overflow-auto">
		<!-- Page content here -->
		<label for={dashboardDrawerId} class="btn drawer-button lg:hidden"><SideBarLine /></label>

		<!-- TODO: Change based on folder -->
		<h1 class="text-2xl font-bold mb-4">My Projects</h1>
		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="drawer-side shadow">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="w-64 min-h-full bg-base-100 space-y-2 p-2">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="menu p-2 space-y-2">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teams}
					{#each user?.teams as team}
						<li>
							<button
								class={activeTeamId === team ? 'active font-semibold ' : ''}
								on:click={() => (activeTeamId = team)}
								>{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}</button
							>
						</li>
					{/each}
				{/if}
			</ul>
		</ul>
	</div>
</div>
