import { ShieldAlert, AlertTriangle } from 'lucide-react';

// MOCK DATA — swap this later for real assets filtered to WARNING/CRITICAL
// status, e.g.: assets.filter(a => a.status !== 'HEALTHY').map(a => ({
//   asset: a.name, metric: 'CPU', value: a.cpuUsage, severity: a.status
// }))
// There's no separate "Alert" entity on the backend — this view is meant to
// be an honest read of asset status, not a fabricated alerting system.
const MOCK_ALERTS = [
  { asset: 'DB-CLUSTER-02', metric: 'CPU', value: 91, severity: 'CRITICAL' },
  { asset: 'WEB-NODE-05', metric: 'Disk', value: 88, severity: 'WARNING' },
  { asset: 'CACHE-NODE-01', metric: 'Memory', value: 84, severity: 'WARNING' },
];

const severityStyle = {
  CRITICAL: { color: '#F87E92', bg: 'rgba(240,69,93,0.1)', icon: ShieldAlert },
  WARNING: { color: '#FBC96D', bg: 'rgba(245,166,35,0.1)', icon: AlertTriangle },
};

export default function AlertsPanel() {
  return (
    <div style={{ background: '#0F1830', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#8B98B0' }}>Assets needing attention</span>
        <span style={{ fontSize: 10, color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)', background: 'rgba(245,166,35,0.1)', borderRadius: 99, padding: '2px 8px' }}>
          Mock data
        </span>
      </div>

      {MOCK_ALERTS.length === 0 ? (
        <p style={{ fontSize: 12.5, color: '#5B6684', margin: 0 }}>Nothing needs attention right now.</p>
      ) : (
        MOCK_ALERTS.map((a, i) => {
          const s = severityStyle[a.severity] || severityStyle.WARNING;
          const Icon = s.icon;
          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                borderRadius: 8, background: s.bg, marginBottom: i < MOCK_ALERTS.length - 1 ? 6 : 0,
              }}
            >
              <Icon size={14} color={s.color} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mono" style={{ fontSize: 12.5, color: '#E2E8F0' }}>{a.asset}</div>
                <div style={{ fontSize: 11, color: '#8B98B0' }}>{a.metric} at {a.value}%</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: s.color, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                {a.severity}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}