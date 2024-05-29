<script lang="ts">
	import { ExternalLink } from 'svelte-radix';
	import type { GithubHistory } from '$shared/models';

	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Button from '$lib/components/ui/button/button.svelte';
	export let githubHistories: GithubHistory[] = [];
</script>

{#if githubHistories.length > 0}
	<Collapsible.Root class="border text-primary rounded w-full p-2 text-sm">
		<Collapsible.Trigger class="hover:opacity-90 w-full text-start"
			>GitHub History ({githubHistories.length} pull requests)
		</Collapsible.Trigger>
		<Collapsible.Content class="mt-4">
			{#each githubHistories as history}
				<div class="flex flex-row max-w-[100%] items-center">
					<p class="line-clamp-1 text-ellipsis max-w-[70%]">
						{history.title}
					</p>
					<div class="ml-auto">
						<Tooltip.Root openDelay={200}>
							<Tooltip.Trigger>
								<Button
									variant="ghost"
									size="sm"
									on:click={() => window.open(history.pullRequestUrl, '_blank')}
									><ExternalLink class="w-3.5 h-3.5" /></Button
								>
							</Tooltip.Trigger>
							<Tooltip.Content side="left" class="w-28">View in GitHub</Tooltip.Content>
						</Tooltip.Root>
					</div>
				</div>
			{/each}
		</Collapsible.Content>
	</Collapsible.Root>
{/if}
