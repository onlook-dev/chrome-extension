const testFirebaseConfig = {
	apiKey: import.meta.env.VITE_TEST_API_KEY,
	authDomain: import.meta.env.VITE_TEST_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_TEST_PROJECT_ID,
	storageBucket: import.meta.env.VITE_TEST_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_TEST_MESSAGE_SENDER_ID,
	appId: import.meta.env.VITE_TEST_APP_ID,
	measurementId: import.meta.env.VITE_TEST_MEASUREMENT_ID
}

const prodFirebaseConfig = {
	apiKey: import.meta.env.VITE_PROD_API_KEY,
	authDomain: import.meta.env.VITE_PROD_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROD_PROJECT_ID,
	storageBucket: import.meta.env.VITE_PROD_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_PROD_MESSAGE_SENDER_ID,
	appId: import.meta.env.VITE_PROD_APP_ID,
	measurementId: import.meta.env.VITE_PROD_MEASUREMENT_ID
}

export const isDevelopment = process.env.NODE_ENV === 'development'
export const firebaseConfig = isDevelopment ? testFirebaseConfig : prodFirebaseConfig
