import React from 'react';
import { motion } from 'motion/react';
import { 
  HomeIcon, 
  MixerHorizontalIcon, 
  ArrowTopRightIcon, 
  CheckCircledIcon 
} from '@radix-ui/react-icons';

export function DashboardKPI({
  totalPopulasi,
  totalPenimbangan,
  rataRataBerat,
  bestCow,
}) {
  const cards = [
    {
      id: 'kpi-populasi',
      title: 'Total Sapi Aktif',
      value: `${totalPopulasi} Ekor`,
      subtext: 'Update real-time',
      statusColor: 'bg-emerald-500',
      iconColor: 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800',
      icon: HomeIcon,
    },
    {
      id: 'kpi-penimbangan',
      title: 'Total Penimbangan',
      value: `${totalPenimbangan} Log`,
      subtext: 'Data dari sensor IoT',
      statusColor: 'bg-emerald-500',
      iconColor: 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800',
      icon: CheckCircledIcon,
    },
    {
      id: 'kpi-berat',
      title: 'Rata-rata Berat',
      value: `${rataRataBerat.toFixed(1)} Kg`,
      subtext: 'Semua sapi aktif',
      statusColor: 'bg-emerald-500',
      iconColor: 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800',
      icon: MixerHorizontalIcon,
    },
    {
      id: 'kpi-adg',
      title: 'Pertumbuhan Terbaik',
      value: bestCow ? `+${bestCow.last_adg} Kg/Hari` : '-',
      subtext: bestCow ? `${bestCow.name} (${bestCow.cow_code})` : 'Belum ada data',
      statusColor: 'bg-emerald-500',
      iconColor: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800/30',
      icon: ArrowTopRightIcon,
    },
  ];

  return (
    <div id="kpi-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            id={card.id}
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="bg-white dark:bg-black rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden flex flex-col justify-between transition-colors duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
                  {card.title}
                </p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5 font-mono tracking-tight transition-colors duration-300">
                  {card.value}
                </h3>
              </div>
              <div className={`p-1.5 rounded-md border ${card.iconColor} shrink-0 transition-colors duration-300`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${card.statusColor}`} />
              <span className="text-[10px] text-gray-600 dark:text-gray-400 font-bold font-sans transition-colors duration-300">
                {card.subtext}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
