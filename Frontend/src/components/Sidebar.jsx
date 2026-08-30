import { LayoutDashboard, Server, ShieldAlert, Bug, ScrollText, ShieldCheck, Users, BarChart3, Lock } from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
      { key: 'assets', label: 'Assets', icon: Server, enabled: true },
    ],
  },
  {
    label: 'Coming up',
    items: [
      { key: 'incidents', label: 'Incidents', icon: ShieldAlert, enabled: false, note: 'Milestone 2' },
      { key: 'vulnerabilities', label: 'Vulnerabilities', icon: Bug, enabled: false, note: 'Milestone 3' },
      { key: 'audit', label: 'Audit logs', icon: ScrollText, enabled: false, note: 'Milestone 4' },
      { key: 'compliance', label: 'Compliance', icon: ShieldCheck, enabled: false, note: 'Milestone 4' },
      { key: 'users', label: 'Users', icon: Users, enabled: false, note: 'Planned' },
      { key: 'reports', label: 'Reports', icon: BarChart3, enabled: false, note: 'Planned' },
    ],
  },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <div style={wrapStyle}>
      <div style={{ padding: '20px 18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(108,140,255,0.15)', border: '1px solid rgba(108,140,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={15} color="#A3B4FF" />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#E2E8F0', lineHeight: 1.2 }}>SentinelCore</div>
            <div style={{ fontSize: 10.5, color: '#5B6684', lineHeight: 1.2 }}>SecureOps</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} style={{ marginBottom: 20 }}>
            <div style={{ padding: '0 8px 6px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#3E4867' }}>
              {section.label}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => item.enabled && onNavigate(item.key)}
                  disabled={!item.enabled}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', marginBottom: 2, borderRadius: 7, border: 'none',
                    background: isActive ? 'rgba(108,140,255,0.14)' : 'transparent',
                    color: isActive ? '#A3B4FF' : item.enabled ? '#8B98B0' : '#3E4867',
                    cursor: item.enabled ? 'pointer' : 'default',
                    fontSize: 12.5, fontWeight: isActive ? 600 : 500, textAlign: 'left',
                  }}
                >
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {!item.enabled && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9.5, color: '#3E4867' }}>
                      <Lock size={9} /> {item.note}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 10.5, color: '#3E4867' }}>
        Infosys Springboard 7.0
      </div>
    </div>
  );
}

const wrapStyle = {
  width: 208, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
  display: 'flex', flexDirection: 'column',
  background: '#0B1220', borderRight: '1px solid rgba(255,255,255,0.06)',
};
