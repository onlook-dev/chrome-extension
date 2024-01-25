<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Project } from '$shared/models/project';
	import type { User } from '$shared/models/user';
	import { DashboardRoutes, GITHUB_APP_URL } from '$shared/constants';
	import { userStore } from '$lib/utils/store';

	import GitHub from '~icons/mdi/github';
	import ConfigureTab from './ConfigureTab.svelte';
	import PublishTab from './PublishTab.svelte';

	export let project: Project;

	enum Tab {
		PUBLISH = 'Publish',
		CONFIGURE = 'Configure'
	}

	const modalId = 'publish-modal';
	let selectedTab = Tab.PUBLISH;
	let unsubs: any[] = [];
	let user: User | undefined;

	onMount(async () => {
		const projectId = $page.params.id;

		if (!projectId) {
			goto(DashboardRoutes.DASHBOARD);
		}

		if (!project.githubSettings) {
			selectedTab = Tab.CONFIGURE;
		}

		userStore.subscribe((newUser) => {
			user = newUser;
		});
	});

	onDestroy(() => {
		unsubs.forEach((unsub: any) => unsub());
	});

	function showModal() {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (modal) {
			modal.showModal();
			modal.addEventListener(
				'click',
				(event) => {
					if (event.target === modal) {
						closeModal();
					}
				},
				{ once: true }
			);
		}
	}

	function closeModal() {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (modal) {
			modal.close();
		}
	}
</script>

<div>
	<button class="flex flex-row justify-center" on:click={showModal}
		><GitHub class="mr-2" /> Publish to Github</button
	>
	<dialog id={modalId} class="modal">
		<div class="modal-box card w-full h-[60%] flex flex-col p-6">
			<h2 class="text-xl font-semibold mb-3">Publish to Github</h2>

			{#if !user?.githubAuthId}
				<div class="flex flex-col items-center justify-center h-full mt-4">
					<button
						class="btn btn-primary"
						on:click={() => {
							window.open(`${GITHUB_APP_URL}/installations/new?state=${project?.id}`, '_blank');
						}}><GitHub class="h-5 w-5" />Connect Github Account</button
					>
				</div>
			{:else}
				<div role="tablist" class="tabs tabs-bordered">
					<input
						type="radio"
						name="my_tabs_1"
						role="tab"
						class="tab"
						value={Tab.PUBLISH}
						aria-label={Tab.PUBLISH}
						bind:group={selectedTab}
						disabled={!project?.githubSettings}
					/>
					<div role="tabpanel" class="tab-content py-4 overflow-auto">
						<PublishTab {project} userId={user.id} />
					</div>

					<input
						type="radio"
						name="my_tabs_1"
						role="tab"
						class="tab"
						value={Tab.CONFIGURE}
						aria-label={Tab.CONFIGURE}
						bind:group={selectedTab}
					/>
					<div role="tabpanel" class="tab-content py-4">
						<ConfigureTab bind:project bind:user />
					</div>
				</div>
			{/if}
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</div>
