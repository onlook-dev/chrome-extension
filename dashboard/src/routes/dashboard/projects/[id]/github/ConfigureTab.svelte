<script lang="ts">
	import { projectsMapStore } from '$lib/utils/store';
	import { getRepoDefaults, getReposByInstallation } from '$lib/github/repos';
	import { onMount } from 'svelte';
	import { githubConfig } from '$lib/utils/env';
	import { FirebaseService } from '$lib/storage';
	import { FirestoreCollections } from '$shared/constants';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	import GitHub from '~icons/mdi/github';
	import Info from '~icons/akar-icons/info';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';

	import type { Project } from '$shared/models/project';
	import type { GithubRepo, GithubSettings } from '$shared/models/github';

	export let project: Project;

	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);
	let repositories: GithubRepo[] = [];
	let loadingRepos = false;
	let filteredRepositories: GithubRepo[] = [];
	let filterTerm = '';
	let selectedRepo: GithubRepo | undefined;
	let saved = false;

	onMount(async () => {
		if (project?.githubSettings) {
			selectedRepo = {
				name: project.githubSettings.repositoryName,
				owner: project.githubSettings.owner
			};
		}
	});

	$: if (filterTerm !== '') {
		filteredRepositories = repositories.filter(
			(repo) => repo.name.includes(filterTerm) && repo.name !== selectedRepo?.name
		);
	} else {
		filteredRepositories = repositories.filter((repo) => repo.name !== selectedRepo?.name);
	}

	$: if (project.installationId) {
		loadingRepos = true;
		getReposByInstallation(project.installationId)
			.then(({ repos }) => {
				repositories = repos;
				filteredRepositories = repos;
				loadingRepos = false;
			})
			.catch((error) => {
				console.error('Error fetching repositories:', error);
			});
	}

	async function connectRepoToProject(repo: GithubRepo) {
		if (!project.installationId) console.error('No installation id found');

		const defaultBranch = await getRepoDefaults(project.installationId as string, repo);
		project.githubSettings = {
			repositoryName: repo.name,
			owner: repo.owner,
			rootPath: '',
			baseBranch: defaultBranch ?? 'main'
		} as GithubSettings;

		selectedRepo = repo;
		updateProject(project);
	}

	async function disconnectRepoFromProject() {
		project.githubSettings = undefined;
		selectedRepo = undefined;
		updateProject(project);
	}

	async function updateProject(project: Project) {
		saved = true;

		// Prevent footgun of having a leading or trailing slash
		if (project?.githubSettings?.rootPath) {
			let pathValue = project?.githubSettings?.rootPath;
			pathValue = pathValue.replace(/^\/+|\/+$/g, '');

			project.githubSettings.rootPath = pathValue;
		}

		saved = false;
		await projectService.post(project);

		projectsMapStore.update((projectsMap) => {
			projectsMap.set(project.id, project);
			return projectsMap;
		});
		project = { ...project };
	}
</script>

<div class="space-y-3">
	{#if selectedRepo}
		<div class="border rounded-lg flex flex-col justify-between p-4 space-y-4 mt-6">
			<div class="flex flex-row align-middle">
				<GitHub class="h-9 w-9 mr-2" />
				<div>
					<p class="text-sm">{selectedRepo.name}</p>
					<p class="text-xs text-white/60">{selectedRepo.owner}</p>
				</div>
			</div>

			<div class="flex flex-row items-center">
				<div class="w-56 flex flex-row items-center">
					<Label for="base-branch">Base branch</Label>
					<div
						class="tooltip tooltip-bottom tooltip-info before:w-[10rem] before:content-[attr(data-tip)]"
						data-tip="Branch your changes will be pushed to. Default is your base branch"
					>
						<button class="label mx-2">
							<Info class="h-4 w-4 text-gray-500" />
						</button>
					</div>
				</div>

				<Input
					id="base-branch"
					type="text"
					placeholder="main"
					value={project?.githubSettings?.baseBranch}
					on:input={(e) => {
						if (!project?.githubSettings) return;
						// @ts-ignore - This value exists
						project.githubSettings.baseBranch = e.target.value;
						saved = false;
					}}
				/>
			</div>

			<div class="flex flex-row items-center">
				<div class="w-56 flex flex-row items-center">
					<Label for="root-dir">Root directory</Label>
					<div
						class="tooltip tooltip-bottom tooltip-info before:w-[10rem] before:content-[attr(data-tip)]"
						data-tip="Folder that contains your src file. If it's at root you can leave this empty"
					>
						<button class="label ml-2">
							<Info class="h-4 w-4 text-gray-500" />
						</button>
					</div>
				</div>

				<Input
					id="root-dir"
					type="text"
					placeholder=""
					value={project?.githubSettings?.rootPath}
					on:input={(e) => {
						if (!project?.githubSettings) return;
						// @ts-ignore - This value exists
						project.githubSettings.rootPath = e.target.value;
						saved = false;
					}}
				/>
			</div>
			<div class="ml-auto mt-4 space-x-2">
				<Button variant="outline" disabled={saved} on:click={() => updateProject(project)} class=""
					>{saved ? 'Saved!' : 'Save'}</Button
				>
				<Button variant="destructive" on:click={() => disconnectRepoFromProject()} class=""
					>Disconnect</Button
				>
			</div>
		</div>
	{:else}
		<div class="flex flex-row gap-3">
			<input
				bind:value={filterTerm}
				class="input input-bordered w-full"
				type="text"
				placeholder="Search for repository"
			/>
		</div>
		<div class="border py-2 divide-y rounded-lg max-h-80 overflow-auto">
			{#if loadingRepos}
				<div class="w-full text-center">
					<div class="loading h-10"></div>
				</div>
			{:else if filteredRepositories.length === 0}
				<div class="flex items-center justify-center h-full">
					<p class="text-gray-500">No repositories found</p>
				</div>
			{/if}

			{#each filteredRepositories as repo}
				<div class="flex flex-row justify-between items-center p-4">
					<div>
						<p class="text-sm">{repo.name}</p>
						<p class="text-xs text-gray-600">{repo.owner}</p>
					</div>
					<button on:click={() => connectRepoToProject(repo)} class="btn btn-outline btn-sm"
						>Connect</button
					>
				</div>
			{/each}
		</div>
	{/if}
	<Button
		variant="link"
		on:click={() => {
			window.location.href = `${githubConfig.appUrl}/installations/new?state=${project?.id}`;
		}}>Update Github Permissions</Button
	>

	<Collapsible.Root class="border rounded w-full p-2 text-sm">
		<Collapsible.Trigger class="hover:opacity-90 w-full text-start"
			>How to setup my repository?</Collapsible.Trigger
		>
		<Collapsible.Content class="mt-4 mb-2">
			<a
				href="https://onlook.dev/blog/installing-onlook"
				class="underline hover:opacity-80"
				target="_blank">Read the docs to learn more</a
			>
		</Collapsible.Content>
	</Collapsible.Root>
</div>
