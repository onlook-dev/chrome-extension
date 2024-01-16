import { getPaymentFromSessionId, setPaymentStatus } from '$lib/storage/payment';
import { getTeamFromPaymentId, setTeamTier } from '$lib/storage/team';
import { stripeConfig, tierMapping } from '$lib/utils/env';
import { paymentsMapStore, teamsMapStore } from '$lib/utils/store';
import { PaymentStatus } from '$shared/models/payment';
import type { Tier } from '$shared/models/team';
import Stripe from 'stripe';

export const stripe = new Stripe(stripeConfig.stripeKey, {
	apiVersion: '2023-10-16',
	typescript: true
});

export async function getStripePaymentStatus(session: Stripe.Checkout.Session) {
	const paymentStatus = session?.payment_status;

	if (!paymentStatus) {
		const intent = await stripe.paymentIntents.retrieve(session?.payment_intent as string);

		return intent?.status as string;
	}

	return paymentStatus as string;
}

export async function handleStripeEvent(event: Stripe.Event) {
	const session = event.data.object as Stripe.Checkout.Session;

	if (!session?.id) {
		return Error('No session id');
	}

	const payment = await getPaymentFromSessionId(session.id);
	console.log('paymentId      :', payment.id);
	console.log('stripePriceId  :', payment.stripePriceId);

	if (!payment) {
		return Error('Payment not found');
	}

	if (event.type === 'checkout.session.completed') {
		const stripePaymentStatus = await getStripePaymentStatus(session);
		const team = await getTeamFromPaymentId(payment.id);

		if (stripePaymentStatus === 'paid' || stripePaymentStatus === 'succeeded') {
			payment.paymentStatus = PaymentStatus.PAID;
			team.tier = tierMapping[payment.stripePriceId] as Tier;

			paymentsMapStore.update((payments) => payments.set(payment.id, payment));
			teamsMapStore.update((teams) => teams.set(team.id, team));

			await setTeamTier(team.id, team.tier);
			await setPaymentStatus(payment.id, payment.paymentStatus);

			return;
		} else {
			await setPaymentStatus(payment.id, PaymentStatus.UNPAID);

			return;
		}
	}

	if (event.type === 'checkout.session.expired') {
		await setPaymentStatus(payment.id, PaymentStatus.EXPIRED);

		return;
	}
}
