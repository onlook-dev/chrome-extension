<script lang="ts">
	import { signOut } from '$lib/firebase/auth';
	import { getInitials } from '$shared/helpers';
	import { Exit } from 'svelte-radix';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import type { User } from '$shared/models';

	export let user: User | null;
	let imageError = false;

	function handleImageError() {
		imageError = true;
	}
</script>

<div class="p-2">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="h-12 p-2  hover:border rounded space-x-2 items-center flex flex-row w-full hover:text-stone-300 "
		>
			<Avatar.Root class="w-6 h-6">
				{#if user?.profileImage && !imageError}
					<Avatar.Image src={user?.profileImage} on:error={handleImageError} />
				{/if}
				<Avatar.Fallback>{getInitials(user?.name ?? '')}</Avatar.Fallback>
			</Avatar.Root>
			<h2 class="text-sm">{user?.name}</h2>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="">
			<DropdownMenu.Item>
				<Exit class="mr-2 h-4 w-4" />
				<button on:click={signOut}>Sign out</button>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
