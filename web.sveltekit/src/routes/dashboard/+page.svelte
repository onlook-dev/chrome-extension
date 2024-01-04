<script lang="ts">
	import type { UserImpl } from '$lib/models/user';
	import { userStore } from '$lib/utils/store';
	import { onMount } from 'svelte';
	import SideBarLine from '~icons/ri/side-bar-line';
	import AvatarDropdown from './AvatarDropdown.svelte';
	import ProjectsView from './ProjectsView.svelte';

	let user: UserImpl | null;
	const dashboardDrawerId = 'dashboard-drawer';

	onMount(() => {
		userStore.subscribe((storeUser) => {
			user = storeUser;
		});
	});
</script>

<div class="drawer lg:drawer-open">
	<input id={dashboardDrawerId} type="checkbox" class="drawer-toggle" />
	<!-- Drawer content -->
	<div class="drawer-content px-4 py-6">
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
					<a class="active font-semibold">My Projects</a>
				</li>
				<li>
					<a class="">Shared with me</a>
				</li>
			</ul>
		</ul>
	</div>
</div>
