import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Cross1Icon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useCowDetail } from '../hooks/useCowDetail';

const normalizeStatus = (status) => {
  if (!status) return '';
  return status.replace(/_/g, ' ').toUpperCase();
};

export function PredictionDetailModal({ selectedCow, onClose }) {
  const { predictionData, weightHistory, recentWeighings, isLoading: isLoadingDetail } = useCowDetail(
    selectedCow?.id
  );

  return (
    <Dialog.Root open={!!selectedCow} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md transition-opacity" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-[9999] w-full max-w-2xl bg-white dark:bg-black shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col focus:outline-none transition-transform duration-300 ease-out data-[state=closed]:translate-x-full data-[state=open]:translate-x-0">
          {selectedCow && (
            <>
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div>
                  <Dialog.Title className="text-xl font-extrabold text-slate-900">
                    Rekam Medis & Prediksi
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-slate-500">
                    {selectedCow.name} ({selectedCow.cow_code})
                  </Dialog.Description>
                </div>
                <Dialog.Close className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-colors cursor-pointer">
                  <Cross1Icon className="w-5 h-5" />
                </Dialog.Close>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
                
                {/* Detailed Information Box */}
                <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
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
                      <span className="font-mono font-bold text-slate-900">{selectedCow.cow_code}</span>
                      
                      <span className="text-slate-400">Rumpun:</span>
                      <span className="text-slate-900 capitalize">{selectedCow.breed}</span>
                      
                      <span className="text-slate-400">Gender:</span>
                      <span className="text-slate-900 capitalize">{selectedCow.gender}</span>
                      
                      <span className="text-slate-400">Umur:</span>
                      <span className="text-slate-900">{selectedCow.ageMonths} bulan</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="border-slate-100" />

                  {/* 2. Monitoring */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monitoring</h4>
                    <div className="grid grid-cols-2 gap-y-1.5 text-xs font-semibold text-slate-600">
                      <span className="text-slate-400">Bobot:</span>
                      <span className="font-bold text-slate-900">{selectedCow.last_weight} Kg</span>
                      
                      <span className="text-slate-400">ADG:</span>
                      <span className={`font-bold ${
                        selectedCow.last_adg >= 0.3 ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {selectedCow.last_adg > 0 ? '+' : ''}{selectedCow.last_adg} Kg/hr
                      </span>
                    </div>
                  </div>

                   {/* Divider */}
                  <hr className="border-slate-100" />

                  {/* Riwayat Penimbangan (3 Terakhir) */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Riwayat Penimbangan (3 Terakhir)</h4>
                    {recentWeighings.length === 0 ? (
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
                        <div className={`text-[11px] font-extrabold uppercase tracking-wide ${
                          normalizeStatus(selectedCow.dssLabel) === 'LAYAK DIPERTAHANKAN' ? 'text-emerald-600' :
                          normalizeStatus(selectedCow.dssLabel) === 'PERLU EVALUASI' ? 'text-amber-600' :
                          'text-rose-600'
                        }`}>
                          {normalizeStatus(selectedCow.dssLabel) === 'LAYAK DIPERTAHANKAN' ? '✓ ' : '⚠ '}
                          {normalizeStatus(selectedCow.dssLabel)}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* AI Prediction & Linear Regression Chart */}
                <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-50/50 rounded-full blur-3xl opacity-50 pointer-events-none" />
                  
                  {isLoadingDetail ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-3">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-sm font-medium text-slate-500">Menganalisis data dari backend...</p>
                    </div>
                  ) : predictionData ? (
                    <div className="relative z-10 space-y-6">
                      
                      {/* Statistik Cards */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Akurasi (R²)</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-black text-slate-800">{predictionData.r_squared.toFixed(2)}</span>
                            <span className="text-[9px] text-slate-500 font-semibold">{predictionData.accuracy_category}</span>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Prediksi {predictionData.horizon_days} Hari</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-black text-blue-600">{predictionData.predicted_weight}</span>
                            <span className="text-xs font-bold text-blue-400">Kg</span>
                          </div>
                        </div>
                      </div>

                      {/* Chart */}
                      <div className="pt-4 border-t border-slate-100">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Grafik Pertumbuhan (3 Bulan)</h4>
                        <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[...weightHistory, {
                                name: 'Prediksi',
                                weight: predictionData.predicted_weight,
                                isPrediction: true
                              }]}
                              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis 
                                dataKey="name" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                dy={10}
                              />
                              <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                domain={['dataMin - 10', 'dataMax + 10']}
                              />
                              <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontWeight: 'bold' }}
                              />
                              
                              <Line 
                                type="monotone" 
                                dataKey="weight" 
                                stroke="#2563eb" 
                                strokeWidth={2.5}
                                dot={{ stroke: '#2563eb', strokeWidth: 1.5, r: 3, fill: '#fff' }}
                                activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 1.5 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-3 text-center italic">*Proyeksi regresi linear berdasarkan {predictionData.data_points_used} bulan historis.</p>
                      </div>

                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 space-y-3">
                      <ExclamationTriangleIcon className="w-8 h-8 text-amber-500" />
                      <p className="text-xs font-semibold text-slate-600 text-center">Data belum cukup (Minimal 3 bulan penimbangan) untuk prediksi</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
