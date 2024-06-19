<script lang="ts">
	// @ts-ignore
	import { decompress } from '@onlook/helpers';
	import { jsToCssProperty } from '$shared/helpers';
	import { projectsMapStore, usersMapStore } from '$lib/utils/store';
	import { GithubLogo, Trash } from 'svelte-radix';
	import { FirebaseService } from '$lib/storage';
	import { FirestoreCollections } from '$shared/constants';

	import ItemHeader from './ItemHeader.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import type {
		Activity,
		ChangeValues,
		ChildVal,
		GithubSettings,
		Project,
		TemplateNode
	} from '$shared/models';
	import ChangeView from './ChangeView.svelte';
	import CodeBlock from './CodeBlock.svelte';

	export let activity: Activity;
	export let project: Project;

	const projectService = new FirebaseService<Project>(FirestoreCollections.PROJECTS);
	$: user = $usersMapStore.get(activity.userId);
	$: userName = user?.name ?? 'user';

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

	function getGitHubPath(githubSettings: GithubSettings, path: string) {
		try {
			const node: TemplateNode = decompress(path);
			const ref = node.commit || githubSettings.baseBranch;
			const filePath = node.path;
			const startLine = node.startTag.start.line;
			const endLine = node.endTag ? node.endTag.end.line : node.startTag.end.line;
			return `https://github.com/${githubSettings.owner}/${
				githubSettings.repositoryName
			}/blob/${ref}/${
				githubSettings.rootPath ? `${githubSettings.rootPath}/` : ''
			}${filePath}#L${startLine}-L${endLine}`;
		} catch (e) {
			return '';
		}
	}

	function getStructureValue(value: string | ChildVal): ChildVal {
		return value as ChildVal;
	}

	function sortChangeValues(a: ChangeValues, b: ChangeValues) {
		return (
			parseInt(getStructureValue(a.newVal).index) - parseInt(getStructureValue(b.newVal).index)
		);
	}

	function getStyleChangesAsCss(styleChanges: ChangeValues[]) {
		let content = '';
		styleChanges.forEach((styleChange) => {
			content += `${jsToCssProperty(styleChange.key)}: ${styleChange.newVal};\n`;
		});
		return content;
	}

	function getLocation(activity: Activity) {
		try {
			if (!activity.path) return '';
			return decompress(activity.path).path;
		} catch (e) {
			return '';
		}
	}
</script>

<div class="flex flex-col space-y-3 w-full p-4 text-tertiary">
	<ItemHeader
		profileImageUrl={user?.profileImage}
		{userName}
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

	<p class="">
		Selector
		<span class="text-brand">{activity.selector}</span>
	</p>
	{#if getLocation(activity)}
		<p class="break-all">
			Location
			<span class="text-brand">{getLocation(activity)}</span>
		</p>
	{/if}

	{#if activity.styleChanges && Object.keys(activity.styleChanges).length > 0}
		<div>
			<span class=""><span class="text-primary">{userName}</span> updated styles </span>
			<ChangeView>
				<div class="pl-4" slot="preview">
					{#each Object.values(activity.styleChanges) as styleChange}
						<span class="text-sky-300">{jsToCssProperty(styleChange.key)}</span>
						{#if styleChange.oldVal !== ''}
							from
							<span class="text-brand">{styleChange.oldVal}</span>
						{/if}
						to
						<span class="text-brand">{styleChange.newVal}</span>
						<br />
					{/each}
				</div>

				<CodeBlock
					slot="code"
					language="css"
					code={getStyleChangesAsCss(Object.values(activity.styleChanges))}
				/>
			</ChangeView>
		</div>
	{/if}

	{#if activity.textChanges && Object.keys(activity.textChanges).length > 0}
		<p>
			<span class="text-primary">{userName}</span>
			updated
			<span class="text-sky-300">text</span>
			from
			<span class="text-brand">{activity.textChanges.text.oldVal}</span>
			to
			<span class="text-brand">{activity.textChanges.text.newVal}</span>
		</p>
	{/if}

	{#if activity.attributeChanges && Object.keys(activity.attributeChanges).length > 0}
		<p>
			<span class="text-primary">{userName}</span>
			{#if activity.attributeChanges.full.oldVal === ''}
				added
				<span class="text-sky-300">class</span>
				value
				<span class="text-brand">{activity.attributeChanges.full?.newVal}</span>
			{:else}
				updated
				<span class="text-sky-300">class</span>
				from
				<span class="text-brand"> {activity.attributeChanges.full?.oldVal ?? ''}</span>
				to
				<span class="text-brand"> {activity.attributeChanges.full?.newVal ?? ''}</span>
				{#if activity.attributeChanges.updated}
					with new attributes:
					<span class="text-brand"> {activity.attributeChanges.updated?.newVal ?? ''}</span>
				{/if}
			{/if}
		</p>
	{/if}

	{#if activity.insertChildChanges && Object.keys(activity.insertChildChanges).length > 0}
		{#each Object.values(activity.insertChildChanges).sort(sortChangeValues) as insertChange}
			<p>
				<span class="text-primary">{userName}</span>
				added element at position
				<span class="text-brand">{getStructureValue(insertChange.newVal).index}</span>
			</p>

			<ChangeView>
				<iframe
					slot="preview"
					title="inserted element"
					class="w-full h-full items-center border bg-surface"
					srcdoc={getStructureValue(insertChange.newVal).content}
				></iframe>
				<CodeBlock
					slot="code"
					language="html"
					code={getStructureValue(insertChange.newVal).content}
				/>
			</ChangeView>
		{/each}
	{/if}

	{#if activity.moveChildChanges && Object.keys(activity.moveChildChanges).length > 0}
		{#each Object.values(activity.moveChildChanges).sort(sortChangeValues) as moveChange}
			<p>
				<span class="text-primary">{userName}</span>
				moved element from position
				<span class="text-brand">{getStructureValue(moveChange.oldVal).index}</span>
				to position
				<span class="text-brand">{getStructureValue(moveChange.newVal).index}</span>
			</p>
		{/each}
	{/if}

	{#if activity.deleteChildChanges && Object.keys(activity.deleteChildChanges).length > 0}
		{#each Object.values(activity.deleteChildChanges).sort(sortChangeValues) as deleteChange}
			<p>
				<span class="text-primary">{userName}</span>
				removed element at position
				<span class="text-brand">{getStructureValue(deleteChange.newVal).index}</span>
			</p>
			<iframe
				title="inserted element"
				class="w-full h-full items-center border"
				srcdoc={getStructureValue(deleteChange.oldVal).content}
			></iframe>
		{/each}
	{/if}
</div>
