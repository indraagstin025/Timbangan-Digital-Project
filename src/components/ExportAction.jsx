import React, { useState } from 'react';
import { 
  FileTextIcon, 
  CheckIcon, 
  UpdateIcon 
} from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'motion/react';

export function ExportAction({ onExport, filteredCount, selectedBreed = '' }) {
  const [loadingType, setLoadingType] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleExportClick = async (type) => {
    setLoadingType(type);
    
    if (type === 'excel' || type === 'csv') {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'https://timbangan-digital-production.up.railway.app/api';
        const token = localStorage.getItem('auth_token') || '';
        const breedParam = selectedBreed && !selectedBreed.includes('Semua') ? `?breed=${encodeURIComponent(selectedBreed)}` : '';
        const url = `${baseUrl}/export/excel${breedParam}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Gagal mengunduh Excel');
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `Laporan_TimbangSapi_IoT_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        
        setToastMessage(`✓ Berhasil mengunduh dokumen Laporan_TimbangSapi_IoT_${new Date().toISOString().slice(0, 10)}.xlsx`);
      } catch (err) {
        setToastMessage(`❌ Gagal mengunduh: ${err.message}`);
      } finally {
        setLoadingType(null);
        setTimeout(() => setToastMessage(null), 4000);
      }
    } else {
      setTimeout(() => {
        setLoadingType(null);
        if (onExport) onExport(type);
        setToastMessage(`Berhasil memproses laporan ${type.toUpperCase()}`);
        setTimeout(() => setToastMessage(null), 4000);
      }, 1000);
    }
  };

  return (
    <div id="export-action-component" className="flex items-center justify-between bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 shadow-xs transition-all duration-300">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-400 font-sans tracking-wide transition-colors duration-300">
          Ekspor Laporan: <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50 transition-colors duration-300">{filteredCount} Sapi Terpilih</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          id="export-excel-btn"
          type="button"
          disabled={loadingType !== null}
          onClick={() => handleExportClick('excel')}
          className="flex items-center gap-1.5 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 border border-black dark:border-white text-white dark:text-black font-bold text-[11px] px-3.5 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer disabled:opacity-50"
        >
          {loadingType === 'excel' ? (
            <UpdateIcon className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FileTextIcon className="w-3.5 h-3.5" />
          )}
          <span>{loadingType === 'excel' ? 'Mengunduh...' : 'Unduh Excel (.xlsx)'}</span>
        </button>

        <button
          id="export-pdf-btn"
          type="button"
          disabled={loadingType !== null}
          onClick={() => handleExportClick('pdf')}
          className="flex items-center gap-1.5 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-black font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
        >
          {loadingType === 'pdf' ? (
            <UpdateIcon className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <FileTextIcon className="w-3.5 h-3.5" />
          )}
          <span>{loadingType === 'pdf' ? 'PDF...' : 'Ekspor PDF'}</span>
        </button>
      </div>

      {/* Floating success toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 max-w-md transition-colors duration-300"
          >
            <div className="p-1 bg-emerald-500 rounded-lg text-white shrink-0">
              <CheckIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs font-sans transition-colors duration-300">Unduhan Berhasil</p>
              <p className="text-[10px] text-gray-500 mt-0.5 font-mono leading-relaxed transition-colors duration-300">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
