<script lang="ts">
	import { fade } from 'svelte/transition';
	import { shortenSelector, timeSince } from '$shared/helpers';
	import { Moon, Sun } from 'svelte-radix';

	import ImageComparer from '$lib/components/ui/image-compare';

	import type { Activity, Project } from '$shared/models';

	enum Mode {
		Light = 'light',
		Dark = 'dark'
	}
	export let activeActivity: Activity | undefined;
	export let project: Project;
	export let mode: Mode = Mode.Light;
	const toggleDarkMode = () => {
		if (mode === Mode.Light) {
			mode = Mode.Dark;
		} else {
			mode = Mode.Light;
		}
	};
</script>

<div
	class="transition {mode === Mode.Dark
		? 'bg-stone-200 text-surface'
		: 'bg-surface text-tertiary'}  flex flex-col w-full h-full"
>
	<div class="flex flex-row p-6">
		<div class="flex flex-col space-y-2 w-full">
			<div class="flex flex-row items-center">
				<p>
					{#if activeActivity}
						<span class="text-sm">{shortenSelector(activeActivity.selector)}</span>
						<span class="text-xs ml-2">
							Edited {timeSince(new Date(activeActivity.updatedAt ?? activeActivity.createdAt))} ago
						</span>
					{:else}
						<span>{project.name}</span>
					{/if}
				</p>
			</div>
			<!-- TODO: Add back later -->
			<!-- <Input class="border-none" placeholder="Click to describe the changes..." /> -->
		</div>
		<div class="ml-auto flex flex-row space-x-4 items-center">
			<!-- TODO: Add back later -->
			<!-- <button><CounterClockwiseClock class="w-4" /></button> -->
			<button on:click={toggleDarkMode}>
				{#if mode == Mode.Light}
					<div in:fade>
						<Sun class="w-4" />
					</div>
				{:else}
					<div in:fade>
						<Moon class="w-4" />
					</div>
				{/if}</button
			>
		</div>
	</div>
	<div class="flex w-full h-full items-center justify-center">
		{#if activeActivity}
			<ImageComparer
				canvasClass="transition {mode === Mode.Dark
					? 'bg-stone-200 text-surface'
					: 'bg-surface text-tertiary'}"
				beforeImage={activeActivity.beforeImage}
				afterImage={activeActivity.previewImage}
			/>
		{:else}
			<ImageComparer
				canvasClass="transition {mode === Mode.Dark
					? 'bg-stone-200 text-surface'
					: 'bg-surface text-tertiary'}"
				beforeImage={project.hostData.beforeImage}
				afterImage={project.hostData.previewImage}
			/>
		{/if}
	</div>
</div>
