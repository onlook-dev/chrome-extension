<script lang="ts">
	import { setTeamPaymentId } from '$lib/storage/team';
	import { priceIdMapping } from '$lib/utils/env';
	import { paymentsMapStore, teamsMapStore } from '$lib/utils/store';
	import { PaymentStatus, type Payment } from '$shared/models/payment';
	import { nanoid } from 'nanoid';
	import { Tier } from '$shared/models/team';
	import { postPaymentToFirebase } from '$lib/storage/payment';
	import { getStripeSubscriptionEnd } from '$lib/stripe/stripe';
	import PlanFeatureRow from './PlanFeatureRow.svelte';

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
	<div class="modal-container bg-white rounded-md shadow-lg p-6 w-full max-w-[80%] mx-auto">
		<h2 class="text-2xl font-bold text-center">Choose Your Plan</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			<div class="border border-gray-200 rounded-lg p-6">
				<h3 class="text-xl font-bold text-center">{Tier.FREE}</h3>
				<p class="text-center text-gray-500">Basic features for free</p>
				<div class="grid gap-4 mt-4">
					<PlanFeatureRow description="File Storage" />
					<PlanFeatureRow description="Team Collaboration" />
					<PlanFeatureRow description="Advanced Design Tools" />
				</div>

				<button
					class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-4 w-full"
					disabled={plan === Tier.FREE}
				>
					{plan === Tier.FREE ? 'Current Plan' : 'Downgrade'}
				</button>
			</div>
			{#if subscriptionEnd === ''}
				<div class="border border-gray-200 rounded-lg p-6">
					<h3 class="text-xl font-bold text-center">{Tier.PRO}</h3>
					<p class="text-center text-gray-500">Advanced features for $15/month</p>
					<div class="grid gap-4 mt-4">
						<PlanFeatureRow description="File Storage" />
						<PlanFeatureRow description="Team Collaboration" />
						<PlanFeatureRow description="Advanced Design Tools" />
					</div>
					<button
						class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-4 w-full"
						on:click={() => (plan === Tier.PRO ? cancelSubscription() : checkout(Tier.PRO))}
					>
						{plan === Tier.PRO ? 'Cancel' : 'Upgrade'}
					</button>
				</div>
			{:else}
				<div class="border border-gray-200 rounded-lg p-6">
					<h3 class="text-xl font-bold text-center">{Tier.PRO}</h3>
					<p class="text-center text-gray-500">Advanced features for $15/month</p>
					<div class="grid gap-4 mt-4">
						<PlanFeatureRow description="File Storage" />
						<PlanFeatureRow description="Team Collaboration" />
						<PlanFeatureRow description="Advanced Design Tools" />
					</div>
					<div class="divider" />
					<div class="flex flex-col">
						<p class="">Your plan is live until {subscriptionEnd}</p>
						<p class="">Please email <b>contact@onlook.dev</b> to cancel</p>
					</div>
				</div>
			{/if}
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
