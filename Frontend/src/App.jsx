import { useState, useEffect, useMemo, useCallback } from 'react';
import * as api from './api/assets';
import * as auth from './api/auth';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import AssetsPage from './components/AssetsPage';
import CloudMonitoringPage from './components/CloudMonitoringPage';
import NetworkMonitoringPage from './components/NetworkMonitoringPage';
import AlertsPage from './components/AlertsPage';
import AuthPage from './pages/AuthPage';

const PAGE_META = {
  dashboard: { title: 'Dashboard', subtitle: "Here's the current state of your infrastructure." },
  assets: { title: 'Assets', subtitle: 'Servers, cloud resources, and network devices under watch.' },
  cloud: { title: 'Cloud Monitoring', subtitle: 'Health of your cloud-type assets.' },
  network: { title: 'Network Monitoring', subtitle: 'Health of your network-type assets.' },
  alerts: { title: 'Alerts', subtitle: 'Assets currently in warning or critical status.' },
};

export default function App() {
  const [user, setUser] = useState(() => auth.getUser());
  const [view, setView] = useState('dashboard');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [backendUp, setBackendUp] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadAssets = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await api.getAssets();
      setAssets(data);
      setLoadError('');
      setBackendUp(true);
      setLastSync(new Date());
    } catch (err) {
      setLoadError(err.message || 'Could not reach the backend.');
      setBackendUp(false);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return; // don't hit the API until logged in
    loadAssets();
    const interval = setInterval(() => loadAssets(true), 15000);
    return () => clearInterval(interval);
  }, [loadAssets, user]);

  const counts = useMemo(() => (
    assets.reduce((acc, a) => ({ ...acc, [a.status]: (acc[a.status] || 0) + 1 }), { HEALTHY: 0, WARNING: 0, CRITICAL: 0 })
  ), [assets]);

  const uptimePct = assets.length ? (100 - counts.CRITICAL * 1.4 - counts.WARNING * 0.3).toFixed(2) : '—';

  if (!user) {
    return <AuthPage onAuthSuccess={setUser} />;
  }

  const meta = PAGE_META[view];

  function handleLogout() {
    auth.logout();
    setUser(null);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0B1220' }}>
      <Sidebar active={view} onNavigate={setView} onLogout={handleLogout} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <Topbar title={meta.title} subtitle={meta.subtitle} backendUp={backendUp} lastSync={lastSync} user={user} />

        <div style={{ maxWidth: 1080, padding: '24px 28px 60px' }}>
          {view === 'dashboard' && (
            <Dashboard assets={assets} counts={counts} uptimePct={uptimePct} onGoToAssets={() => setView('assets')} />
          )}
          {view === 'assets' && (
            <AssetsPage
              assets={assets}
              counts={counts}
              loading={loading}
              loadError={loadError}
              onReload={() => loadAssets(true)}
              showToast={showToast}
            />
          )}
          {view === 'cloud' && (
            <CloudMonitoringPage assets={assets} onGoToAssets={() => setView('assets')} />
          )}
          {view === 'network' && (
            <NetworkMonitoringPage assets={assets} onGoToAssets={() => setView('assets')} />
          )}
          {view === 'alerts' && (
            <AlertsPage assets={assets} onGoToAssets={() => setView('assets')} />
          )}
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: toast.type === 'error' ? '#F0455D' : '#141F3D',
          border: toast.type === 'error' ? 'none' : '1px solid rgba(255,255,255,0.1)',
          color: toast.type === 'error' ? '#fff' : '#E2E8F0',
          padding: '10px 18px', borderRadius: 8, fontSize: 13, zIndex: 60,
        }}>
          {toast.message}
        </div>
      )}
    </div>
  );
}