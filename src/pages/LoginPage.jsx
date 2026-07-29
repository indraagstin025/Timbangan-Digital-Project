import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Activity, Lock, User, AlertCircle, CheckCircle2, Mail, ArrowLeft, Sun, Moon, Eye, EyeOff } from 'lucide-react';

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

export default function LoginPage({ onBack }) {
  const { login, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    if (isRegisterMode) {
      const result = await register(username, email, password);
      if (!result.success) {
        setError(result.message || 'Registrasi gagal');
      } else {
        setSuccessMsg('Registrasi berhasil! Silakan login.');
        setIsRegisterMode(false);
        setPassword('');
      }
    } else {
      const result = await login(username, password);
      if (!result.success) {
        setError(result.message || 'Login gagal');
      }
      // Jika success, komponen ini akan di-unmount oleh App.jsx (Protected Route)
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#212121] flex flex-col transition-colors duration-300 font-sans">
      
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between p-4 sm:p-6 max-w-7xl mx-auto z-50">
        <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={onBack}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg">
            <CowLogo className="w-5 h-5 sm:w-6 sm:h-6 text-white dark:text-black" />
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight text-black dark:text-white">TimbangSapi</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {onBack && (
            <button 
              onClick={onBack}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium rounded-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black transition-colors"
            >
              Kembali
            </button>
          )}
        </div>
      </nav>

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 pb-12 pt-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-[400px] relative">
          <div className="flex justify-center">
            <div className="h-12 w-12 sm:h-14 sm:w-14 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-xl shadow-black/10 dark:shadow-white/5">
              <CowLogo className="h-6 w-6 sm:h-7 sm:w-7 text-white dark:text-black" />
            </div>
          </div>
          <h2 className="mt-5 text-center text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
            Masuk ke Akun Anda
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Sistem Manajemen Timbangan & Keputusan
          </p>
        </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-white dark:bg-[#212121] py-6 px-4 sm:rounded-3xl sm:px-8 border border-gray-200 dark:border-white/10 shadow-xl transition-colors duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="mb-6 flex border-b border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => { setIsRegisterMode(false); setError(''); setSuccessMsg(''); }}
                className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${!isRegisterMode ? 'border-black text-black dark:border-white dark:text-white' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setIsRegisterMode(true); setError(''); setSuccessMsg(''); }}
                className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${isRegisterMode ? 'border-black text-black dark:border-white dark:text-white' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                Daftar
              </button>
            </div>

            {error && (
              <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3 border border-red-100">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {successMsg && (
              <div className="bg-emerald-50 p-4 rounded-lg flex items-start gap-3 border border-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-sm text-emerald-700">{successMsg}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-gray-50 dark:bg-[#2a2a2a] text-black dark:text-white sm:text-sm transition-all outline-none"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            {isRegisterMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required={isRegisterMode}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-gray-50 dark:bg-[#2a2a2a] text-black dark:text-white sm:text-sm transition-all outline-none"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-gray-50 dark:bg-[#2a2a2a] text-black dark:text-white sm:text-sm transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-medium text-white bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading 
                  ? 'Memproses...' 
                  : isRegisterMode 
                    ? 'Daftar Akun Baru' 
                    : 'Masuk ke Dashboard'}
              </button>
            </div>
            
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
              Silakan login dengan akun yang telah terdaftar.
            </div>
          </form>
        </div>
      </div>
      
      </div>
    </div>
  );
}
