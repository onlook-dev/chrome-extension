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
	import * as Resizable from '$lib/components/ui/resizable';

	import type { Team, Payment, User } from '$shared/models';
	import Button from '$lib/components/ui/button/button.svelte';

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

<svelte:head>
	<title>Onlook - Dashboard</title>
</svelte:head>

<div class="dark w-screen h-screen bg-black">
	<Resizable.PaneGroup direction="horizontal">
		<Resizable.Pane class="min-w-56" minSize={8} defaultSize={8}>
			<div class="flex flex-col w-full h-full p-0 bg-surface text-primary text-sm">
				<!-- Sidebar content -->
				<AvatarDropdown {user} />
				<!-- Project folder navigation -->
				<div class="space-y-2">
					{#if user?.teamIds}
						{#each user?.teamIds as teamId}
							<div
								class="p-2 flex h-10 items-center {activeTeamId === teamId
									? 'bg-black'
									: 'hover:bg-stone-900'}"
							>
								<button
									class="btn btn-ghost grid grid-cols-3 items-center w-full font-normal"
									on:click={() => {
										activeTeamId = teamId;
										goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
											replaceState: true
										});
									}}
								>
									<p class="{activeTeamId === teamId ? 'active ' : ''} col-span-2 text-left">
										{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
									</p>
									{#if activeTeamId === teamId}
										<div class="col-start-3 justify-self-end">
											<PlanModal {teamId} />
										</div>
									{/if}
								</button>
							</div>
						{/each}
					{/if}
					<div class="px-6 py-2">
						<NewTeamModal />
					</div>
				</div>
				<div class="mt-auto m-4">
					<Button
						variant="secondary"
						class="w-full"
						on:click={() => window.open('https://i6u7z7qkhxw.typeform.com/to/X4CeiAVd', '_blank')}
						>Give feedback</Button
					>
				</div>
			</div>
		</Resizable.Pane>
		<Resizable.Handle class="hover:bg-surface-brand bg-black" />
		<Resizable.Pane class="p-6 space-y-4" minSize={50}>
			<div class="flex flex-row w-full items-center">
				<h1 class="text-xl text-primary">
					{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
				</h1>
			</div>
			<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>
