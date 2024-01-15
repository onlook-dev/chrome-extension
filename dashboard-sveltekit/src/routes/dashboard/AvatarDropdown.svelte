<script lang="ts">
	import type { User } from '$shared/models/user';
	import { signOut } from '$lib/firebase/auth';
	import { getInitials } from '$shared/models/comment';
	import ChevronDownIcon from '~icons/mdi/chevron-down';
	import PlanModal from './PlanModal.svelte';

	export let user: User | null;
</script>

<div class="dropdown dropdown-bottom">
	<div
		tabindex="0"
		role="button"
		class="flex items-center space-x-2 hover:shadow rounded-lg py-2 px-1"
	>
		<div class="flex items-center space-x-2">
			<div class="avatar online placeholder">
				<div class="bg-neutral text-neutral-content rounded-full w-6">
					{#if user?.profileImage}
						<img src={user?.profileImage} alt="profile" />
					{:else}
						<span class="text-xs">{getInitials(user?.name ?? '👤')}</span>
					{/if}
				</div>
			</div>
			<h2 class="text-sm font-semibold">{user?.name}</h2>
		</div>
		<ChevronDownIcon class="w-4 h-4" />
	</div>
	<ul class="dropdown-content z-[1] menu shadow bg-base-100 rounded-box w-52">
		<li><button>Profile</button></li>
		<li>
			<button>Settings</button>
		</li>
		<li>
			<PlanModal />
		</li>
		<li class="text-red-600">
			<button on:click={signOut}>Sign out</button>
		</li>
	</ul>
</div>
