<script lang="ts">
	import { timeSince } from '$shared/models/comment';
	import Dots from '~icons/material-symbols/more-vert';

	export let profileImageUrl = '';
	export let userName = '';
	export let creationTime: string = '';
</script>

<div class="flex flex-row items-center pb-4 w-full">
	<div class="avatar">
		<div class="w-6 mask mask-circle">
			<img src={profileImageUrl} alt="Avatar of {userName}" />
		</div>
	</div>
	<div class="px-2">{userName}</div>
	<div class="text-xs text-gray-500">
		{timeSince(new Date(creationTime))}
	</div>
	<div class="ml-auto">
		<button class="btn btn-square btn-ghost"> <Dots /> </button>
	</div>
</div>
