import { get, post, put, del } from './apiClient';

/**
 * Ambil semua data sapi (dengan pagination & filter)
 * @param {object} params - { status, breed, page, limit }
 * Response: { success, data: CowListItem[], pagination: { page, limit, total } }
 */
export function getCows({ status = '', breed = '', page = 1, limit = 100 } = {}) {
  const query = new URLSearchParams();
  if (status) query.set('status', status);
  if (breed) query.set('breed', breed);
  query.set('page', String(page));
  query.set('limit', String(limit));
  return get(`/cows?${query.toString()}`);
}

/**
 * Ambil detail sapi berdasarkan ID
 */
export function getCowById(id) {
  return get(`/cows/${id}`);
}

/**
 * Tambah sapi baru
 * @param {object} data - { cow_code, name, breed, gender, birth_date, owner, status }
 */
export function createCow(data) {
  return post('/cows', data);
}

/**
 * Update data sapi
 */
export function updateCow(id, data) {
  return put(`/cows/${id}`, data);
}

/**
 * Hapus sapi
 */
export function deleteCow(id) {
  return del(`/cows/${id}`);
}

/**
 * Ambil prediksi pertumbuhan sapi (DSS)
 * @param {number} id - cow ID
 * @param {number} horizon - jumlah hari ke depan (default 30)
 * Response: { success, data: PredictionResponse }
 */
export function getCowPrediction(id, horizon = 90) {
  return get(`/cows/${id}/prediction?horizon=${horizon}`);
}

/**
 * Ambil riwayat penimbangan per sapi
 */
export function getCowWeights(id) {
  return get(`/cows/${id}/weights`);
}
