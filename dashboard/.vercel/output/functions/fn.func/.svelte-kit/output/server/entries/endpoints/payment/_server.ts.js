import { b as baseUrl } from "../../../chunks/firebase.js";
import { s as stripe } from "../../../chunks/stripe.js";
import { D as DashboardRoutes } from "../../../chunks/constants.js";
const POST = async ({ request }) => {
  const data = await request.json();
  const priceId = data.priceId;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: "subscription",
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
        "Content-Type": "application/json"
      }
    }
  );
};
export {
  POST
};
