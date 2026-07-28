import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { addWeighing } from '../api/weighingApi';

export function AddWeighingModal({ isOpen, onClose, cows = [], onSuccess }) {
  const [selectedCowId, setSelectedCowId] = useState(cows[0]?.id || '');
  const [weight, setWeight] = useState('');
  const [measurementDate, setMeasurementDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCowId) {
      setErrorMsg('Pilih sapi terlebih dahulu');
      return;
    }
    if (!weight || parseFloat(weight) <= 0) {
      setErrorMsg('Masukkan bobot sapi yang valid dalam KG');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        cow_id: parseInt(selectedCowId, 10),
        weight: parseFloat(weight),
        date: measurementDate ? new Date(measurementDate).toISOString() : new Date().toISOString()
      };

      const res = await addWeighing(payload);
      if (res && (res.success || res.id)) {
        setWeight('');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res?.message || 'Gagal menambahkan penimbangan');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan jaringan atau server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 focus:outline-none animate-in fade-in zoom-in-95 duration-150">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <PlusIcon className="w-4 h-4" />
              </div>
              <div>
                <Dialog.Title className="text-base font-extrabold text-slate-900 dark:text-white">
                  Tambah Penimbangan Manual
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400">
                  Input data berat sapi untuk analisis Regresi Linear & Prediksi.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
              <Cross2Icon className="w-5 h-5" />
            </Dialog.Close>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800/50 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilih Sapi *</label>
              <select
                required
                value={selectedCowId}
                onChange={(e) => setSelectedCowId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="" disabled>-- Pilih Sapi --</option>
                {cows.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.cow_code} - {c.name} ({c.breed})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bobot Penimbangan (KG) *</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="1500"
                required
                placeholder="Contoh: 350.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tanggal Penimbangan *</label>
              <input
                type="date"
                required
                value={measurementDate}
                onChange={(e) => setMeasurementDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Penimbangan'}
              </button>
            </div>
          </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
