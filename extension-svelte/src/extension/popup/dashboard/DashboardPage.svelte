<script lang="ts">
	import { onMount } from 'svelte'
	import type { User } from '$models/user'
	import type { Team } from '$models/team'

	import { userBucket, teamsMapBucket } from '$lib/utils/localstorage'
	import ProjectsView from './ProjectsView.svelte'
	import AvatarDropdown from './AvatarDropdown.svelte'
	import SideBarLine from '~icons/ri/side-bar-line'

	const dashboardDrawerId = 'dashboard-drawer'
	let stateUser: User | undefined
	let activeTeamId = ''
	let teamsMap = new Map<string, Team>()

	function setActive(item: string) {
		activeItem = item
	}

	onMount(() => {
		userBucket.valueStream.subscribe(({ user }) => {
			if (user) {
				stateUser = user
				activeTeamId = stateUser?.teams[0] ?? ''
			}
		})

		teamsMapBucket.valueStream.subscribe(map => {
			teamsMap = map
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
		<h1 class="text-2xl font-bold mb-4">{teamsMap[activeTeamId]?.name ?? 'Unknown team'}</h1>
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
				{#if stateUser?.teams}
					{#each stateUser?.teams as teamId}
						<li>
							<button
								class={activeTeamId === teamId ? 'active font-semibold ' : ''}
								on:click={() => (activeTeamId = teamId)}
								>{teamsMap[teamId]?.name ?? 'Unknown team'}</button
							>
						</li>
					{/each}
				{/if}
			</ul>
		</ul>
	</div>
</div>
