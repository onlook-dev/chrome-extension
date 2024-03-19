<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Project } from '$shared/models/project';
	import type { User } from '$shared/models/user';
	import { DashboardRoutes } from '$shared/constants';

	import GitHub from '~icons/mdi/github';
	import ConfigureTab from './ConfigureTab.svelte';
	import PublishTab from './PublishTab.svelte';
	import { githubConfig } from '$lib/utils/env';
	import ConfigureProjectInstructions from './instructions/ConfigureProjectInstructions.svelte';
	import { projectsMapStore } from '$lib/utils/store';

	export let project: Project;
	export let user: User;

	enum Tab {
		PUBLISH = 'Publish',
		CONFIGURE = 'Configure'
	}

	const modalId = 'publish-modal';
	let selectedTab = Tab.PUBLISH;

	onMount(async () => {
		const projectId = $page.params.id;

		if (!projectId) {
			goto(DashboardRoutes.DASHBOARD);
		}

		if (!project.githubSettings) {
			selectedTab = Tab.CONFIGURE;
		}
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
	<button class="flex flex-row justify-center" on:click={showModal}>
		<GitHub class="mr-2" /> Pull Request
	</button>
	<dialog id={modalId} class="modal">
		<div class="modal-box card w-full h-[80%] flex flex-col p-6">
			<h2 class="text-xl font-semibold mb-3">Send to Github</h2>

			{#if project?.installationId}
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
						<PublishTab {project} {user} />
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
						<ConfigureTab {project} />
						<div class="collapse collapse-arrow border rounded-md mt-6">
							<input type="checkbox" />
							<div class="collapse-title">How to setup your repository</div>
							<div class="collapse-content">
								<ConfigureProjectInstructions />
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center h-full mt-4">
					<button
						class="btn btn-primary"
						on:click={() => {
							console.log('projectMapStore', $projectsMapStore.get(project?.id));
							window.location.href = `${githubConfig.appUrl}/installations/new?state=${project?.id}`;
						}}><GitHub class="h-5 w-5" />Connect project to Github</button
					>
				</div>
			{/if}
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</div>
