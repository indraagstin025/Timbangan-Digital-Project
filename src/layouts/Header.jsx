import React, { useState } from 'react';
import { 
  PersonIcon,
  HamburgerMenuIcon,
  DotFilledIcon,
  ExitIcon,
  ChevronDownIcon
} from '@radix-ui/react-icons';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { ConfirmModal } from '../components/ConfirmModal';

export function Header({ activeTab, setActiveTab, setIsSidebarOpen, wsConnected, user, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 py-4 px-4 sm:px-6 lg:h-20 lg:py-0 lg:px-8 flex flex-wrap items-center justify-between gap-y-4 sticky top-0 z-40 shadow-xs transition-colors duration-300">
      {/* Left Title */}
      <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-black dark:text-white rounded shrink-0 cursor-pointer transition-colors"
          >
            <HamburgerMenuIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
          <div className="min-w-0">
            {activeTab === 'control' ? (
              <>
                <div className="text-sm lg:text-base font-bold text-black dark:text-white mt-1 truncate transition-colors duration-300">
                  Panel Kontrol & Live Scale Mirroring
                </div>
              </>
            ) : (
              <>
                <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none font-sans truncate">
                  Sistem Timbangan Sapi
                </div>
                <h2 className="text-sm lg:text-base font-bold text-black dark:text-white mt-1 truncate transition-colors duration-300">
                  {activeTab === 'dashboard' && 'Dashboard Utama'}
                  {activeTab === 'dss' && 'Sistem Pendukung Keputusan (DSS)'}
                  {activeTab === 'growth' && 'Analisis Tren & ADG Sapi'}
                  {activeTab === 'history' && 'Log Sensor Timbangan IoT'}
                  {activeTab === 'devices' && 'Perangkat Timbangan ESP32'}
                  {activeTab === 'export' && 'Ekspor Berkas & Laporan'}
                </h2>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Nav: Theme Toggle & Profile Dropdown */}
        <div className="flex lg:hidden items-center gap-2 pl-2">
          <button 
            onClick={toggleTheme}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold text-xs ring-1 ring-gray-200 dark:ring-gray-700 cursor-pointer"
          >
            <PersonIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Status Indicators & Nav */}
      <div className="flex items-center justify-between w-full lg:w-auto gap-2 sm:gap-4 lg:gap-6 relative">

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* IoT Status for Control Page */}
          {activeTab === 'control' && (
            <div className="flex items-center gap-2 pr-2 sm:pr-4 border-r border-gray-200 dark:border-gray-800 transition-colors duration-300">
              <div className="text-right hidden sm:block">
                <p className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400">Status Koneksi IoT</p>
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1 justify-end mt-0.5">
                  <DotFilledIcon className={`w-3.5 h-3.5 ${wsConnected ? 'text-emerald-500 animate-ping' : 'text-gray-400'}`} />
                  {wsConnected ? 'WebSocket Terhubung (Live)' : 'HTTP Polling Mode'}
                </p>
              </div>
              {/* Mobile simplified view */}
              <div className="block sm:hidden px-2">
                <DotFilledIcon className={`w-5 h-5 ${wsConnected ? 'text-emerald-500 animate-ping' : 'text-gray-400'}`} />
              </div>
            </div>
          )}
          
          {/* Theme Toggle Desktop */}
          <button 
            onClick={toggleTheme}
            className="hidden lg:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer mr-2"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Profile Dropdown Container (Desktop & Mobile) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="hidden lg:flex items-center gap-2.5 pl-4 border-l border-gray-200 dark:border-gray-800 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs shadow-xs">
                <PersonIcon className="w-4 h-4" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-gray-900 dark:text-white leading-none transition-colors duration-300 flex items-center gap-1">
                  {user?.username || 'Indra Agustin'}
                  <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1 font-bold font-sans">Peternak Utama</p>
              </div>
            </button>

            {/* Profile Dropdown Popup Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  {/* Backdrop listener to close menu when clicking outside */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-12 sm:top-14 w-56 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl p-3 z-50 space-y-2 font-sans"
                  >
                    {/* User Info Header inside Dropdown */}
                    <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-gray-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs shrink-0">
                        <PersonIcon className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {user?.username || 'Indra Agustin'}
                        </p>
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">
                          {user?.email || 'peternak@timbangsapi.id'}
                        </p>
                      </div>
                    </div>

                    {/* Role Tag */}
                    <div className="px-2 py-1 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400 font-bold">
                      <span>Peran Hak Akses:</span>
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800">
                        User
                      </span>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-900 my-1" />

                    {/* Logout Button */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsLogoutConfirmOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg border border-black dark:border-white transition-colors cursor-pointer"
                    >
                      <ExitIcon className="w-4 h-4" />
                      <span>Logout / Keluar</span>
                    </motion.button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari sistem TimbangSapi IoT? Sesi login Anda akan diakhiri."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        variant="warning"
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={() => {
          setIsLogoutConfirmOpen(false);
          if (onLogout) onLogout();
        }}
      />
    </header>
  );
}
