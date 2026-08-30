import { Server, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import StatCard from './StatCard';
import { StatusPieChart, TypeBarChart } from './AssetCharts';


export default function Dashboard({ assets, counts, uptimePct, onGoToAssets }) {
  const recent = [...assets]
    .sort((a, b) => new Date(b.lastCheckedAt || 0) - new Date(a.lastCheckedAt || 0))
    .slice(0, 5);

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <StatCard label="Total assets" value={assets.length} sub="Devices registered" icon={Server} accent="#6C8CFF" />
        <StatCard label="Healthy" value={counts.HEALTHY} sub="No action needed" icon={ShieldCheck} accent="#2DD4BF" />
        <StatCard label="Warning" value={counts.WARNING} sub="Worth a look" icon={AlertTriangle} accent="#F5A623" />
        <StatCard label="Critical" value={counts.CRITICAL} sub="Needs attention" icon={ShieldAlert} accent="#F0455D" />
      </div>
<div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
  <ChartCard title="Status distribution">
    <StatusPieChart counts={counts} />
  </ChartCard>
  <ChartCard title="Assets by type">
    <TypeBarChart assets={assets} />
  </ChartCard>
        
</div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 260px', background: '#0F1830', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#8B98B0', marginBottom: 4 }}>Estimated uptime</div>
          <div className="mono" style={{ fontSize: 34, fontWeight: 600, color: '#E2E8F0' }}>
            {assets.length ? `${uptimePct}%` : '—'}
          </div>
          <div style={{ fontSize: 11.5, color: '#5B6684', marginTop: 6 }}>
            Calculated from live asset status — not a fixed target.
          </div>
        </div>

        <div style={{ flex: '2 1 380px', background: '#0F1830', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#8B98B0' }}>Recently checked</span>
            <button onClick={onGoToAssets} style={{ background: 'none', border: 'none', color: '#6C8CFF', fontSize: 11.5, cursor: 'pointer' }}>
              View all assets →
            </button>
          </div>
          {recent.length === 0 ? (
            <p style={{ fontSize: 12.5, color: '#5B6684', margin: 0 }}>No assets yet — add one from the Assets page.</p>
          ) : (
            recent.map((a) => (
              <div key={a.assetId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="mono" style={{ fontSize: 12.5, color: '#E2E8F0' }}>{a.name}</div>
                <div style={{ fontSize: 11, color: statusText(a.status) }}>{a.status}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function statusText(status) {
  if (status === 'HEALTHY') return '#5EEAD4';
  if (status === 'WARNING') return '#FBC96D';
  return '#F87E92';
}
function ChartCard({ title, children }) {
  return (
    <div style={{ flex: '1 1 320px', background: '#0F1830', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#8B98B0', marginBottom: 4 }}>{title}</div>
      {children}
    </div>
  );
}
