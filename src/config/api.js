// Set VITE_API_BASE_URL in the frontend environment to point at the API.
// The default matches the local Express server through the Vite /api proxy.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api')
  .replace(/\/$/, '')
