import {
	PUBLIC_TEST_API_KEY,
	PUBLIC_TEST_AUTH_DOMAIN,
	PUBLIC_TEST_PROJECT_ID,
	PUBLIC_TEST_STORAGE_BUCKET,
	PUBLIC_TEST_MESSAGE_SENDER_ID,
	PUBLIC_TEST_APP_ID,
	PUBLIC_TEST_MEASUREMENT_ID,
	PUBLIC_PROD_API_KEY,
	PUBLIC_PROD_AUTH_DOMAIN,
	PUBLIC_PROD_PROJECT_ID,
	PUBLIC_PROD_STORAGE_BUCKET,
	PUBLIC_PROD_MESSAGE_SENDER_ID,
	PUBLIC_PROD_APP_ID,
	PUBLIC_PROD_MEASUREMENT_ID,
	PUBLIC_TEST_STRIPE_SK,
	PUBLIC_TEST_STRIPE_PRODUCT_ID_PRO,
	PUBLIC_TEST_STRIPE_PRODUCT_ID_ENTERPRISE,
	PUBLIC_TEST_STRIPE_PRODUCT_ID_ORG,
	PUBLIC_PROD_STRIPE_SK,
	PUBLIC_PROD_STRIPE_PRODUCT_ID_PRO,
	PUBLIC_PROD_STRIPE_PRODUCT_ID_ORG,
	PUBLIC_PROD_STRIPE_PRODUCT_ID_ENTERPRISE
} from '$env/static/public';
import { Tier } from '../../../../models/pricing';

const testFirebaseConfig = {
	apiKey: PUBLIC_TEST_API_KEY,
	authDomain: PUBLIC_TEST_AUTH_DOMAIN,
	projectId: PUBLIC_TEST_PROJECT_ID,
	storageBucket: PUBLIC_TEST_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_TEST_MESSAGE_SENDER_ID,
	appId: PUBLIC_TEST_APP_ID,
	measurementId: PUBLIC_TEST_MEASUREMENT_ID
};

const prodFirebaseConfig = {
	apiKey: PUBLIC_PROD_API_KEY,
	authDomain: PUBLIC_PROD_AUTH_DOMAIN,
	projectId: PUBLIC_PROD_PROJECT_ID,
	storageBucket: PUBLIC_PROD_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_PROD_MESSAGE_SENDER_ID,
	appId: PUBLIC_PROD_APP_ID,
	measurementId: PUBLIC_PROD_MEASUREMENT_ID
};

const testStripeConfig = {
	stripeKey: PUBLIC_TEST_STRIPE_SK,
	proPriceId: PUBLIC_TEST_STRIPE_PRODUCT_ID_PRO,
	orgPriceId: PUBLIC_TEST_STRIPE_PRODUCT_ID_ORG,
	enterprisePriceId: PUBLIC_TEST_STRIPE_PRODUCT_ID_ENTERPRISE
};

const prodStripeConfig = {
	stripeKey: PUBLIC_PROD_STRIPE_SK,
	proPriceId: PUBLIC_PROD_STRIPE_PRODUCT_ID_PRO,
	orgPriceId: PUBLIC_PROD_STRIPE_PRODUCT_ID_ORG,
	enterprisePriceId: PUBLIC_PROD_STRIPE_PRODUCT_ID_ENTERPRISE
};

export const isDevelopment = process.env.NODE_ENV === 'development';
export const firebaseConfig = isDevelopment ? testFirebaseConfig : prodFirebaseConfig;
export const stripeConfig = isDevelopment ? testStripeConfig : prodStripeConfig;

export const priceIdMapping = {
	[Tier.PRO]: isDevelopment ? testStripeConfig.proPriceId : prodStripeConfig.proPriceId,
	[Tier.ORG]: isDevelopment ? testStripeConfig.orgPriceId : prodStripeConfig.orgPriceId,
	[Tier.ENTERPRISE]: isDevelopment
		? testStripeConfig.enterprisePriceId
		: prodStripeConfig.enterprisePriceId
};
