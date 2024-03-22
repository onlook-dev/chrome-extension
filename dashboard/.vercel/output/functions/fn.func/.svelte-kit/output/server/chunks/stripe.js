import { g as getObjectFromCollectionWhere, F as FirebaseService } from "./index2.js";
import { F as FirestoreCollections } from "./constants.js";
import { s as stripeConfig, t as tierMapping } from "./firebase.js";
import { a as paymentsMapStore, t as teamsMapStore } from "./store.js";
import Stripe from "stripe";
async function getPaymentFromSessionId(checkoutSessionId) {
  const paymentData = await getObjectFromCollectionWhere(
    FirestoreCollections.PAYMENTS,
    "checkoutSessionId",
    checkoutSessionId
  );
  return paymentData;
}
async function getPaymentFromSubscriptionId(subscriptionId) {
  const paymentData = await getObjectFromCollectionWhere(
    FirestoreCollections.PAYMENTS,
    "subscriptionId",
    subscriptionId
  );
  return paymentData;
}
async function setPaymentStatus(paymentId, paymentStatus) {
  const paymentServices = new FirebaseService(FirestoreCollections.PAYMENTS);
  const payment = await paymentServices.get(paymentId);
  payment.paymentStatus = paymentStatus;
  await paymentServices.post(payment);
}
async function getTeamFromPaymentId(paymentId) {
  const teamData = await getObjectFromCollectionWhere(
    FirestoreCollections.TEAMS,
    "paymentId",
    paymentId
  );
  return teamData;
}
async function setTeamTier(teamId, tier) {
  const teamServices = new FirebaseService(FirestoreCollections.TEAMS);
  const team = await teamServices.get(teamId);
  team.tier = tier;
  await teamServices.post(team);
}
var PaymentStatus = /* @__PURE__ */ ((PaymentStatus2) => {
  PaymentStatus2["UNPAID"] = "unpaid";
  PaymentStatus2["PENDING"] = "pending";
  PaymentStatus2["EXPIRED"] = "expired";
  PaymentStatus2["PAID"] = "paid";
  PaymentStatus2["CANCELLED"] = "cancelled";
  return PaymentStatus2;
})(PaymentStatus || {});
const stripe = new Stripe(stripeConfig.stripeKey, {
  apiVersion: "2023-10-16",
  typescript: true
});
async function getStripePaymentStatus(session) {
  const paymentStatus = session?.payment_status;
  if (!paymentStatus) {
    const intent = await stripe.paymentIntents.retrieve(session?.payment_intent);
    return intent?.status;
  }
  return paymentStatus;
}
async function handleCheckoutSessionCompleted(event) {
  const session = event.data.object;
  if (!session.subscription) {
    return Error("Not a subscription session");
  }
  const payment = await getPaymentFromSessionId(session.id);
  if (!payment) {
    return Error("Payment not found");
  }
  const stripePaymentStatus = await getStripePaymentStatus(session);
  const team = await getTeamFromPaymentId(payment.id);
  if (stripePaymentStatus === "paid" || stripePaymentStatus === "succeeded") {
    payment.paymentStatus = PaymentStatus.PAID;
    payment.subscriptionId = session.subscription;
    team.tier = tierMapping[payment.stripePriceId];
    team.paymentId = payment.id;
    paymentsMapStore.update((payments) => payments.set(payment.id, payment));
    teamsMapStore.update((teams) => teams.set(team.id, team));
    const paymentService = new FirebaseService(FirestoreCollections.PAYMENTS);
    const teamService = new FirebaseService(FirestoreCollections.TEAMS);
    await teamService.post(team);
    await paymentService.post(payment);
    return;
  } else {
    await setPaymentStatus(payment.id, PaymentStatus.UNPAID);
    return;
  }
}
async function handleCheckoutSessionExpired(event) {
  const session = event.data.object;
  const payment = await getPaymentFromSessionId(session.id);
  if (!payment) {
    return Error("Payment not found");
  }
  await setPaymentStatus(payment.id, PaymentStatus.EXPIRED);
  return;
}
async function handleSubscriptionDeleted(event) {
  const subscription = event.data.object;
  const payment = await getPaymentFromSubscriptionId(subscription.id);
  if (!payment) {
    return Error("Payment not found");
  }
  const team = await getTeamFromPaymentId(payment.id);
  if (!team) {
    return Error("Team not found");
  }
  payment.paymentStatus = PaymentStatus.CANCELLED;
  team.tier = tierMapping[payment.stripePriceId];
  paymentsMapStore.update((payments) => payments.set(payment.id, payment));
  teamsMapStore.update((teams) => teams.set(team.id, team));
  const paymentService = new FirebaseService(FirestoreCollections.PAYMENTS);
  await setTeamTier(team.id, team.tier);
  await paymentService.post(payment);
  return;
}
export {
  handleCheckoutSessionExpired as a,
  handleCheckoutSessionCompleted as b,
  handleSubscriptionDeleted as h,
  stripe as s
};
