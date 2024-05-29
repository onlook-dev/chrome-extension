<script lang="ts">
	import { onMount } from 'svelte';
	import { EyeNone, Gear, GithubLogo, Shadow, Trash, TriangleDown } from 'svelte-radix';
	import { Button } from '$lib/components/ui/button/index.js';
	import { shortenSelector, sortActivities } from '$shared/helpers';
	import { FirebaseService } from '$lib/storage';
	import { projectsMapStore, teamsMapStore } from '$lib/utils/store';
	import { goto } from '$app/navigation';
	import { DashboardRoutes, FirestoreCollections } from '$shared/constants';

	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import type { Project, Team } from '$shared/models';

	export let projectService: FirebaseService<Project>;
	export let project: Project;
	export let activeActivityId: string;
	export let githubModalOpen: boolean;

	let teamsService: FirebaseService<Team> = new FirebaseService(FirestoreCollections.TEAMS);
	let resizeObserver: ResizeObserver;
	let activityCols = 'grid-cols-4';
	let container: HTMLDivElement;
	let imageErrors: string[] = [];
	let loadingImages = true;

	onMount(() => {
		setTimeout(() => {
			loadingImages = false;
		}, 10000);

		resizeObserver = new ResizeObserver((entries) => {
			const width = entries[0].contentRect.width;
			if (!width || width === 0) return;
			if (width < 400) {
				activityCols = 'grid-cols-1';
			} else if (width < 500) {
				activityCols = 'grid-cols-2';
			} else if (width < 750) {
				activityCols = 'grid-cols-3';
			} else {
				activityCols = 'grid-cols-4';
			}
		});
		resizeObserver.observe(container);
	});

	function handleBlur(event: any) {
		let updatedText = event?.currentTarget?.textContent || project.name;
		if (updatedText === project.name) return;

		project.name = updatedText;
		projectsMapStore.update((projectsMap) => {
			projectsMap.set(project.id, project);
			return projectsMap;
		});
		projectService.post(project);
	}

	function handleImageError(imageUrl: string) {
		imageErrors = [...imageErrors, imageUrl];
	}

	function deleteProject() {
		projectService
			.delete(project.id)
			.then(async () => {
				// Remove project from team
				const team = $teamsMapStore.get(project.teamId);
				if (team) {
					team.projectIds = team.projectIds.filter((id) => id !== project.id);
					await teamsService.post(team, false);
					teamsMapStore.update((teamsMap) => teamsMap.set(team.id, team));
				}

				// Remove project from store
				projectsMapStore.update((projectsMap) => {
					projectsMap.delete(project.id);
					return projectsMap;
				});
			})
			.finally(() => {
				goto(DashboardRoutes.DASHBOARD);
			});
	}
</script>

<div class="bg-black flex flex-col w-full h-full space-y-6" style="flex-direction: column;">
	<div class="p-4 flex flex-col space-y-2">
		<div class="flex flex-row">
			<h1
				class="rounded p-2 text-xl focus:ring-0 focus:outline-none border border-transparent focus:border-stone-800 hover:border-stone-800 transition"
				contenteditable={true}
				on:keypress={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						e.currentTarget.blur();
					}
				}}
				on:blur={handleBlur}
			>
				{project.name}
			</h1>
			<div class="ml-auto">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="ghost" class=" text-tertiary">
							<Gear class="w-4 h-4" />
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56 ">
						<DropdownMenu.Item on:click={() => (githubModalOpen = true)}>
							<GithubLogo class="mr-2 h-4 w-4" />
							<span>Update GitHub settings</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item class="text-red-600" on:click={deleteProject}>
							<Trash class="mr-2 h-4 w-4" />
							<span>Delete Project</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
		<h2 class="px-2 text-xs text-white/60">
			{project.hostUrl}
		</h2>
	</div>
	<Separator />
	<div class="px-6 flex flex-row text-tertiary" style="background-color: #8a3d3d;">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button builders={[builder]} variant="ghost"
					>All activities <TriangleDown class="h-4 w-4 ml-2" /></Button
				>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="dark text-sm text-tertiary">
				<DropdownMenu.Item>
					<span>(Coming soon)</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<div
		bind:this={container}
		class="grid {activityCols} p-6 pt-0 transition text-white gap-3 overflow-auto cursor-pointer"
	>
		{#each sortActivities(project.activities) as activity}
			<Card.Root
				class="{activity.id === activeActivityId
					? 'border-stone-600 bg-surface'
					: 'border-transparent bg-transparent'} transition rounded  hover:bg-surface w-42 h-42"
				on:click={() => {
					if (activeActivityId === activity.id) {
						activeActivityId = '';
						return;
					}
					activeActivityId = activity.id;
				}}
			>
				<Card.Header class="p-2 pb-1">
					{#if !activity.previewImage || imageErrors.includes(activity.previewImage)}
						<div
							class="text-tertiary bg-stone-800 w-full rounded aspect-video mx-auto my-auto object-scale-down object-center items-center justify-center flex"
						>
							{#if loadingImages}
								<Shadow class="animate-spin" />
							{:else}
								<EyeNone />
							{/if}
						</div>
					{:else}
						<img
							class="bg-black w-full rounded aspect-video mx-auto my-auto object-scale-down object-center"
							src={activity.previewImage}
							alt="Activity preview"
							on:load={() => {
								imageErrors = imageErrors.filter((error) => error !== activity.previewImage);
							}}
							on:error={() => {
								if (!activity.previewImage) return;
								if (imageErrors.includes(activity.previewImage)) return;
								handleImageError(activity.previewImage);
							}}
						/>
					{/if}
				</Card.Header>
				<Card.Content class="p-2 space-y-1">
					<Card.Title class="font-normal">{shortenSelector(activity.selector)}</Card.Title>
					<Card.Description>{new Array(activity.styleChanges).length} changes</Card.Description>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
