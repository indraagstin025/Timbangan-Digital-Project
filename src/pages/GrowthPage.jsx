import React from 'react';
import { motion } from 'motion/react';
import { GrowthChart } from '../components/GrowthChart';

export function GrowthPage({ growthData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GrowthChart data={growthData} />
        </div>

        {/* Progress bar and Target */}
        <div className="bg-white dark:bg-black rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between transition-colors duration-300">
          <div>
            <h3 className="font-bold text-xs text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4 mb-4 flex items-center gap-2 font-sans uppercase tracking-wider transition-colors duration-300">
              <span>Target Penjualan Q3</span>
            </h3>

            {/* Progress Circle SVG */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#1f2937"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="377"
                    strokeDashoffset={377 - (377 * 75) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">75%</span>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 font-sans">Tercapai</span>
                </div>
              </div>

              <div className="text-center mt-4">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 font-sans transition-colors duration-300">45 dari 60 Ekor Sapi</p>
                <p className="text-[10px] text-gray-500 mt-1 font-sans">Bobot siap jual telah terpenuhi (&gt; 450 Kg)</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-3 text-[10px] text-gray-600 dark:text-gray-400 mt-2 font-sans transition-colors duration-300">
            <span className="font-bold text-gray-900 dark:text-white block mb-1 transition-colors duration-300">Metrik Kelayakan Sapi:</span>
            Evaluasi berat dan ADG dilakukan setiap 7 hari otomatis saat sapi melewati lorong gerbang RFID load cell.
          </div>
        </div>
      </div>

      {/* Custom SVG Bar Chart comparing ADG by Breed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-black rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
          <h3 className="font-bold text-xs text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4 mb-4 flex items-center gap-2 font-sans uppercase tracking-wider transition-colors duration-300">
            <span>Rata-rata ADG Berdasarkan Jenis Sapi</span>
          </h3>

          <div className="space-y-4.5 py-2">
            {[
              { jenis: 'Sapi Limousin', adg: 0.88, isHighest: true },
              { jenis: 'Sapi Simmental', adg: 0.74, isHighest: false },
              { jenis: 'Sapi PO (Ongole)', adg: 0.65, isHighest: false },
              { jenis: 'Sapi Brahman', adg: 0.48, isHighest: false },
              { jenis: 'Sapi Bali', adg: 0.38, isHighest: false },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-gray-700 dark:text-gray-300 transition-colors duration-300">{item.jenis}</span>
                  <span className={`font-mono font-bold transition-colors duration-300 ${item.isHighest ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-500 dark:text-gray-400'}`}>+{item.adg.toFixed(2)} Kg/Hari</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden transition-colors duration-300">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.adg / 1.0) * 100}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className={`h-full rounded-full ${item.isHighest ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-600'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition Advice */}
        <div className="bg-white dark:bg-black rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between transition-colors duration-300">
          <div>
            <h3 className="font-bold text-xs text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4 mb-4 flex items-center gap-2 font-sans uppercase tracking-wider transition-colors duration-300">
              <span>Rekomendasi Ahli Gizi Peternakan</span>
            </h3>

            <div className="space-y-3.5">
              <div className="flex gap-3 text-xs leading-relaxed">
                <span className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center shrink-0 font-bold font-mono transition-colors duration-300">1</span>
                <div>
                  <strong className="text-gray-900 dark:text-white font-bold block mb-0.5 transition-colors duration-300">Optimalisasi Sapi Brahman</strong>
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Untuk Brahman (ADG 0.48), direkomendasikan penambahan</span> <span className="font-semibold text-emerald-600 dark:text-emerald-500 font-mono transition-colors duration-300">ampas tahu 15%</span> <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">pada diet jerami kering guna mempercepat sintesis otot.</span>
                </div>
              </div>

              <div className="flex gap-3 text-xs leading-relaxed">
                <span className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center shrink-0 font-bold font-mono transition-colors duration-300">2</span>
                <div>
                  <strong className="text-gray-900 dark:text-white font-bold block mb-0.5 transition-colors duration-300">Penanganan Sapi Bali ADG &lt; 0.4</strong>
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Lakukan isolasi kelompok khusus pakan konsentrat basah berprotein tinggi (18%) untuk mendongkrak ADG harian yang berada di bawah standar.</span>
                </div>
              </div>

              <div className="flex gap-3 text-xs leading-relaxed">
                <span className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center shrink-0 font-bold font-mono transition-colors duration-300">3</span>
                <div>
                  <strong className="text-gray-900 dark:text-white font-bold block mb-0.5 transition-colors duration-300">Sterilisasi Suhu Kandang</strong>
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Sapi Simmental & Limousin rentan stres panas di atas 28°C yang memicu perlambatan nafsu makan. Jaga sirkulasi udara kandang dengan blower.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 text-center font-medium pt-4 border-t border-gray-200 dark:border-gray-800 mt-4 font-sans transition-colors duration-300">
            Data analisis gizi diperbarui berkala berkolaborasi dengan Fakultas Peternakan Universitas IPB
          </div>
        </div>
      </div>
    </div>
  );
}
