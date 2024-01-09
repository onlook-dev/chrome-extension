import {
	TEST_API_KEY,
	TEST_AUTH_DOMAIN,
	TEST_PROJECT_ID,
	TEST_STORAGE_BUCKET,
	TEST_MESSAGE_SENDER_ID,
	TEST_APP_ID,
	TEST_MEASUREMENT_ID,
	PROD_API_KEY,
	PROD_AUTH_DOMAIN,
	PROD_PROJECT_ID,
	PROD_STORAGE_BUCKET,
	PROD_MESSAGE_SENDER_ID,
	PROD_APP_ID,
	PROD_MEASUREMENT_ID,
	NODE_ENV
} from '$env/static/private';

const testFirebaseConfig = {
	apiKey: TEST_API_KEY,
	authDomain: TEST_AUTH_DOMAIN,
	projectId: TEST_PROJECT_ID,
	storageBucket: TEST_STORAGE_BUCKET,
	messagingSenderId: TEST_MESSAGE_SENDER_ID,
	appId: TEST_APP_ID,
	measurementId: TEST_MEASUREMENT_ID
};

const prodFirebaseConfig = {
	apiKey: PROD_API_KEY,
	authDomain: PROD_AUTH_DOMAIN,
	projectId: PROD_PROJECT_ID,
	storageBucket: PROD_STORAGE_BUCKET,
	messagingSenderId: PROD_MESSAGE_SENDER_ID,
	appId: PROD_APP_ID,
	measurementId: PROD_MEASUREMENT_ID
};

export const isDevelopment = NODE_ENV === 'development';
export const firebaseConfig = isDevelopment ? testFirebaseConfig : prodFirebaseConfig;
