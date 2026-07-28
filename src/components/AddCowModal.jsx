import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross1Icon, ExclamationTriangleIcon, SymbolIcon } from '@radix-ui/react-icons';

export function AddCowModal({ isOpen, onClose, onAdd }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [newCowForm, setNewCowForm] = useState({
    cow_code: '',
    name: '',
    breed: 'Sapi Limousin',
    gender: 'jantan',
    birth_date: '2025-01-01',
    owner: 'Peternak A',
    status: 'active'
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Validasi Dasar Frontend
    if (!newCowForm.cow_code.trim()) {
      setErrorMsg('RFID / Kode Sapi tidak boleh kosong.');
      return;
    }
    if (!newCowForm.name.trim()) {
      setErrorMsg('Nama Panggilan sapi tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onAdd(newCowForm);
      if (result && result.success) {
        // Reset form & close ONLY on success
        setNewCowForm({
          cow_code: '', name: '', breed: 'Sapi Limousin', gender: 'jantan', birth_date: '2025-01-01', owner: 'Peternak A', status: 'active'
        });
        onClose();
      } else {
        // Tampilkan pesan error dari backend (misal: RFID sudah ada)
        setErrorMsg(result?.error || 'Gagal menambahkan sapi ke database.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan jaringan atau server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md transition-opacity" />
        <Dialog.Content 
          onInteractOutside={(e) => { if(isSubmitting) e.preventDefault(); }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-[9999] focus:outline-none transition-all"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-950 flex items-center justify-between">
            <div>
              <Dialog.Title className="text-base font-bold text-gray-900 dark:text-white">Registrasi Sapi Baru</Dialog.Title>
              <Dialog.Description className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Daftarkan sapi ke sistem pangkalan data.</Dialog.Description>
            </div>
            <Dialog.Close disabled={isSubmitting} className="p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-white rounded-full transition-colors disabled:opacity-50 cursor-pointer">
              <Cross1Icon />
            </Dialog.Close>
          </div>
          
          <form onSubmit={handleAddSubmit} className="p-6 space-y-4 font-sans">
            {errorMsg && (
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5 shadow-sm">
                <ExclamationTriangleIcon className="w-5 h-5 mt-0.5 shrink-0 text-rose-500" />
                <div>
                  <strong className="block font-bold">Validasi Gagal</strong>
                  <span className="text-rose-600/90 dark:text-rose-400/90 text-xs mt-0.5 block">{errorMsg}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">Tag RFID / Kode Sapi <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  required
                  disabled={isSubmitting}
                  value={newCowForm.cow_code}
                  onChange={e => setNewCowForm({...newCowForm, cow_code: e.target.value.toUpperCase()})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-zinc-950"
                  placeholder="e.g. RFID-001"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">Nama Panggilan <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  required
                  disabled={isSubmitting}
                  value={newCowForm.name}
                  onChange={e => setNewCowForm({...newCowForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-zinc-950"
                  placeholder="e.g. Bimo"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">Rumpun Sapi</label>
                <select 
                  value={newCowForm.breed}
                  disabled={isSubmitting}
                  onChange={e => setNewCowForm({...newCowForm, breed: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-zinc-950"
                >
                  <option>Sapi Limousin</option>
                  <option>Sapi Simmental</option>
                  <option>Sapi Brahman</option>
                  <option>Sapi PO (Ongole)</option>
                  <option>Sapi Bali</option>
                  <option>Sapi Madura</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">Jenis Kelamin</label>
                <select 
                  value={newCowForm.gender}
                  disabled={isSubmitting}
                  onChange={e => setNewCowForm({...newCowForm, gender: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-zinc-950"
                >
                  <option value="jantan">Jantan</option>
                  <option value="betina">Betina</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">Tanggal Lahir</label>
                <input 
                  type="date" 
                  required
                  disabled={isSubmitting}
                  value={newCowForm.birth_date}
                  onChange={e => setNewCowForm({...newCowForm, birth_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-zinc-950"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1.5">Pemilik</label>
                <input 
                  type="text" 
                  required
                  disabled={isSubmitting}
                  value={newCowForm.owner}
                  onChange={e => setNewCowForm({...newCowForm, owner: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-zinc-950"
                  placeholder="Nama Peternak"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-900">
              <Dialog.Close asChild>
                <button 
                  type="button" 
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
              </Dialog.Close>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 border border-black dark:border-white rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-70 disabled:cursor-wait"
              >
                {isSubmitting ? (
                  <>
                    <SymbolIcon className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Data Sapi'
                )}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
