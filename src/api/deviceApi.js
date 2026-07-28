import { get, post, put, del } from './apiClient';

/**
 * Ambil semua perangkat (admin view — termasuk pending)
 */
export function getAllDevices() {
  return get('/devices');
}

/**
 * Ambil hanya perangkat milik user login
 */
export function getDevices() {
  return get('/devices/me');
}

/**
 * Ambil daftar perangkat yang masih pending pairing
 */
export function getPendingDevices() {
  return get('/devices/pending');
}

/**
 * Hubungkan / Claim timbangan baru berdasarkan kode perangkat (misal SCALE-ESP32-01)
 * @param {object} data - { device_code, device_name }
 */
export function claimDevice(data) {
  return post('/devices/claim', data);
}

/**
 * Setujui atau tolak permintaan pairing dari ESP32
 * @param {number} id - ID perangkat
 * @param {string} pairingStatus - 'approved' | 'rejected'
 */
export function approvePairing(id, pairingStatus) {
  return put(`/devices/${id}/pairing`, { pairing_status: pairingStatus });
}

/**
 * Putuskan tautan (unlink) perangkat
 */
export function deleteDevice(id) {
  return del(`/devices/${id}`);
}

/**
 * Kirim perintah remote (Remote Tare, Select Cow, Save Weight, Kalibrasi, Buzzer Test, Backlight) ke ESP32
 * @param {string} deviceCode - e.g. 'SCALE-ESP32-01'
 * @param {string} action - 'tare' | 'select_cow' | 'save_weight' | 'calibrate' | 'buzzer' | 'backlight_toggle'
 * @param {object} extraPayload - e.g. { cow_code, cow_name, cow_id }
 */
export function sendRemoteCommand(deviceCode, action, extraPayload = {}) {
  return post('/devices/command', { device_code: deviceCode, action, ...extraPayload });
}

