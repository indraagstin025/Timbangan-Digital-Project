import React from 'react';
import { 
  TokensIcon, 
  BarChartIcon, 
  MixerHorizontalIcon, 
  FileTextIcon,
  Cross1Icon,
  PersonIcon,
  ExitIcon
} from '@radix-ui/react-icons';

const CowLogo = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 11a6 6 0 0 1 12 0v4a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-4z" />
    <path d="M6 11l-3-2" />
    <path d="M18 11l3-2" />
    <path d="M8 7c0-2 1-3 2-3" />
    <path d="M16 7c0-2-1-3-2-3" />
    <path d="M9 15h6" />
    <circle cx="9" cy="17" r="1.5" fill="currentColor" />
    <circle cx="15" cy="17" r="1.5" fill="currentColor" />
  </svg>
);

export function Sidebar({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, user, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Utama', desc: 'Panel ringkasan KPI', icon: TokensIcon },
    { id: 'control', label: 'Kontrol Timbangan', desc: 'Live scale & remote control', icon: MixerHorizontalIcon },
    { id: 'dss', label: 'Sistem Keputusan (DSS)', desc: 'Manajemen kelayakan sapi', icon: MixerHorizontalIcon },
    { id: 'growth', label: 'Analisis Pertumbuhan', desc: 'Metrik ADG & tren bobot', icon: BarChartIcon },
    { id: 'history', label: 'Histori Timbangan', desc: 'Stream log IoT ESP32', icon: MixerHorizontalIcon },
    { id: 'devices', label: 'Perangkat Saya', desc: 'Pairing timbangan ESP32', icon: MixerHorizontalIcon },
    { id: 'export', label: 'Ekspor Laporan', desc: 'Unduh data PDF/CSV', icon: FileTextIcon },
  ];


  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between shrink-0 transition-all duration-300 transform
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:flex lg:shadow-none lg:overflow-y-auto
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl h-screen' : '-translate-x-full lg:shadow-none'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="p-4 lg:h-20 lg:py-0 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-2.5 transition-colors duration-300">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center shadow-xs transition-colors duration-300">
                <CowLogo className="w-5 h-5 text-white dark:text-black" />
              </div>
              <div>
                <h1 className="text-xs font-bold font-sans tracking-tight leading-none text-black dark:text-white transition-colors duration-300">
                  TimbangSapi
                </h1>
                <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold mt-1 font-sans">
                  IoT MANAGEMENT
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              type="button" 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
            >
              <Cross1Icon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  id={`sidebar-menu-${item.id}`}
                  key={item.id}
                  type="button"
                  onClick={() => { 
                    setActiveTab(item.id); 
                    setIsSidebarOpen(false); 
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-sm scale-[1.01]' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white dark:text-black' : 'text-gray-400 dark:text-gray-500'}`} />
                  <div>
                    <p className="text-xs font-bold leading-none">{item.label}</p>
                    <p className={`text-[9px] mt-1 font-sans font-bold ${isActive ? 'text-gray-300 dark:text-gray-700' : 'text-gray-400 dark:text-gray-500'}`}>{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Clean Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black transition-colors duration-300">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 text-center font-sans">
            © 2026 TimbangSapi IoT
          </p>
        </div>
      </aside>
    </>
  );
}
