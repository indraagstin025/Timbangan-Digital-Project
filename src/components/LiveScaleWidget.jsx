import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DotFilledIcon, SymbolIcon, SpeakerLoudIcon, SunIcon, CheckIcon, DiscIcon, HomeIcon, EnterIcon, GearIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { sendRemoteCommand } from '../api/deviceApi';
import { addWeighing } from '../api/weighingApi';

export function LiveScaleWidget({ wsConnected, liveWeight, cows = [], activeDeviceCode = 'SCALE-ESP32-01', onDataSaved }) {
  const [isSending, setIsSending] = useState(false);
  const [commandStatus, setCommandStatus] = useState(null);
  const [selectedCowId, setSelectedCowId] = useState('');

  const currentWeight = liveWeight?.weight ?? 0.0;
  const cowCode = liveWeight?.cowCode || '';
  const cowName = liveWeight?.cowName || '';
  const isLocked = liveWeight?.isLocked || false;

  // Auto-sync Dropdown with ESP32 Telemetry only if valid cowCode exists
  React.useEffect(() => {
    if (cowCode && String(cowCode).trim() !== '' && cows && cows.length > 0) {
      const targetCow = cows.find(c => String(c.cow_code).trim() === String(cowCode).trim());
      if (targetCow && String(selectedCowId) !== String(targetCow.id)) {
        setSelectedCowId(String(targetCow.id));
      }
    }
  }, [cowCode, cows]);

  // Validation Checks
  const isCowSelected = Boolean(selectedCowId);
  const isOverload = currentWeight > 1400.0;
  const isWeightValid = currentWeight > 0.0 && !isOverload;
  const canSave = isCowSelected && isLocked && isWeightValid && !isSending;

  const handleCommand = async (action, extraPayload = {}) => {
    setIsSending(true);
    setCommandStatus(`Mengirim perintah ${action}...`);
    try {
      await sendRemoteCommand(activeDeviceCode, action, extraPayload);
      setCommandStatus(`✓ Perintah ${action} berhasil dikirim ke ESP32!`);
    } catch (err) {
      setCommandStatus(`❌ Gagal: ${err.message}`);
    } finally {
      setIsSending(false);
      setTimeout(() => setCommandStatus(null), 3000);
    }
  };

  // Handler: Exit / Kembali ke Pilihan Sapi / Menu Utama
  const handleExitMenu = async () => {
    if (selectedCowId) {
      // Jika sedang dalam Mode Timbang sapi tertentu, Kembali akan membatalkan pilihan sapi & kembali ke layar Pilih Sapi
      setSelectedCowId('');
      await handleCommand('state_cow_select', { cow_code: '', cow_name: '', cow_id: 0 });
      setCommandStatus('✓ Kembali ke Pilihan Sapi. Silakan pilih sapi target baru.');
      setTimeout(() => setCommandStatus(null), 3000);
    } else {
      // Jika belum ada sapi terpilih, Kembali akan membuka Menu Utama ESP32
      await handleCommand('menu', { nav: 'back', state: 'menu', action: 'exit' });
    }
  };

  // Handler: Masuk Mode Timbang (Wajib pilih Sapi dahulu)
  const handleEnterWeighingMode = async () => {
    if (!selectedCowId) {
      setCommandStatus('⚠️ SILAKAN PILIH SAPI DARI DROPDOWN TERLEBIH DAHULU SEBELUM MASUK MODE TIMBANG!');
      setTimeout(() => setCommandStatus(null), 3500);
      return;
    }
    const targetCow = cows.find(c => String(c.id) === String(selectedCowId));
    await handleCommand('state_weighing', targetCow ? {
      cow_code: targetCow.cow_code,
      cow_name: targetCow.name,
      cow_id: targetCow.id
    } : {});
  };

  // Handler: Select Cow from Dropdown
  const handleSelectCowChange = async (e) => {
    const cowId = e.target.value;
    setSelectedCowId(cowId);

    if (!cowId) {
      setCommandStatus('⚠️ Silakan pilih sapi dari list.');
      setTimeout(() => setCommandStatus(null), 2000);
      return;
    }

    const targetCow = cows.find(c => String(c.id) === String(cowId));
    if (targetCow) {
      await handleCommand('select_cow', {
        cow_code: targetCow.cow_code,
        cow_name: targetCow.name,
        cow_id: targetCow.id
      });
    }
  };

  // Handler: Save Weight with Strict Validations
  const handleSaveWeight = async () => {
    // Validasi 1: Must select a cow first
    if (!isCowSelected) {
      setCommandStatus('❌ SIMPAN GAGAL: Harus pilih Sapi terlebih dahulu dari dropdown!');
      setTimeout(() => setCommandStatus(null), 3500);
      return;
    }

    // Validasi 2: Weight must be > 0.0 KG
    if (currentWeight <= 0.0) {
      setCommandStatus('❌ SIMPAN GAGAL: Berat timbangan harus > 0.00 KG untuk disimpan!');
      setTimeout(() => setCommandStatus(null), 3500);
      return;
    }

    // Validasi 3: Must be locked
    if (!isLocked) {
      setCommandStatus('⚠️ SIMPAN GAGAL: Tunggu Weight Lock ([TERKUNCI]) sebelum menyimpan!');
      setTimeout(() => setCommandStatus(null), 3500);
      return;
    }

    // Validasi 4: Cannot save when Overload (> 1400 KG)
    if (isOverload) {
      setCommandStatus('❌ SIMPAN GAGAL: Timbangan Overload (> 1400 KG)! Tidak dapat disimpan.');
      setTimeout(() => setCommandStatus(null), 3500);
      return;
    }

    setIsSending(true);
    setCommandStatus('Menyimpan data penimbangan ke database & ESP32...');

    try {
      const targetCow = cows.find(c => String(c.id) === String(selectedCowId)) || cows[0];
      const payload = {
        cow_id: targetCow ? targetCow.id : 1,
        cow_code: targetCow ? targetCow.cow_code : cowCode,
        weight: currentWeight,
        device_id: activeDeviceCode
      };

      // 1. Simpan ke Backend Database
      await addWeighing(payload);

      // 2. Perintahkan ESP32 untuk menampilkan pesan sukses & reset timbangan untuk sapi berikutnya
      await sendRemoteCommand(activeDeviceCode, 'remote_saved_success');

      setCommandStatus(`✓ BERHASIL DISIMPAN: ${currentWeight.toFixed(2)} KG untuk ${payload.cow_code}!`);
      if (onDataSaved) onDataSaved();
    } catch (err) {
      setCommandStatus(`❌ Gagal simpan: ${err.message}`);
    } finally {
      setIsSending(false);
      setTimeout(() => setCommandStatus(null), 4000);
    }
  };

  // ── Keyboard Navigation (Remote Rotary Encoder) ──
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input or select
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (isSending) return; // Prevent spamming

      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleCommand('nav_up');
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleCommand('nav_down');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleCommand('nav_click');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleExitMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDeviceCode, isSending]);

  return (
    <div className="bg-transparent text-gray-900 dark:text-white font-sans space-y-4 transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700;800&display=swap');
        .font-lcd {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      {/* Navigasi Remote Mode & Exit Panel */}
      <div className="bg-white dark:bg-black p-3 rounded-lg border border-gray-200 dark:border-gray-900 space-y-2 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-wider flex items-center transition-colors duration-300">
            NAVIGASI HALAMAN ESP32:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Exit / Return to Menu Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            disabled={isSending}
            onClick={handleExitMenu}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-300 dark:border-white bg-white dark:bg-white hover:bg-gray-100 dark:hover:bg-gray-200 text-gray-900 dark:text-black font-medium text-[11px] transition-all cursor-pointer shadow-xs"
            title="Keluar dari menu kalibrasi / setting dan kembali ke Menu Utama"
          >
            <HomeIcon className="w-4 h-4" />
            Kembali / Exit Menu
          </motion.button>

          {/* Switch to Weighing Mode Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            disabled={isSending}
            onClick={handleEnterWeighingMode}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-300 dark:border-white bg-white dark:bg-white hover:bg-gray-100 dark:hover:bg-gray-200 text-gray-900 dark:text-black font-medium text-[11px] transition-all cursor-pointer shadow-xs"
            title="Masuk langsung ke layar penimbangan berat live"
          >
            <EnterIcon className="w-4 h-4" />
            Mode Timbang
          </motion.button>

          {/* Main Menu Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            disabled={isSending}
            onClick={() => handleCommand('state_menu')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-300 dark:border-white bg-white dark:bg-white hover:bg-gray-100 dark:hover:bg-gray-200 text-gray-900 dark:text-black font-medium text-[11px] transition-all cursor-pointer shadow-xs"
            title="Buka Menu Utama ESP32"
          >
            <GearIcon className="w-4 h-4" />
            Menu Utama
          </motion.button>
        </div>
      </div>

      {/* Warning Banner if Cow Not Selected */}
      {!isCowSelected && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 text-yellow-800 dark:text-yellow-400 p-2 rounded-lg text-[10px] flex items-center gap-1.5 font-medium transition-colors duration-300">
          <ExclamationTriangleIcon className="w-3 h-3 text-yellow-600 dark:text-yellow-500 shrink-0 transition-colors duration-300" />
          <span>⚠️ <strong>HARUS PILIH SAPI DAHULU:</strong> Silakan pilih sapi pada dropdown di bawah sebelum melakukan penimbangan & menyimpan data.</span>
        </div>
      )}

      {/* Baris Kontrol Utama: Pilih Sapi & Tombol Simpan Data */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 bg-white dark:bg-black p-3 rounded-lg border border-gray-200 dark:border-gray-900 transition-colors duration-300">
        {/* Dropdown Pilih Sapi */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5 transition-colors duration-300">
            <span className="text-[11px] opacity-80">🏴</span>
            <span>Pilih Sapi untuk Ditimbang (ESP32 Live Target):</span>
          </label>
          <select
            value={selectedCowId}
            onChange={handleSelectCowChange}
            disabled={isSending}
            className={`w-full bg-white dark:bg-black border text-[11px] font-medium rounded-lg p-2.5 outline-none transition-all cursor-pointer ${!isCowSelected
                ? 'border-yellow-500 dark:border-yellow-600 text-yellow-600 dark:text-yellow-500 ring-1 ring-yellow-500/50 dark:ring-yellow-600/50 animate-pulse'
                : 'border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 focus:border-gray-400 dark:focus:border-gray-500'
              }`}
          >
            <option value="">-- PILIH KODE/NAMA SAPI DARI MASTER DATA (WAJIB) --</option>
            {cows.map((cow) => (
              <option key={cow.id} value={cow.id}>
                {cow.cow_code} - {cow.name} ({cow.breed}) [{cow.last_weight ? `${cow.last_weight} KG` : 'Belum Timbang'}]
              </option>
            ))}
          </select>
        </div>

        {/* Tombol Simpan Data (Aktif saat Weight Lock & Cow Selected) */}
        <div className="flex flex-col justify-end w-full md:w-auto">
          <motion.button
            whileHover={canSave ? { scale: 1.02 } : {}}
            whileTap={canSave ? { scale: 0.97 } : {}}
            type="button"
            onClick={handleSaveWeight}
            disabled={!canSave}
            className={`w-full md:w-64 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-[11px] shadow-sm transition-all ${canSave
                ? 'bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black border border-black dark:border-white cursor-pointer'
                : 'bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white opacity-90 cursor-not-allowed'
              }`}
          >
            <span className="text-[12px]">⏳</span>
            {!isCowSelected
              ? 'HARUS PILIH SAPI DAHULU'
              : isLocked
                ? 'SIMPAN DATA (WEIGHT LOCKED)'
                : 'TUNGGU WEIGHT LOCK (~5s)'}
          </motion.button>
        </div>
      </div>

      {/* Main Display Container */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3 items-stretch">
        {/* Virtual LCD Display (20x4 Character Look) */}
        <div className="bg-[#e8f5e9] dark:bg-black border border-gray-300 dark:border-gray-800 rounded-lg p-3 font-mono shadow-inner relative overflow-hidden transition-colors duration-300 min-h-[130px] flex flex-col justify-between">

          {/* Cow Watermark (Dark Mode Only) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 dark:opacity-[0.03] pointer-events-none text-[120px] leading-none select-none right-[-30px] top-[-10px] scale-150">
            🐄
          </div>

          <div className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 text-[9px] transition-colors duration-300 tracking-wider text-right">
            <div>VIRTUAL LCD 20x4</div>
            <div className="mt-1">
              [ {isLocked ? 'TERKUNCI' : 'TIMBANG'} ]
            </div>
          </div>

          <div className="space-y-1 text-green-700 dark:text-gray-300 text-[11px] transition-colors duration-300 relative z-10">
            {/* Line 0 */}
            <div className="flex justify-between font-bold pb-2 transition-colors duration-300">
              <span className="text-gray-900 dark:text-gray-200 tracking-wide text-[12px]">{isCowSelected ? (cowCode || 'PILIH SAPI').substring(0, 10).padEnd(10, ' ') : 'PILIH SAPI '}</span>
            </div>

            {/* Line 1 — Weight Big Display (Digital Font) */}
            <div className="text-5xl font-black tracking-wider text-green-700 dark:text-white py-1 drop-shadow-md transition-colors duration-300 font-lcd">
              {currentWeight.toFixed(2)} <span className="text-3xl">KG</span>
            </div>

            {/* Line 2 — Cow Name */}
            <div className="text-[12px] text-gray-600 dark:text-gray-400 truncate transition-colors duration-300 mt-2">
              {isCowSelected ? (cowName || 'Sapi Penimbangan') : '⚠️ PILIH SAPI DARIDROP-DOWN'}
            </div>

            {/* Line 3 — Status & Max */}
            <div className="flex justify-between text-[9px] text-gray-600 dark:text-gray-500 border-t border-gray-300 dark:border-gray-800 pt-2 transition-colors duration-300 mt-2">
              <span className="flex items-center gap-1.5"><span className="text-[12px]">📶</span> WiFi: OK</span>
              <span>Max: 1400KG</span>
            </div>
          </div>
        </div>

        {/* Remote Hardware Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-[9px] font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300 mb-1">Aksi Cepat Hardware</h4>

          <div className="grid grid-cols-3 gap-2">
            {/* Remote Tare Button */}
            <button
              type="button"
              disabled={isSending}
              onClick={() => handleCommand('tare')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900 active:bg-gray-200 dark:active:bg-gray-800 border border-gray-200 dark:border-gray-800 transition-all text-gray-700 dark:text-gray-200 cursor-pointer disabled:opacity-50 group shadow-sm text-center min-h-[65px]"
              title="Reset timbangan ke 0.00 KG secara remote"
            >
              <SymbolIcon className="w-4 h-4 text-gray-600 dark:text-gray-300 mb-1 group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-[9px] font-bold">Remote Tare</span>
              <span className="text-[8px] text-gray-500 dark:text-gray-500 mt-0.5 leading-tight w-full truncate text-wrap">Nolkan berat saat ini di indikator</span>
            </button>

            {/* Buzzer Test Button */}
            <button
              type="button"
              disabled={isSending}
              onClick={() => handleCommand('buzzer')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900 active:bg-gray-200 dark:active:bg-gray-800 border border-gray-200 dark:border-gray-800 transition-all text-gray-700 dark:text-gray-200 cursor-pointer disabled:opacity-50 group shadow-sm text-center min-h-[65px]"
              title="Uji bunyi buzzer ESP32"
            >
              <SpeakerLoudIcon className="w-4 h-4 text-gray-600 dark:text-gray-300 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold">Test Buzzer</span>
              <span className="text-[8px] text-gray-500 dark:text-gray-500 mt-0.5 leading-tight w-full truncate text-wrap">Uji bunyi buzzer indikator</span>
            </button>

            {/* Backlight Toggle Button */}
            <button
              type="button"
              disabled={isSending}
              onClick={() => handleCommand('backlight_toggle')}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900 active:bg-gray-200 dark:active:bg-gray-800 border border-gray-200 dark:border-gray-800 transition-all text-gray-700 dark:text-gray-200 cursor-pointer disabled:opacity-50 group shadow-sm text-center min-h-[65px]"
              title="Nyalakan/matikan lampu LCD"
            >
              <SunIcon className="w-4 h-4 text-gray-600 dark:text-gray-300 mb-1 group-hover:rotate-45 transition-transform" />
              <span className="text-[9px] font-bold">LCD Lampu</span>
              <span className="text-[8px] text-gray-500 dark:text-gray-500 mt-0.5 leading-tight w-full truncate text-wrap">Atur backlight LCD indikator</span>
            </button>
          </div>

          {commandStatus && (
            <div className="text-[9px] p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white animate-fade-in font-mono text-center transition-colors duration-300">
              {commandStatus}
            </div>
          )}
        </div>
      </div>

      {/* ── Status Tegangan & Kesehatan Hardware ESP32 (Web Diagnostic Panel) ── */}
      <div className="bg-transparent space-y-4 transition-colors duration-300 pt-4 border-t border-gray-200 dark:border-gray-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors duration-300">
          <span className="text-[11px] font-bold text-gray-800 dark:text-gray-300 uppercase tracking-wider flex items-center transition-colors duration-300">
            STATUS TEGANGAN & TELEMETRI HARDWARE ESP32:
          </span>
          <span className="text-[10px] text-white dark:text-white font-mono font-bold bg-black dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-black dark:border-zinc-700 transition-colors duration-300">
            Real-time Telemetry
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-[10px]">
          {/* Item 1: Tegangan VCC */}
          <div className="bg-white dark:bg-black p-3 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors duration-300 flex flex-col justify-between min-h-[80px]">
            <div className="text-[9px] text-gray-500 flex items-center gap-1.5 font-medium"><span className="text-[11px]">⚡</span> Tegangan Rail VCC</div>
            <div className="text-[11px] font-bold text-gray-900 dark:text-white mt-0.5 flex items-center gap-1 transition-colors duration-300">
              {liveWeight?.isHardwareOnline && liveWeight?.vccVoltage ? `${liveWeight.vccVoltage.toFixed(2)} V` : '0.00 V'}
              <span className={`text-[8px] px-1 py-0.5 rounded font-bold transition-colors duration-300 ${liveWeight?.isHardwareOnline && (liveWeight?.voltageStatus === 'NORMAL' || liveWeight?.voltageStatus === 'NORMAL ✓' || !liveWeight?.voltageStatus)
                  ? 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50'
                }`}>
                {liveWeight?.isHardwareOnline ? (liveWeight?.voltageStatus || 'NORMAL ✓') : 'OFFLINE ❌'}
              </span>
            </div>
            <div className="text-[8px] text-gray-500 dark:text-gray-400 mt-1">Standar Normal: 3.0V - 3.6V</div>
          </div>

          {/* Item 2: Indikator Yaohua A12E (RS232) */}
          <div className="bg-white dark:bg-black p-3 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors duration-300 flex flex-col justify-between min-h-[80px]">
            <div className="text-[9px] text-gray-500 flex items-center gap-1.5 font-medium"><span className="text-[11px]">🔌</span> Indikator Yaohua (RS232)</div>
            <div className="text-[11px] font-bold text-gray-900 dark:text-white mt-0.5 flex items-center gap-1 transition-colors duration-300">
              <span className={`w-1.5 h-1.5 rounded-full ${liveWeight?.isHardwareOnline && (liveWeight?.a12e_status || liveWeight?.hx711Status) === 'CONNECTED' ? 'bg-black dark:bg-white animate-pulse' : 'bg-red-500'
                }`} />
              {liveWeight?.isHardwareOnline && (liveWeight?.a12e_status || liveWeight?.hx711Status) === 'CONNECTED' ? 'TERHUBUNG ✓' : 'OFFLINE ❌'}
            </div>
            <div className="text-[8px] font-mono text-gray-500 dark:text-gray-400 mt-1 truncate">
              UART2 @ 9600 8N1 (P5 1)
            </div>
          </div>

          {/* Item 3: Status Sinyal Wi-Fi (RSSI) */}
          <div className="bg-white dark:bg-black p-3 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors duration-300 flex flex-col justify-between min-h-[80px]">
            <div className="text-[9px] text-gray-500 flex items-center gap-1.5 font-medium"><span className="text-[11px]">📶</span> Sinyal Wi-Fi (RSSI)</div>
            <div className="text-[11px] font-bold text-gray-900 dark:text-white mt-0.5 flex items-center gap-1 transition-colors duration-300">
              {liveWeight?.isHardwareOnline && liveWeight?.wifiRssi ? `${liveWeight.wifiRssi} dBm` : '— dBm'}
              <span className={`text-[8px] px-1 py-0.5 rounded border font-bold transition-colors duration-300 ${liveWeight?.isHardwareOnline
                  ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700'
                  : 'bg-gray-50 dark:bg-black text-gray-500 border-gray-200 dark:border-gray-800'
                }`}>
                {liveWeight?.isHardwareOnline ? ((liveWeight?.wifiRssi ?? -60) > -70 ? 'STABIL' : 'SEDANG') : 'TERPUTUS'}
              </span>
            </div>
            <div className="text-[8px] text-gray-500 dark:text-gray-400 mt-1">2.4 GHz Mobile Hotspot</div>
          </div>

          {/* Item 4: Weight Lock Status */}
          <div className="bg-white dark:bg-black p-3 rounded-xl border border-gray-200 dark:border-gray-800 transition-colors duration-300 flex flex-col justify-between min-h-[80px]">
            <div className="text-[9px] text-gray-500 flex items-center gap-1.5 font-medium"><span className="text-[11px]">🔒</span> Weight Lock Status</div>
            <div className="text-[11px] font-bold mt-0.5 flex items-center gap-1">
              {liveWeight?.isHardwareOnline && isLocked ? (
                <span className="text-gray-900 dark:text-white flex items-center gap-1 font-extrabold animate-pulse transition-colors duration-300">
                  <CheckIcon className="w-3 h-3" /> TERKUNCI
                </span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">{liveWeight?.isHardwareOnline ? 'Menimbang...' : 'OFFLINE'}</span>
              )}
            </div>
            <div className="text-[8px] text-gray-500 dark:text-gray-400 mt-1">Kunci Otomatis (2.5 Detik)</div>
          </div>
        </div>

        {/* ── Sub-Panel: ESP32 Chip Internal Diagnostics ── */}
        <div className="pt-2 flex flex-wrap gap-8 text-[11px] transition-colors duration-300 justify-start sm:px-2">
          <div className="flex items-center gap-2 bg-transparent transition-colors duration-300">
            <span className="text-gray-500 dark:text-gray-500">🖩 Free RAM:</span>
            <span className="font-bold font-mono text-gray-900 dark:text-gray-300">
              {liveWeight?.isHardwareOnline && liveWeight?.freeHeap ? `${Math.round(liveWeight.freeHeap / 1024)} KB` : '—'}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-transparent transition-colors duration-300">
            <span className="text-gray-500 dark:text-gray-500">🌡️ Suhu CPU:</span>
            <span className="font-bold font-mono text-gray-900 dark:text-gray-300">
              {liveWeight?.isHardwareOnline && liveWeight?.cpuTemp ? `${liveWeight.cpuTemp.toFixed(1)} °C` : '—'}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-transparent transition-colors duration-300">
            <span className="text-gray-500 dark:text-gray-500">⏱️ Uptime:</span>
            <span className="font-bold font-mono text-gray-900 dark:text-gray-300">
              {liveWeight?.isHardwareOnline && liveWeight?.uptimeSec !== undefined
                ? `${Math.floor(liveWeight.uptimeSec / 60)}m ${liveWeight.uptimeSec % 60}s`
                : '—'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
