import { stripeConfig } from '$lib/utils/env';
import {
	handleCheckoutSessionCompleted,
	handleCheckoutSessionExpired,
	handleSubscriptionDeleted,
	stripe
} from '$lib/stripe/stripe';
import type { RequestHandler } from '@sveltejs/kit';
import type Stripe from 'stripe';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature') ?? '';

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(body, signature, stripeConfig.webhookSecret);
	} catch (err) {
		console.warn('Webhook signature verification failed.');

		return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`, {
			status: 400
		});
	}

	switch (event.type) {
		case 'checkout.session.completed':
			await handleCheckoutSessionCompleted(event);
			break;
		case 'checkout.session.expired':
			await handleCheckoutSessionExpired(event);
			break;
		case 'customer.subscription.deleted':
			await handleSubscriptionDeleted(event);
			break;
		default:
	}

	return new Response(null, { status: 200 });
};
