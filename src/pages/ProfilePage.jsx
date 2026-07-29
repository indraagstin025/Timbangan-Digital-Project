import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PersonIcon, LockClosedIcon, CheckCircledIcon,
  Cross2Icon, Pencil1Icon, ExclamationTriangleIcon
} from '@radix-ui/react-icons';
import { getProfile, updateProfile } from '../api/profileApi';
import { useAuth } from '../contexts/AuthContext';

function ProfileAvatar({ username }) {
  const initials = (username || '?').slice(0, 2).toUpperCase();
  return (
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
      <span className="text-2xl font-extrabold text-white font-mono">{initials}</span>
    </div>
  );
}

export function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Username form state
  const [editUsername, setEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState({ type: '', text: '' });

  // Password form state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        if (res.success && res.data) {
          setProfile(res.data);
          setNewUsername(res.data.username);
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim() || newUsername.trim() === profile?.username) {
      setUsernameMsg({ type: 'error', text: 'Username tidak berubah atau kosong.' });
      return;
    }
    setUsernameLoading(true);
    setUsernameMsg({ type: '', text: '' });
    try {
      const res = await updateProfile({ username: newUsername.trim() });
      if (res.success) {
        setProfile(prev => ({ ...prev, username: newUsername.trim() }));
        // Update localStorage agar header ikut berubah
        const savedUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
        savedUser.username = newUsername.trim();
        localStorage.setItem('auth_user', JSON.stringify(savedUser));
        setEditUsername(false);
        setUsernameMsg({ type: 'success', text: '✓ Username berhasil diubah!' });
        setTimeout(() => setUsernameMsg({ type: '', text: '' }), 4000);
      } else {
        setUsernameMsg({ type: 'error', text: res.message || 'Gagal mengubah username.' });
      }
    } catch (err) {
      setUsernameMsg({ type: 'error', text: err.message || 'Terjadi kesalahan server.' });
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (!oldPassword) {
      setPasswordMsg({ type: 'error', text: 'Password lama wajib diisi.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password baru minimal 6 karakter.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Konfirmasi password tidak cocok.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await updateProfile({
        old_password: oldPassword,
        new_password: newPassword,
      });
      if (res.success) {
        setPasswordMsg({ type: 'success', text: '✓ Password berhasil diubah! Silakan login ulang.' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordForm(false);
        setTimeout(() => logout(), 2500);
      } else {
        setPasswordMsg({ type: 'error', text: res.message || 'Gagal mengubah password.' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Terjadi kesalahan server.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayProfile = profile || authUser;

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-1">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm"
      >
        <div className="flex items-center gap-5">
          <ProfileAvatar username={displayProfile?.username} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
              Akun Saya
            </p>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white truncate">
              {displayProfile?.username}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
                {displayProfile?.role || 'user'}
              </span>
              {displayProfile?.email && (
                <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {displayProfile.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Card: Update Username --- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
              <PersonIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Username</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">Nama tampilan akun Anda</p>
            </div>
          </div>
          {!editUsername && (
            <button
              type="button"
              onClick={() => { setEditUsername(true); setUsernameMsg({ type: '', text: '' }); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer border border-blue-200 dark:border-blue-800"
            >
              <Pencil1Icon className="w-3 h-3" />
              Ubah
            </button>
          )}
        </div>

        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {!editUsername ? (
              <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-mono font-bold">
                  @{displayProfile?.username}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="edit"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onSubmit={handleUpdateUsername}
                className="space-y-3"
              >
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Username Baru *
                  </label>
                  <input
                    id="input-new-username"
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    minLength={3}
                    required
                    placeholder="Masukkan username baru..."
                    className="w-full px-3.5 py-2.5 text-sm font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="btn-save-username"
                    type="submit"
                    disabled={usernameLoading}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircledIcon className="w-3.5 h-3.5" />
                    {usernameLoading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditUsername(false); setNewUsername(displayProfile?.username || ''); setUsernameMsg({ type: '', text: '' }); }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <Cross2Icon className="w-3 h-3" />
                    Batal
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Alert Username */}
          <AnimatePresence>
            {usernameMsg.text && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-3 flex items-center gap-2 p-3 rounded-lg text-xs font-bold ${
                  usernameMsg.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {usernameMsg.type === 'success' ? <CheckCircledIcon className="w-3.5 h-3.5 shrink-0" /> : <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0" />}
                {usernameMsg.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* --- Card: Update Password --- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
              <LockClosedIcon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Password</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">Ubah kata sandi akun Anda</p>
            </div>
          </div>
          {!showPasswordForm && (
            <button
              id="btn-show-change-password"
              type="button"
              onClick={() => { setShowPasswordForm(true); setPasswordMsg({ type: '', text: '' }); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/40 rounded-lg transition-colors cursor-pointer border border-violet-200 dark:border-violet-800"
            >
              <Pencil1Icon className="w-3 h-3" />
              Ubah
            </button>
          )}
        </div>

        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {!showPasswordForm ? (
              <motion.div key="mask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-sm text-gray-400 dark:text-gray-500 font-mono tracking-widest">••••••••</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onSubmit={handleUpdatePassword}
                className="space-y-3"
              >
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Password Lama *
                  </label>
                  <input
                    id="input-old-password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    placeholder="Masukkan password saat ini..."
                    className="w-full px-3.5 py-2.5 text-sm font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Password Baru * <span className="text-gray-400 font-normal">(min. 6 karakter)</span>
                  </label>
                  <input
                    id="input-new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={6}
                    required
                    placeholder="Masukkan password baru..."
                    className="w-full px-3.5 py-2.5 text-sm font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Konfirmasi Password Baru *
                  </label>
                  <input
                    id="input-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Ulangi password baru..."
                    className={`w-full px-3.5 py-2.5 text-sm font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 border rounded-xl focus:outline-none transition-all ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/40'
                        : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500'
                    }`}
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[11px] text-rose-500 font-bold mt-1">Password tidak cocok</p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    id="btn-save-password"
                    type="submit"
                    disabled={passwordLoading}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <LockClosedIcon className="w-3.5 h-3.5" />
                    {passwordLoading ? 'Menyimpan...' : 'Simpan Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowPasswordForm(false); setOldPassword(''); setNewPassword(''); setConfirmPassword(''); setPasswordMsg({ type: '', text: '' }); }}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <Cross2Icon className="w-3 h-3" />
                    Batal
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Alert Password */}
          <AnimatePresence>
            {passwordMsg.text && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`mt-3 flex items-center gap-2 p-3 rounded-lg text-xs font-bold ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {passwordMsg.type === 'success' ? <CheckCircledIcon className="w-3.5 h-3.5 shrink-0" /> : <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0" />}
                {passwordMsg.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-black rounded-xl border border-rose-200 dark:border-rose-900/60 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-rose-700 dark:text-rose-400">Keluar dari Akun</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Anda akan keluar dari sesi saat ini.</p>
          </div>
          <button
            id="btn-logout-profile"
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
