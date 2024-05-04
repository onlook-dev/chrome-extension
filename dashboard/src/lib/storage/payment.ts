import {
	getObjectFromCollectionWhere
} from '$lib/firebase/firestore';
import { FirestoreCollections } from '$shared/constants';
import type { Payment, PaymentStatus } from '$shared/models';
import { FirebaseService } from '.';

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

export async function setSessionId(paymentId: string, checkoutSessionId: string) {
	const paymentServices = new FirebaseService<Payment>(FirestoreCollections.PAYMENTS);
	const payment = await paymentServices.get(paymentId);
	payment.checkoutSessionId = checkoutSessionId;
	await paymentServices.post(payment);
}

export async function setPaymentStatus(paymentId: string, paymentStatus: PaymentStatus) {
	const paymentServices = new FirebaseService<Payment>(FirestoreCollections.PAYMENTS);
	const payment = await paymentServices.get(paymentId);
	payment.paymentStatus = paymentStatus;
	await paymentServices.post(payment);
}
