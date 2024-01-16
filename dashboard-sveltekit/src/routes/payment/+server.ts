import { baseUrl } from '$lib/utils/env';
import { stripe } from '$lib/stripe/stripe';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const priceId = data.priceId;
	console.log('priceId:', priceId);

	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		mode: 'subscription',
		success_url: `${baseUrl}/dashboard`,
		cancel_url: `${baseUrl}/dashboard`
	});

	return new Response(
		JSON.stringify({
			url: session.url
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
