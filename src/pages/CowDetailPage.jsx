import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChevronLeftIcon, ExclamationTriangleIcon, PlusIcon, Cross2Icon } from '@radix-ui/react-icons';
import { useCowDetail } from '../hooks/useCowDetail';
import { addWeighing } from '../api/weighingApi';

const normalizeStatus = (status) => {
  if (!status) return '';
  return status.replace(/_/g, ' ').toUpperCase();
};

const getDssExplanation = (cow, predictionData) => {
  if (!predictionData || !predictionData.data_points_used || predictionData.data_points_used < 3) {
    return null;
  }
  
  if (predictionData.reason) {
    return predictionData.reason;
  }

  return null;
};

export function CowDetailPage({ cow, onBack }) {
  const { predictionData, weightHistory, recentWeighings, isLoading: isLoadingDetail, refetchData } = useCowDetail(cow?.id);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const chartData = [...weightHistory];
  if (predictionData && predictionData.projected_points && predictionData.projected_points.length > 0) {
    predictionData.projected_points.forEach((pt, index) => {
      const predDate = new Date(pt.date);
      chartData.push({
        name: `Bulan ${index + 1} (${predDate.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })})`,
        weight: pt.weight,
        isPrediction: true
      });
    });
  } else if (predictionData && predictionData.predicted_weight) {
    const predDate = new Date(predictionData.prediction_date);
    chartData.push({
      name: `Prediksi (${predDate.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })})`,
      weight: predictionData.predicted_weight,
      isPrediction: true
    });
  }


  const handleAddWeightSubmit = async (e) => {
    e.preventDefault();
    if (!weightInput || parseFloat(weightInput) <= 0) {
      setErrorMsg('Masukkan bobot sapi yang valid dalam KG');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await addWeighing({
        cow_id: cow.id,
        weight: parseFloat(weightInput),
        date: dateInput ? dateInput : new Date().toISOString().split('T')[0]
      });

      if (res && (res.success || res.id)) {
        setWeightInput('');
        setIsModalOpen(false);
        refetchData();
      } else {
        setErrorMsg(res?.message || 'Gagal menambahkan data penimbangan');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan jaringan atau server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Back navigation */}
      <button 
        onClick={onBack}
        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer focus:outline-none"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span>Kembali ke DSS</span>
      </button>

      {/* Header & Manual Entry Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/65 shadow-xs">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Detail Rekam Medis & Prediksi</h2>
          <p className="text-xs text-slate-500 font-medium">
            Sapi: <strong className="text-slate-800 font-bold">{cow.name}</strong> ({cow.cow_code}) — {cow.breed}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Tambah Data Penimbangan Manual</span>
        </button>
      </div>

      {/* Modal Input Penimbangan Manual */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <Cross2Icon className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Tambah Data Penimbangan</h3>
              <p className="text-xs text-slate-500 font-medium">
                Masukkan bobot penimbangan manual untuk sapi <strong className="text-slate-800">{cow.name}</strong> ({cow.cow_code}).
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddWeightSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Bobot Penimbangan (KG) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="1500"
                  required
                  placeholder="Contoh: 350.5"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tanggal Penimbangan *</label>
                <input
                  type="date"
                  required
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
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
          </div>
        </div>
      )}

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Detailed Info Card */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/65 p-6 shadow-xs space-y-5 h-fit">
          {/* Header/Title */}
          <div className="flex items-center gap-1.5 text-slate-800 border-b border-slate-100 pb-3">
            <span className="text-[10px] text-slate-500">▼</span>
            <h3 className="font-extrabold text-[13px] tracking-wider uppercase text-slate-700">Detail Sapi</h3>
          </div>

          {/* 1. Informasi Identitas */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Informasi Identitas</h4>
            <div className="grid grid-cols-2 gap-y-1.5 text-xs font-semibold text-slate-600">
              <span className="text-slate-400">RFID:</span>
              <span className="font-mono font-bold text-slate-900">{cow.cow_code}</span>
              
              <span className="text-slate-400">Rumpun:</span>
              <span className="text-slate-900 capitalize">{cow.breed}</span>
              
              <span className="text-slate-400">Gender:</span>
              <span className="text-slate-900 capitalize">{cow.gender}</span>
              
              <span className="text-slate-400">Umur:</span>
              <span className="text-slate-900">{cow.ageMonths || 0} bulan</span>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-slate-100" />

          {/* 2. Monitoring */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monitoring</h4>
            <div className="grid grid-cols-2 gap-y-1.5 text-xs font-semibold text-slate-600">
              <span className="text-slate-400">Bobot:</span>
              <span className="font-bold text-slate-900">{cow.last_weight} Kg</span>
              
              <span className="text-slate-400">ADG:</span>
              <span className={`font-bold ${
                cow.last_adg >= 0.3 ? 'text-emerald-600' : 'text-slate-900'
              }`}>
                {cow.last_adg > 0 ? '+' : ''}{cow.last_adg} Kg/hr
              </span>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-slate-100" />

          {/* Riwayat Penimbangan */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Riwayat Penimbangan (3 Terakhir)</h4>
            {isLoadingDetail ? (
              <p className="text-[10px] text-slate-400 italic">Memuat data timbangan...</p>
            ) : recentWeighings.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic">Belum ada data timbangan.</p>
            ) : (
              <div className="space-y-1.5">
                {recentWeighings.map((w, index) => {
                  const date = new Date(w.measurement_date);
                  const formattedDate = date.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });
                  return (
                    <div key={w.id || index} className="flex justify-between items-center text-xs font-semibold text-slate-650 bg-slate-50 border border-slate-100/50 p-2 rounded-lg">
                      <span>{formattedDate}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{w.weight} Kg</span>
                        {w.adg !== undefined && w.adg !== null && (
                          <span className={`text-[10px] ${w.adg >= 0.3 ? 'text-emerald-600' : w.adg > 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                            ({w.adg > 0 ? '+' : ''}{w.adg.toFixed(1)} Kg/d)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. DSS Analysis */}
          {predictionData && predictionData.data_points_used >= 3 && (
            <>
              {/* Divider */}
              <hr className="border-slate-100" />

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DSS Analysis</h4>
                <div className="space-y-1.5">
                  <div className={`text-xs font-extrabold uppercase tracking-wide ${
                    normalizeStatus(cow.dssLabel) === 'LAYAK DIPERTAHANKAN' ? 'text-emerald-600' :
                    normalizeStatus(cow.dssLabel) === 'PERLU EVALUASI' ? 'text-amber-600' :
                    'text-rose-600'
                  }`}>
                    {normalizeStatus(cow.dssLabel) === 'LAYAK DIPERTAHANKAN' ? '✓ ' : '⚠ '}
                    {normalizeStatus(cow.dssLabel)}
                  </div>
                  {getDssExplanation(cow, predictionData) && (
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed bg-slate-50 border border-slate-100/50 p-2.5 rounded-xl">
                      {getDssExplanation(cow, predictionData)}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* AI Prediction & Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/65 p-6 shadow-xs relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl opacity-50 pointer-events-none" />
          
          {isLoadingDetail ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-slate-500">Menganalisis data dari backend...</p>
            </div>
          ) : predictionData ? (
            <div className="relative z-10 space-y-6">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Akurasi Prediksi (R²)</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-slate-800">{predictionData.r_squared.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Akurasi {predictionData.accuracy_category}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Proyeksi Bobot ({predictionData.horizon_days} Hari)</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-blue-600">{predictionData.predicted_weight}</span>
                    <span className="text-xs font-bold text-blue-400">Kg</span>
                  </div>
                </div>
              </div>

              {/* Growth Chart */}
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Grafik Tren Bobot & Prediksi Regresi Linear</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        domain={['dataMin - 15', 'dataMax + 15']}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                      
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#2563eb" 
                        strokeWidth={3}
                        dot={{ stroke: '#2563eb', strokeWidth: 2, r: 4, fill: '#fff' }}
                        activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-slate-400 mt-4 text-center italic">*Proyeksi regresi linear berdasarkan {predictionData.data_points_used} bulan data timbangan historis.</p>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <ExclamationTriangleIcon className="w-8 h-8 text-amber-500" />
              <p className="text-xs font-semibold text-slate-650 text-center">Data belum cukup (Minimal 3 bulan penimbangan) untuk prediksi</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Input Data Penimbangan Ke-{weightHistory.length + 1}</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
