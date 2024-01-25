<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import type { Project } from '$shared/models/project';
	import type { User } from '$shared/models/user';
	import type { GithubRepo, GithubSettings } from '$shared/models/github';
	import { DashboardRoutes, GITHUB_APP_URL } from '$shared/constants';
	import { projectsMapStore, userStore } from '$lib/utils/store';
	import { getGithubAuthFromFirebase } from '$lib/storage/github';
	import { getReposByInstallation } from '$lib/github/github';
	import { postProjectToFirebase } from '$lib/storage/project';
	import { exportToPRComments } from '$lib/github/github';

	import GitHub from '~icons/mdi/github';

	export let userId: string;
	export let project: Project;

	enum Tab {
		PUBLISH = 'Publish',
		CONFIGURE = 'Configure'
	}

	let selectedTab = Tab.PUBLISH;

	const modalId = 'publish-modal';
	let isLoading = false;
	let prLink: string | undefined;

	let unsubs: any[] = [];
	let user: User | undefined;
	let filterTerm = '';
	let loadingRepos = false;

	let selectedRepo: GithubRepo | undefined;
	let repositories: GithubRepo[] = [];
	let filteredRepositories: GithubRepo[] = [];

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

		if (!project.githubSettings) {
			selectedTab = Tab.CONFIGURE;
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
		<div class="modal-box card w-full h-[60%] flex flex-col p-6">
			<h2 class="text-xl font-semibold mb-3">Connect GitHub Repository</h2>

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
					<!-- Actions -->
					<div role="tabpanel" class="tab-content py-4">
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

							<div class="border py-2 divide-y rounded-lg max-h-64 overflow-auto">
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
										<button
											on:click={() => connectRepoToProject(repo)}
											class="btn btn-outline btn-sm">Connect</button
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
					</div>
				</div>
			{/if}
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</div>
