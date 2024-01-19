<script lang="ts">
	import { setTeamPaymentId } from '$lib/storage/team';
	import { priceIdMapping } from '$lib/utils/env';
	import { paymentsMapStore, teamsMapStore } from '$lib/utils/store';
	import { PaymentStatus, type Payment } from '$shared/models/payment';
	import { nanoid } from 'nanoid';
	import { Tier } from '$shared/models/team';
	import { postPaymentToFirebase } from '$lib/storage/payment';
	import { getStripeSubscriptionEnd } from '$lib/stripe/stripe';

	export let teamId: string;
	let subscriptionEnd = '';
	const modalId = 'plan-modal';

	$: plan = $teamsMapStore.get(teamId)?.tier ?? Tier.FREE;

	async function createPayment(checkoutSessionId: string, priceId: string) {
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

	async function checkout(tier: Tier) {
		const priceId = priceIdMapping[tier];
		const data = await fetch('/payment', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				priceId
			})
		}).then((data) => data.json());

		await createPayment(data.sessionId, priceId);

		window.location.replace(data.url);
	}

	async function cancelSubscription() {
		const team = $teamsMapStore.get(teamId);
		if (team?.paymentId) {
			const payment = $paymentsMapStore.get(team.paymentId);
			if (payment?.subscriptionId) {
				const endDate = new Date(await getStripeSubscriptionEnd(payment.subscriptionId));
				subscriptionEnd = endDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
			}
		}
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
	<div class="modal-container bg-white rounded-md p-4 shadow-lg">
		<h3 class="font-bold text-lg mb-4">Choose a plan</h3>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div
				class="plan-card bg-gray-300 p-4 rounded-lg border opacity-80 flex items-center justify-center flex-col"
			>
				<h4 class="text-xl font-bold mb-2">
					{Tier.FREE}
					{plan === Tier.FREE ? '(your plan)' : ''}
				</h4>
				<div class="mb-2 flex items-center justify-center flex-col">
					<p class="plan-description">for trying things out</p>
				</div>
				<div class="py-8"></div>
			</div>

			{#if subscriptionEnd === ''}
				<div
					class="plan-card bg-blue-600 p-4 rounded-lg border opacity-80 flex items-center justify-center flex-col"
				>
					<h4 class="text-xl font-bold text-white mb-2">
						{Tier.PRO}
						{plan === Tier.PRO ? '(your plan)' : ''}
					</h4>
					<div class="mb-2 flex items-center justify-center flex-col">
						<p class="text-white">$15/team/mo.</p>
						<p class="text-white">early access to new features</p>
					</div>
					<div class="py-2"></div>
					<button
						class="btn-select-plan bg-gray-100 hover:bg-gray-300 cursor-pointer text-xs font-bold py-1 px-2 rounded opacity-80"
						on:click={() => (plan === Tier.PRO ? cancelSubscription() : checkout(Tier.PRO))}
					>
						{plan === Tier.PRO ? 'cancel' : 'upgrade'}
					</button>
				</div>
			{:else}
				<div
					class="plan-card bg-blue-600 p-4 rounded-lg border opacity-80 flex items-center justify-center flex-col max-w-xs"
				>
					<div class="mb-2 flex items-center justify-center flex-col">
						<p class="text-white">please email erik@onlook.dev to cancel</p>
						<p class="text-white">your plan is live until {subscriptionEnd}</p>
					</div>
				</div>
			{/if}
		</div>

		<div class="modal-footer mt-4 text-right">
			<button class="btn-close" on:click={closeModal}>Close</button>
		</div>
	</div>
</dialog>

<style>
	#plan-modal {
		transition: none !important;
		animation: none !important;
	}
</style>
