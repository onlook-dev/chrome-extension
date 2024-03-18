import {
	getObjectFromCollection,
	getObjectFromCollectionWhere,
	postObjectToCollection,
	subscribeToDocument
} from '$lib/firebase/firestore';
import { FirestoreCollections } from '$shared/constants';
import type { Payment, PaymentStatus } from '$shared/models/payment';

export async function getPaymentFromFirebase(paymentId: string): Promise<Payment> {
	const paymentData = await getObjectFromCollection(FirestoreCollections.PAYMENTS, paymentId);
	return paymentData as Payment;
}

export async function getPaymentFromSessionId(checkoutSessionId: string): Promise<Payment> {
	const paymentData = await getObjectFromCollectionWhere(
		FirestoreCollections.PAYMENTS,
		'checkoutSessionId',
		checkoutSessionId
	);
	return paymentData as Payment;
}

export async function getPaymentFromSubscriptionId(subscriptionId: string): Promise<Payment> {
	const paymentData = await getObjectFromCollectionWhere(
		FirestoreCollections.PAYMENTS,
		'subscriptionId',
		subscriptionId
	);
	return paymentData as Payment;
}

export async function postPaymentToFirebase(payment: Payment) {
	const objectId = await postObjectToCollection(FirestoreCollections.PAYMENTS, payment, payment.id);
	console.log('Posted firebase payment with ID', objectId);
	return;
}

export async function subscribeToPayment(
	paymentId: string,
	callback: (data: Payment) => void
): Promise<() => void> {
	const unsubscribe = await subscribeToDocument(FirestoreCollections.PAYMENTS, paymentId, callback);
	return unsubscribe;
}

export async function setSessionId(paymentId: string, checkoutSessionId: string) {
	const payment = await getPaymentFromFirebase(paymentId);
	payment.checkoutSessionId = checkoutSessionId;
	await postPaymentToFirebase(payment);
}

export async function setPaymentStatus(paymentId: string, paymentStatus: PaymentStatus) {
	const payment = await getPaymentFromFirebase(paymentId);
	payment.paymentStatus = paymentStatus;
	await postPaymentToFirebase(payment);
}
