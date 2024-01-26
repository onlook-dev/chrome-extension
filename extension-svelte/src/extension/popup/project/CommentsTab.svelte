<script lang="ts">
	import { onMount } from 'svelte'
	import type { Project } from '$shared/models/project'
	import { CommentMediaType, type Comment } from '$shared/models/comment'
	import type { User } from '$shared/models/user'

	import ItemHeader from './ItemHeader.svelte'
	import { usersMapBucket } from '$lib/utils/localstorage'

	export let project: Project
	let usersMap: Map<string, User> = new Map()

	let comments: Comment[]
	let hoverComment = (comment: Comment) => {}
	let leaveComment = (comment: Comment) => {}
	let clickComment = (comment: Comment) => {}

	onMount(async () => {
		usersMap = new Map(Object.entries(await usersMapBucket.get()))
	})

	$: comments = project.comments.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	)
</script>

{#if comments.length === 0}
	<div class="flex flex-col items-center justify-center text-center h-full pt-6">
		<p class="text-gray-500">No comments yet<br /></p>
	</div>
{/if}
<div class="divide-y flex flex-col w-full">
	{#each comments as comment}
		<button
			class="p-4 flex flex-col pb-6 hover:bg-gray-50 transition duration-200 ease-in-out"
			on:mouseenter={() => hoverComment(comment)}
			on:mouseleave={() => leaveComment(comment)}
			on:click={() => clickComment(comment)}
		>
			<!-- Item header -->
			<ItemHeader
				profileImageUrl={usersMap.get(comment.userId)?.profileImage}
				userName={usersMap.get(comment.userId)?.name}
				createdAt={comment.createdAt}
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
