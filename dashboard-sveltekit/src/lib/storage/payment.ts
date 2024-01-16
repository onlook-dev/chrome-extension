import {
	getObjectFromCollection,
	getObjectFromCollectionWhere,
	postObjectToCollection,
	subscribeToDocument
} from '$lib/firebase/firestore';
import { FIREBASE_COLLECTION_PAYMENTS } from '$shared/constants';
import type { Payment, PaymentStatus } from '$shared/models/payment';

export async function getPaymentFromFirebase(paymentId: string): Promise<Payment> {
	const paymentData = await getObjectFromCollection(FIREBASE_COLLECTION_PAYMENTS, paymentId);
	return paymentData as Payment;
}

export async function getPaymentFromSessionId(checkoutSessionId: string): Promise<Payment> {
	const paymentData = await getObjectFromCollectionWhere(
		FIREBASE_COLLECTION_PAYMENTS,
		'checkoutSessionId',
		checkoutSessionId
	);
	return paymentData as Payment;
}

export async function postPaymentToFirebase(payment: Payment) {
	console.log('Posting firebase payment');
	const objectId = await postObjectToCollection(FIREBASE_COLLECTION_PAYMENTS, payment, payment.id);
	console.log('Posted firebase payment with ID', objectId);
	return;
}

export async function subscribeToPayment(
	paymentId: string,
	callback: (data: Payment) => void
): Promise<() => void> {
	const unsubscribe = await subscribeToDocument(FIREBASE_COLLECTION_PAYMENTS, paymentId, callback);
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
