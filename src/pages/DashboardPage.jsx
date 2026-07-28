import React from 'react';
import { DotFilledIcon, ExclamationTriangleIcon, CheckCircledIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { DashboardKPI } from '../components/DashboardKPI';
import { GrowthChart } from '../components/GrowthChart';
import { LiveScaleWidget } from '../components/LiveScaleWidget';
import { ScrollArea } from '../components/ui/ScrollArea';

export function DashboardPage({ calculatedKPIs, growthData, cows, handleAddNewCow, setActiveTab }) {
  return (
    <div className="space-y-6">

      {/* KPIs Summary */}
      <DashboardKPI
        totalPopulasi={calculatedKPIs.totalPopulasi}
        totalPenimbangan={calculatedKPIs.totalPenimbangan}
        rataRataBerat={calculatedKPIs.rataRataBerat}
        bestCow={calculatedKPIs.bestCow}
      />

      {/* Chart & Live Alerts side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GrowthChart data={growthData} />
        </div>

        {/* IoT Broadcast Alerts */}
        <div className="bg-white dark:bg-black rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-full transition-colors duration-300">
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3 mb-3 transition-colors duration-300">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-emerald-50 dark:bg-gray-800 text-emerald-700 dark:text-white">
                  <DotFilledIcon className="w-3.5 h-3.5 text-emerald-500 animate-ping" />
                </span>
                <h3 className="font-bold text-[11px] text-gray-900 dark:text-white font-sans transition-colors duration-300">Live Log IoT (ESP32)</h3>
              </div>
              <span className="text-[9px] font-mono font-bold text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800">
                9600 bps
              </span>
            </div>

            <ScrollArea className="max-h-[210px]">
              <div className="space-y-2.5 pr-1">
                {/* Alert 1 */}
                <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 flex items-start gap-2 transition-colors duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <div className="text-[11px] font-sans">
                    <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">RFID Scan: {cows[0]?.cow_code || 'RFID-9281-A'}</p>
                    <p className="text-[9px] font-bold text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">Berhasil mencatat berat {cows[0]?.last_weight || 485} Kg pada kandang utama.</p>
                    <span className="text-[8px] font-mono font-bold text-gray-500 dark:text-gray-400 block mt-1">10 detik yang lalu</span>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 flex items-start gap-2 transition-colors duration-300">
                  <ExclamationTriangleIcon className="w-3.5 h-3.5 text-amber-500 dark:text-gray-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] font-sans">
                    <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">Peringatan ADG Rendah</p>
                    <p className="text-[9px] font-bold text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">Sapi Bali <strong className="font-extrabold text-gray-800 dark:text-gray-200">RFID-5100-E</strong> tumbuh lambat (+0.32 Kg/hari). Dianjurkan evaluasi pakan.</p>
                    <span className="text-[8px] font-mono font-bold text-gray-500 dark:text-gray-400 block mt-1">2 jam yang lalu</span>
                  </div>
                </div>

                {/* Alert 3 */}
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 flex items-start gap-2.5 transition-colors duration-300">
                  <CheckCircledIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-xs font-sans">
                    <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">Pemberian Pakan Sukses</p>
                    <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">Pintu katup pakan otomatis di Kandang A terbuka sukses selama 45 detik.</p>
                    <span className="text-[9px] font-mono font-bold text-gray-500 dark:text-gray-400 block mt-1">Pagi ini, 06:00 WITA</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
