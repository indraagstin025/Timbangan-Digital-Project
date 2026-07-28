import React from 'react';
import { LiveScaleWidget } from '../components/LiveScaleWidget';
import { DotFilledIcon, MixerHorizontalIcon, CheckCircledIcon, InfoCircledIcon } from '@radix-ui/react-icons';

export function ControlPage({ wsConnected, liveWeight, cows = [], refreshAllData }) {
  const currentWeight = liveWeight?.weight ?? 0.0;
  const cowCode = liveWeight?.cowCode || '';
  const cowName = liveWeight?.cowName || '';
  const isLocked = liveWeight?.isLocked || false;

  return (
    <div className="space-y-3">
      {/* Real-time Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-black p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors duration-300">
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Perangkat Timbangan</p>
          <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">SCALE-ESP32-01</p>
          <p className="text-[9px] text-emerald-600 dark:text-emerald-500 font-semibold mt-1">✓ Device Paired & Approved</p>
        </div>

        <div className="bg-white dark:bg-black p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors duration-300">
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Berat Real-Time</p>
          <p className="text-base font-black text-emerald-600 dark:text-emerald-500 mt-1">
            {currentWeight.toFixed(2)} KG
          </p>
          <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-1">
            Status: {isLocked ? <span className="text-amber-600 dark:text-amber-500 font-bold">[TERKUNCI]</span> : 'Menimbang...'}
          </p>
        </div>

        <div className="bg-white dark:bg-black p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors duration-300">
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Sapi Target Ditimbang</p>
          <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate mt-1">{cowCode || 'Belum Dipilih'}</p>
          <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate mt-1">{cowName || 'Silakan Pilih dari Dropdown'}</p>
        </div>

        <div className="bg-white dark:bg-black p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors duration-300">
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Jumlah Master Sapi</p>
          <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-1">{cows.length} Ekor</p>
          <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-1">Siap dipilih dari dropdown</p>
        </div>
      </div>

      {/* Main Live Scale Mirroring & Remote Control Widget */}
      <LiveScaleWidget
        wsConnected={wsConnected}
        liveWeight={liveWeight}
        cows={cows}
        activeDeviceCode="SCALE-ESP32-01"
        onDataSaved={refreshAllData}
      />

      {/* Instructions & Calibration Procedure Guide */}
      <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 transition-colors duration-300">
        <h3 className="text-[10px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <InfoCircledIcon className="w-3.5 h-3.5 text-sky-600 dark:text-sky-500" />
          Panduan Penggunaan Remote Control Timbangan IoT:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] text-slate-600 dark:text-slate-400">
          <div className="bg-white dark:bg-black p-3 rounded-md border border-slate-200 dark:border-slate-800 space-y-1 transition-colors duration-300">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[9px] flex items-center justify-center font-extrabold">1</span>
              Pilih Sapi Target
            </h4>
            <p className="text-[9px] text-slate-500 dark:text-slate-500 leading-relaxed">
              Gunakan dropdown di atas untuk memilih sapi yang akan ditimbang. ESP32 secara instan mengganti target di layar LCD.
            </p>
          </div>

          <div className="bg-white dark:bg-black p-3 rounded-md border border-slate-200 dark:border-slate-800 space-y-1 transition-colors duration-300">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[9px] flex items-center justify-center font-extrabold">2</span>
              Simpan Data Weight Lock
            </h4>
            <p className="text-[9px] text-slate-500 dark:text-slate-500 leading-relaxed">
              Saat sapi berdiri di atas timbangan dan berat terkunci (`[TERKUNCI]`), klik tombol hijau **Simpan Data** untuk menyimpan ke database.
            </p>
          </div>

          <div className="bg-white dark:bg-black p-3 rounded-md border border-slate-200 dark:border-slate-800 space-y-1 transition-colors duration-300">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[9px] flex items-center justify-center font-extrabold">3</span>
              Navigasi Exit & Tare
            </h4>
            <p className="text-[9px] text-slate-500 dark:text-slate-500 leading-relaxed">
              Gunakan tombol **Kembali / Exit Menu** untuk keluar dari sub-layar ESP32, atau tombol **Remote Tare** untuk memenolkan berat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
