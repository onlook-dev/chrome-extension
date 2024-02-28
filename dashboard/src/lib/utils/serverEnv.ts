import { PROD_OPENAPI_API_KEY, PROD_OPENAPI_ORG } from '$env/static/private';

const openAiConfig = {
  organization: PROD_OPENAPI_ORG,
  apiKey: PROD_OPENAPI_API_KEY
};

export const openAi = openAiConfig;