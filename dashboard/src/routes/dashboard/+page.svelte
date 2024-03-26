<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase';
	import { DashboardRoutes, DashboardSearchParams, FirestoreCollections } from '$shared/constants';
	import { paymentsMapStore, teamsMapStore, userStore } from '$lib/utils/store';
	import { FirebaseService } from '$lib/storage';

	import AvatarDropdown from './AvatarDropdown.svelte';
	import ProjectsView from './ProjectsView.svelte';
	import SideBarLine from '~icons/ri/side-bar-line';
	import NewTeamModal from './NewTeamModal.svelte';
	import PlanModal from './PlanModal.svelte';

	import type { Team } from '$shared/models/team';
	import type { Payment } from '$shared/models/payment';
	import type { User } from '$shared/models/user';

	const teamService = new FirebaseService<Team>(FirestoreCollections.TEAMS);
	const paymentService = new FirebaseService<Payment>(FirestoreCollections.PAYMENTS);
	const dashboardDrawerId = 'dashboard-drawer';
	let user: User | null;
	let activeTeamId: string = '';
	let unsubs: any[] = [];

	onMount(async () => {
		// Get active team from params
		activeTeamId = $page.url.searchParams.get(DashboardSearchParams.TEAM) ?? '';

		auth.onAuthStateChanged((user) => {
			if (!user) {
				goto(DashboardRoutes.SIGNIN);
			}
		});

		userStore.subscribe((storeUser) => {
			if (!storeUser) return;
			user = storeUser;
			if (activeTeamId === '' && user?.teamIds.length > 0) {
				activeTeamId = user?.teamIds[0];
			}

			// Unsubscribe from previous teams
			unsubs.forEach((unsub: any) => unsub());

			user?.teamIds.forEach((teamId) => {
				teamService
					.subscribe(teamId, (firebaseTeam) => {
						teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
						if (firebaseTeam.paymentId) {
							paymentService.subscribe(firebaseTeam.paymentId, (payment) => {
								paymentsMapStore.update((map) => map.set(payment.id, payment));
							});
						}
					})
					.then((unsubscribe) => {
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
	<div class="drawer-content px-4 py-6 overflow-auto h-screen bg-gray-200">
		<!-- Page content here -->
		<div class="flex flex-row gap-2 mb-4 items-center">
			<label for={dashboardDrawerId} class="btn btn-square btn-ghost drawer-button lg:hidden"
				><SideBarLine /></label
			>
			<div class="flex flex-row w-full items-center">
				<h1 class="text-2xl text-black font-medium">
					{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
				</h1>
			</div>
		</div>

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
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="grid grid-cols-3 items-center w-full"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="font-semibold {activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="col-start-3 justify-self-end">
										<PlanModal {teamId} />
									</div>
								{/if}
							</button>
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
