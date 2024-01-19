<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes } from '$shared/constants';
	import { paymentsMapStore, teamsMapStore, userStore } from '$lib/utils/store';
	import { subscribeToTeam } from '$lib/storage/team';
	import type { User } from '$shared/models/user';

	import AvatarDropdown from './AvatarDropdown.svelte';
	import ProjectsView from './ProjectsView.svelte';
	import SideBarLine from '~icons/ri/side-bar-line';
	import NewTeamModal from './NewTeamModal.svelte';
	import PlanModal from './PlanModal.svelte';
	import { subscribeToPayment } from '$lib/storage/payment';

	const dashboardDrawerId = 'dashboard-drawer';
	let user: User | null;
	let activeTeamId = '';
	let unsubs: any[] = [];

	onMount(async () => {
		auth.onAuthStateChanged((user) => {
			if (!user) {
				goto(DashboardRoutes.SIGNIN);
			}
		});

		userStore.subscribe((storeUser) => {
			if (!storeUser) return;
			user = storeUser;
			activeTeamId = user?.teams[0] ?? '';

			// Unsubscribe from previous teams
			unsubs.forEach((unsub: any) => unsub());

			user?.teams.forEach((team) => {
				subscribeToTeam(team, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(team, firebaseTeam));
					if (firebaseTeam.paymentId) {
						subscribeToPayment(firebaseTeam.paymentId, (payment) => {
							paymentsMapStore.update((map) => map.set(payment.id, payment));
						});
					}
				}).then((unsubscribe) => {
					unsubs.push(unsubscribe);
				});
			});
		});
	});

	onDestroy(() => {
		unsubs.forEach((unsub: any) => unsub());
	});
</script>

<div class="drawer lg:drawer-open">
	<input id={dashboardDrawerId} type="checkbox" class="drawer-toggle" />
	<!-- Drawer content -->
	<div class="bg-base-200 drawer-content px-4 py-6 overflow-auto h-screen">
		<!-- Page content here -->
		<label for={dashboardDrawerId} class="btn drawer-button lg:hidden"><SideBarLine /></label>

		<!-- TODO: Change based on folder -->
		<h1 class="text-2xl font-bold mb-4">
			{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
		</h1>
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
					{#each user?.teams as teamId}
						<li>
							<div class="grid grid-cols-3 items-center w-full">
								<button
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
									on:click={() => (activeTeamId = teamId)}
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</button>
								{#if activeTeamId === teamId}
									<div class="col-start-3 justify-self-end">
										<PlanModal {teamId} />
									</div>
								{/if}
							</div>
						</li>
					{/each}
				{/if}
				<li>
					<NewTeamModal />
				</li>
			</ul>
		</ul>
	</div>
</div>
