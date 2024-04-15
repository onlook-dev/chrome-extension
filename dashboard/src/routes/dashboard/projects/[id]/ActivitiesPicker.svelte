<script lang="ts">
	import type { Project } from '$shared/models/project';
	import { TriangleDown } from 'svelte-radix';
	import { Button } from '$lib/components/ui/button/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { shortenSelector } from '$shared/helpers';

	export let project: Project;
	export let activityCols: string;
	export let activeActivityId: string;

	let imageErrors: string[] = [];
	function handleImageError(imageUrl: string) {
		imageErrors = [...imageErrors, imageUrl];
	}
</script>

<div class="bg-black p-6 flex flex-col w-full h-full space-y-6">
	<div class="pb-6 flex flex-col space-y-2">
		<h1 class="text-xl">{project.name}</h1>
		<h2 class="text-sm text-white/60">
			{project.hostUrl}
		</h2>
	</div>
	<Separator />
	<div>
		<div class="flex flex-row text-tertiary">
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
		<div class="transition text-white grid {activityCols} gap-8 overflow-auto cursor-pointer">
			{#each Object.values(project.activities) as activity}
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
					<Card.Header class="p-3 pb-1">
						{#if !activity.previewImage || imageErrors.includes(activity.previewImage)}
							<div
								class="bg-stone-800 w-full rounded aspect-video mx-auto my-auto object-scale-down object-center"
							></div>
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
					<Card.Content class="p-3 space-y-1">
						<Card.Title class="font-normal">{shortenSelector(activity.selector)}</Card.Title>
						<Card.Description>{new Array(activity.styleChanges).length} changes</Card.Description>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>
</div>
