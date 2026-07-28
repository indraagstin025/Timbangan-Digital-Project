import { useState, useMemo, useEffect, useCallback } from 'react';
import { initialGrowthData } from '../data';
import { getCows, createCow } from '../api/cowApi';
import { getSummary, getGrowthTrend } from '../api/dashboardApi';
import { getWeighingHistory, addWeighing } from '../api/weighingApi';

export function useLivestockData() {
  // Global States
  const [cows, setCows] = useState([]);
  const [growthData, setGrowthData] = useState([]); // Akan diisi dari API backend
  const [scaleLogs, setScaleLogs] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  // IoT simulator states
  const [selectedCowId, setSelectedCowId] = useState('');
  const [simulatedWeightChange, setSimulatedWeightChange] = useState(5);
  const [isSimulating, setIsSimulating] = useState(false);
  const [iotStatus, setIotStatus] = useState('connected');
  const [lastScannedRfid, setLastScannedRfid] = useState(null);

  const fetchGrowthData = useCallback(async () => {
    try {
      const res = await getGrowthTrend();
      if (res.success && res.data) {
        setGrowthData(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch growth trend', e);
    }
  }, []);

  // Fungsi Fetch Data
  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await getSummary();
      if (res.success) {
        setDashboardSummary(res.data);
      }
    } catch (e) {
      console.error('Failed to fetch dashboard summary', e);
    }
  }, []);

  const fetchCows = useCallback(async () => {
    try {
      const res = await getCows();
      if (res.success && res.data) {
        setCows(res.data);
        if (res.data.length > 0 && !selectedCowId) {
          setSelectedCowId(res.data[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to fetch cows', e);
    }
  }, [selectedCowId]);

  const fetchWeighings = useCallback(async () => {
    try {
      const res = await getWeighingHistory();
      if (res.success && res.data) {
        // Map data API ke format UI tabel
        const mappedLogs = res.data.map((log) => ({
          id: `scale-${log.id}`,
          rfid: log.cow_code,
          jenisSapi: log.cow_name,
          tanggalTimbang: new Date(log.measurement_date).toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
          }) + ' WIB',
          beratSebelumnya: log.weight - (log.adg || 0), // Aproksimasi berat sebelumnya
          beratSekarang: log.weight,
          selisih: log.adg || 0,
          petugas: 'IoT ESP32 - Auto Node'
        }));
        setScaleLogs(mappedLogs);
      }
    } catch (e) {
      console.error('Failed to fetch weighings', e);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchDashboardData(), fetchCows(), fetchWeighings(), fetchGrowthData()]);
    setIsLoading(false);
  }, [fetchDashboardData, fetchCows, fetchWeighings, fetchGrowthData]);

  // Real-Time WebSocket Connection & Event Stream
  const [wsConnected, setWsConnected] = useState(false);
  const [liveWeight, setLiveWeight] = useState(null);
  const [syncNotif, setSyncNotif] = useState(null);

  useEffect(() => {
    refreshAllData();

    // Heartbeat checker: Tandai ESP32 OFFLINE jika tidak ada telemetri baru > 7 detik
    const heartbeatInterval = setInterval(() => {
      setLiveWeight((prev) => {
        if (!prev) return null;
        const timeDiff = Date.now() - (prev.timestamp || 0);
        if (timeDiff > 7000 && prev.isHardwareOnline !== false) {
          return {
            ...prev,
            isHardwareOnline: false,
            a12e_status: 'OFFLINE',
            voltageStatus: 'OFFLINE ❌',
            vccVoltage: 0.0,
          };
        }
        return prev;
      });
    }, 3000);

    // Inisialisasi WebSocket ke Server Backend dengan Auto-Reconnect
    const wsUrl = 'ws://localhost:5000/ws';
    let socket = null;
    let reconnectTimer = null;
    let isUnmounted = false;

    const connectWebSocket = () => {
      if (isUnmounted) return;

      try {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('[WS Client] ✅ Terhubung ke Server Backend WebSocket');
          setWsConnected(true);
        };

        socket.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);

            // Handle LIVE WEIGHT stream
            if (payload.type === 'LIVE_WEIGHT' || payload.event === 'LIVE_WEIGHT') {
              setLiveWeight({
                isHardwareOnline: true,
                weight: payload.weight ?? payload.data?.weight ?? 0.0,
                cowCode: (payload.cow_code ?? payload.data?.cow_code) || '',
                cowName: (payload.cow_name ?? payload.data?.cow_name) || '',
                isLocked: payload.is_locked ?? payload.data?.is_locked ?? false,
                deviceCode: payload.device_code || 'SCALE-ESP32-01',
                vccVoltage: payload.vcc_voltage ?? 3.31,
                voltageStatus: payload.voltage_status || 'NORMAL ✓',
                a12e_status: payload.a12e_status || payload.hx711_status || 'CONNECTED',
                rawAdc: payload.raw_adc ?? 0,
                wifiRssi: payload.wifi_rssi ?? -60,
                freeHeap: payload.free_heap ?? 220000,
                cpuTemp: payload.cpu_temp ?? 42.5,
                uptimeSec: payload.uptime_sec ?? 0,
                timestamp: Date.now()
              });
            }

            // Handle SYNC NOTIF stream (batch upload dari ESP32)
            if (payload.type === 'SYNC_NOTIF' || payload.event === 'SYNC_NOTIF') {
              setSyncNotif({
                message: payload.message || 'Sync otomatis ESP32 selesai',
                count: payload.success_count || payload.records_saved || 0,
                timestamp: Date.now()
              });
              refreshAllData();
            }

            // Handle NEW WEIGHING record push
            if ((payload.type === 'NEW_WEIGHT_RECORD' || payload.event === 'NEW_WEIGHING') && payload.data) {
              console.log('[WS Event] Instant Push Payload:', payload.data);
              const log = payload.data;
              const newLogItem = {
                id: `scale-${log.id}`,
                rfid: log.cow_code || 'SCALE-ESP32',
                jenisSapi: log.cow_name || 'Sapi Penimbangan',
                tanggalTimbang: new Date(log.measurement_date || Date.now()).toLocaleString('id-ID', {
                  timeZone: 'Asia/Jakarta',
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                }) + ' WIB',
                beratSebelumnya: log.weight - (log.adg || 0),
                beratSekarang: log.weight,
                selisih: log.adg || 0,
                petugas: `IoT ESP32 (${log.device_id || 'SCALE-ESP32-01'})`
              };

              setScaleLogs((prev) => [newLogItem, ...prev.filter(item => item.id !== newLogItem.id)]);
              fetchDashboardData();
            }
          } catch (err) {
            console.error('[WS Error] Failed to parse event:', err);
          }
        };

        socket.onerror = (err) => {
          console.warn('[WS Warning] WebSocket error, akan reconnect...');
          setWsConnected(false);
        };

        socket.onclose = () => {
          console.log('[WS Client] WebSocket terputus, mencoba koneksi ulang dalam 2.5s...');
          setWsConnected(false);
          if (!isUnmounted) {
            reconnectTimer = setTimeout(connectWebSocket, 2500);
          }
        };
      } catch (err) {
        console.error('[WS Error] Connection failed:', err);
        setWsConnected(false);
        if (!isUnmounted) {
          reconnectTimer = setTimeout(connectWebSocket, 3000);
        }
      }
    };

    connectWebSocket();

    // Fallback auto-polling 5s jika WebSocket offline
    const interval = setInterval(() => {
      fetchWeighings();
      fetchDashboardData();
      fetchGrowthData();
    }, 5000);

    return () => {
      isUnmounted = true;
      clearInterval(heartbeatInterval);
      clearInterval(interval);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (socket) socket.close();
    };

  }, [refreshAllData, fetchWeighings, fetchDashboardData, fetchGrowthData]);

  // Dynamic KPI calculations dari Dashboard Summary API
  const calculatedKPIs = useMemo(() => {
    if (dashboardSummary) {
      return {
        totalPopulasi: dashboardSummary.total_cows_active || cows.length,
        totalPenimbangan: dashboardSummary.total_weighings || scaleLogs.length,
        rataRataBerat: dashboardSummary.average_weight || 0,
        bestCow: dashboardSummary.best_growth ? {
          name: dashboardSummary.best_growth.cow_name,
          last_adg: dashboardSummary.best_growth.adg
        } : null
      };
    }

    // Fallback jika API belum memuat
    const totalPopulasi = cows.length;
    const totalPenimbangan = scaleLogs.length;

    const sumWeight = cows.reduce((sum, c) => sum + (c.last_weight || 0), 0);
    const avgWeight = totalPopulasi > 0 ? sumWeight / totalPopulasi : 0;

    let bestCow = null;
    let maxAdg = -Infinity;
    cows.forEach(c => {
      if ((c.last_adg || 0) > maxAdg) {
        maxAdg = c.last_adg || 0;
        bestCow = c;
      }
    });

    return {
      totalPopulasi,
      totalPenimbangan,
      rataRataBerat: avgWeight,
      bestCow
    };
  }, [cows, scaleLogs, dashboardSummary]);

  // Handler: Add New Cow
  const handleAddNewCow = async (newCow) => {
    try {
      const payload = {
        cow_code: newCow.cow_code,
        name: newCow.name,
        breed: newCow.breed,
        gender: newCow.gender,
        birth_date: newCow.birth_date,
        owner: newCow.owner || 'Peternakan',
        status: newCow.status || 'active'
      };
      
      const res = await createCow(payload);
      if (res.success) {
        await fetchCows(); // Refresh tabel sapi
        await fetchDashboardData(); // Refresh summary
        return { success: true };
      }
      return { success: false, error: 'Gagal dari server.' };
    } catch (e) {
      console.error('Failed to add cow:', e);
      return { success: false, error: e.response?.data?.error || e.message || 'Terjadi kesalahan sistem' };
    }
  };

  // Handler: Simulate IoT RFID weighing
  const runIotSimulation = async () => {
    if (isSimulating) return;
    const cowToWeigh = cows.find(c => c.id === selectedCowId);
    if (!cowToWeigh) return;

    setIsSimulating(true);
    setIotStatus('transmitting');

    try {
      // Tunggu delay buatan supaya efek UI IoT terasa
      await new Promise(resolve => setTimeout(resolve, 1500));

      const prevWeight = cowToWeigh.last_weight || 0;
      const addedWeight = simulatedWeightChange;
      const newWeight = prevWeight + addedWeight;

      const payload = {
        cow_id: cowToWeigh.id,
        weight: newWeight,
        device_id: 'SIMULATOR-01'
      };

      const res = await addWeighing(payload);
      
      if (res.success) {
        // Berhasil simpan ke backend
        await refreshAllData(); // Refresh semua (cow, summary, weighing)
        setLastScannedRfid(cowToWeigh.cow_code); // Tampilkan info ke UI
      }
    } catch (e) {
      console.error('Failed IoT simulation:', e);
      alert('Gagal mensimulasikan IoT: ' + e.message);
    } finally {
      setIsSimulating(false);
      setIotStatus('connected');

      setTimeout(() => {
        setLastScannedRfid(null);
      }, 5000);
    }
  };

  return {
    cows,
    setCows,
    growthData,
    setGrowthData,
    scaleLogs,
    setScaleLogs,
    selectedCowId,
    setSelectedCowId,
    simulatedWeightChange,
    setSimulatedWeightChange,
    isSimulating,
    iotStatus,
    lastScannedRfid,
    setLastScannedRfid,
    calculatedKPIs,
    handleAddNewCow,
    runIotSimulation,
    isLoading,
    refreshAllData,
    wsConnected,
    liveWeight,
    syncNotif
  };
}
