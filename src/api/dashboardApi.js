import { get } from './apiClient';

/**
 * Ambil ringkasan dashboard (KPI)
 * Response: { success, data: { total_cows_active, total_weighings, average_weight, best_growth } }
 */
export function getSummary() {
  return get('/dashboard/summary');
}

/**
 * Ambil tren pertumbuhan (6 bulan terakhir)
 * Response: { success, data: [{tanggal, beratRataRata, adgRataRata}, ...] }
 */
export function getGrowthTrend() {
  return get('/dashboard/growth');
}
