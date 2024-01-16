<script lang="ts">
	import { setTeamPaymentId } from '$lib/storage/team';
	import { priceIdMapping } from '$lib/utils/env';
	import { paymentsMapStore, teamsMapStore } from '$lib/utils/store';
	import { PaymentStatus, type Payment } from '$shared/models/payment';
	import { nanoid } from 'nanoid';
	import { Tier } from '$shared/models/team';
	import { postPaymentToFirebase } from '$lib/storage/payment';
	const modalId = 'plan-modal';

	export let teamId: string;

	let selectedPlan = $teamsMapStore.get(teamId)?.tier ?? Tier.BASIC;

	$: plan = selectedPlan;

	function selectPlan() {
		closeModal();
	}

	async function createPayment(checkoutSessionId: string) {
		const priceId = priceIdMapping[plan];

		const newPayment: Payment = {
			id: nanoid(),
			stripePriceId: priceId,
			paymentStatus: PaymentStatus.PENDING,
			checkoutSessionId: checkoutSessionId
		};

		paymentsMapStore.update((payments) => payments.set(newPayment.id, newPayment));
		teamsMapStore.update((teams) => {
			const team = teams.get(teamId);
			if (team) {
				team.paymentId = newPayment.id;
			}
			return teams;
		});

		await postPaymentToFirebase(newPayment);
		await setTeamPaymentId(teamId, newPayment.id);
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

		await createPayment(data.sessionId);

		window.location.replace(data.url);
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

<button
	on:click={showModal}
	class="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded opacity-80"
>
	{plan}
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
			<span class="label-text"> Everyone on the team will have this plan</span>
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
