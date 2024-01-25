<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';

	import type { Project } from '$shared/models/project';
	import type { User } from '$shared/models/user';
	import type { GithubRepo, GithubSettings } from '$shared/models/github';

	import { subscribeToProject } from '$lib/storage/project';
	import { getUserFromFirebase } from '$lib/storage/user';
	import { DashboardRoutes, GITHUB_APP_URL } from '$shared/constants';
	import { projectsMapStore, userStore, usersMapStore } from '$lib/utils/store';
	import { getGithubAuthFromFirebase } from '$lib/storage/github';
	import { getReposByInstallation } from '$lib/github/github';
	import { postProjectToFirebase } from '$lib/storage/project';

	import ChevronLeft from '~icons/mdi/chevron-left';
	import GitHub from '~icons/mdi/github';

	let project: Project | undefined;
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

		postProjectToFirebase(project).then(() => {
			goto(`${DashboardRoutes.PROJECTS}/${project?.id}`);
		});
	}

	function disconnectRepoFromProject() {
		if (!project) return;

		project.githubSettings = undefined;

		postProjectToFirebase(project).then(() => {
			goto(`${DashboardRoutes.PROJECTS}/${project?.id}`);
		});
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

		if ($projectsMapStore.has(projectId)) {
			project = $projectsMapStore.get(projectId);
		} else {
			subscribeToProject(projectId, async (firebaseProject) => {
				$projectsMapStore.set(projectId, firebaseProject);
				projectsMapStore.set($projectsMapStore);
				project = firebaseProject;

				// Get store users from activities and comments
				const userIds = Object.values(project.activities)
					.map((item) => item.userId)
					.concat(project.comments.map((item) => item.userId));

				for (const userId of userIds) {
					if (!$usersMapStore.has(userId)) {
						const newUser = await getUserFromFirebase(userId);
						newUser && usersMapStore.update((map) => map.set(userId, newUser));
					}
				}
			}).then((unsubscribe) => {
				unsubs.push(unsubscribe);
			});
		}

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
</script>

<div class="flex h-screen w-screen flex-col">
	{#if project}
		<!-- Header -->
		<div class="navbar bg-base-100">
			<button
				class="flex flex-row btn btn-ghost text-sm"
				on:click={() => goto(`${DashboardRoutes.PROJECTS}/${project?.id}`)}
			>
				<ChevronLeft class="w-6 h-6" />
				Back to Project
			</button>
		</div>
		<div class="p-8 mt-20 bg-white text-gray-900">
			<h1 class="text-2xl font-bold mb-4">Connect Github</h1>
			<div class="flex flex-col md:flex-row gap-10">
				<div class="card w-full md:w-2/3 shadow border p-6">
					<h2 class="text-xl font-semibold mb-3">Import Git Repository</h2>
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
								<ul class="border divide-y rounded-lg p-2 max-h-96 overflow-auto">
									<li class="flex justify-between items-center p-4">
										<div>
											<p class="text-sm">{selectedRepo.name}</p>
											<p class="text-xs text-gray-600">{selectedRepo.owner}</p>
										</div>
										<button
											on:click={() => disconnectRepoFromProject()}
											class="btn btn-outline btn-sm btn-error">Disconnect</button
										>
									</li>
								</ul>
							{/if}

							<ul class="border divide-y rounded-lg p-2 max-h-96 overflow-auto">
								{#if loadingRepos}
									<div class="w-full text-center">
										<div class="loading h-10"></div>
									</div>
								{:else if filteredRepositories.length === 0}
									<div class="flex flex-col items-center justify-center h-full">
										<p class="text-gray-500">No repositories found</p>
									</div>
								{/if}
								{#each filteredRepositories as repo}
									<li class="flex justify-between items-center p-4">
										<div>
											<p class="text-sm">{repo.name}</p>
											<p class="text-xs text-gray-600">{repo.owner}</p>
										</div>
										<button
											on:click={() => connectRepoToProject(repo)}
											class="btn btn-outline btn-sm">Connect</button
										>
									</li>
								{/each}
							</ul>
						</div>
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
				</div>
				<div class="card border w-full md:w-1/3 shadow p-6">
					<div class="badge badge-lg badge-success badge-outline my-2">Coming soon</div>
					<h2 class="text-xl font-semibold mb-3">Create New Repository</h2>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-scroll">
						{#each templates as template}
							<button class="hover:shadow-lg p-4 border rounded-lg align-middle">
								<h3 class="font-medium">{template.name}</h3>
								<p class="text-sm">{template.description}</p>
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center h-full">
			<!-- TODO: Skeleton -->
			<p class="text-gray-500">Loading...</p>
		</div>
	{/if}
</div>
