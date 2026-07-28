import React from "react";
import { Sun, Moon, ArrowRight, ShieldCheck, Activity, Cpu, Radio, FileText, Smartphone, Scale, Wifi, LineChart, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

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

export default function LandingPage({ onLoginClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-[#212121] text-gray-800 dark:text-gray-100 transition-colors duration-300 font-sans selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95">
          <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg">
            <CowLogo className="w-6 h-6 text-white dark:text-black" />
          </div>
          <span className="font-bold text-xl tracking-tight text-black dark:text-white">TimbangSapi</span>
        </div>
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
          <a href="#features" className="hover:text-black dark:hover:text-white transition-colors">Fitur</a>
          <a href="#how-it-works" className="hover:text-black dark:hover:text-white transition-colors">Cara Kerja</a>
          <a href="#faq" className="hover:text-black dark:hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={onLoginClick}
            className="px-4 py-2 text-sm font-medium rounded-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black transition-colors"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="w-full flex flex-col items-center overflow-hidden">
        
        {/* Split Hero Layout */}
        <div className="w-full max-w-7xl mx-auto px-6 pt-4 pb-20 lg:pt-8 lg:pb-32 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-10">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 text-black dark:text-white leading-[1.15]"
              >
                Manajemen Ternak <br />
                <span className="text-gray-800 dark:text-gray-200">Era Cerdas</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8 leading-relaxed"
              >
                Platform pemantauan ternak yang menyatukan perangkat IoT, analisis data, dan sistem rekomendasi pakar untuk peternakan yang lebih efisien.
              </motion.p>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <motion.button 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  onClick={onLoginClick}
                  className="w-full sm:w-auto group flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 dark:shadow-white/5"
                >
                  Pantau Sekarang
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.a 
                  href="#features"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="w-full sm:w-auto flex items-center justify-center px-6 py-3 text-base font-medium rounded-full border-2 border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white text-black dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-white/5 active:scale-95"
                >
                  Lihat Fitur
                </motion.a>
              </div>
            </div>

            {/* Right Column: Hero Image Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.2 }}
              className="relative w-full flex justify-center lg:justify-end"
            >
              <div className="relative w-[85%] md:w-[70%] lg:w-[90%] max-w-sm md:max-w-md lg:max-w-md xl:max-w-lg mt-12 lg:mt-0">
                {/* Subtle Glow behind image */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-gray-200 to-gray-50 dark:from-white/5 dark:to-transparent rounded-[2rem] blur-xl opacity-50"></div>
                <img 
                  src="/hero-image.png" 
                  alt="Sistem Manajemen Timbangan IoT" 
                  className="relative z-10 w-full h-auto rounded-[2rem] shadow-2xl border border-gray-200/50 dark:border-white/10 object-cover"
                />
                
                {/* Floating Badge - Mimicking Reference UI */}
                <div className="absolute -bottom-6 -left-2 md:-bottom-8 md:-left-8 bg-white dark:bg-[#1a1a1a] p-5 md:p-6 rounded-2xl md:rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center min-w-[140px] md:min-w-[180px] z-20">
                  <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Berat Saat Ini</span>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl md:text-6xl font-bold text-black dark:text-white tracking-tighter">482</span>
                    <span className="text-lg md:text-xl font-bold text-gray-400 mb-2">kg</span>
                  </div>
                  <LineChart className="text-black dark:text-white mt-2 opacity-50" size={24} />
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>

        {/* Stats / Quick Features Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-7xl mx-auto px-6 pb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 md:p-10 rounded-[2rem] bg-gray-50 dark:bg-[#2f2f2f] border border-gray-100 dark:border-white/5 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <Scale className="text-black dark:text-white mb-4" size={32} />
              <h4 className="font-bold text-black dark:text-white text-lg">Penimbangan Akurat</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Sensor loadcell presisi tinggi</p>
            </div>
            <div className="flex flex-col items-center">
              <Wifi className="text-black dark:text-white mb-4" size={32} />
              <h4 className="font-bold text-black dark:text-white text-lg">Monitoring Real-time</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Data langsung dikirim ke web</p>
            </div>
            <div className="flex flex-col items-center">
              <LineChart className="text-black dark:text-white mb-4" size={32} />
              <h4 className="font-bold text-black dark:text-white text-lg">Grafik & Riwayat</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Lihat perkembangan dari waktu ke waktu</p>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="text-black dark:text-white mb-4" size={32} />
              <h4 className="font-bold text-black dark:text-white text-lg">Kelola Data Sapi</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Tersimpan aman & terpusat di cloud</p>
            </div>
          </div>
        </motion.div>

        {/* Content Wrapper for remaining sections */}
        <div className="flex flex-col items-center px-4 pb-32 text-center max-w-5xl mx-auto w-full">
          {/* Features Grid - ChatGPT Style */}
        <motion.div 
          id="features" 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-32 w-full text-left scroll-mt-24"
        >
          
          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#2f2f2f] border border-gray-100 dark:border-white/5 hover:border-black/30 dark:hover:border-white/30 transition-colors">
            <Cpu className="text-black dark:text-white mb-4" size={28} />
            <h3 className="text-xl font-semibold mb-2">Timbangan IoT</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Timbangan digital cerdas yang terhubung ke internet. Mendukung sinkronisasi data otomatis meski sempat kehilangan koneksi (offline-first).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#2f2f2f] border border-gray-100 dark:border-white/5 hover:border-black/30 dark:hover:border-white/30 transition-colors">
            <Activity className="text-black dark:text-white mb-4" size={28} />
            <h3 className="text-xl font-semibold mb-2">Analisis Pertumbuhan</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Memantau kurva berat badan dan menghitung Average Daily Gain (ADG) secara otomatis untuk mengetahui performa tiap ternak.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#2f2f2f] border border-gray-100 dark:border-white/5 hover:border-black/30 dark:hover:border-white/30 transition-colors">
            <ShieldCheck className="text-black dark:text-white mb-4" size={28} />
            <h3 className="text-xl font-semibold mb-2">Sistem Keputusan (DSS)</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Mengevaluasi status kesehatan sapi dan memberikan rekomendasi tindakan atau nutrisi pakan berdasarkan hasil evaluasi sistem.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#2f2f2f] border border-gray-100 dark:border-white/5 hover:border-black/30 dark:hover:border-white/30 transition-colors">
            <Radio className="text-black dark:text-white mb-4" size={28} />
            <h3 className="text-xl font-semibold mb-2">Kontrol Live</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Pantau status perangkat di kandang secara real-time. Meliputi kondisi sinyal WiFi, indikator baterai, hingga suhu mikrokontroler.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#2f2f2f] border border-gray-100 dark:border-white/5 hover:border-black/30 dark:hover:border-white/30 transition-colors">
            <FileText className="text-black dark:text-white mb-4" size={28} />
            <h3 className="text-xl font-semibold mb-2">Riwayat & Ekspor</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Semua data penimbangan tersimpan rapi dalam log riwayat. Bisa diekspor ke format PDF maupun CSV untuk keperluan pelaporan.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#2f2f2f] border border-gray-100 dark:border-white/5 hover:border-black/30 dark:hover:border-white/30 transition-colors">
            <Smartphone className="text-black dark:text-white mb-4" size={28} />
            <h3 className="text-xl font-semibold mb-2">Manajemen Perangkat</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Satu akun terhubung ke alat timbangan. Sistem Pairing menjamin keamanan data ternak hanya bisa diakses oleh perangkat yang sah.
            </p>
          </div>

        </motion.div>

        {/* How It Works Section */}
        <motion.div 
          id="how-it-works" 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-32 w-full scroll-mt-24"
        >
          <h2 className="text-3xl font-bold mb-12 text-center text-black dark:text-white">Bagaimana Cara Kerjanya?</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center max-w-xs z-10">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#2f2f2f] flex items-center justify-center mb-6 shadow-sm border border-gray-200 dark:border-white/10">
                <Scale className="text-black dark:text-white" size={32} />
              </div>
              <h4 className="text-lg font-bold mb-2">1. Pasang Timbangan</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Hubungkan perangkat timbangan IoT di kandang Anda.</p>
            </div>

            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block w-24 h-[2px] bg-gray-200 dark:bg-white/10 -mt-16 z-0"></div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center max-w-xs z-10">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#2f2f2f] flex items-center justify-center mb-6 shadow-sm border border-gray-200 dark:border-white/10">
                <Wifi className="text-black dark:text-white" size={32} />
              </div>
              <h4 className="text-lg font-bold mb-2">2. Hubungkan ke WiFi</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Lakukan proses pairing agar perangkat terhubung ke internet.</p>
            </div>

            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block w-24 h-[2px] bg-gray-200 dark:bg-white/10 -mt-16 z-0"></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center max-w-xs z-10">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-[#2f2f2f] flex items-center justify-center mb-6 shadow-sm border border-gray-200 dark:border-white/10">
                <LineChart className="text-black dark:text-white" size={32} />
              </div>
              <h4 className="text-lg font-bold mb-2">3. Pantau Hasilnya</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Data berat sapi akan otomatis masuk ke web untuk dianalisis.</p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          id="faq" 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-32 w-full max-w-3xl text-left scroll-mt-24"
        >
          <div className="flex items-center gap-3 mb-8 justify-center">
            <HelpCircle className="text-black dark:text-white" size={28} />
            <h2 className="text-3xl font-bold text-black dark:text-white text-center">Pertanyaan Umum</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-gray-50 dark:bg-[#2f2f2f] border border-gray-100 dark:border-white/5">
              <h4 className="font-bold text-black dark:text-white mb-2">Apakah alat tetap berfungsi jika WiFi mati?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Ya. Alat timbangan IoT kami memiliki fitur Antrean (Queue) NVS. Data akan disimpan sementara di dalam alat dan dikirimkan secara otomatis begitu WiFi kembali menyala.</p>
            </div>
            
            <div className="p-5 rounded-xl bg-gray-50 dark:bg-[#2f2f2f] border border-gray-100 dark:border-white/5">
              <h4 className="font-bold text-black dark:text-white mb-2">Bagaimana Sistem Pakar (DSS) memberikan rekomendasi?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Sistem membandingkan Average Daily Gain (ADG) sapi Anda dengan standar kurva pertumbuhan ideal. Jika trennya menurun, sistem akan menyarankan evaluasi pakan atau pengecekan kesehatan.</p>
            </div>
            
            <div className="p-5 rounded-xl bg-gray-50 dark:bg-[#2f2f2f] border border-gray-100 dark:border-white/5">
              <h4 className="font-bold text-black dark:text-white mb-2">Berapa maksimal alat yang bisa dipairing?</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Untuk memastikan keamanan dan mencegah data tumpang tindih, satu akun peternak saat ini hanya diizinkan mem-pairing maksimal 1 buah timbangan (1 Alat = 1 Akun).</p>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mt-32 w-full p-12 rounded-3xl bg-gray-50 dark:bg-[#2f2f2f] border border-gray-200 dark:border-white/10 text-center flex flex-col items-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white">Siap Untuk Memulai?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
            Bergabunglah dan ubah cara Anda mengelola peternakan menjadi lebih modern, terukur, dan berbasis data akurat.
          </p>
          <button 
            onClick={onLoginClick}
            className="group flex items-center gap-2 px-8 py-4 text-lg font-medium rounded-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black transition-all hover:scale-105 active:scale-95"
          >
            Masuk ke Aplikasi Sekarang
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
        </div>

      </main>
      
      {/* Comprehensive Footer */}
      <footer className="border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1a1a] pt-12 pb-8 px-6 text-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center shadow-md">
                <CowLogo className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="font-bold text-lg text-black dark:text-white tracking-tight">TimbangSapi</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-4">
              Sistem Manajemen Timbangan & Keputusan berbasis IoT. Membantu peternak mengelola data berat sapi, analisis ADG, dan rekomendasi pakar dengan mudah.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-black dark:text-white mb-4">Fitur</h4>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400">
              <li><button onClick={() => {}} className="hover:text-black dark:hover:text-white transition-colors">Timbangan IoT</button></li>
              <li><button onClick={() => {}} className="hover:text-black dark:hover:text-white transition-colors">Analisis ADG</button></li>
              <li><button onClick={() => {}} className="hover:text-black dark:hover:text-white transition-colors">Sistem Pakar (DSS)</button></li>
              <li><button onClick={() => {}} className="hover:text-black dark:hover:text-white transition-colors">Kontrol Perangkat</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400">
              <li><button onClick={() => {}} className="hover:text-black dark:hover:text-white transition-colors">Kebijakan Privasi</button></li>
              <li><button onClick={() => {}} className="hover:text-black dark:hover:text-white transition-colors">Syarat & Ketentuan</button></li>
              <li><button onClick={() => {}} className="hover:text-black dark:hover:text-white transition-colors">Panduan Alat</button></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} TimbangSapi IoT Management. All rights reserved.</p>
          <p>Dibuat untuk peternakan masa depan.</p>
        </div>
      </footer>
    </div>
  );
}

