<script lang="ts">
	import PullRequest from '~icons/ph/git-pull-request-bold';
	import Restore from '~icons/ic/baseline-restore';
	import type { GithubHistory } from '$shared/models/github';

	export let githubHistories: GithubHistory[] = [];
	export let restoreActivities = (history: GithubHistory) => {};

	let historyOpen = true;
</script>

{#if githubHistories.length > 0}
	<div
		class="collapse collapse-arrow border rounded-md mt-6 {historyOpen
			? 'collapse-open'
			: 'collapse-close'}"
	>
		<input type="checkbox" on:click={() => (historyOpen = !historyOpen)} />
		<div class="collapse-title">Publish history ({githubHistories.length})</div>
		<div class="collapse-content space-y-2">
			{#each githubHistories as history}
				<div class="flex flex-row max-w-[100%] items-center">
					<p class="line-clamp-1 text-ellipsis max-w-[70%]">
						{history.title}
					</p>
					<div class="ml-auto">
						<div class="tooltip tooltip-left" data-tip="View pull request">
							<button
								class="btn btn-xs btn-square btn-ghost ml-auto"
								on:click={() => window.open(history.pullRequestUrl, '_blank')}
								><PullRequest class="w-4 h-4" /></button
							>
						</div>
						<div class="tooltip tooltip-left" data-tip="Restore changes">
							<button
								class="btn btn-xs btn-square btn-ghost"
								on:click={() => {
									// @ts-ignore
									document.getElementById('confirm_restore_modal').showModal();
								}}><Restore class="w-4 h-4" /></button
							>
						</div>

						<dialog id="confirm_restore_modal" class="modal">
							<div class="modal-box">
								<h3 class="font-bold text-lg">Restore changes?</h3>
								<p class="py-4">This will overwrite your current activities.</p>
								<div class="modal-action">
									<form method="dialog">
										<!-- if there is a button in form, it will close the modal -->
										<button class="btn">Cancel</button>
										<button class="btn btn-error ml-2" on:click={() => restoreActivities(history)}
											>Restore</button
										>
									</form>
								</div>
							</div>
						</dialog>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
