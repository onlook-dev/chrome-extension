import { initializeApp, type FirebaseApp, getApps } from 'firebase/app';
import { isDevelopment } from '../utils/env';
import { getAuth, type Auth } from 'firebase/auth';

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: 'AIzaSyAtnwE7i1Azb_ahlORjf2hJ_9bcjbeADfI',
	authDomain: 'engineering-931f1.firebaseapp.com',
	projectId: 'engineering-931f1',
	storageBucket: 'engineering-931f1.appspot.com',
	messagingSenderId: '734955546377',
	appId: '1:734955546377:web:7f78364adf2b326ef8d5d8'
};

const devConfig = {
	apiKey: 'AIzaSyAhr-k6P6-s02xGqk623lRwAWIayCTm8Bw',
	authDomain: 'engineering-test-c1d78.firebaseapp.com',
	projectId: 'engineering-test-c1d78',
	storageBucket: 'engineering-test-c1d78.appspot.com',
	messagingSenderId: '635742834024',
	appId: '1:635742834024:web:97047e475ce1ec5f1adadd'
};

// Initialize Firebase only if it hasn't been initialized yet
export const app: FirebaseApp =
	getApps().length === 0 ? initializeApp(isDevelopment ? devConfig : firebaseConfig) : getApps()[0];
export const auth: Auth = getAuth(app);
