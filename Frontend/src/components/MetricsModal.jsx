import { useState } from 'react';
import { X } from 'lucide-react';

export default function MetricsModal({ asset, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState({
    cpuUsage: asset.cpuUsage ?? 0,
    memoryUsage: asset.memoryUsage ?? 0,
    diskUsage: asset.diskUsage ?? 0,
    networkUsage: asset.networkUsage ?? 0,
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      cpuUsage: Number(form.cpuUsage),
      memoryUsage: Number(form.memoryUsage),
      diskUsage: Number(form.diskUsage),
      networkUsage: Number(form.networkUsage),
    });
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <div>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#E2E8F0' }}>Update live metrics</h2>
            <p className="mono" style={{ margin: '2px 0 0', fontSize: 11, color: '#5B6684' }}>{asset.name}</p>
          </div>
          <button onClick={onClose} style={iconBtnStyle} aria-label="Close">
            <X size={16} color="#8B98B0" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '16px 20px 20px' }}>
          <p style={{ fontSize: 12, color: '#5B6684', margin: '0 0 14px' }}>
            Calls <code className="mono">PUT /api/monitoring/{'{assetId}'}</code> directly — this simulates
            a monitoring agent reporting fresh telemetry for this asset.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {['cpuUsage', 'memoryUsage', 'diskUsage', 'networkUsage'].map((field) => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: 11, color: '#8B98B0', marginBottom: 5, textTransform: 'capitalize' }}>
                  {field.replace('Usage', ' %')}
                </label>
                <input
                  type="number" min="0" max="100" value={form[field]}
                  onChange={(e) => update(field, e.target.value)}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <button type="button" onClick={onClose} style={secondaryBtnStyle}>Cancel</button>
            <button type="submit" disabled={submitting} style={primaryBtnStyle}>
              {submitting ? 'Updating…' : 'Update metrics'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
};
const modalStyle = {
  width: 400, maxWidth: '92vw', background: '#0F1830',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden',
};
const headerStyle = {
  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
  padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
};
const iconBtnStyle = { background: 'none', border: 'none', padding: 4, display: 'flex' };
const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 6, padding: '8px 10px', color: '#E2E8F0', fontSize: 13, outline: 'none',
};
const primaryBtnStyle = {
  background: '#6C8CFF', color: '#0B1220', border: 'none', borderRadius: 6,
  padding: '8px 16px', fontSize: 13, fontWeight: 600,
};
const secondaryBtnStyle = {
  background: 'transparent', color: '#8B98B0', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6, padding: '8px 16px', fontSize: 13,
};
