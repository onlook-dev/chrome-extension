<script lang="ts">
	import GitHub from '~icons/mdi/github';
	import Slack from '~icons/devicon/slack';
	import Jira from '~icons/logos/jira';
	import Linear from '~icons/logos/linear-icon';
	import { goto } from '$app/navigation';
	import { DashboardRoutes } from '$shared/constants';
	import type { Project } from '$shared/models/project';

	export let project: Project;

	const modalId = 'publish-modal';
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

		<!-- <div class="flex flex-row space-x-2">
			<input type="text" placeholder="Email, comma separated" class="input input-bordered w-full" />
			<button
				class="btn btn-primary"
				on:click={() => {
					toast.push('Sent invite email');
				}}>Invite to project</button
			>
		</div> -->

		<!-- Actions -->
		<div class="form-control space-y-4">
			<button
				class="btn btn-outline"
				on:click={() => goto(`${DashboardRoutes.PROJECTS}/${project.id}${DashboardRoutes.GITHUB}`)}
			>
				<GitHub class="w-5 h-5" />
				Publish changes to Github</button
			>

			<div class="divider">Coming soon</div>

			<button disabled class="btn btn-outline">
				<Linear class="w-4 h-4" />
				Open Linear ticket</button
			>
			<button disabled class="btn btn-outline">
				<Jira class="w-4 h-4" />
				Open Jira ticket</button
			>
			<button disabled class="btn btn-outline">
				<Slack class="w-4 h-4" />
				Create Slack thread</button
			>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
