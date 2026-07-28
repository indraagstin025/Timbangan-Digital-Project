import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export function MainLayout({ activeTab, setActiveTab, lastScannedRfid, setLastScannedRfid, wsConnected, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-black flex text-gray-900 dark:text-white font-sans selection:bg-emerald-500/30 dark:selection:bg-gray-800 relative transition-colors duration-300">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} user={user} onLogout={logout} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} setIsSidebarOpen={setIsSidebarOpen} wsConnected={wsConnected} user={user} onLogout={logout} />

        {/* RFID scan toast popup banner */}
        <AnimatePresence>
          {lastScannedRfid && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-emerald-50 dark:bg-slate-900 text-emerald-900 dark:text-white px-6 py-2.5 flex items-center justify-between text-xs font-mono border-b border-emerald-100 dark:border-slate-800 transition-colors duration-300"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                <span>[IoT ESP32 Node 01] RFID Tag Dibaca: <strong className="text-emerald-700 dark:text-emerald-300 font-bold">{lastScannedRfid}</strong>. Menyinkronkan timbangan terbaru.</span>
              </div>
              <button onClick={() => setLastScannedRfid(null)} className="text-emerald-600 dark:text-slate-400 hover:text-emerald-900 dark:hover:text-white font-bold ml-4">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="p-4 lg:p-6 flex-1 space-y-4 max-w-6xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
