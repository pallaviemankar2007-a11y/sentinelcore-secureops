export default function StatCard({ label, value, sub, icon: Icon, accent = '#6C8CFF' }) {
  return (
    <div style={{
      position: 'relative', flex: 1, minWidth: 140, background: '#0F1830',
      border: '1px solid rgba(255,255,255,0.06)', borderLeft: `2px solid ${accent}`,
      borderRadius: 10, padding: '16px 18px', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5B6684' }}>
          {label}
        </span>
        {Icon && (
          <div style={{ width: 24, height: 24, borderRadius: 6, background: `${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={13} color={accent} />
          </div>
        )}
      </div>
      <div className="mono" style={{ fontSize: 26, fontWeight: 600, color: '#E2E8F0', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#5B6684', marginTop: 5 }}>{sub}</div>}
    </div>
  );
}
