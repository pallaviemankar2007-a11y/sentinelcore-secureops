import { Server, Cloud, Network, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import StatCard from './StatCard';
import { countByStatus } from '../utils/assetHelpers';

const typeIcon = { SERVER: Server, CLOUD: Cloud, NETWORK: Network };
const statusColor = {
  HEALTHY: { dot: '#2DD4BF', text: '#5EEAD4', bg: 'rgba(45,212,191,0.1)' },
  WARNING: { dot: '#F5A623', text: '#FBC96D', bg: 'rgba(245,166,35,0.1)' },
  CRITICAL: { dot: '#F0455D', text: '#F87E92', bg: 'rgba(240,69,93,0.1)' },
};

export default function AssetListView({ assets, emptyLabel, showTrigger, onGoToAssets }) {
  const counts = countByStatus(assets);

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <StatCard label="Total" value={assets.length} icon={Server} accent="#6C8CFF" />
        <StatCard label="Healthy" value={counts.HEALTHY} icon={ShieldCheck} accent="#2DD4BF" />
        <StatCard label="Warning" value={counts.WARNING} icon={AlertTriangle} accent="#F5A623" />
        <StatCard label="Critical" value={counts.CRITICAL} icon={ShieldAlert} accent="#F0455D" />
      </div>

      {assets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', borderRadius: 12, border: '1px dashed rgba(255,255,255,0.1)' }}>
          <p style={{ margin: '0 0 4px', fontSize: 14, color: '#E2E8F0' }}>{emptyLabel}</p>
          <button onClick={onGoToAssets} style={{ marginTop: 8, background: 'none', border: 'none', color: '#6C8CFF', fontSize: 12.5, cursor: 'pointer' }}>
            Go to Assets to add one →
          </button>
        </div>
      ) : (
        <div style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#0F1830', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Asset', 'Type', 'Status', showTrigger ? 'Triggered by' : 'CPU', 'Last checked'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5B6684', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => {
                const Icon = typeIcon[a.type] || Server;
                const c = statusColor[a.status] || statusColor.HEALTHY;
                return (
                  <tr key={a.assetId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '11px 14px' }}>
                      <div className="mono" style={{ color: '#E2E8F0' }}>{a.name}</div>
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8B98B0' }}><Icon size={13} /> {a.type}</div>
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 500, color: c.text, background: c.bg }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }} /> {a.status}
                      </span>
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      {showTrigger ? (
                        a.trigger ? (
                          <span className="mono" style={{ fontSize: 12, color: '#8B98B0' }}>{a.trigger.metric} · {a.trigger.value}%</span>
                        ) : <span style={{ fontSize: 12, color: '#3E4867' }}>—</span>
                      ) : (
                        <span className="mono" style={{ fontSize: 12, color: '#8B98B0' }}>{a.cpuUsage ?? 0}%</span>
                      )}
                    </td>
                    <td className="mono" style={{ padding: '11px 14px', fontSize: 11, color: '#5B6684' }}>
                      {a.lastCheckedAt ? new Date(a.lastCheckedAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}