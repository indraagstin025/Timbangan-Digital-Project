import { get, post } from './apiClient';

/**
 * Kirim data penimbangan baru (dari IoT ESP32 / Simulator)
 * @param {object} data - { cow_id, weight, date?, device_id? }
 */
export function addWeighing(data) {
  const payload = { ...data };
  if (payload.date) {
    payload.date = String(payload.date).split('T')[0];
  }
  return post('/weighings', payload);
}

/**
 * Ambil riwayat penimbangan (semua sapi)
 * @param {object} params - { cow_id?, start_date?, end_date? }
 * Response: { success, data: WeightWithCow[] }
 */
export function getWeighingHistory({ cow_id = 0, start_date = '', end_date = '' } = {}) {
  const query = new URLSearchParams();
  if (cow_id) query.set('cow_id', String(cow_id));
  if (start_date) query.set('start_date', start_date);
  if (end_date) query.set('end_date', end_date);
  return get(`/weighings?${query.toString()}`);
}
