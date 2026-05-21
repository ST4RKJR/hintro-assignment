import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { FeedbackWizard } from './components/FeedbackWizard';
import { LogoutModal } from './components/LogoutModal';
import { LoginView } from './components/LoginView';
import type { UserProfile, DashboardData, CallStats, CallHistoryResponse } from './types';
import './App.css';

function App() {
  const [userId, setUserId] = useState<string>(() => {
    return localStorage.getItem('hintro_userId') || 'u2';
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('hintro_isLoggedIn') === 'true';
  });

  const handleSetUserId = (id: string) => {
    setUserId(id);
    localStorage.setItem('hintro_userId', id);
  };

  // Modal states
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isFeedbackHistoryOpen, setIsFeedbackHistoryOpen] = useState<boolean>(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Pagination & limit
  const [limit] = useState<number>(10);
  const [page] = useState<number>(1);

  // API States
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [statsData, setStatsData] = useState<CallStats | null>(null);
  const [historyData, setHistoryData] = useState<CallHistoryResponse | null>(null);

  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    // Defer the loading state setter to a microtask to avoid synchronous setState inside useEffect
    await Promise.resolve();
    setIsLoading(true);
    const BASE_URL = 'https://mock-backend-hintro.vercel.app';
    const headers = { 'x-user-id': userId };

    try {
      const [profileRes, dashboardRes, statsRes, historyRes] = await Promise.all([
        fetch(`${BASE_URL}/api/auth/profile`, { headers }),
        fetch(`${BASE_URL}/api/auth/dashboard`, { headers }),
        fetch(`${BASE_URL}/api/call-sessions/stats`, { headers }),
        fetch(`${BASE_URL}/api/call-sessions?limit=${limit}&page=${page}`, { headers }),
      ]);

      if (!profileRes.ok || !dashboardRes.ok || !statsRes.ok || !historyRes.ok) {
        throw new Error('API fetch error.');
      }

      const profileJson = await profileRes.json();
      const dashboardJson = await dashboardRes.json();
      const statsJson = await statsRes.json();
      const historyJson = await historyRes.json();

      setProfileData(profileJson);
      setDashboardData(dashboardJson);
      setStatsData(statsJson);
      setHistoryData(historyJson);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, limit, page]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        fetchData();
      }
    });
    return () => {
      active = false;
    };
  }, [fetchData]);

  const handleLogin = (email: string) => {
    // Demo logic: if email contains "jane", log in as User 2 (Data), else User 1 (Empty)
    const selectedUserId = email.toLowerCase().includes('jane') ? 'u2' : 'u1';
    handleSetUserId(selectedUserId);
    setIsLoggedIn(true);
    localStorage.setItem('hintro_isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLogoutOpen(false);
    setIsLoggedIn(false);
    handleSetUserId('u1');
    localStorage.setItem('hintro_isLoggedIn', 'false');
  };

  const userName = profileData ? `${profileData.firstName} ${profileData.lastName}` : '';
  const userEmail = profileData?.email || '';

  const usageUsed = dashboardData?.usage?.kb_files?.used ?? 0;
  const usageLimit = dashboardData?.usage?.kb_files?.limit ?? 1000;

  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {isMobileMenuOpen && (
        <div className="mobile-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openFeedback={() => setIsFeedbackOpen(true)}
        openFeedbackHistory={() => setIsFeedbackHistoryOpen(true)}
        used={usageUsed}
        limit={usageLimit}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="main-content">
        <Header
          userId={userId}
          setUserId={handleSetUserId}
          userName={userName}
          userEmail={userEmail}
          isLoading={isLoading}
          onLogout={() => setIsLogoutOpen(true)}
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {activeTab === 'dashboard' ? (
          <DashboardView
            userId={userId}
            dashboardData={dashboardData}
            statsData={statsData}
            sessions={historyData?.callSessions || []}
            isLoading={isLoading}
          />
        ) : (
          /* Placeholder for other tabs since Figma only shows Dashboard */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: '64px 32px',
            color: 'var(--text-tertiary)',
            textAlign: 'center',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              {activeTab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </h3>
            <p style={{ fontSize: '14px', maxWidth: '360px' }}>
              This section is coming soon. Use the Dashboard to view your call sessions and analytics.
            </p>
          </div>
        )}
      </main>

      {/* Modals */}
      {isFeedbackOpen && (
        <FeedbackWizard
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />
      )}

      {isFeedbackHistoryOpen && (
        <FeedbackWizard
          isOpen={isFeedbackHistoryOpen}
          onClose={() => setIsFeedbackHistoryOpen(false)}
          showHistoryOnly
        />
      )}

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default App;
