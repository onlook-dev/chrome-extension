<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { DashboardRoutes, FirestoreCollections } from '$shared/constants';
	import { githubConfig } from '$lib/utils/env';
	import { GithubLogo } from 'svelte-radix';
	import { FirebaseService } from '$lib/storage';
	import { timeSince } from '$shared/helpers';
	import { trackMixpanelEvent } from '$lib/mixpanel/client';
	import type { Project, Team, User } from '$shared/models';

	import PublishModal from './PublishModal.svelte';
	import GitHub from '~icons/mdi/github';
	import ConfigureTab from './ConfigureTab.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Dialog from '$lib/components/ui/dialog';

	export let project: Project;
	export let user: User;
	export let projectService: FirebaseService<Project>;
	export let githubModalOpen = false; // TODO: This might be better as a store
	export let requestEditProject: () => void;

	let publishModalOpen = false;
	let matchingProjects: Project[] = [];

	onMount(async () => {
		const projectId = $page.params.id;

		if (!projectId) {
			goto(DashboardRoutes.DASHBOARD);
		}

		if (!project.installationId) {
			// Check other projects for installation
			const teamService = new FirebaseService<Team>(FirestoreCollections.TEAMS);
			const team: Team = await teamService.get(project.teamId);
			const projectHostUrl = new URL(project.hostUrl);
			team.projectIds.forEach(async (teamProjectId) => {
				if (teamProjectId === project.id) {
					return;
				}
				try {
					const teamProject = await projectService.get(teamProjectId);
					if (!teamProject || !teamProject.hostUrl) {
						return;
					}
					const teamProjectHostUrl = new URL(teamProject.hostUrl);
					if (
						teamProjectHostUrl.hostname === projectHostUrl.hostname &&
						teamProject.installationId
					) {
						matchingProjects = [...matchingProjects, teamProject];
					}
				} catch (error) {
					console.error('Error fetching project:', error);
				}
			});
		}
	});

	function connectToGithub() {
		window.location.href = `${githubConfig.appUrl}/installations/new?state=${project?.id}`;
		trackMixpanelEvent('Connect to Github started', {
			projectId: project?.id,
			projectName: project?.name,
			url: project?.hostUrl
		});
	}

	function connectExistingProject(connectProj: Project) {
		project.installationId = connectProj.installationId;
		project.githubSettings = connectProj.githubSettings;

		// Save installation ID
		projectService.post(project);
		project = { ...project };
		githubModalOpen = false;
	}
</script>

<Dialog.Root bind:open={githubModalOpen}>
	{#if !project.githubSettings || !project.installationId}
		<Dialog.Trigger
			><Button variant="primary" class="h-8"
				><GithubLogo class="mr-2 w-4 h-4" /> Connect to Codebase</Button
			></Dialog.Trigger
		>
	{:else if project?.githubSettings && project?.installationId}
		<Dialog.Root bind:open={publishModalOpen}>
			<Dialog.Trigger>
				<Button variant="primary" class="h-8"
					><GithubLogo class="mr-2 w-4 h-4" /> Create Code Change</Button
				>
			</Dialog.Trigger>
			<Dialog.Content class="dark">
				<Dialog.Header>
					<Dialog.Title>Publish to GitHub</Dialog.Title>
				</Dialog.Header>
				<PublishModal bind:publishModalOpen {requestEditProject} {project} {user} />
			</Dialog.Content>
		</Dialog.Root>
	{/if}
	<Dialog.Content class="dark">
		<Dialog.Header>
			<Dialog.Title>Connect to GitHub</Dialog.Title>
		</Dialog.Header>
		<div>
			{#if project?.installationId}
				<ConfigureTab {project} bind:githubModalOpen />
			{:else}
				<div class="flex flex-col items-center justify-center mt-4">
					<Button on:click={connectToGithub}
						><GitHub class="h-5 w-5 mr-2" />Connect project to Github</Button
					>
					<div class="flex flex-col w-full text-sm text-primary mt-4">
						{#if matchingProjects.length}
							<Separator />
							<Collapsible.Root class="border rounded w-full p-2 text-sm">
								<Collapsible.Trigger class="hover:opacity-90 w-full text-start">
									<p class="p-4 text-center">Apply github settings from existing project</p>
								</Collapsible.Trigger>
								<Collapsible.Content class="mt-4 mb-2">
									<div class="overflow-auto">
										{#each matchingProjects as proj}
											<div class="flex flex-row items-center p-4 text hover:bg-surface">
												<Avatar.Root class="w-8 h-8 mr-2">
													<Avatar.Image src={proj.hostData?.favicon ?? ''} alt="favicon" />
													<Avatar.Fallback></Avatar.Fallback>
												</Avatar.Root>
												<div class="flex flex-col space-y-1">
													<p>
														{proj.name}
													</p>
													<p class="text-tertiary text-xs">
														Edited {timeSince(new Date(proj.updatedAt ?? proj.createdAt))} ago
													</p>
												</div>

												<Button
													class="ml-auto"
													variant="outline"
													on:click={() => connectExistingProject(proj)}
													>Apply
												</Button>
											</div>
										{/each}
									</div>
								</Collapsible.Content>
							</Collapsible.Root>
						{/if}
					</div>
					<p class="text-sm text-primary my-4">
						Need help? <a
							class="underline text-red-500 ml-1"
							href="https://meetings.hubspot.com/daniel-onlook/onboarding-to-onlook-with-daniel"
							target="_blank">Talk to a founder</a
						>
					</p>
				</div>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
