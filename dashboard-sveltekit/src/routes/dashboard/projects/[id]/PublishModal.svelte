<script lang="ts">
	import GitHub from '~icons/mdi/github';
	import Slack from '~icons/devicon/slack';
	import Jira from '~icons/logos/jira';
	import Linear from '~icons/logos/linear-icon';
	import { goto } from '$app/navigation';
	import { DashboardRoutes } from '$shared/constants';
	import type { Project } from '$shared/models/project';
	import { exportToPRComments } from '$lib/github/github';

	export let project: Project;
	export let userId: string;

	const modalId = 'publish-modal';
	let isLoading = false;
	let prLink: string | undefined;

	function showModal() {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (modal) {
			modal.showModal();
			modal.addEventListener(
				'click',
				(event) => {
					if (event.target === modal) {
						closeModal();
					}
				},
				{ once: true }
			);
		}
	}

	function closeModal() {
		const modal = document.getElementById(modalId) as HTMLDialogElement;
		if (modal) {
			modal.close();
		}
	}

	async function handlePublishClick() {
		if (!project.githubSettings) {
			goto(`${DashboardRoutes.PROJECTS}/${project.id}${DashboardRoutes.GITHUB}`);
			return;
		}

		isLoading = true;
		try {
			prLink = await exportToPRComments(userId, project.id);
			console.log('PR Link:', prLink);
		} catch (error) {
			console.error('Error publishing changes:', error);
			// TODO: handle error
		} finally {
			isLoading = false;
		}
	}
</script>

<button class="btn btn-primary" on:click={showModal}>Publish</button>
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
			{#if isLoading}
				<button disabled class="btn btn-outline"> Loading... </button>
			{:else if prLink}
				<a href={prLink} target="_blank" class="btn btn-outline">
					<GitHub class="w-5 h-5" />
					View changes in Github
				</a>
			{:else}
				<button class="btn btn-outline" on:click={handlePublishClick}>
					<GitHub class="w-5 h-5" />
					Publish changes to Github
				</button>
			{/if}

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
