import { getApps, initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
const PUBLIC_PROD_API_KEY = "AIzaSyAwoG7w5ElqY76tNcxdvyw-c-uZuVqP-UY";
const PUBLIC_PROD_AUTH_DOMAIN = "onlook-prod.firebaseapp.com";
const PUBLIC_PROD_PROJECT_ID = "onlook-prod";
const PUBLIC_PROD_STORAGE_BUCKET = "onlook-prod.appspot.com";
const PUBLIC_PROD_MESSAGE_SENDER_ID = "655670367467";
const PUBLIC_PROD_APP_ID = "1:655670367467:web:e09b81c6cb3f72a6781aae";
const PUBLIC_PROD_MEASUREMENT_ID = "G-V1XHBZFFK6";
const PUBLIC_PROD_STRIPE_SK = "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";
const PUBLIC_PROD_STRIPE_PRODUCT_ID_PRO = "price_1ObTrzCrXZplPvVXw15QBn8v";
const PUBLIC_PROD_STRIPE_PRODUCT_ID_ORG = "price_1ObTzOCrXZplPvVXDC3JpxWm";
const PUBLIC_PROD_STRIPE_PRODUCT_ID_ENTERPRISE = "price_1ObU0RCrXZplPvVXfMUotCL2";
const PUBLIC_PROD_STRIPE_WEBHOOK_ID = "whsec_umEEXoCPvkwrXZj5ZvlLUeEKX6mGfn3i";
const PUBLIC_PROD_URL = "https://app.onlook.dev";
var Tier = /* @__PURE__ */ ((Tier2) => {
  Tier2["FREE"] = "Free";
  Tier2["PRO"] = "Pro";
  Tier2["ORG"] = "Organization";
  Tier2["ENTERPRISE"] = "Enterprise";
  return Tier2;
})(Tier || {});
var define_import_meta_env_default = { BASE_URL: "/", MODE: "production", DEV: false, PROD: true, SSR: true };
const prodFirebaseConfig = {
  apiKey: PUBLIC_PROD_API_KEY,
  authDomain: PUBLIC_PROD_AUTH_DOMAIN,
  projectId: PUBLIC_PROD_PROJECT_ID,
  storageBucket: PUBLIC_PROD_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_PROD_MESSAGE_SENDER_ID,
  appId: PUBLIC_PROD_APP_ID,
  measurementId: PUBLIC_PROD_MEASUREMENT_ID
};
const prodStripeConfig = {
  stripeKey: PUBLIC_PROD_STRIPE_SK,
  proPriceId: PUBLIC_PROD_STRIPE_PRODUCT_ID_PRO,
  orgPriceId: PUBLIC_PROD_STRIPE_PRODUCT_ID_ORG,
  enterprisePriceId: PUBLIC_PROD_STRIPE_PRODUCT_ID_ENTERPRISE,
  webhookSecret: PUBLIC_PROD_STRIPE_WEBHOOK_ID
};
const isFirebaseEmulator = define_import_meta_env_default.VITE_FIREBASE_EMULATOR;
const firebaseConfig = prodFirebaseConfig;
const stripeConfig = prodStripeConfig;
const baseUrl = PUBLIC_PROD_URL;
const priceIdMapping = {
  [Tier.FREE]: "free",
  [Tier.PRO]: prodStripeConfig.proPriceId,
  [Tier.ORG]: prodStripeConfig.orgPriceId,
  [Tier.ENTERPRISE]: prodStripeConfig.enterprisePriceId
};
const tierMapping = Object.fromEntries(
  Object.entries(priceIdMapping).map(([key, value]) => [value, key])
);
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const store = getFirestore(app);
const functions = getFunctions(app);
if (isFirebaseEmulator) {
  console.log("Using Firebase Emulator");
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  connectFirestoreEmulator(store, "127.0.0.1", 8080);
}
export {
  Tier as T,
  store as a,
  baseUrl as b,
  stripeConfig as s,
  tierMapping as t
};
