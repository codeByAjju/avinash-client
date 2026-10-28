import axios from 'axios';
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  withCredentials: true,
});
export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  withCredentials: true,
  headers: { 'X-Requested-With': 'artist-admin' },
});
export function apiMessage(error) {
  return (
    error.response?.data?.error?.message ||
    'We couldn’t connect just now. Please try again shortly.'
  );
}
export const submitBooking = (values, requestId) =>
  api.post('/bookings', values, { headers: { 'Idempotency-Key': requestId } });
