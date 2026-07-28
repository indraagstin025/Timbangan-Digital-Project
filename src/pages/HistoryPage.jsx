import React from 'react';
import { MixerHorizontalIcon, UpdateIcon, PlayIcon } from '@radix-ui/react-icons';

export function HistoryPage({ 
  scaleLogs, 
  refreshAllData
}) {
  return (
    <div className="space-y-6">
      {/* Full Width: Weight history table */}
      <div className="w-full bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between transition-colors duration-300">
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white font-sans transition-colors duration-300">Riwayat Penimbangan Sapi</h1>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 font-sans">Log timbangan otomatis dipush langsung dari router ESP32 ke Web Browser</p>
          </div>
          <button
            id="refresh-logs-btn"
            type="button"
            onClick={refreshAllData}
            className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UpdateIcon className="w-3.5 h-3.5" />
            <span>Muat Ulang Tabel</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 font-semibold text-gray-500 dark:text-gray-400 transition-colors duration-300">
                <th className="py-3 px-5">TANGGAL TIMBANG</th>
                <th className="py-3 px-5">TAG RFID</th>
                <th className="py-3 px-5">JENIS SAPI</th>
                <th className="py-3 px-5 text-right">BERAT SEBELUM</th>
                <th className="py-3 px-5 text-right">BERAT BARU</th>
                <th className="py-3 px-5 text-right">SELISIH</th>
                <th className="py-3 px-5">PETUGAS / SUMBER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 transition-colors duration-300">
              {scaleLogs.map((log) => (
                <tr id={`log-row-${log.id}`} key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors duration-150">
                  <td className="py-3.5 px-5 text-gray-500 dark:text-gray-400 font-mono font-medium">{log.tanggalTimbang}</td>
                  <td className="py-3.5 px-5">
                    <span className="font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded text-[10px] transition-colors duration-300">
                      {log.rfid}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-bold text-gray-900 dark:text-white transition-colors duration-300">{log.jenisSapi}</td>
                  <td className="py-3.5 px-5 text-right text-gray-500 dark:text-gray-400 font-mono">{log.beratSebelumnya} Kg</td>
                  <td className="py-3.5 px-5 text-right font-bold text-gray-900 dark:text-white font-mono transition-colors duration-300">{log.beratSekarang} Kg</td>
                  <td className="py-3.5 px-5 text-right font-bold">
                    <span className={`inline-block font-mono px-1.5 py-0.5 rounded text-[10px] border transition-colors duration-300 ${
                      log.selisih > 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50' : log.selisih < 0 ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800/50' : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                    }`}>
                      {log.selisih > 0 ? `+${log.selisih}` : log.selisih} Kg
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-2 py-0.5 rounded transition-colors duration-300">
                      {log.petugas}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
