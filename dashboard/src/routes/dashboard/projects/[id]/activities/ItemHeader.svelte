<script lang="ts">
	import { getInitials, timeSince } from '$shared/helpers';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	export let profileImageUrl = '';
	export let userName = '';
	export let createdAt: string;
	let imageError = false;

	function handleImageError() {
		imageError = true;
	}
</script>

<div class="flex flex-row items-center w-full">
	<Avatar.Root class="w-5 h-5">
		<Avatar.Image src={profileImageUrl} alt="avatar" />
		<Avatar.Fallback>{getInitials(userName ?? '')}</Avatar.Fallback>
	</Avatar.Root>

	<div class="px-2 text-primary text-sm">{userName || 'user'}</div>
	<div class="text-xs">
		{timeSince(new Date(createdAt))} ago
	</div>
	<div class="ml-auto">
		<slot />
	</div>
</div>
