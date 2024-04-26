<script lang="ts">
	import { onMount } from 'svelte'
	import { PopupRoutes } from '$lib/utils/constants'
	import { userBucket, teamsMapBucket, popupStateBucket } from '$lib/utils/localstorage'

	import ProjectsView from './ProjectsView.svelte'
	import AvatarDropdown from './AvatarDropdown.svelte'
	import SideBarLine from '~icons/ri/side-bar-line'

	import type { User, Team } from '$shared/models'

	const dashboardDrawerId = 'dashboard-drawer'
	let user: User | undefined
	let activeTeamId = ''
	let teamsMap = new Map<string, Team>()

	onMount(() => {
		userBucket.valueStream.subscribe(({ user: bucketUser }) => {
			if (bucketUser) {
				user = bucketUser
				// Set active team to first team if not set
				popupStateBucket.get().then(({ activeTeamId: bucketActiveTeamId }) => {
					setActiveTeam(bucketActiveTeamId ?? bucketUser.teamIds[0] ?? '')
				})
			}
		})

		teamsMapBucket.valueStream.subscribe(map => {
			teamsMap = new Map(Object.entries(map))
		})
	})

	function setActiveTeam(teamId: string) {
		activeTeamId = teamId
		popupStateBucket.set({ activeTeamId: teamId })
	}
</script>

<div class="drawer lg:drawer-open">
	<input id={dashboardDrawerId} type="checkbox" class="drawer-toggle" />
	<!-- Drawer content -->
	<div class="drawer-content px-2 overflow-auto bg-base-200">
		<!-- Page content here -->

		<div class="navbar p-none">
			<div class="flex-none">
				<label for={dashboardDrawerId} class="btn btn-square btn-ghost">
					<SideBarLine />
				</label>
			</div>
			<div class="flex-1">
				<p class="font-semibold text-sm">{teamsMap.get(activeTeamId)?.name ?? 'Unknown team'}</p>
			</div>

			<div class="flex-none">
				<button
					on:click={() => {
						popupStateBucket.set({ activeRoute: PopupRoutes.NEW_PROJECT })
					}}
					class="btn btn-sm btn-outline">+ New Project</button
				>
			</div>
		</div>
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
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class={activeTeamId === teamId ? 'active font-semibold ' : ''}
								on:click={() => setActiveTeam(teamId)}
								>{teamsMap.get(teamId)?.name ?? 'Unknown team'}</button
							>
						</li>
					{/each}
				{/if}
			</ul>
		</ul>
	</div>
</div>
