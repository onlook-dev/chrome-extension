const env = import.meta.env

const testFirebaseConfig = {
	apiKey: env.VITE_TEST_API_KEY,
	authDomain: env.VITE_TEST_AUTH_DOMAIN,
	projectId: env.VITE_TEST_PROJECT_ID,
	storageBucket: env.VITE_TEST_STORAGE_BUCKET,
	messagingSenderId: env.VITE_TEST_MESSAGE_SENDER_ID,
	appId: env.VITE_TEST_APP_ID,
	measurementId: env.VITE_TEST_MEASUREMENT_ID
}

const prodFirebaseConfig = {
	apiKey: env.VITE_PROD_API_KEY,
	authDomain: env.VITE_PROD_AUTH_DOMAIN,
	projectId: env.VITE_PROD_PROJECT_ID,
	storageBucket: env.VITE_PROD_STORAGE_BUCKET,
	messagingSenderId: env.VITE_PROD_MESSAGE_SENDER_ID,
	appId: env.VITE_PROD_APP_ID,
	measurementId: env.VITE_PROD_MEASUREMENT_ID
}

export const isDevelopment: boolean = env.DEV
export const isFirebaseEmulator: boolean = env.VITE_FIREBASE_EMULATOR
export const firebaseConfig = isDevelopment ? testFirebaseConfig : prodFirebaseConfig
export const baseUrl = isDevelopment ? env.VITE_TEST_URL : env.VITE_PROD_URL
export const mixpanelToken = isDevelopment ? env.VITE_TEST_MIXPANEL_TOKEN : env.VITE_PROD_MIXPANEL_TOKEN

export const openAiConfig = {
	apiKey: isDevelopment ? env.VITE_TEST_OPENAI_API_KEY : env.VITE_PROD_OPENAI_API_KEY,
	organization: isDevelopment ? env.VITE_TEST_OPENAI_ORG : env.VITE_PROD_OPENAI_ORG,
};

export const langfuseConfig = {
	secretKey: isDevelopment ? env.VITE_TEST_LANGFUSE_SECRET_KEY : env.VITE_PROD_LANGFUSE_SECRET_KEY,
	publicKey: isDevelopment ? env.VITE_TEST_LANGFUSE_PUBLIC_KEY : env.VITE_PROD_LANGFUSE_PUBLIC_KEY,
	baseUrl: isDevelopment ? env.VITE_TEST_LANGFUSE_BASE_URL : env.VITE_PROD_LANGFUSE_BASE_URL
}
