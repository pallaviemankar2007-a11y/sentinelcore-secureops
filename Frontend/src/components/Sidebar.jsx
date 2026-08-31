import { LayoutDashboard, Server, Cloud, Network, ShieldAlert, Bug, ScrollText, ShieldCheck, Users, BarChart3, Lock, LogOut } from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
      { key: 'assets', label: 'Assets', icon: Server, enabled: true },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { key: 'cloud', label: 'Cloud Monitoring', icon: Cloud, enabled: true },
      { key: 'network', label: 'Network Monitoring', icon: Network, enabled: true },
      { key: 'alerts', label: 'Alerts', icon: ShieldAlert, enabled: true },
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

export default function Sidebar({ active, onNavigate, onLogout }) {
  return (
    <div style={wrapStyle}>
      <div style={{ padding: '26px 22px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(108,140,255,0.15)', border: '1px solid rgba(108,140,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={20} color="#A3B4FF" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9', lineHeight: 1.2 }}>SentinelCore</div>
            <div style={{ fontSize: 12, color: '#5B6684', lineHeight: 1.2, marginTop: 1 }}>SecureOps</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 14px' }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} style={{ marginBottom: 26 }}>
            <div style={{ padding: '0 10px 10px', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#3E4867' }}>
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
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 12px', marginBottom: 4, borderRadius: 9,
                    border: 'none', borderLeft: isActive ? '3px solid #6C8CFF' : '3px solid transparent',
                    background: isActive ? 'rgba(108,140,255,0.14)' : 'transparent',
                    color: isActive ? '#C3D0FF' : item.enabled ? '#9AA6C0' : '#3E4867',
                    cursor: item.enabled ? 'pointer' : 'default',
                    fontSize: 14.5, fontWeight: isActive ? 700 : 500, textAlign: 'left',
                  }}
                >
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {!item.enabled && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10.5, color: '#3E4867' }}>
                      <Lock size={10} /> {item.note}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 12px', borderRadius: 9, border: 'none', background: 'transparent',
            color: '#9AA6C0', fontSize: 14.5, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

const wrapStyle = {
  width: 250, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
  display: 'flex', flexDirection: 'column',
  background: '#0B1220', borderRight: '1px solid rgba(255,255,255,0.06)',
};