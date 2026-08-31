import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getAtRiskAssets } from '../utils/assetHelpers';

const severityStyle = {
  CRITICAL: { color: '#F87E92', bg: 'rgba(240,69,93,0.1)', icon: ShieldAlert },
  WARNING: { color: '#FBC96D', bg: 'rgba(245,166,35,0.1)', icon: AlertTriangle },
};

export default function AlertsPanel({ assets, limit = 4 }) {
  const atRisk = getAtRiskAssets(assets).slice(0, limit);

  return (
    <div style={{ background: '#0F1830', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#8B98B0', marginBottom: 12 }}>
        Assets needing attention
      </div>

      {atRisk.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', fontSize: 12.5, color: '#5B6684' }}>
          <ShieldCheck size={14} color="#5EEAD4" /> Everything's healthy right now.
        </div>
      ) : (
        atRisk.map((a, i) => {
          const s = severityStyle[a.status] || severityStyle.WARNING;
          const Icon = s.icon;
          return (
            <div
              key={a.assetId}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                borderRadius: 8, background: s.bg, marginBottom: i < atRisk.length - 1 ? 6 : 0,
              }}
            >
              <Icon size={14} color={s.color} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mono" style={{ fontSize: 12.5, color: '#E2E8F0' }}>{a.name}</div>
                <div style={{ fontSize: 11, color: '#8B98B0' }}>{a.trigger.metric} at {a.trigger.value}%</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: s.color, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                {a.status}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}