const DEFAULT_API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://backend-4z3v.onrender.com'
    : 'http://localhost:5000');

export const API_URL = DEFAULT_API_URL;

export function buildUrl(path) {
  return new URL(path, DEFAULT_API_URL).href;
}
