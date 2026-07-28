import { post } from './apiClient';

/**
 * Login pengguna
 * @returns {{ success: boolean, data: { token: string, user: object } }}
 */
export function login(username, password) {
  return post('/auth/login', { username, password });
}

/**
 * Registrasi pengguna baru
 * @returns {{ success: boolean, data: object }}
 */
export function register(username, email, password) {
  return post('/auth/register', { username, email, password });
}
