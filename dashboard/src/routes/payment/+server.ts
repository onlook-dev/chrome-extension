import { baseUrl } from '$lib/utils/env';
import { stripe } from '$lib/stripe/stripe';
import type { RequestHandler } from '@sveltejs/kit';
import { DashboardRoutes } from '$shared/constants';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const priceId = data.priceId;

	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		mode: 'subscription',
		success_url: `${baseUrl}${DashboardRoutes.DASHBOARD}`,
		cancel_url: `${baseUrl}${DashboardRoutes.DASHBOARD}`
	});

	return new Response(
		JSON.stringify({
			url: session.url,
			sessionId: session.id
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
