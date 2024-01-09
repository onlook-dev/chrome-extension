<script lang="ts">
	import { CommentMediaType, type CommentImpl } from '$lib/models/comment';
	import ItemHeader from './ItemHeader.svelte';

	export let comments: CommentImpl[] = [];
</script>

{#if comments.length === 0}
	<div class="flex flex-col items-center justify-center h-full">
		<p class="text-gray-500">No comments yet</p>
	</div>
{/if}
{#each comments as comment}
	<div class="p-4 flex flex-col pb-6">
		<!-- Item header -->
		<ItemHeader
			profileImageUrl={comment.author.profileImage}
			userName={comment.author.name}
			creationTime={new Date(comment.timestamp)}
		/>

		<!-- Item body -->
		<div class="">
			{#if comment.media}
				{#each comment.media as media}
					<div class="p-2">
						{#if media.type === CommentMediaType.IMAGE}
							<img class="rounded" src={media.localUrl ?? media.remoteUrl} alt="Screenshot" />
						{:else if media.type === CommentMediaType.VIDEO}
							<video class="rounded" src={media.localUrl ?? media.remoteUrl ?? ''} controls />
						{/if}
					</div>
				{/each}
			{/if}
			{#if comment.text}
				<p class="p-2">{comment.text}</p>
			{/if}
		</div>
		<!-- Metadata -->
	</div>
{/each}
