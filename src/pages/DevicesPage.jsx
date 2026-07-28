import React, { useState, useEffect, useCallback } from 'react';
import { getAllDevices, approvePairing, deleteDevice, sendRemoteCommand } from '../api/deviceApi';
import {
  DotFilledIcon,
  TrashIcon,
  MixerHorizontalIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ReloadIcon,
  ClockIcon,
  DesktopIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';

import { ConfirmModal } from '../components/ConfirmModal';

const PAIRING_STATUS_CONFIG = {
  approved: {
    label: 'Terhubung & Disetujui ✓',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'text-emerald-500',
  },
  pending: {
    label: 'Menunggu Persetujuan',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'text-amber-400',
  },
  rejected: {
    label: 'Akses Ditolak',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-200 dark:border-red-800',
    dot: 'text-red-500',
  },
  unpaired: {
    label: 'Akses Diterputus (Unpaired)',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    dot: 'text-amber-500',
  },
};

export function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState({});
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Ya, Lanjutkan',
    variant: 'danger',
    onConfirm: () => {},
  });

  const fetchDeviceList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllDevices();
      if (res && res.success) {
        setDevices(res.data || []);
      } else {
        setDevices([]);
      }
    } catch (err) {
      console.error('Failed to fetch device:', err);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeviceList();
    const interval = setInterval(fetchDeviceList, 5000);
    return () => clearInterval(interval);
  }, [fetchDeviceList]);

  const handleApprove = async (id, status) => {
    setApproving((prev) => ({ ...prev, [id]: true }));
    try {
      await approvePairing(id, status);
      fetchDeviceList();
    } catch (err) {
      console.error('Failed to update pairing status:', err);
    } finally {
      setApproving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const promptUnpairDevice = (deviceCode, id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Cabut Akses Pairing Perangkat',
      message: `Apakah Anda yakin ingin mencabut akses pairing perangkat ${deviceCode}? Perangkat tidak lagi dapat mengirimkan data penimbangan.`,
      confirmText: 'Ya, Cabut Akses',
      variant: 'warning',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await sendRemoteCommand(deviceCode, 'unpair');
        } catch (e) { console.error(e); }
        handleApprove(id, 'unpaired');
      },
    });
  };

  const promptDeleteDevice = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Data Perangkat Timbangan',
      message: 'Apakah Anda yakin ingin menghapus data perangkat timbangan ini dari database?',
      confirmText: 'Ya, Hapus Data',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          await deleteDevice(id);
          fetchDeviceList();
        } catch (err) {
          console.error('Failed to unlink device:', err);
        }
      },
    });
  };

  // Main active device (Single Device System)
  const activeDevice = devices.find((d) => d.pairing_status === 'approved') || devices[0];
  const pendingDevices = devices.filter((d) => d.pairing_status === 'pending');

  const pairingCfg = activeDevice
    ? PAIRING_STATUS_CONFIG[activeDevice.pairing_status] || PAIRING_STATUS_CONFIG.approved
    : PAIRING_STATUS_CONFIG.approved;

  return (
    <div className="space-y-4 font-sans text-gray-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-black p-4 rounded-xl border border-gray-200 dark:border-gray-900 shadow-2xs transition-colors duration-300">
        <div>
          <h1 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MixerHorizontalIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Informasi Perangkat Timbangan IoT
          </h1>
          <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-0.5">
            Status koneksi, pairing, dan spesifikasi hardware ESP32 yang terhubung ke sistem.
          </p>
        </div>
        <button
          onClick={fetchDeviceList}
          className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs"
        >
          <ReloadIcon className="w-3.5 h-3.5" />
          Refresh Status
        </button>
      </div>

      {/* Pending Pairing Requests Alert (If any new device attempts connection) */}
      {pendingDevices.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-3">
            <ClockIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
            <h2 className="text-xs font-bold text-amber-800 dark:text-amber-300">
              Permintaan Pairing Baru Menunggu Persetujuan ({pendingDevices.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {pendingDevices.map((device) => (
              <div
                key={device.id}
                className="bg-white dark:bg-black rounded-lg border border-amber-200 dark:border-amber-900 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {device.device_code}
                    </span>
                    <h3 className="font-bold text-xs text-gray-900 dark:text-white">{device.device_name}</h3>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                    Permintaan masuk pada: {new Date(device.created_at).toLocaleString('id-ID', {
                      timeZone: 'Asia/Jakarta', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })} WIB
                  </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleApprove(device.id, 'approved')}
                    disabled={approving[device.id]}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircledIcon className="w-3.5 h-3.5" />
                    {approving[device.id] ? 'Memproses...' : 'Setujui Pairing'}
                  </button>
                  <button
                    onClick={() => handleApprove(device.id, 'rejected')}
                    disabled={approving[device.id]}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <CrossCircledIcon className="w-3.5 h-3.5" />
                    Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Dedicated Single Device Detail View */}
      {loading && !activeDevice ? (
        <div className="p-12 text-center bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-900 text-gray-400">
          <ReloadIcon className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
          <p className="text-xs">Memuat informasi perangkat timbangan...</p>
        </div>
      ) : !activeDevice ? (
        <div className="p-8 text-center bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-900">
          <ExclamationTriangleIcon className="w-8 h-8 mx-auto text-amber-500 mb-2" />
          <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Belum Ada Perangkat Timbangan Terhubung</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Nyalakan hardware ESP32 dan pilih menu <strong>"Hubungkan Web"</strong> pada layar LCD untuk melakukan pairing.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-900 p-6 space-y-6 shadow-2xs transition-colors duration-300">
          {/* Top Section: Active Device Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-900">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <DesktopIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700">
                    {activeDevice.device_code || 'SCALE-ESP32-01'}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${pairingCfg.color} ${pairingCfg.bg} px-2.5 py-0.5 rounded-full border ${pairingCfg.border}`}>
                    <DotFilledIcon className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                    {pairingCfg.label}
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mt-1.5">
                  {activeDevice.device_name || 'Timbangan Digital Sapi ESP32 Utama'}
                </h2>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                  Perangkat Terdedikasi Kandang • Dual-Core Microcontroller • Loadcell RS232 Indicator
                </p>
              </div>
            </div>

            {/* Quick Actions for Active Device */}
            <div className="flex gap-2 items-center self-start md:self-center">
              {activeDevice.pairing_status === 'approved' && (
                <button
                  onClick={() => promptUnpairDevice(activeDevice.device_code, activeDevice.id)}
                  className="px-3 py-2 text-xs font-bold rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
                >
                  Cabut Akses Pairing
                </button>
              )}
              {activeDevice.pairing_status !== 'approved' && (
                <button
                  onClick={() => handleApprove(activeDevice.id, 'approved')}
                  className="px-3 py-2 text-xs font-bold rounded-lg bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black border border-black dark:border-white transition-colors cursor-pointer"
                >
                  Setujui & Hubungkan Perangkat
                </button>
              )}
              <button
                onClick={() => promptDeleteDevice(activeDevice.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                title="Hapus Data Perangkat"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid Technical Specifications & System Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Arsitektur Komunikasi */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-900 space-y-2">
              <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Arsitektur Komunikasi IoT
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-bold">Protokol Web:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">WebSocket Push + REST API</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-bold">Kecepatan Telemetri:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">Real-Time Stream (~100ms)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-bold">Standard Modul Wi-Fi:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">ESP-32 WROOM (2.4 GHz)</span>
                </div>
              </div>
            </div>

            {/* Box 2: Modul Loadcell & Indikator */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-900 space-y-2">
              <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Loadcell & Indikator Fisik
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-bold">Koneksi RS232:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">UART2 @ 9600 8N1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-bold">Tipe Indikator:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">Yaohua A12E / HX711</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-bold">Kapasitas Maksimal:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">1400.00 KG</span>
                </div>
              </div>
            </div>

            {/* Box 3: Keamanan Pairing & ID System */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-gray-900 space-y-2">
              <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Keamanan & Token Authentication
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-bold">ID Database:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">#{activeDevice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-bold">Sistem Verification:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckIcon className="w-3.5 h-3.5" /> Token Approved
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400 font-bold">Terdaftar Sejak:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">
                    {new Date(activeDevice.created_at || Date.now()).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Animated Confirmation Alert Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
      />
    </div>
  );
}
