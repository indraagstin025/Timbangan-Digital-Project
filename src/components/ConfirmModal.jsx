import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExclamationTriangleIcon, CheckCircledIcon, Cross2Icon, InfoCircledIcon } from '@radix-ui/react-icons';

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'danger', // 'danger' | 'warning' | 'info' | 'success'
  isLoading = false,
}) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />,
      iconBg: 'bg-red-100 dark:bg-red-950/60 border-red-200 dark:border-red-800',
      btnBg: 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-500',
    },
    warning: {
      icon: <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      iconBg: 'bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-500',
    },
    info: {
      icon: <InfoCircledIcon className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      iconBg: 'bg-sky-100 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
      btnBg: 'bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black',
    },
    success: {
      icon: <CheckCircledIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500',
    },
  };

  const style = variantStyles[variant] || variantStyles.danger;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 w-full max-w-md z-10 space-y-4"
        >
          {/* Close button top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer"
          >
            <Cross2Icon className="w-4 h-4" />
          </button>

          {/* Header Icon + Title */}
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl border ${style.iconBg} shrink-0`}>
              {style.icon}
            </div>
            <div className="pt-0.5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-900">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
              }}
              disabled={isLoading}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${style.btnBg} transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5`}
            >
              {isLoading ? 'Memproses...' : confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
