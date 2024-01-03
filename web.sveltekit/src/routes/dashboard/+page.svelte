<script lang="ts">
	import { signOut } from '$lib/firebase/auth';
	import { getInitials } from '$lib/models/comment';
	import type { UserImpl } from '$lib/models/user';
	import { userStore } from '$lib/utils/store';
	import { onMount } from 'svelte';
	import ChevronDownIcon from '~icons/mdi/chevron-down';

	let user: UserImpl | null;
	let dropdownOpen = false;

	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}

	onMount(() => {
		userStore.subscribe((storeUser) => {
			user = storeUser;
		});
	});
</script>

<div class="flex h-screen">
	<!-- Side Panel -->
	<div class="sidebar p-2 border w-64 space-y-6 px-2 absolute inset-y-0 left-0">
		<!-- User Avatar and Dropdown Section -->
		<button
			on:click={toggleDropdown}
			class="flex items-center space-x-2 hover:shadow rounded-lg p-2"
		>
			<div class="flex items-center space-x-4">
				<div class="avatar online placeholder">
					<div class="bg-neutral text-neutral-content rounded-full w-8">
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
		</button>
		<!-- Dropdown Menu -->
		<div
			class={`absolute right-0 w-48 bg-gray-700 rounded-md shadow-lg py-1 ${
				dropdownOpen ? 'block' : 'hidden'
			}`}
			tabindex="-1"
		>
			<a href="#" class="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-600">Your Profile</a>
			<a href="#" class="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-600">Settings</a>
			<a href="#" on:click={signOut} class="block px-4 py-2 text-sm text-gray-100 hover:bg-gray-600"
				>Sign out</a
			>
		</div>
	</div>

	<!-- Page Content -->
	<div class="flex-1 border">
		<!-- Your page content here -->
	</div>
</div>
