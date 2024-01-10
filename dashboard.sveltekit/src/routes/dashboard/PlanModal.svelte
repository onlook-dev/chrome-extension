<script lang="ts">
	const modalId = 'plan-modal';
	const teamName = 'Team name';
	import { Tier } from '../../../../models.typescript/pricing';

	let plan = Tier.BASIC;

	function selectPlan() {
		closeModal();
	}

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
</script>

<button class="font-semibold" on:click={showModal}>
	Plan: {plan}
</button>

<dialog id={modalId} class="modal fixed inset-0 flex items-center justify-center">
	<div class="modal-box space-y-2">
		<h3 class="font-bold text-lg mb-4">Select a Plan</h3>

		<div class="flex flex-row space-x-2">
			<select bind:value={plan} class="input input-bordered w-full">
				<option value={Tier.BASIC}>{Tier.BASIC}</option>
				<option value={Tier.PRO}>{Tier.PRO}</option>
				<option value={Tier.ORG}>{Tier.ORG}</option>
				<option value={Tier.ENTERPRISE}>{Tier.ENTERPRISE}</option>
			</select>
			<button class="btn btn-primary" on:click={selectPlan}>Select</button>
		</div>

		<div class="label cursor-pointer">
			<span class="label-text">
				Everyone at
				<b>{teamName}</b>
				will have this plan's features
			</span>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
