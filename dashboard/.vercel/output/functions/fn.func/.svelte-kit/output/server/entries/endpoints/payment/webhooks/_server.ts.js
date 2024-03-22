import { s as stripeConfig } from "../../../../chunks/firebase.js";
import { s as stripe, h as handleSubscriptionDeleted, a as handleCheckoutSessionExpired, b as handleCheckoutSessionCompleted } from "../../../../chunks/stripe.js";
const POST = async ({ request }) => {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeConfig.webhookSecret);
  } catch (err) {
    console.warn("Webhook signature verification failed.");
    return new Response(`Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`, {
      status: 400
    });
  }
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event);
      break;
    case "checkout.session.expired":
      await handleCheckoutSessionExpired(event);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event);
      break;
  }
  return new Response(null, { status: 200 });
};
export {
  POST
};
