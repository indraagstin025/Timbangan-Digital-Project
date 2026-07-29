import React, { useState, useEffect } from 'react';
import { useLivestockData } from './hooks/useLivestockData';
import { MainLayout } from './layouts/MainLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import { getCowById } from './api/cowApi';

// Import Pages
import { DashboardPage } from './pages/DashboardPage';
import { ControlPage } from './pages/ControlPage';
import { DssPage } from './pages/DssPage';
import { GrowthPage } from './pages/GrowthPage';
import { HistoryPage } from './pages/HistoryPage';
import { ExportPage } from './pages/ExportPage';
import { CowDetailPage } from './pages/CowDetailPage';
import { DevicesPage } from './pages/DevicesPage';
import { ProfilePage } from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  // Simpan & restore activeTab dari sessionStorage agar tidak reset saat reload
  const [activeTab, setActiveTabState] = useState(() => {
    return sessionStorage.getItem('activeTab') || 'dashboard';
  });

  // Restore selectedCowDetail dari sessionStorage saat refresh
  const [selectedCowDetail, setSelectedCowDetailState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('selectedCowDetail');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Wrapper setActiveTab: update state + simpan ke sessionStorage
  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    sessionStorage.setItem('activeTab', tab);
    // Jika pindah dari cow-detail, bersihkan data sapi tersimpan
    if (tab !== 'cow-detail') {
      sessionStorage.removeItem('selectedCowDetail');
    }
  };

  // Wrapper setSelectedCowDetail: update state + simpan ke sessionStorage
  const setSelectedCowDetail = (cow) => {
    setSelectedCowDetailState(cow);
    if (cow) {
      sessionStorage.setItem('selectedCowDetail', JSON.stringify(cow));
    } else {
      sessionStorage.removeItem('selectedCowDetail');
    }
  };

  // Saat refresh di cow-detail tapi data sapi tidak ada → fetch ulang dari API
  useEffect(() => {
    if (activeTab === 'cow-detail' && !selectedCowDetail) {
      const savedCow = sessionStorage.getItem('selectedCowDetail');
      if (savedCow) {
        try {
          const parsed = JSON.parse(savedCow);
          setSelectedCowDetailState(parsed);
        } catch {
          setActiveTabState('dss');
          sessionStorage.setItem('activeTab', 'dss');
        }
      } else {
        // Tidak ada data tersimpan → fallback ke DSSPage
        setActiveTabState('dss');
        sessionStorage.setItem('activeTab', 'dss');
      }
    }
  }, [activeTab, selectedCowDetail]);

  // Custom hook to manage all global states and handlers
  const livestockData = useLivestockData();

  if (!isAuthenticated) {
    if (showLogin) {
      return <LoginPage onBack={() => setShowLogin(false)} />;
    }
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }

  return (
      <MainLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lastScannedRfid={livestockData.lastScannedRfid}
        setLastScannedRfid={livestockData.setLastScannedRfid}
        wsConnected={livestockData.wsConnected}
      >
        {/* Route matching for tabs */}
        {activeTab === 'dashboard' && (
          <DashboardPage 
            calculatedKPIs={livestockData.calculatedKPIs} 
            growthData={livestockData.growthData} 
            cows={livestockData.cows} 
            handleAddNewCow={livestockData.handleAddNewCow} 
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'control' && (
          <ControlPage
            wsConnected={livestockData.wsConnected}
            liveWeight={livestockData.liveWeight}
            cows={livestockData.cows}
            refreshAllData={livestockData.refreshAllData}
          />
        )}

        {activeTab === 'dss' && (
          <DssPage 
            cows={livestockData.cows}
            handleAddNewCow={livestockData.handleAddNewCow}
            onViewDetail={(cow) => {
              setSelectedCowDetail(cow);
              setActiveTab('cow-detail');
            }}
          />
        )}

        {activeTab === 'cow-detail' && selectedCowDetail && (
          <CowDetailPage 
            cow={selectedCowDetail}
            onBack={() => {
              setSelectedCowDetail(null);
              setActiveTab('dss');
            }}
          />
        )}


        {activeTab === 'growth' && (
          <GrowthPage 
            growthData={livestockData.growthData}
            cows={livestockData.cows}
            refreshAllData={livestockData.refreshAllData}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage 
            scaleLogs={livestockData.scaleLogs}
            cows={livestockData.cows}
            refreshAllData={livestockData.refreshAllData}
          />
        )}

        {activeTab === 'export' && (
          <ExportPage cows={livestockData.cows} />
        )}

        {activeTab === 'devices' && (
          <DevicesPage />
        )}

        {activeTab === 'profile' && (
          <ProfilePage />
        )}
      </MainLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
