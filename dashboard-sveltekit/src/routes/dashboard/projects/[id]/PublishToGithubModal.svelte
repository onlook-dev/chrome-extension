<script lang="ts">
	import { exportToPRComments } from '$lib/github/github';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';

	import type { Project } from '$shared/models/project';
	import type { User } from '$shared/models/user';
	import type { GithubRepo, GithubSettings } from '$shared/models/github';

	import { DashboardRoutes, GITHUB_APP_URL } from '$shared/constants';
	import { projectsMapStore, userStore } from '$lib/utils/store';
	import { getGithubAuthFromFirebase } from '$lib/storage/github';
	import { getReposByInstallation } from '$lib/github/github';
	import { postProjectToFirebase } from '$lib/storage/project';

	import GitHub from '~icons/mdi/github';
	export let userId: string;

	const modalId = 'publish-modal';
	let isLoading = false;
	let prLink: string | undefined;

	export let project: Project;
	let unsubs: any[] = [];
	let user: User | undefined;
	let filterTerm = '';
	let loadingRepos = false;

	let selectedRepo: GithubRepo | undefined;
	let repositories: GithubRepo[] = [];
	let filteredRepositories: GithubRepo[] = [];

	const templates = [
		{ id: 1, name: 'Next.js', description: 'React framework' },
		{ id: 2, name: 'SvelteKit', description: 'Svelte framework' },
		{ id: 3, name: 'Angular', description: 'Typescript framework' },
		{ id: 4, name: 'Vite', description: 'Vue framework' }
	];

	$: if (filterTerm !== '') {
		filteredRepositories = repositories.filter(
			(repo) => repo.name.includes(filterTerm) && repo.name !== selectedRepo?.name
		);
	} else {
		filteredRepositories = repositories.filter((repo) => repo.name !== selectedRepo?.name);
	}

	function connectRepoToProject(repo: any) {
		if (!project) return;

		project.githubSettings = {
			auth: user?.githubAuthId,
			repositoryName: repo.name,
			owner: repo.owner,
			rootPath: 'src',
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

	onMount(async () => {
		// Get project
		const projectId = $page.params.id;

		if (!projectId) {
			goto(DashboardRoutes.DASHBOARD);
		}

		userStore.subscribe((newUser) => {
			user = newUser;
			if (user?.githubAuthId) {
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
		});

		if (project?.githubSettings) {
			selectedRepo = {
				name: project.githubSettings.repositoryName,
				owner: project.githubSettings.owner
			};
		}
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

	async function handlePublishClick() {
		if (!project?.githubSettings) {
			goto(`${DashboardRoutes.PROJECTS}/${project?.id}${DashboardRoutes.GITHUB}`);
			return;
		}

		isLoading = true;
		try {
			prLink = await exportToPRComments(userId, project?.id);
		} catch (error) {
			console.error('Error publishing changes:', error);
			// TODO: handle error
		} finally {
			isLoading = false;
		}
	}
</script>

<div>
	<button class="flex flex-row justify-center" on:click={showModal}
		><GitHub class="mr-2" /> Publish to Github</button
	>
	<dialog id={modalId} class="modal">
		<div class="modal-box card w-full flex flex-col p-6">
			<h2 class="text-xl font-semibold mb-3">Connect GitHub Repository</h2>

			{#if user?.githubAuthId}
				<div class="space-y-3">
					<div class="flex flex-row gap-3">
						<!-- <select class="select select-bordered w-1/3">
									<option selected>Kitenite</option>
								</select> -->
						<input
							bind:value={filterTerm}
							class="input input-bordered w-full"
							type="text"
							placeholder="Search for repository"
						/>
					</div>

					{#if selectedRepo}
						<div class="border rounded-lg flex flex-row justify-between items-center p-4">
							<div>
								<p class="text-sm">{selectedRepo.name}</p>
								<p class="text-xs text-gray-600">{selectedRepo.owner}</p>
							</div>
							<button
								on:click={() => disconnectRepoFromProject()}
								class="btn btn-outline btn-sm btn-error">Disconnect</button
							>
						</div>
					{/if}

					<div class="border py-2 divide-y rounded-lg max-h-52 overflow-auto">
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
				</div>

				<button
					class="btn btn-link mt-4"
					on:click={() => {
						window.open(`${GITHUB_APP_URL}/installations/new?state=${project?.id}`, '_blank');
					}}><GitHub class="h-5 w-5" />Configure Github Account</button
				>
			{:else}
				<div class="flex flex-col items-center justify-center h-full">
					<button
						class="btn btn-primary"
						on:click={() => {
							window.open(`${GITHUB_APP_URL}/installations/new?state=${project?.id}`, '_blank');
						}}><GitHub class="h-5 w-5" />Connect Github Account</button
					>
				</div>
			{/if}
			<!-- Actions -->
			<!-- <div class="form-control space-y-4">
				{#if isLoading}
					<button disabled class="btn btn-outline"> Loading... </button>
				{:else if prLink}
					<a href={prLink} target="_blank" class="btn btn-outline">
						<GitHub class="w-5 h-5" />
						View changes in Github
					</a>
				{:else}
					<button class="btn btn-outline" on:click={handlePublishClick}>
						<GitHub class="w-5 h-5" />
						Publish changes to Github
					</button>
				{/if}
			</div> -->
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</div>
