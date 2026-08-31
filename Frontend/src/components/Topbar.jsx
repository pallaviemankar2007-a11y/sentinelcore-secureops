import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function Topbar({ title, subtitle, backendUp, lastSync, user }) {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(108,140,255,0.15)', border: '1px solid rgba(108,140,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 700, color: '#A3B4FF', flexShrink: 0 }}>
              {user.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0', lineHeight: 1.2 }}>{user.username}</div>
              <div style={{ fontSize: 11, color: '#5B6684', lineHeight: 1.2 }}>{user.role}</div>
            </div>
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