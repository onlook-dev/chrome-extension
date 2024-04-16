<script lang="ts">
	import ItemHeader from './ItemHeader.svelte';
	import { jsToCssProperty } from '$shared/helpers';
	import { usersMapStore } from '$lib/utils/store';

	import type { Activity } from '$shared/models/activity';
	import type { Project } from '$shared/models/project';
	import { GithubLogo } from 'svelte-radix';

	export let activity: Activity;
	export let project: Project;

	$: userName = $usersMapStore.get(activity.userId)?.name;
</script>

<div class="flex flex-col space-y-3 w-full p-4">
	<ItemHeader
		profileImageUrl={$usersMapStore.get(activity.userId)?.profileImage}
		createdAt={activity.updatedAt ?? activity.createdAt}
	>
		{#if project?.githubSettings && activity?.path}
			<div class="tooltip tooltip-left" data-tip="View in GitHub">
				<button
					class="btn btn-xs btn-square btn-ghost ml-auto"
					on:click={() =>
						// Root path may be empty
						window.open(
							`https://github.com/${project?.githubSettings?.owner}/${
								project?.githubSettings?.repositoryName
							}/blob/${project?.githubSettings?.baseBranch}/${
								project?.githubSettings?.rootPath ? `${project?.githubSettings?.rootPath}/` : ''
							}${activity?.path?.split(':')[0]}#L${activity?.path?.split(':')[1]}`,
							'_blank'
						)}
				>
					<GithubLogo class="w-4 h-4" />
				</button>
			</div>
		{/if}
	</ItemHeader>

	<p>Selector:</p>
	<span class="text-orange-600 bg-gray-50 p-2 rounded border">{activity.selector}</span>

	{#if activity.path}
		<p class="text-tertiary">Path:</p>
		<span class="text-orange-600 bg-gray-50 p-2 rounded border">{activity.path}</span>
	{/if}

	{#each Object.values(activity.styleChanges) as styleChange}
		<div>
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
		</div>
	{/each}

	{#if activity.textChanges && Object.keys(activity.textChanges).length > 0}
		<div>
			{userName}
			updated
			<span class="text-brand">text</span>
			from
			<span class="text-brand">{activity.textChanges.text.oldVal}</span>
			to
			<span class="text-brand">{activity.textChanges.text.newVal}</span>
		</div>
	{/if}

	{#if activity.attributeChanges && Object.keys(activity.attributeChanges).length > 0}
		<div>
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
				. New attributes:
				<span class="text-brand"> {activity.attributeChanges.updated.newVal}</span>
			{/if}
		</div>
	{/if}
</div>
