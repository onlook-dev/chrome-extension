<script lang="ts">
	import { setTeamPaymentId } from '$lib/storage/team';
	import { priceIdMapping } from '$lib/utils/env';
	import { paymentsMapStore, teamsMapStore } from '$lib/utils/store';
	import { PaymentStatus, type Payment } from '$shared/models/payment';
	import { nanoid } from 'nanoid';
	import { Tier } from '$shared/models/team';
	import { getStripeSubscriptionEnd } from '$lib/stripe/stripe';
	import PlanFeatureRow from './PlanFeatureRow.svelte';
	import { FirebaseService } from '$lib/storage';
	import { FirestoreCollections } from '$shared/constants';

	export let teamId: string;
	const modalId = 'plan-modal';
	const paymentService = new FirebaseService<Payment>(FirestoreCollections.PAYMENTS);
	let subscriptionEnd = '';
	let loading = false;

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

		await paymentService.post(newPayment);
		await setTeamPaymentId(teamId, newPayment.id);
	}

	async function checkout(tier: Tier) {
		loading = true;
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
		loading = false;
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
	class="bg-green-100 text-green-700 hover:outline text-xs font-semibold py-1 px-2 rounded opacity-80 {plan ===
	Tier.FREE
		? 'bg-blue-100 text-blue-700'
		: 'bg-red-100 text-red-700'}"
>
	{plan}
</button>

<dialog id={modalId} class="modal fixed inset-0 flex items-center justify-center">
	<div class=" modal-container bg-black rounded-md shadow-lg p-6 w-[80%] max-w-2xl mx-auto">
		<h2 class="text-2xl font-bold text-center">Choose Your Plan</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			<div class="border border-gray-700 rounded-lg p-6">
				<h3 class="text-xl font-bold text-center">{Tier.FREE}</h3>
				<p class="text-center text-gray-300">Basic features for free</p>
				<div class="grid gap-4 mt-4">
					<PlanFeatureRow description="Unlimited editing" />
					<PlanFeatureRow description="Design inspection tools" />
					<PlanFeatureRow description="Invite up to 3 teammates" />
				</div>

				{#if plan === Tier.FREE}
					<button
						class="btn btn-outline disabled:text-gray-500 border-gray-300 h-10 px-4 py-2 mt-4 w-full"
						disabled
					>
						Current Plan
					</button>
				{/if}
			</div>
			<div class="border border-gray-700 rounded-lg p-6">
				<h3 class="text-xl font-bold text-center">{Tier.PRO}</h3>
				<p class="text-center text-gray-300">$15/month</p>
				<div class="grid gap-4 mt-4 mb-4">
					<PlanFeatureRow description="Publish changes to Github" />
					<PlanFeatureRow description="Early access to new features" />
				</div>
				<div class="grid gap-4 mt-4">
					<PlanFeatureRow description="Advanced design tools" />
				</div>
				{#if subscriptionEnd === ''}
					<button
						class="{plan === Tier.FREE
							? 'btn btn-white'
							: 'btn-outline'} border-gray-700 btn h-10 px-4 py-2 mt-4 w-full"
						on:click={() => (plan === Tier.PRO ? cancelSubscription() : checkout(Tier.PRO))}
						disabled={loading}
					>
						{#if loading}
							<span class="loading loading-xs mr-2"></span>
							<p>Checking out</p>
						{:else}
							{plan === Tier.PRO ? 'Cancel' : `Upgrade to ${Tier.PRO}`}
						{/if}
					</button>
				{:else}
					<div class="divider" />
					<div class="flex flex-col">
						<p class="">Your plan is live until {subscriptionEnd}</p>
						<p class="">Please email <b>contact@onlook.dev</b> to cancel</p>
					</div>
				{/if}
			</div>
		</div>

		<div class="modal-footer mt-4 text-right">
			<button class="btn-close btn btn-ghost" on:click={closeModal}>Cancel</button>
		</div>
	</div>
</dialog>

<style>
	#plan-modal {
		transition: none !important;
		animation: none !important;
	}
</style>
