<script lang="ts">
	import { priceIdMapping } from '$lib/utils/env';
	const modalId = 'plan-modal';
	const teamName = 'Team name';
	import { Tier } from '$shared/models/team';

	let selectedPlan = Tier.BASIC;

	$: plan = selectedPlan;

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

	async function checkout() {
		const priceId = priceIdMapping[plan];
		const data = await fetch('/payment', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				priceId
			})
		}).then((data) => data.json());

		window.location.replace(data.url);
	}
</script>

<button on:click={showModal}>
	Plan ({plan})
</button>

<dialog id={modalId} class="modal fixed inset-0 flex items-center justify-center">
	<div class="modal-box space-y-2">
		<h3 class="font-bold text-lg mb-4">Select a Plan</h3>

		<div class="flex flex-row space-x-2">
			<select bind:value={selectedPlan} class="input input-bordered w-full">
				<option value={Tier.BASIC}>{Tier.BASIC}</option>
				<option value={Tier.PRO}>{Tier.PRO}</option>
				<option value={Tier.ORG}>{Tier.ORG}</option>
				<option value={Tier.ENTERPRISE}>{Tier.ENTERPRISE}</option>
			</select>
			<button
				class="btn btn-primary"
				on:click={() => (plan === Tier.BASIC ? selectPlan() : checkout())}>Select</button
			>
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

<style>
	#plan-modal {
		transition: none !important;
		animation: none !important;
	}
</style>
