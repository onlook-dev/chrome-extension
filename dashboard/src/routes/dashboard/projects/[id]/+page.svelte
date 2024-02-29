<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';

	import type { Project } from '$shared/models/project';
	import { subscribeToProject } from '$lib/storage/project';
	import { getUserFromFirebase } from '$lib/storage/user';
	import { DashboardRoutes, DashboardSearchParams, MAX_TITLE_LENGTH } from '$shared/constants';
	import { projectsMapStore, userStore, usersMapStore } from '$lib/utils/store';

	import { truncateString } from '$shared/helpers';
	import type { User } from '$shared/models/user';
	import { auth } from '$lib/firebase/firebase';

	import Activities from './Activities.svelte';
	import ShareModal from './ShareModal.svelte';
	import Slack from '~icons/devicon/slack';
	import Jira from '~icons/logos/jira';
	import Linear from '~icons/logos/linear-icon';
	import PublishToGithubModal from './github/PublishToGithubModal.svelte';
	import type { Activity } from '$shared/models/activity';

	let project: Project | undefined;
	let user: User | null;
	let unsubs: any[] = [];
	let activeActivityId: string = '';
	let activeActivity: Activity | undefined;

	$: if (project) {
		activeActivity = Object.values(project.activities).find(
			(activity) => activity.id === activeActivityId
		);
	}

	onMount(async () => {
		auth.onAuthStateChanged((user) => {
			if (!user) {
				goto(DashboardRoutes.SIGNIN);
			}
		});

		userStore.subscribe((storeUser) => {
			if (!storeUser) return;
			user = storeUser;
		});

		// Get project
		const projectId = $page.params.id;
		if (!projectId) {
			goto(DashboardRoutes.DASHBOARD);
		}

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
						const user = await getUserFromFirebase(userId);
						user && usersMapStore.update((map) => map.set(userId, user));
					}
				}
			}).then((unsubscribe) => {
				unsubs.push(unsubscribe);
			});
		}
	});

	onDestroy(() => {
		unsubs.forEach((unsub: any) => unsub());
	});
</script>

<div class="flex h-screen w-screen flex-col">
	{#if project && user}
		<!-- Header -->
		<div class="navbar bg-base-100">
			<div class="navbar-start flex flex-row">
				<a
					class="btn btn-ghost text-sm text-red-500"
					href="{DashboardRoutes.DASHBOARD}?{DashboardSearchParams.TEAM}={project?.teamId}"
					>Onlook</a
				>
				<p class="text-sm mr-4">/</p>
				<p class="truncate font-light">
					{truncateString(project?.name || 'Dashboard', MAX_TITLE_LENGTH)}
				</p>
			</div>

			<div class="navbar-end space-x-2">
				<ShareModal teamId={project.teamId} />
				<div class="dropdown dropdown-end">
					<button tabindex="0" class="btn btn-primary">Publish</button>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<ul
						tabindex="0"
						class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
					>
						<li><PublishToGithubModal {project} /></li>
						<div class="divider">Coming soon</div>
						<li class="opacity-60"><button disabled><Linear /> Open Linear ticket</button></li>
						<li class="opacity-60"><button disabled><Jira /> Open Jira ticket</button></li>
						<li class="opacity-60"><button disabled><Slack /> Create Slack thread</button></li>
					</ul>
				</div>
			</div>
		</div>
		<!-- Main content -->
		<div class="bg-base-200 flex flex-col sm:flex-row flex-grow overflow-auto">
			<!-- Screenshot -->
			<div class="sm:w-full flex flex-grow h-full border items-center justify-center bg-red-500">
				{#if activeActivity && activeActivity.previewImage}
					<img
						src={activeActivity.previewImage}
						alt="Screenshot"
						class="shadow max-w-[80%] mx-auto my-auto"
					/>
				{:else if project.hostData?.previewImage}
					<img
						src={project.hostData?.previewImage}
						alt="Screenshot"
						class="shadow w-[80%] h-auto max-w-[80%] max-h-[80%] object-cover object-top aspect-video skeleton mx-auto my-auto"
					/>
				{:else}
					<div
						class="shadow w-[80%] h-auto max-w-[80%] max-h-[80%] aspect-video skeleton mx-auto my-auto"
					></div>
				{/if}
			</div>
			<!-- Sidebar/ comments + activities -->
			<div class="flex flex-col w-full sm:max-w-96 h-full text-sm">
				<div class="border h-full w-full overflow-auto">
					<Activities {project} bind:activeActivityId />
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
