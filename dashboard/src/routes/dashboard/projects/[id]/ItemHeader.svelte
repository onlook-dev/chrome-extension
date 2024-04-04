<script lang="ts">
	import { getInitials, timeSince } from '$shared/helpers';

	export let profileImageUrl = '';
	export let userName = '';
	export let createdAt: string;
	let imageError = false;

	function handleImageError() {
		imageError = true;
	}
</script>

<div class="flex flex-row items-center pb-4 w-full">
	<div class="avatar">
		<div class="w-6 mask mask-circle">
			{#if imageError}
				<span class="text-xs">{getInitials(userName ?? '')}</span>
			{:else}
				<img src={profileImageUrl} alt="Avatar of {userName}" on:error={handleImageError} />
			{/if}
		</div>
	</div>
	<div class="px-2">{userName}</div>
	<div class="text-xs text-gray-500">
		{timeSince(new Date(createdAt))}
	</div>
	<div class="ml-auto">
		<slot />
	</div>
</div>
