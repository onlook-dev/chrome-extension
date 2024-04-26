import { FirebaseService } from '$lib/storage';
import {
	getPaymentFromSessionId,
	getPaymentFromSubscriptionId,
	setPaymentStatus
} from '$lib/storage/payment';
import { getTeamFromPaymentId, setTeamTier } from '$lib/storage/team';
import { stripeConfig, tierMapping } from '$lib/utils/env';
import { paymentsMapStore, teamsMapStore } from '$lib/utils/store';
import { FirestoreCollections } from '$shared/constants';
import { PaymentStatus } from '$shared/models';

import Stripe from 'stripe';

import type { Team, Tier, Payment } from '$shared/models';

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

export async function getStripeSubscriptionEnd(subscriptionId: string) {
	const subscription = await stripe.subscriptions.retrieve(subscriptionId);

	const subscriptionEnd = subscription?.current_period_end as number;
	// convert subscriptionEnd to a date MMM DD
	const date = new Date(subscriptionEnd * 1000);
	return date;
}

export async function handleCheckoutSessionCompleted(event: Stripe.Event) {
	const session = event.data.object as Stripe.Checkout.Session;

	if (!session.subscription) {
		return Error('Not a subscription session');
	}

	const payment = await getPaymentFromSessionId(session.id);

	if (!payment) {
		return Error('Payment not found');
	}

	const stripePaymentStatus = await getStripePaymentStatus(session);
	const team = await getTeamFromPaymentId(payment.id);

	if (stripePaymentStatus === 'paid' || stripePaymentStatus === 'succeeded') {
		payment.paymentStatus = PaymentStatus.PAID;
		payment.subscriptionId = session.subscription as string;
		team.tier = tierMapping[payment.stripePriceId] as Tier;
		team.paymentId = payment.id;

		paymentsMapStore.update((payments) => payments.set(payment.id, payment));
		teamsMapStore.update((teams) => teams.set(team.id, team));

		const paymentService = new FirebaseService<Payment>(FirestoreCollections.PAYMENTS);
		const teamService = new FirebaseService<Team>(FirestoreCollections.TEAMS);
		await teamService.post(team);
		await paymentService.post(payment);

		return;
	} else {
		await setPaymentStatus(payment.id, PaymentStatus.UNPAID);

		return;
	}
}

export async function handleCheckoutSessionExpired(event: Stripe.Event) {
	const session = event.data.object as Stripe.Checkout.Session;

	const payment = await getPaymentFromSessionId(session.id);

	if (!payment) {
		return Error('Payment not found');
	}

	await setPaymentStatus(payment.id, PaymentStatus.EXPIRED);

	return;
}

export async function handleSubscriptionDeleted(event: Stripe.Event) {
	const subscription = event.data.object as Stripe.Subscription;

	const payment = await getPaymentFromSubscriptionId(subscription.id);

	if (!payment) {
		return Error('Payment not found');
	}

	const team = await getTeamFromPaymentId(payment.id);

	if (!team) {
		return Error('Team not found');
	}

	payment.paymentStatus = PaymentStatus.CANCELLED;
	team.tier = tierMapping[payment.stripePriceId] as Tier;

	paymentsMapStore.update((payments) => payments.set(payment.id, payment));
	teamsMapStore.update((teams) => teams.set(team.id, team));

	const paymentService = new FirebaseService<Payment>(FirestoreCollections.PAYMENTS);

	await setTeamTier(team.id, team.tier);
	await paymentService.post(payment);

	return;
}

export async function cancelStripeSubscription(subscriptionId: string) {
	const subscription = await stripe.subscriptions.cancel(subscriptionId);

	return subscription;
}
