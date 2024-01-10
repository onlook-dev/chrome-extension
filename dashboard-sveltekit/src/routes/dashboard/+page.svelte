<script lang="ts">
	import type { UserImpl } from '$lib/models/user';
	import { projectsMapStore, userStore } from '$lib/utils/store';
	import { onMount } from 'svelte';
	import SideBarLine from '~icons/ri/side-bar-line';
	import AvatarDropdown from './AvatarDropdown.svelte';
	import ProjectsView from './ProjectsView.svelte';
	import { getProjectFromFirebase } from '$lib/storage/project';
	import { auth } from '$lib/firebase/firebase';
	import { ROUTE_SIGNIN } from '$lib/utils/constants';
	import { goto } from '$app/navigation';

	let activeItem = '';

	let user: UserImpl | null;
	const dashboardDrawerId = 'dashboard-drawer';

	function setActive(item: string) {
		activeItem = item;
	}

	onMount(() => {
		auth.onAuthStateChanged((user) => {
			if (!user) {
				goto(ROUTE_SIGNIN);
			}
		});

		userStore.subscribe((storeUser) => {
			if (!storeUser) return;
			console.log('User updated');
			user = storeUser;
			user?.projectIds?.forEach((projectId) => {
				// Populate projects
				if (!$projectsMapStore.has(projectId)) {
					getProjectFromFirebase(projectId).then((project) => {
						$projectsMapStore.set(projectId, project);
						projectsMapStore.set($projectsMapStore);
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
		<ProjectsView />
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
				<!-- TODO: Make responsive -->
				<li>
					<button
						class="font-semibold {activeItem === 'My Teams' ? 'active' : ''}"
						on:click={() => setActive('My Teams')}>My Teams</button
					>
				</li>
				<li>
					<button
						class="font-semibold {activeItem === 'My Projects' ? 'active' : ''}"
						on:click={() => setActive('My Projects')}>My Projects</button
					>
				</li>
				<li>
					<button
						class="font-semibold{activeItem === 'Shared with me' ? 'active' : ''}"
						on:click={() => setActive('Shared with me')}>Shared with me</button
					>
				</li>
			</ul>
		</ul>
	</div>
</div>
