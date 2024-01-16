import { stripeConfig } from '$lib/utils/env';
import Stripe from 'stripe';

export const stripe = new Stripe(stripeConfig.stripeKey, {
	apiVersion: '2023-10-16',
	typescript: true
});

export async function getPaymentStatus(session: Stripe.Checkout.Session) {
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

	// Find payment with checkout session id

	// throw error if payment not found

	if (event.type === 'checkout.session.completed') {
		const paymentStatus = await getPaymentStatus(session);

		if (paymentStatus === 'paid' || paymentStatus === 'succeeded') {
			// update payment status
			// find team with payment id and update tier
		} else {
			// update status to unpaid
		}
	}
}
