<script lang="ts">
	import type { Project } from '$models/project';
	import { CommentMediaType, type Comment } from '$models/comment';
	import { usersMapStore } from '$lib/utils/store';

	import ItemHeader from './ItemHeader.svelte';

	export let project: Project;

	let comments: Comment[];
	let hoverComment = (comment: Comment) => {};
	let leaveComment = (comment: Comment) => {};
	let clickComment = (comment: Comment) => {};

	$: comments = project.comments.sort(
		(a, b) => b.creationTime.getTime() - a.creationTime.getTime()
	);
</script>

{#if comments.length === 0}
	<div class="flex flex-col items-center justify-center h-full">
		<p class="text-gray-500">No comments yet</p>
	</div>
{/if}
<div class="divide-y flex flex-col w-full">
	<h1 class="m-2 font-semibold">Comments</h1>

	{#each comments as comment}
		<button
			class="p-4 flex flex-col pb-6"
			on:mouseenter={() => hoverComment(comment)}
			on:mouseleave={() => leaveComment(comment)}
			on:click={() => clickComment(comment)}
		>
			<!-- Item header -->
			<ItemHeader
				profileImageUrl={$usersMapStore.get(comment.userId)?.profileImage}
				userName={$usersMapStore.get(comment.userId)?.name}
				creationTime={comment.creationTime}
			/>

			<!-- Item body -->
			<div class="">
				{#if comment.media}
					{#each comment.media as media}
						<div class="p-2">
							{#if media.type === CommentMediaType.IMAGE}
								<img class="rounded" src={media.localUrl ?? media.remoteUrl} alt="Screenshot" />
							{:else if media.type === CommentMediaType.VIDEO}
								<video class="rounded" src={media.localUrl ?? media.remoteUrl ?? ''} controls>
									<track kind="captions" />
								</video>
							{/if}
						</div>
					{/each}
				{/if}
				{#if comment.text}
					<p class="p-2">{comment.text}</p>
				{/if}
			</div>
			<!-- Metadata -->
		</button>
	{/each}
</div>
