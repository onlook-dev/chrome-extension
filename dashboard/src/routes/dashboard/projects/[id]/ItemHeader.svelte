<script lang="ts">
	import { timeSince } from '$shared/models/comment';

	export let profileImageUrl = '';
	export let userName = '';
	export let createdAt: string;
</script>

<div class="flex flex-row items-center pb-4 w-full">
	<div class="avatar">
		<div class="w-6 mask mask-circle">
			<img src={profileImageUrl} alt="Avatar of {userName}" />
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
