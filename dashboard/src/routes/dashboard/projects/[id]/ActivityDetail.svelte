<script lang="ts">
	import { getGitHubPath, jsToCssProperty } from '$shared/helpers';
	import { projectsMapStore, usersMapStore } from '$lib/utils/store';
	import { GithubLogo, Trash } from 'svelte-radix';
	import { FirebaseService } from '$lib/storage';
	import { FirestoreCollections } from '$shared/constants';

	import ItemHeader from './ItemHeader.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import type { Activity } from '$shared/models/activity';
	import type { Project } from '$shared/models/project';

	export let activity: Activity;
	export let project: Project;

	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);
	$: userName = $usersMapStore.get(activity.userId)?.name;

	async function deleteActivity(activity: Activity) {
		project.activities = Object.fromEntries(
			Object.entries(project.activities).filter(([key, value]) => value.id !== activity.id)
		);

		await projectService.post(project, false);

		projectsMapStore.update((projectsMap) => {
			projectsMap.set(project.id, project);
			return projectsMap;
		});
		project = { ...project };
	}
</script>

<div class="flex flex-col space-y-3 w-full p-4">
	<ItemHeader
		profileImageUrl={$usersMapStore.get(activity.userId)?.profileImage}
		createdAt={activity.updatedAt ?? activity.createdAt}
	>
		{#if project?.githubSettings && activity?.path}
			<Tooltip.Root openDelay={200}>
				<Tooltip.Trigger>
					<Button
						variant="ghost"
						class="px-2"
						on:click={() => {
							if (!project.githubSettings || !activity.path) return;
							window.open(getGitHubPath(project.githubSettings, activity.path), '_blank');
						}}
					>
						<GithubLogo class="w-4 h-4" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>View in GitHub</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/if}
		<Tooltip.Root openDelay={200}>
			<Tooltip.Trigger>
				<AlertDialog.Root>
					<AlertDialog.Trigger
						><Button variant="ghost" class="px-2">
							<Trash class="w-4 h-4" />
						</Button>
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Are you sure?</AlertDialog.Title>
							<AlertDialog.Description>
								This action cannot be undone. This will permanently delete the changes.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action
								on:click={() => {
									deleteActivity(activity);
								}}>Delete</AlertDialog.Action
							>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Delete activity</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</ItemHeader>

	<p>
		Selector
		<span class="text-brand">{activity.selector}</span>
	</p>
	{#if activity.path}
		<p class="break-all">
			Path
			<span class="text-brand">{activity.path}</span>
		</p>
	{/if}

	{#each Object.values(activity.styleChanges) as styleChange}
		<p>
			{userName}
			{#if styleChange.oldVal === ''}
				added style
				<span class="text-brand">{jsToCssProperty(styleChange.key)}</span>
				with value
			{:else}
				update style of
				<span class="text-brand">{jsToCssProperty(styleChange.key)}</span>
				from
				<span class="text-brand">{styleChange.oldVal}</span>
				to
			{/if}
			<span class="text-brand">{styleChange.newVal}</span>
		</p>
	{/each}

	{#if activity.textChanges && Object.keys(activity.textChanges).length > 0}
		<p>
			{userName}
			updated
			<span class="text-brand">text</span>
			from
			<span class="text-brand">{activity.textChanges.text.oldVal}</span>
			to
			<span class="text-brand">{activity.textChanges.text.newVal}</span>
		</p>
	{/if}

	{#if activity.attributeChanges && Object.keys(activity.attributeChanges).length > 0}
		<p>
			{userName}
			{#if activity.attributeChanges.full.oldVal === ''}
				added class value
				<span class="text-brand">{activity.attributeChanges.full.newVal}</span>
			{:else}
				updated
				<span class="text-brand">class</span>
				from
				<span class="text-brand"> {activity.attributeChanges.full.oldVal}</span>
				to
				<span class="text-brand"> {activity.attributeChanges.full.newVal}</span>
				with new attributes:
				<span class="text-brand"> {activity.attributeChanges.updated.newVal}</span>
			{/if}
		</p>
	{/if}
</div>
