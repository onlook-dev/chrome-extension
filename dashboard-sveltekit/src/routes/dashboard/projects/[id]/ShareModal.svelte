<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	// import type { ProjectImpl } from '$lib/models/project';
	// export let project: ProjectImpl | undefined;

	const modalId = 'share-modal';
	const teamName = 'Team name';
</script>

<button
	class="btn btn-outline"
	on:click={() => {
		// @ts-ignore - showModal() does not exist on HTMLElement
		document?.getElementById(modalId)?.showModal();
	}}>Share</button
>
<dialog id={modalId} class="modal">
	<div class="modal-box relative space-y-2">
		<h3 class="font-bold text-lg mb-4">Share project</h3>

		<div class="flex flex-row space-x-2">
			<input type="text" placeholder="Email, comma separated" class="input input-bordered w-full" />
			<button class="btn btn-primary">Invite</button>
		</div>

		<label for="access-input" class="label cursor-pointer">
			<span class="label-text"
				>Everyone at
				<b>{teamName}</b>
				can access this file</span
			>
		</label>
		<input
			type="text"
			id="access-input"
			placeholder="Email, comma separated"
			class="input input-bordered w-full"
		/>
		<div class="divider"></div>

		<!-- Users with access -->
		<div class="flex items-center space-x-4">
			<!-- TODO: Use team's access -->
			<div class="flex flex-row items-center pb-4 w-full">
				<div class="avatar">
					<div class="skeleton w-6 mask mask-circle">
						<!-- <img src={profileImageUrl} alt="Avatar of {userName}" /> -->
						<div class="skeleton"></div>
					</div>
				</div>
				<div class="px-2">{'User name'}</div>
				<div class="ml-auto">
					<button class="text-xs p-2 hover:shadow-sm hover:bg-gray-50 rounded"> Owner </button>
				</div>
			</div>
		</div>
		<button
			class="modal-action btn btn-outline"
			on:click={() => toast.push('Link copied to clipboard')}
		>
			Copy link
		</button>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style>
	#share-modal {
		transition: none !important;
		animation: none !important;
	}
</style>
