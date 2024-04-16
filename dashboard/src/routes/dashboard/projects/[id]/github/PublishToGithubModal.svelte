<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { DashboardRoutes } from '$shared/constants';
	import { githubConfig } from '$lib/utils/env';
	import { GithubLogo } from 'svelte-radix';

	import GitHub from '~icons/mdi/github';
	import ConfigureTab from './ConfigureTab.svelte';
	import PublishTab from './PublishTab.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	import type { Project } from '$shared/models/project';
	import type { User } from '$shared/models/user';

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
	<Button on:click={showModal} variant="primary" class="h-8"
		><GithubLogo class="mr-2 w-4 h-4" /> Publish to GitHub</Button
	>
	<dialog id={modalId} class="modal">
		<Card.Root class="text-primary modal-box w-full h-[80%] flex flex-col">
			<Card.Header><h1 class="text-xl font-light">Publish to Github</h1></Card.Header>
			<Card.Content>
				{#if project?.installationId}
					<Tabs.Root value={selectedTab} class="w-full">
						<Tabs.List class="grid w-full grid-cols-2">
							<Tabs.Trigger value={Tab.PUBLISH} disabled={!project?.githubSettings}
								>Publish</Tabs.Trigger
							>
							<Tabs.Trigger value={Tab.CONFIGURE}>Configure</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value={Tab.CONFIGURE}>
							<ConfigureTab {project} />
						</Tabs.Content>
						<Tabs.Content value={Tab.PUBLISH}>
							<PublishTab {project} {user} />
						</Tabs.Content>
					</Tabs.Root>
				{:else}
					<div class="flex flex-col items-center justify-center h-[20rem] mt-4">
						<button
							class="btn"
							on:click={() => {
								window.location.href = `${githubConfig.appUrl}/installations/new?state=${project?.id}`;
							}}><GitHub class="h-5 w-5" />Connect project to Github</button
						>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</div>
