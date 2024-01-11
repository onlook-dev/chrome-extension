<script lang="ts">
	import { onMount } from 'svelte'

	import type { User } from '$models/user'
	import ProjectsView from './ProjectsView.svelte'
	import AvatarDropdown from './AvatarDropdown.svelte'
	import SideBarLine from '~icons/ri/side-bar-line'
	import { userBucket } from '$lib/utils/localstorage'

	let stateUser: User | undefined
	let activeItem = 'My Teams'
	const dashboardDrawerId = 'dashboard-drawer'

	function setActive(item: string) {
		activeItem = item
	}

	onMount(() => {
		userBucket.valueStream.subscribe(({ user }) => {
			if (user) {
				stateUser = user
			}
		})
	})
</script>

<div class="drawer lg:drawer-open">
	<input id={dashboardDrawerId} type="checkbox" class="drawer-toggle" />
	<!-- Drawer content -->
	<div class="drawer-content px-4 py-2 overflow-auto">
		<!-- Page content here -->
		<label for={dashboardDrawerId} class="btn btn-sm p-2 drawer-button lg:hidden"
			><SideBarLine /></label
		>

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
				<AvatarDropdown user={stateUser} />
			</li>

			<!-- Project folder navigation -->
			<ul class="menu p-2 space-y-2">
				<!-- TODO: Make responsive -->
				<li>
					<button
						class={activeItem === 'My Teams' ? 'active font-semibold ' : ''}
						on:click={() => setActive('My Teams')}>My Teams</button
					>
				</li>
				<li>
					<button
						class={activeItem === 'My Projects' ? 'active font-semibold ' : ''}
						on:click={() => setActive('My Projects')}>My Projects</button
					>
				</li>
				<li>
					<button
						class=" {activeItem === 'Shared with me' ? 'active font-semibold' : ''}"
						on:click={() => setActive('Shared with me')}>Shared with me</button
					>
				</li>
			</ul>
		</ul>
	</div>
</div>
