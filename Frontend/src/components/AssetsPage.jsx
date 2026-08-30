import { useState, useMemo, useCallback } from 'react';
import { Server, Cloud, Network, Search, Plus, Pencil, Trash2, Zap, Activity, WifiOff } from 'lucide-react';
import * as api from '../api/assets';
import AssetFormModal from './AssetFormModal';
import ConfirmDialog from './ConfirmDialog';
import MetricsModal from './MetricsModal';

const STATUS_WEIGHT = { CRITICAL: 0, WARNING: 1, HEALTHY: 2 };
const statusColor = {
  HEALTHY: { dot: '#2DD4BF', text: '#5EEAD4', bg: 'rgba(45,212,191,0.1)' },
  WARNING: { dot: '#F5A623', text: '#FBC96D', bg: 'rgba(245,166,35,0.1)' },
  CRITICAL: { dot: '#F0455D', text: '#F87E92', bg: 'rgba(240,69,93,0.1)' },
};
const typeIcon = { SERVER: Server, CLOUD: Cloud, NETWORK: Network };

export default function AssetsPage({ assets, counts, loading, loadError, onReload, showToast }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [metricsTarget, setMetricsTarget] = useState(null);
  const [updatingMetrics, setUpdatingMetrics] = useState(false);

  const filtered = useMemo(() => {
    return assets
      .filter((a) => filter === 'all' || a.status === filter)
      .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (STATUS_WEIGHT[a.status] ?? 3) - (STATUS_WEIGHT[b.status] ?? 3));
  }, [assets, filter, search]);

  function openCreate() { setEditingAsset(null); setFormOpen(true); }
  function openEdit(asset) { setEditingAsset(asset); setFormOpen(true); }

  const handleSubmit = useCallback(async (form) => {
    setSaving(true);
    try {
      if (editingAsset) {
        await api.updateAsset(editingAsset.assetId, form);
        showToast('Asset updated.');
      } else {
        await api.createAsset({ ...form, lastCheckedAt: new Date().toISOString() });
        showToast('Asset created.');
      }
      setFormOpen(false);
      await onReload();
    } catch (err) {
      showToast(err.message || 'Something went wrong.', 'error');
    } finally {
      setSaving(false);
    }
  }, [editingAsset, onReload, showToast]);

  const handleMetricsSubmit = useCallback(async (values) => {
    setUpdatingMetrics(true);
    try {
      await api.updateMetrics(metricsTarget.assetId, values);
      showToast('Metrics updated.');
      setMetricsTarget(null);
      await onReload();
    } catch (err) {
      showToast(err.message || 'Could not update metrics.', 'error');
    } finally {
      setUpdatingMetrics(false);
    }
  }, [metricsTarget, onReload, showToast]);

  const handleDelete = useCallback(async () => {
    try {
      await api.deleteAsset(deleteTarget.assetId);
      showToast('Asset deleted.');
      setDeleteTarget(null);
      await onReload();
    } catch (err) {
      showToast(err.message || 'Could not delete asset.', 'error');
    }
  }, [deleteTarget, onReload, showToast]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 18 }}>
        <button onClick={openCreate} style={primaryBtnStyle}><Plus size={14} /> Add asset</button>
      </div>

      {loadError && (
        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 8, background: 'rgba(240,69,93,0.1)', border: '1px solid rgba(240,69,93,0.25)', fontSize: 13, color: '#F87E92', display: 'flex', alignItems: 'center', gap: 8 }}>
          <WifiOff size={14} /> Couldn't reach the backend: {loadError}
        </div>
      )}

      {assets.length > 0 && (
        <div style={{ marginBottom: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: '#0F1830', padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5B6684' }}>Asset pulse</span>
            <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#8B98B0' }}>
              <LegendDot color="#2DD4BF" label={`${counts.HEALTHY} healthy`} />
              <LegendDot color="#F5A623" label={`${counts.WARNING} warning`} />
              <LegendDot color="#F0455D" label={`${counts.CRITICAL} critical`} />
            </div>
          </div>
          <div style={{ display: 'flex', height: 56, alignItems: 'flex-end', gap: 3 }}>
            {assets.map((a) => (
              <div
                key={a.assetId}
                title={`${a.name} · ${a.status}`}
                style={{
                  flex: 1, borderRadius: 2, background: statusColor[a.status]?.dot || '#5B6684',
                  height: `${Math.min(Math.max(a.cpuUsage ?? 5, 6), 100)}%`,
                  opacity: a.status === 'CRITICAL' ? 1 : 0.75, transition: 'height 0.6s ease',
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
        {['all', 'HEALTHY', 'WARNING', 'CRITICAL'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: filter === f ? '#E2E8F0' : '#5B6684',
              border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 500, textTransform: 'capitalize',
            }}
          >
            {f.toLowerCase()}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '6px 10px' }}>
          <Search size={13} color="#5B6684" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets…"
            style={{ background: 'none', border: 'none', outline: 'none', color: '#E2E8F0', fontSize: 12, width: 140 }} />
        </div>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : filtered.length === 0 ? (
        <EmptyState hasAssets={assets.length > 0} onAdd={openCreate} />
      ) : (
        <div style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#0F1830', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Asset', 'Type', 'Status', 'CPU load', 'Last checked', ''].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5B6684', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const Icon = typeIcon[a.type] || Server;
                const c = statusColor[a.status] || statusColor.HEALTHY;
                return (
                  <tr key={a.assetId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '11px 16px' }}>
                      <div className="mono" style={{ color: '#E2E8F0' }}>{a.name}</div>
                      <div className="mono" style={{ fontSize: 10.5, color: '#3E4867' }}>{a.assetId?.slice(0, 8)}</div>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8B98B0' }}><Icon size={13} /> {a.type}</div>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 500, color: c.text, background: c.bg }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }} /> {a.status}
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 72, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 3, background: c.dot, width: `${Math.min(a.cpuUsage ?? 0, 100)}%` }} />
                        </div>
                        <span className="mono" style={{ fontSize: 11, color: '#5B6684' }}>{a.cpuUsage ?? 0}%</span>
                      </div>
                    </td>
                    <td className="mono" style={{ padding: '11px 16px', fontSize: 11, color: '#5B6684' }}>
                      {a.lastCheckedAt ? new Date(a.lastCheckedAt).toLocaleString() : '—'}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <IconButton onClick={() => setMetricsTarget(a)} title="Update metrics"><Zap size={13} /></IconButton>
                        <IconButton onClick={() => openEdit(a)} title="Edit"><Pencil size={13} /></IconButton>
                        <IconButton onClick={() => setDeleteTarget(a)} title="Delete" danger><Trash2 size={13} /></IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <AssetFormModal initialAsset={editingAsset} submitting={saving} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} />
      )}
      {deleteTarget && (
        <ConfirmDialog title="Delete asset?" message={`This permanently removes "${deleteTarget.name}" from monitoring. This can't be undone.`}
          confirmLabel="Delete" danger onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
      {metricsTarget && (
        <MetricsModal asset={metricsTarget} submitting={updatingMetrics} onClose={() => setMetricsTarget(null)} onSubmit={handleMetricsSubmit} />
      )}
    </div>
  );
}

function LegendDot({ color, label }) {
  return <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} /> {label}</span>;
}
function IconButton({ children, onClick, title, danger }) {
  return (
    <button onClick={onClick} title={title} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: 6, display: 'flex', color: danger ? '#F0455D' : '#8B98B0' }}>
      {children}
    </button>
  );
}
function SkeletonTable() {
  return (
    <div style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 16 }}>
      {[...Array(5)].map((_, i) => <div key={i} style={{ height: 36, borderRadius: 6, background: 'rgba(255,255,255,0.03)', marginBottom: 8 }} />)}
    </div>
  );
}
function EmptyState({ hasAssets, onAdd }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 12, border: '1px dashed rgba(255,255,255,0.1)' }}>
      <Activity size={22} color="#5B6684" style={{ marginBottom: 10 }} />
      <p style={{ margin: '0 0 4px', fontSize: 14, color: '#E2E8F0' }}>{hasAssets ? 'No assets match this filter' : 'No assets yet'}</p>
      <p style={{ margin: '0 0 16px', fontSize: 12.5, color: '#5B6684' }}>
        {hasAssets ? 'Try a different status or clear your search.' : 'Add your first server, cloud resource, or network device to start monitoring.'}
      </p>
      {!hasAssets && <button onClick={onAdd} style={primaryBtnStyle}><Plus size={14} /> Add asset</button>}
    </div>
  );
}
const primaryBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6, background: '#6C8CFF', color: '#0B1220',
  border: 'none', borderRadius: 7, padding: '8px 14px', fontSize: 12.5, fontWeight: 600,
};
