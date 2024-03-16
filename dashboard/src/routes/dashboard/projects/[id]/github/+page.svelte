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
	import ConfigureProjectInstructions from './ConfigureProjectInstructions.svelte';
	import { userStore } from '$lib/utils/store';
	import { getProjectFromFirebase } from '$lib/storage/project';
	import { Steps } from 'svelte-steps';
	import CodeChanges from './CodeChanges.svelte';
	import type { FileContentData } from '$shared/models/translation';

	let project: Project | undefined;
	let user: User | undefined;
	let changesMap = new Map<string, FileContentData>();

	let steps = [
		{ text: 'Connect Github' },
		{ text: 'Configure Project' },
		{ text: 'Review Changes' },
		{ text: 'Publish to Code' }
	];

	let currentStep = 0;

	onMount(async () => {
		const projectId = $page.params.id;
		if (!projectId) {
			goto(DashboardRoutes.DASHBOARD);
		}

		project = await getProjectFromFirebase(projectId);
		user = $userStore;

		if (!project) {
			goto(DashboardRoutes.DASHBOARD);
		}

		if (project.installationId) {
			currentStep = 1;
		}

		Object.values(project.activities).forEach((activity) => {
			if (activity.path) {
				currentStep = 2;
				return;
			}
		});
	});
</script>

<div class="flex flex-col w-screen h-screen p-8">
	<h2 class="text-xl font-semibold mb-3">Send to Github</h2>
	<div class="flex flex-grow overflow-auto">
		{#if project && user}
			{#if currentStep === 0}
				<div class="flex items-center justify-center h-full w-full">
					{#if !project.installationId}
						<button
							class="btn btn-primary"
							on:click={() => {
								window.location.href = `${githubConfig.appUrl}/installations/new?state=${project?.id}`;
							}}><GitHub class="h-5 w-5" />Connect project to Github</button
						>
					{:else}
						<ConfigureTab {project} />
					{/if}
				</div>
			{:else if currentStep === 1}
				<ConfigureProjectInstructions />
			{:else if currentStep === 2}
				<CodeChanges projectId={project.id} userId={user.id} bind:changesMap />
			{:else if currentStep === 3}
				<PublishTab {project} userId={user.id} {changesMap} />
			{/if}
		{/if}
	</div>
	<div class="mt-auto text-sm py-8">
		<Steps {steps} bind:current={currentStep} size="2em" line="2px" />
	</div>

	<!-- {#if project && user}
		{#if project.installationId}
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
						window.location.href = `${githubConfig.appUrl}/installations/new?state=${project?.id}`;
					}}><GitHub class="h-5 w-5" />Connect project to Github</button
				>
			</div>
		{/if}
	{/if} -->
</div>
