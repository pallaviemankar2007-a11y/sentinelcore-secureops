import { useState } from 'react';
import { X } from 'lucide-react';

const TYPES = ['SERVER', 'CLOUD', 'NETWORK'];
const STATUSES = ['HEALTHY', 'WARNING', 'CRITICAL'];

export default function AssetFormModal({ initialAsset, onClose, onSubmit, submitting }) {
  const isEdit = Boolean(initialAsset);
  const [form, setForm] = useState({
    name: initialAsset?.name || '',
    type: initialAsset?.type || 'SERVER',
    status: initialAsset?.status || 'HEALTHY',
    cpuUsage: initialAsset?.cpuUsage ?? 0,
    memoryUsage: initialAsset?.memoryUsage ?? 0,
    diskUsage: initialAsset?.diskUsage ?? 0,
    networkUsage: initialAsset?.networkUsage ?? 0,
  });
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Asset name is required.');
      return;
    }
    setError('');
    onSubmit({
      ...form,
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
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#E2E8F0' }}>
            {isEdit ? 'Edit asset' : 'Add asset'}
          </h2>
          <button onClick={onClose} style={iconBtnStyle} aria-label="Close">
            <X size={16} color="#8B98B0" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '16px 20px 20px' }}>
          <Field label="Name">
            <input
              autoFocus
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. DB-SRV-12"
              style={inputStyle}
            />
          </Field>

          <div style={{ display: 'flex', gap: 12 }}>
            <Field label="Type" style={{ flex: 1 }}>
              <select value={form.type} onChange={(e) => update('type', e.target.value)} style={inputStyle}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Status" style={{ flex: 1 }}>
              <select value={form.status} onChange={(e) => update('status', e.target.value)} style={inputStyle}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="CPU %">
              <input type="number" min="0" max="100" value={form.cpuUsage}
                onChange={(e) => update('cpuUsage', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Memory %">
              <input type="number" min="0" max="100" value={form.memoryUsage}
                onChange={(e) => update('memoryUsage', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Disk %">
              <input type="number" min="0" max="100" value={form.diskUsage}
                onChange={(e) => update('diskUsage', e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Network %">
              <input type="number" min="0" max="100" value={form.networkUsage}
                onChange={(e) => update('networkUsage', e.target.value)} style={inputStyle} />
            </Field>
          </div>

          {error && <p style={{ color: '#F0455D', fontSize: 12, margin: '4px 0 0' }}>{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <button type="button" onClick={onClose} style={secondaryBtnStyle}>Cancel</button>
            <button type="submit" disabled={submitting} style={primaryBtnStyle}>
              {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, style }) {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      <label style={{ display: 'block', fontSize: 11, color: '#8B98B0', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
};
const modalStyle = {
  width: 420, maxWidth: '92vw', background: '#0F1830',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden',
};
const headerStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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
