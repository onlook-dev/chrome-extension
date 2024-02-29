<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] text-red-600 text-6xl">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a] bg-red-800">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
	<input id={dashboardDrawerId} type="checkbox" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]" />
	<!-- Drawer content -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
		<!-- Page content here -->
		<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
			<label for={dashboardDrawerId} class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]"></label>
		<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen bg-[#8a230a]">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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

<div class="text-2xl font-bold text-54px text-red-500">
	<input id={dashboardDrawerId} type="checkbox" class="text-2xl font-bold text-54px text-red-500" />
	<!-- Drawer content -->
	<div class="text-2xl font-bold text-54px text-red-500">
		<!-- Page content here -->
		<div class="text-2xl font-bold text-54px text-red-500">
			<label for={dashboardDrawerId} class="text-2xl font-bold text-54px text-red-500"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="text-2xl font-bold text-54px text-red-500">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
		</div>

		<ProjectsView team={$teamsMapStore.get(activeTeamId)} />
	</div>

	<!-- Drawer Sidebar -->
	<div class="text-2xl font-bold text-54px text-red-500">
		<label for={dashboardDrawerId} aria-label="close sidebar" class="text-2xl font-bold text-54px text-red-500"></label>
		<ul class="text-2xl font-bold text-54px text-red-500">
			<!-- Sidebar content -->
			<li>
				<AvatarDropdown {user} />
			</li>

			<!-- Project folder navigation -->
			<ul class="text-2xl font-bold text-54px text-red-500">
				<!-- TODO: Make responsive with teamsMapStore-->
				{#if user?.teamIds}
					{#each user?.teamIds as teamId}
						<li>
							<button
								class="text-2xl font-bold text-54px text-red-500"
								on:click={() => {
									activeTeamId = teamId;
									goto(`${DashboardRoutes.DASHBOARD}?${DashboardSearchParams.TEAM}=` + teamId, {
										replaceState: true
									});
								}}
							>
								<p
									class="{activeTeamId === teamId
										? 'active font-extrabold'
										: ''} col-span-2 text-left"
								>
									{$teamsMapStore.get(teamId)?.name ?? 'Unknown team'}
								</p>
								{#if activeTeamId === teamId}
									<div class="text-2xl font-bold text-54px text-red-500">
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

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { auth } from '$lib/firebase/firebase';
	import { DashboardRoutes, DashboardSearchParams } from '$shared/constants';
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
				subscribeToTeam(teamId, (firebaseTeam) => {
					teamsMapStore.update((map) => map.set(teamId, firebaseTeam));
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
	<div class="bg-[#e6e6e6] drawer-content px-4 py-6 overflow-auto h-screen">
		<!-- Page content here -->
		<div class="flex flex-row gap-2 mb-4 items-center">
			<label for={dashboardDrawerId} class="btn btn-square btn-ghost drawer-button lg:hidden"
				><SideBarLine /></label
			>

			<!-- TODO: Change based on folder -->
			<h1 class="text-2xl font-bold">
				{$teamsMapStore.get(activeTeamId)?.name ?? 'Unknown team'}
			</h1>
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
									class="{activeTeamId === teamId
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
