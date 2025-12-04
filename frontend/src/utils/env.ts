export const env = {
  backendUrl: import.meta.env.VITE_BACKEND_URL,
  frontendUrl: import.meta.env.VITE_FRONTEND_URL,
  googleBooksApiKey: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY,
  crossrefApiUrl: import.meta.env.VITE_CROSSREF_API_URL
} as const;


