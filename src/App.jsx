import React, { useState, useEffect } from 'react';
import { useLivestockData } from './hooks/useLivestockData';
import { MainLayout } from './layouts/MainLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';

// Import Pages
import { DashboardPage } from './pages/DashboardPage';
import { ControlPage } from './pages/ControlPage';
import { DssPage } from './pages/DssPage';
import { GrowthPage } from './pages/GrowthPage';
import { HistoryPage } from './pages/HistoryPage';
import { ExportPage } from './pages/ExportPage';
import { CowDetailPage } from './pages/CowDetailPage';
import { DevicesPage } from './pages/DevicesPage';
import LandingPage from './pages/LandingPage';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  // Simpan & restore activeTab dari sessionStorage agar tidak reset saat reload
  const [activeTab, setActiveTabState] = useState(() => {
    return sessionStorage.getItem('activeTab') || 'dashboard';
  });
  const [selectedCowDetail, setSelectedCowDetail] = useState(null);

  // Wrapper setActiveTab: update state + simpan ke sessionStorage
  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    sessionStorage.setItem('activeTab', tab);
  };
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
            onBack={() => setActiveTab('dss')}
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
