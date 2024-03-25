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
	PUBLIC_TEST_STRIPE_WEBHOOK_ID,
	PUBLIC_PROD_STRIPE_SK,
	PUBLIC_PROD_STRIPE_PRODUCT_ID_PRO,
	PUBLIC_PROD_STRIPE_PRODUCT_ID_ORG,
	PUBLIC_PROD_STRIPE_PRODUCT_ID_ENTERPRISE,
	PUBLIC_PROD_STRIPE_WEBHOOK_ID,
	PUBLIC_TEST_URL,
	PUBLIC_PROD_URL,
	PUBLIC_TEST_GITHUB_APP_ID,
	PUBLIC_TEST_GITHUB_PRIVATE_KEY,
	PUBLIC_TEST_GITHUB_APP_URL,
	PUBLIC_PROD_GITHUB_APP_ID,
	PUBLIC_PROD_GITHUB_PRIVATE_KEY,
	PUBLIC_PROD_GITHUB_APP_URL,
	PUBLIC_TEST_OPENAI_API_KEY,
	PUBLIC_TEST_OPENAI_ORG,
	PUBLIC_PROD_OPENAI_API_KEY,
	PUBLIC_PROD_OPENAI_ORG
} from '$env/static/public';

import { Tier } from '$shared/models/team';

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
	enterprisePriceId: PUBLIC_TEST_STRIPE_PRODUCT_ID_ENTERPRISE,
	webhookSecret: PUBLIC_TEST_STRIPE_WEBHOOK_ID
};

const prodStripeConfig = {
	stripeKey: PUBLIC_PROD_STRIPE_SK,
	proPriceId: PUBLIC_PROD_STRIPE_PRODUCT_ID_PRO,
	orgPriceId: PUBLIC_PROD_STRIPE_PRODUCT_ID_ORG,
	enterprisePriceId: PUBLIC_PROD_STRIPE_PRODUCT_ID_ENTERPRISE,
	webhookSecret: PUBLIC_PROD_STRIPE_WEBHOOK_ID
};

const testGithubConfig = {
	appUrl: PUBLIC_TEST_GITHUB_APP_URL,
	appId: PUBLIC_TEST_GITHUB_APP_ID,
	privateKey: PUBLIC_TEST_GITHUB_PRIVATE_KEY
};

const prodGithubConfig = {
	appUrl: PUBLIC_PROD_GITHUB_APP_URL,
	appId: PUBLIC_PROD_GITHUB_APP_ID,
	privateKey: PUBLIC_PROD_GITHUB_PRIVATE_KEY
};

const testOpenAiConfig = {
	apiKey: PUBLIC_TEST_OPENAI_API_KEY,
	organization: PUBLIC_TEST_OPENAI_ORG,
};

const prodOpenAiConfig = {
	apiKey: PUBLIC_PROD_OPENAI_API_KEY,
	organization: PUBLIC_PROD_OPENAI_ORG,
};

export const isDevelopment: boolean = import.meta.env.DEV;
export const isFirebaseEmulator: boolean = import.meta.env.VITE_FIREBASE_EMULATOR;
export const firebaseConfig = isDevelopment ? testFirebaseConfig : prodFirebaseConfig;
export const stripeConfig = isDevelopment ? testStripeConfig : prodStripeConfig;
export const baseUrl = isDevelopment ? PUBLIC_TEST_URL : PUBLIC_PROD_URL;
export const githubConfig = isDevelopment ? testGithubConfig : prodGithubConfig;
export const openAiConfig = isDevelopment ? testOpenAiConfig : prodOpenAiConfig;

export const priceIdMapping = {
	[Tier.FREE]: isDevelopment ? 'free' : 'free',
	[Tier.PRO]: isDevelopment ? testStripeConfig.proPriceId : prodStripeConfig.proPriceId,
	[Tier.ORG]: isDevelopment ? testStripeConfig.orgPriceId : prodStripeConfig.orgPriceId,
	[Tier.ENTERPRISE]: isDevelopment
		? testStripeConfig.enterprisePriceId
		: prodStripeConfig.enterprisePriceId
};

export const tierMapping = Object.fromEntries(
	Object.entries(priceIdMapping).map(([key, value]) => [value, key])
);
