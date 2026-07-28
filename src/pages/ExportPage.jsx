import React from 'react';
import { FileTextIcon, CalendarIcon, TokensIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { ExportAction } from '../components/ExportAction';

export function ExportPage({ cows = [] }) {
  return (
    <div className="space-y-6">
      {/* Detailed Export Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form parameters */}
        <div className="lg:col-span-2 bg-white dark:bg-black rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5 transition-colors duration-300">
          <div className="border-b border-gray-200 dark:border-gray-800 pb-4 transition-colors duration-300">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white transition-colors duration-300">Atur Konfigurasi Unduhan Laporan</h3>
            <p className="text-xs font-bold text-gray-500 mt-1 font-sans">Sesuaikan isi dan format berkas laporan Smart Livestock Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format file selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-1.5 transition-colors duration-300">Format Laporan</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-500 rounded-md flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold justify-center cursor-pointer transition-colors duration-300">
                  <FileTextIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-500 transition-colors duration-300" />
                  <span>Spreadsheet (.xlsx)</span>
                </button>
                <button className="p-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-2 text-xs text-gray-900 dark:text-white font-bold justify-center cursor-pointer transition-colors duration-300">
                  <FileTextIcon className="w-4 h-4 text-rose-600 dark:text-rose-500 transition-colors duration-300" />
                  <span>PDF Dokumen (.pdf)</span>
                </button>
              </div>
            </div>

            {/* Date Range Selection */}
            <div>
              <label htmlFor="exp-range-select" className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-1.5 transition-colors duration-300">Rentang Tanggal Timbangan</label>
              <div className="relative">
                <select
                  id="exp-range-select"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600 focus:bg-gray-50 dark:focus:bg-black text-xs px-3.5 py-3 rounded-md outline-none appearance-none cursor-pointer text-gray-900 dark:text-white font-semibold transition-colors duration-300"
                >
                  <option>Hari Ini (18 Juli 2026)</option>
                  <option>7 Hari Terakhir</option>
                  <option>30 Hari Terakhir</option>
                  <option>Bulan Ini (Juli 2026)</option>
                  <option>Semua Riwayat Timbangan</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <CalendarIcon className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Barn Group filter */}
            <div>
              <label htmlFor="exp-barn-select" className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-1.5 transition-colors duration-300">Kelompok Kandang</label>
              <div className="relative">
                <select
                  id="exp-barn-select"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 focus:border-gray-400 dark:focus:border-gray-600 focus:bg-gray-50 dark:focus:bg-black text-xs px-3.5 py-3 rounded-md outline-none appearance-none cursor-pointer text-gray-900 dark:text-white font-semibold transition-colors duration-300"
                >
                  <option>Semua Kandang (Kandang A, B, C)</option>
                  <option>Kandang A - Utama</option>
                  <option>Kandang B - Karantina</option>
                  <option>Kandang C - Penggemukan</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <TokensIcon className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Checkboxes parameters */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-1.5 transition-colors duration-300">Parameter Tambahan</label>
              <div className="space-y-2 mt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-400 cursor-pointer font-sans transition-colors duration-300">
                  <input type="checkbox" defaultChecked className="accent-gray-700 rounded" />
                  <span>Sertakan tren grafik pertumbuhan berat</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-400 cursor-pointer font-sans transition-colors duration-300">
                  <input type="checkbox" defaultChecked className="accent-gray-700 rounded" />
                  <span>Sertakan rekam medis vaksinasi sapi</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <ExportAction filteredCount={cows.length} onExport={(t) => console.log(t)} />
          </div>
        </div>

        {/* Right: Download history ledger */}
        <div className="bg-white dark:bg-black rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between transition-colors duration-300">
          <div>
            <h3 className="font-bold text-xs text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4 mb-4 flex items-center gap-2 font-sans uppercase tracking-wider transition-colors duration-300">
              <span>Arsip Unduhan Terbaru</span>
            </h3>

            <div className="space-y-3">
              {[
                { file: 'LAPORAN_LIVESTOCK_DSS_180726.xlsx', size: '24.5 KB', tgl: 'Hari ini, 07:15 WITA', tipe: 'excel' },
                { file: 'REKAP_TIMBANGAN_ESP32_Q2.pdf', size: '1.2 MB', tgl: '15 Jul 2026, 11:24 WITA', tipe: 'pdf' },
                { file: 'RIWAYAT_VAKSIN_BRUCELLOSIS.xlsx', size: '18.2 KB', tgl: '10 Jul 2026, 09:40 WITA', tipe: 'excel' },
              ].map((doc, idx) => (
                <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md flex items-center justify-between transition-colors duration-300">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileTextIcon className={`w-5 h-5 shrink-0 ${doc.tipe === 'excel' ? 'text-emerald-500' : 'text-rose-500'}`} />
                    <div className="min-w-0 font-sans">
                      <p className="font-bold text-[11px] text-gray-900 dark:text-white truncate transition-colors duration-300">{doc.file}</p>
                      <p className="text-[9px] text-gray-500 mt-0.5 font-medium">{doc.tgl} • {doc.size}</p>
                    </div>
                  </div>
                  
                  <button
                    id={`redownload-doc-${idx}`}
                    type="button"
                    onClick={() => console.log(`Mengunduh ulang berkas: ${doc.file}`)}
                    className="text-[10px] font-bold text-gray-900 dark:text-white hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 px-2.5 py-1.5 rounded transition-colors cursor-pointer"
                  >
                    Unduh
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-3.5 text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed mt-4 flex gap-2.5 font-sans transition-colors duration-300">
            <InfoCircledIcon className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            <span>Laporan yang diunduh mencakup tanda tangan digital pengelola peternakan dan cap sertifikat keamanan data blockchain IoT.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
