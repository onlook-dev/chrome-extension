<script lang="ts">
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { DashboardRoutes, FirestoreCollections } from '$shared/constants';
	import { projectsMapStore } from '$lib/utils/store';
	import { FirebaseService } from '$lib/storage';

	import Pin from '$lib/assets/welcome-pin.gif';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	import type { Team, Project } from '$shared/models';

	export let team: Team | undefined;
	let unsubs: any[] = [];
	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);
	let faviconErrorIds: string[] = [];

	$: team?.projectIds.forEach((projectId) => {
		if (!$projectsMapStore.has(projectId)) {
			projectService
				.subscribe(projectId, (firebaseProject) => {
					if (!firebaseProject || !Object.keys(firebaseProject)) return;
					projectsMapStore.update((map) => map.set(projectId, firebaseProject));
				})
				.then((unsubscribe) => {
					unsubs.push(unsubscribe);
				});
		}
	});

	$: projects = (
		team?.projectIds.map((id) => $projectsMapStore.get(id)).filter((p) => p) as Project[]
	).toSorted((a, b) => ((a.updatedAt ?? a.createdAt) < (b.updatedAt ?? b.createdAt) ? 1 : -1));

	onDestroy(() => {
		unsubs.forEach((unsub: any) => unsub());
	});

	const shortenUrl = (url: string) => {
		try {
			const urlObj = new URL(url);
			return urlObj.hostname + (urlObj.port ? `:${urlObj.port}` : '') + urlObj.pathname;
		} catch (e) {
			return url;
		}
	};
</script>

<div
	class="pb-16 w-full max-h-full overflow-auto text-primary grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
>
	{#if team?.projectIds.length}
		{#each projects as project}
			{#if project && Object.keys(project).length}
				<button
					on:click={() => goto(`${DashboardRoutes.PROJECTS}/${project?.id}`)}
					class="transition rounded space-y-4 p-4 border border-black hover:bg-surface hover:border-stone-700 block"
				>
					<figure class="">
						{#if project?.hostData?.previewImage}
							<img
								src={project.hostData?.previewImage}
								alt={project.name}
								class="object-cover object-top aspect-video rounded w-full"
							/>
						{:else}
							<div class="bg-surface aspect-video rounded w-full" />
						{/if}
					</figure>
					<div class="flex items-center space-x-2">
						<Avatar.Root class="w-8 h-8">
							{#if project.hostData?.favicon && faviconErrorIds.indexOf(project.id) === -1}
								<Avatar.Image
									src={project.hostData.favicon}
									on:error={() => {
										if (!project) return;
										faviconErrorIds = [...faviconErrorIds, project.id];
									}}
								/>
							{/if}
							<Avatar.Fallback></Avatar.Fallback>
						</Avatar.Root>

						<div class="text-left overflow-x-hidden">
							<p class="text-sm truncate">{project?.name}</p>
							<p class="text-xs opacity-70 truncate">{shortenUrl(project?.hostUrl)}</p>
						</div>
					</div>
				</button>
			{/if}
		{/each}
	{:else}
		<div class="col-span-full mt-10">
			<p class="mt-10 text-center"><b>Tip:</b> Pin the extension for easy access</p>
			<div class="flex justify-center">
				<img class="mt-6 h-auto max-w-md rounded-lg" src={Pin} alt="Pin extension tip" />
			</div>
		</div>
	{/if}
</div>
