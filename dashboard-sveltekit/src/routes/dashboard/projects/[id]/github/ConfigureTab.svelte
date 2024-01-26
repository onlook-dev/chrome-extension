<script lang="ts">
	import GitHub from '~icons/mdi/github';
	import type { Project } from '$shared/models/project';
	import type { User } from '$shared/models/user';
	import type { GithubRepo, GithubSettings } from '$shared/models/github';
	import { postProjectToFirebase } from '$lib/storage/project';
	import { projectsMapStore } from '$lib/utils/store';
	import { getGithubAuthFromFirebase } from '$lib/storage/github';
	import { getReposByInstallation } from '$lib/github/github';
	import { onMount } from 'svelte';
	import { GITHUB_APP_URL } from '$shared/constants';

	export let project: Project;
	export let user: User;

	let repositories: GithubRepo[] = [];
	let loadingRepos = false;
	let filteredRepositories: GithubRepo[] = [];
	let filterTerm = '';
	let selectedRepo: GithubRepo | undefined;

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

	$: if (user?.githubAuthId) {
		loadingRepos = true;
		getGithubAuthFromFirebase(user.githubAuthId)
			.then((auth) => {
				return getReposByInstallation(auth.installationId);
			})
			.then(({ repos }) => {
				repositories = repos;
				filteredRepositories = repos;
				loadingRepos = false;
			})
			.catch((error) => {
				console.error('Error fetching GitHub data:', error);
			});
	}

	function connectRepoToProject(repo: any) {
		if (!project) return;

		project.githubSettings = {
			auth: user?.githubAuthId,
			repositoryName: repo.name,
			owner: repo.owner,
			rootPath: '.',
			baseBranch: 'main'
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
		await postProjectToFirebase(project);
		projectsMapStore.update((projectsMap) => {
			projectsMap.set(project.id, project);
			return projectsMap;
		});
		project = { ...project };
	}
</script>

<div class="space-y-3">
	{#if selectedRepo}
		<div class="border rounded-lg flex flex-col justify-between p-4 space-y-4">
			<div class="flex flex-row align-middle">
				<GitHub class="h-9 w-9 mr-2" />
				<div>
					<p class="text-sm">{selectedRepo.name}</p>
					<p class="text-xs text-gray-600">{selectedRepo.owner}</p>
				</div>
			</div>

			<div class="flex flex-row">
				<p class="label w-28">Base branch</p>
				<input
					class="input input-bordered input-sm"
					type="text"
					placeholder="main"
					value={project?.githubSettings?.baseBranch}
					on:input={(e) => {
						if (!project?.githubSettings) return;
						// @ts-ignore - This value exists
						project.githubSettings.baseBranch = e.target.value;
					}}
				/>
			</div>
			<div class="flex flex-row">
				<p class="label w-28">Root directory</p>
				<input
					class="input input-bordered input-sm"
					type="text"
					placeholder="."
					value={project?.githubSettings?.rootPath}
					on:input={(e) => {
						if (!project?.githubSettings) return;
						// @ts-ignore - This value exists
						project.githubSettings.rootPath = e.target.value;
					}}
				/>
			</div>
			<div class="ml-auto mt-4 space-x-2">
				<button on:click={() => updateProject(project)} class="btn btn-outline btn-sm">Save</button>
				<button
					on:click={() => disconnectRepoFromProject()}
					class="btn btn-outline btn-sm btn-error">Disconnect</button
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
	<button
		class="btn btn-link mt-4"
		on:click={() => {
			window.open(`${GITHUB_APP_URL}/installations/new?state=${project?.id}`, '_blank');
		}}>Configure Github Account</button
	>
</div>
