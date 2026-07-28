export interface CowData {
  id: string;
  rfid: string;
  jenisSapi: string;
  beratTerakhir: number;
  adgHarian: number;
  umurBulan: number;
  statusKelayakan: 'Pertahankan' | 'Jual/Evaluasi' | 'Pantau';
  pakanUtama: string;
  kandang: string;
  terakhirDiperiksa: string;
}

export interface GrowthDataPoint {
  tanggal: string;
  beratRataRata: number;
  adgRataRata: number;
}

export interface ScaleHistory {
  id: string;
  rfid: string;
  jenisSapi: string;
  tanggalTimbang: string;
  beratSebelumnya: number;
  beratSekarang: number;
  selisih: number;
  petugas: string;
}
