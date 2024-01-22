<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	import GitHub from '~icons/mdi/github';
	import Slack from '~icons/devicon/slack';
	import Jira from '~icons/logos/jira';
	import Linear from '~icons/logos/linear-icon';

	// import type { ProjectImpl } from '$lib/models/project';
	// export let project: ProjectImpl | undefined;

	const modalId = 'publish-modal';
	const teamName = 'Team name';
</script>

<button
	class="btn btn-primary"
	on:click={() => {
		// @ts-ignore - showModal() does not exist on HTMLElement
		document?.getElementById(modalId)?.showModal();
	}}>Publish</button
>
<dialog id={modalId} class="modal">
	<div class="modal-box relative space-y-6">
		<h3 class="font-bold text-lg mb-4">Publish project</h3>

		<div class="flex flex-row space-x-2">
			<input type="text" placeholder="Email, comma separated" class="input input-bordered w-full" />
			<button
				class="btn btn-primary"
				on:click={() => {
					toast.push('Sent invite email');
				}}>Invite to project</button
			>
		</div>

		<div class="divider">Coming soon</div>

		<!-- Actions -->
		<div class="form-control space-y-4">
			<button class="btn btn-outline">
				<GitHub class="w-5 h-5" />
				Publish changes to Github</button
			>
			<button class="btn btn-outline">
				<Linear class="w-4 h-4" />
				Open Linear ticket</button
			>
			<button class="btn btn-outline">
				<Jira class="w-4 h-4" />
				Open Jira ticket</button
			>
			<button class="btn btn-outline">
				<Slack class="w-4 h-4" />
				Create Slack thread</button
			>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
