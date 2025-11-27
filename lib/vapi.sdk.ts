import Vapi from "@vapi-ai/web";

// Initialize Vapi with token from environment variable
const getVapiToken = () => {
  const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
  if (!token) {
    console.error('VAPI token is not configured. Please set NEXT_PUBLIC_VAPI_WEB_TOKEN in your .env.local file');
  }
  return token || '';
};

export const vapi = new Vapi(getVapiToken());