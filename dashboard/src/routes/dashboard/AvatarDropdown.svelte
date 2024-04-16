<script lang="ts">
	import type { User } from '$shared/models/user';
	import { signOut } from '$lib/firebase/auth';
	import { getInitials } from '$shared/helpers';
	import ChevronDownIcon from '~icons/mdi/chevron-down';

	export let user: User | null;
	let imageError = false;

	function handleImageError() {
		imageError = true;
	}
</script>

<div class="dropdown dropdown-bottom">
	<div
		tabindex="0"
		role="button"
		class="flex items-center space-x-2 hover:shadow rounded-lg py-2 px-1"
	>
		<div class="flex items-center space-x-2">
			<div class="avatar placeholder">
				<div class="bg-neutral text-neutral-content rounded-full w-6">
					{#if user?.profileImage && !imageError}
						<img src={user?.profileImage} alt="profile" on:error={handleImageError} />
					{:else}
						<span class="text-xs">{getInitials(user?.name ?? '')}</span>
					{/if}
				</div>
			</div>
			<h2 class="text-sm">{user?.name}</h2>
		</div>
		<ChevronDownIcon class="w-4 h-4" />
	</div>
	<ul class="dropdown-content bg-black text-white z-[1] menu shadow rounded-box w-52">
		<li class="disabled">
			<button class="text-gray-500">Profile</button>
		</li>
		<li class="disabled">
			<button class="text-gray-500">Settings</button>
		</li>
		<li class="text-red-600">
			<button on:click={signOut}>Sign out</button>
		</li>
	</ul>
</div>
