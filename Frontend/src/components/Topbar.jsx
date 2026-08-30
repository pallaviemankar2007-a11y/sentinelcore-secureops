import { useState, useEffect } from 'react';
import { WifiOff, LogOut } from 'lucide-react';

export default function Topbar({ title, subtitle, backendUp, lastSync, user, onLogout }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 19, fontWeight: 600, color: '#E2E8F0', letterSpacing: '-0.01em' }}>{title}</h1>
        {subtitle && <p style={{ margin: '2px 0 0', fontSize: 12.5, color: '#5B6684' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <BackendStatus up={backendUp} lastSync={lastSync} />
        <div className="mono" style={{ fontSize: 12, color: '#5B6684' }}>
          {now.toLocaleTimeString()}
        </div>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div title={user.role} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(108,140,255,0.15)', border: '1px solid rgba(108,140,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#A3B4FF' }}>
              {user.username?.[0]?.toUpperCase() || '?'}
            </div>
            <button onClick={onLogout} title="Log out" style={{ background: 'none', border: 'none', color: '#5B6684', display: 'flex', padding: 4 }}>
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BackendStatus({ up, lastSync }) {
  if (up === null) return <span style={{ fontSize: 11, color: '#5B6684' }}>connecting…</span>;
  return (
    <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: up ? '#5B6684' : '#F87E92' }}>
      {up ? (
        <>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2DD4BF' }} />
          live · synced {lastSync ? lastSync.toLocaleTimeString() : ''}
        </>
      ) : (
        <>
          <WifiOff size={12} /> backend unreachable
        </>
      )}
    </div>
  );
}