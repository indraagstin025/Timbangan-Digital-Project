import { get, put } from './apiClient';

/**
 * Ambil profil user yang sedang login
 */
export function getProfile() {
  return get('/profile');
}

/**
 * Update profil user (username dan/atau password)
 * @param {object} data - { username?, old_password?, new_password? }
 */
export function updateProfile(data) {
  return put('/profile', data);
}
