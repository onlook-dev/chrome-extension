<script lang="ts">
	import { setTeamPaymentId } from '$lib/storage/team';
	import { priceIdMapping } from '$lib/utils/env';
	import { paymentsMapStore, teamsMapStore } from '$lib/utils/store';
	import { PaymentStatus, Tier, type Payment } from '$shared/models';
	import { nanoid } from 'nanoid';
	import { getStripeSubscriptionEnd } from '$lib/stripe/stripe';
	import { FirebaseService } from '$lib/storage';
	import { FirestoreCollections } from '$shared/constants';
	import { trackMixpanelEvent } from '$lib/mixpanel/client';

	import Button from '$lib/components/ui/button/button.svelte';
	import PlanFeatureRow from './PlanFeatureRow.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	export let teamId: string;
	const paymentService = new FirebaseService<Payment>(FirestoreCollections.PAYMENTS);
	let subscriptionEnd = '';
	let loading = false;
	let modalOpen = false;

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

		trackMixpanelEvent('Upgrade to Pro', { tier });
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
</script>

<Dialog.Root bind:open={modalOpen}>
	<Dialog.Trigger>
		<button
			class="bg-green-500/25 text-green-400 hover:bg-green-500/30 text-xs py-1 px-2 opacity-80 {plan ===
			Tier.FREE
				? 'bg-blue-100 text-blue-700'
				: 'bg-red-100 text-red-700'}"
		>
			{plan}
		</button>
	</Dialog.Trigger>
	<Dialog.Content class="dark text-primary min-w-[50rem]">
		<Dialog.Header>
			<Dialog.Title>Choose Your Plan</Dialog.Title>
		</Dialog.Header>
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
					<Button class="btn btn-outline border-gray-300 h-10 px-4 py-2 mt-4 w-full" disabled>
						Current Plan
					</Button>
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
					<Button
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
					</Button>
				{:else}
					<div class="divider" />
					<div class="flex flex-col">
						<p class="">Your plan is live until {subscriptionEnd}</p>
						<p class="">Please email <b>contact@onlook.dev</b> to cancel</p>
					</div>
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
