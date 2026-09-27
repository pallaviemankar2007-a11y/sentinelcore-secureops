import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Server,
  Cloud,
  Network,
  Search,
  Plus,
  Pencil,
  Trash2,
  Zap,
  Activity,
  WifiOff,
  RefreshCw,
  Boxes,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

import * as api from "../api/assets";
import AssetFormModal from "./AssetFormModal";
import ConfirmDialog from "./ConfirmDialog";
import MetricsModal from "./MetricsModal";

const STATUS_WEIGHT = {
  CRITICAL: 0,
  WARNING: 1,
  HEALTHY: 2,
};

const statusColor = {
  HEALTHY: {
    dot: "#10B981",
    text: "#047857",
    bg: "#ECFDF5",
    border: "#D1FAE5",
  },

  WARNING: {
    dot: "#F59E0B",
    text: "#B45309",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },

  CRITICAL: {
    dot: "#EF4444",
    text: "#B91C1C",
    bg: "#FEF2F2",
    border: "#FECACA",
  },
};

const typeIcon = {
  SERVER: Server,
  CLOUD: Cloud,
  NETWORK: Network,
};

const typeColor = {
  SERVER: "#4F46E5",
  CLOUD: "#8B5CF6",
  NETWORK: "#0891B2",
};

export default function AssetsPage({
  assets: externalAssets,
  counts: externalCounts,
  loading: externalLoading,
  loadError: externalError,
  onReload,
  showToast = (msg) => console.log(msg),
}) {
  /* =====================================================
     STATE
  ===================================================== */

  const [internalAssets, setInternalAssets] = useState([]);
  const [internalLoading, setInternalLoading] = useState(true);
  const [internalError, setInternalError] = useState(null);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  const [formOpen, setFormOpen] = useState(false);

  const [editingAsset, setEditingAsset] = useState(null);

  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [metricsTarget, setMetricsTarget] = useState(null);

  const [updatingMetrics, setUpdatingMetrics] = useState(false);

  /* =====================================================
     FETCH ASSETS
  ===================================================== */

  const fetchInternalAssets = useCallback(async () => {
    if (externalAssets !== undefined) return;

    try {
      setInternalLoading(true);

      const data = await api.getAssets();

      setInternalAssets(data || []);
      setInternalError(null);
    } catch (err) {
      setInternalError(err.message || "Failed to load assets.");
    } finally {
      setInternalLoading(false);
    }
  }, [externalAssets]);

  useEffect(() => {
    fetchInternalAssets();
  }, [fetchInternalAssets]);

  const reloadData = useCallback(async () => {
    if (onReload) {
      await onReload();
    } else {
      await fetchInternalAssets();
    }
  }, [onReload, fetchInternalAssets]);

  /* =====================================================
     DATA
  ===================================================== */

  const assets = externalAssets !== undefined ? externalAssets : internalAssets;

  const loading =
    externalLoading !== undefined ? externalLoading : internalLoading;

  const loadError = externalError !== undefined ? externalError : internalError;

  const counts = useMemo(() => {
    if (externalCounts) {
      return externalCounts;
    }

    return assets.reduce(
      (acc, asset) => {
        const status = asset.status || "HEALTHY";

        acc[status] = (acc[status] || 0) + 1;

        return acc;
      },
      {
        HEALTHY: 0,
        WARNING: 0,
        CRITICAL: 0,
      },
    );
  }, [externalCounts, assets]);

  /* =====================================================
     FILTER + SORT
  ===================================================== */

  const filtered = useMemo(() => {
    return assets
      .filter(
        (asset) => filter === "all" || (asset.status || "HEALTHY") === filter,
      )
      .filter((asset) =>
        (asset.name || asset.assetName || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
      .sort(
        (a, b) =>
          (STATUS_WEIGHT[a.status] ?? 3) - (STATUS_WEIGHT[b.status] ?? 3),
      );
  }, [assets, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;

    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  /* =====================================================
     ACTIONS
  ===================================================== */

  function openCreate() {
    setEditingAsset(null);
    setFormOpen(true);
  }

  function openEdit(asset) {
    setEditingAsset(asset);
    setFormOpen(true);
  }

  const handleSubmit = useCallback(
    async (form) => {
      setSaving(true);

      try {
        if (editingAsset) {
          await api.updateAsset(editingAsset.assetId || editingAsset.id, form);

          showToast("Asset updated.");
        } else {
          await api.createAsset({
            ...form,
            lastCheckedAt: new Date().toISOString(),
          });

          showToast("Asset created.");
        }

        setFormOpen(false);

        await reloadData();
      } catch (err) {
        showToast(err.message || "Something went wrong.", "error");
      } finally {
        setSaving(false);
      }
    },
    [editingAsset, reloadData, showToast],
  );

  const handleMetricsSubmit = useCallback(
    async (values) => {
      setUpdatingMetrics(true);

      try {
        await api.updateMetrics(
          metricsTarget.assetId || metricsTarget.id,
          values,
        );

        showToast("Metrics updated.");

        setMetricsTarget(null);

        await reloadData();
      } catch (err) {
        showToast(err.message || "Could not update metrics.", "error");
      } finally {
        setUpdatingMetrics(false);
      }
    },
    [metricsTarget, reloadData, showToast],
  );

  const handleDelete = useCallback(async () => {
    try {
      await api.deleteAsset(deleteTarget.assetId || deleteTarget.id);

      showToast("Asset deleted.");

      setDeleteTarget(null);

      await reloadData();
    } catch (err) {
      showToast(err.message || "Could not delete asset.", "error");
    }
  }, [deleteTarget, reloadData, showToast]);

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "none",
        margin: 0,
      }}
    >
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          gap: 20,

          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: 9,

                background: "#EEF2FF",

                border: "1px solid #E0E7FF",

                color: "#4F46E5",
              }}
            >
              <Boxes size={18} strokeWidth={2} />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#0F172A",

                  fontSize: 18,
                  fontWeight: 700,

                  letterSpacing: "-0.02em",
                }}
              >
                Infrastructure Assets
              </h2>

              <p
                style={{
                  margin: "3px 0 0",

                  color: "#64748B",

                  fontSize: 11.5,
                }}
              >
                Monitor servers, cloud resources, and network devices.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={reloadData}
            disabled={loading}
            style={secondaryButtonStyle(loading)}
          >
            <RefreshCw
              size={14}
              style={
                loading
                  ? {
                      animation: "spin 1s linear infinite",
                    }
                  : {}
              }
            />
            Refresh
          </button>

          <button type="button" onClick={openCreate} style={primaryBtnStyle}>
            <Plus size={15} />
            Add Asset
          </button>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {loadError && (
        <div
          style={{
            marginBottom: 18,

            padding: "11px 14px",

            borderRadius: 10,

            background: "#FEF2F2",

            border: "1px solid #FECACA",

            color: "#B91C1C",

            fontSize: 11.5,

            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <WifiOff size={15} />

          <span>Couldn't reach the backend: {loadError}</span>
        </div>
      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",

          gap: 14,

          marginBottom: 18,
        }}
      >
        <SummaryCard
          label="Total Assets"
          value={assets.length}
          icon={Boxes}
          color="#4F46E5"
          bg="#EEF2FF"
        />

        <SummaryCard
          label="Healthy"
          value={counts.HEALTHY || 0}
          icon={ShieldCheck}
          color="#059669"
          bg="#ECFDF5"
        />

        <SummaryCard
          label="Warning"
          value={counts.WARNING || 0}
          icon={AlertTriangle}
          color="#D97706"
          bg="#FFFBEB"
        />

        <SummaryCard
          label="Critical"
          value={counts.CRITICAL || 0}
          icon={ShieldAlert}
          color="#DC2626"
          bg="#FEF2F2"
        />
      </div>

      {/* =================================================
          ASSET PULSE
      ================================================= */}

      {assets.length > 0 && (
        <div
          style={{
            marginBottom: 18,

            padding: "14px 16px",

            background: "#FFFFFF",

            border: "1px solid #E2E8F0",

            borderRadius: 12,

            boxShadow: "0 2px 5px rgba(15, 23, 42, 0.035)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",

              gap: 12,

              marginBottom: 11,
            }}
          >
            <div>
              <div
                style={{
                  color: "#0F172A",

                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Asset pulse
              </div>

              <div
                style={{
                  marginTop: 3,

                  color: "#94A3B8",

                  fontSize: 9.5,
                }}
              >
                Current infrastructure status distribution
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,

                flexWrap: "wrap",
              }}
            >
              <LegendDot
                color="#10B981"
                label={`${counts.HEALTHY || 0} healthy`}
              />

              <LegendDot
                color="#F59E0B"
                label={`${counts.WARNING || 0} warning`}
              />

              <LegendDot
                color="#EF4444"
                label={`${counts.CRITICAL || 0} critical`}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",

              width: "100%",
              height: 48,

              gap: 3,
            }}
          >
            {assets.map((asset, index) => {
              const status = asset.status || "HEALTHY";

              const color = statusColor[status]?.dot || "#10B981";

              const metric = asset.cpuUsage ?? 10;

              return (
                <div
                  key={asset.assetId || asset.id || index}
                  title={`${asset.name || asset.assetName} · ${status}`}
                  style={{
                    flex: 1,

                    minWidth: 3,

                    maxWidth: 32,

                    borderRadius: "4px 4px 2px 2px",

                    background: color,

                    height: `${Math.min(Math.max(metric, 8), 100)}%`,

                    opacity: status === "CRITICAL" ? 1 : 0.72,

                    transition: "height 0.4s ease",
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================
          FILTER TOOLBAR
      ================================================= */}

      <div
        style={{
          display: "flex",
          alignItems: "center",

          justifyContent: "space-between",

          gap: 12,

          marginBottom: 12,

          flexWrap: "wrap",
        }}
      >
        {/* Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",

            gap: 5,

            padding: 4,

            background: "#F8FAFC",

            border: "1px solid #E2E8F0",

            borderRadius: 10,
          }}
        >
          {["all", "HEALTHY", "WARNING", "CRITICAL"].map((status) => {
            const active = filter === status;

            const count =
              status === "all" ? assets.length : counts[status] || 0;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,

                  padding: "6px 10px",

                  border: "none",
                  borderRadius: 7,

                  background: active ? "#FFFFFF" : "transparent",

                  color: active ? "#0F172A" : "#64748B",

                  boxShadow: active
                    ? "0 1px 3px rgba(15, 23, 42, 0.08)"
                    : "none",

                  fontSize: 10.5,
                  fontWeight: active ? 650 : 500,

                  cursor: "pointer",
                }}
              >
                {status !== "all" && (
                  <span
                    style={{
                      width: 6,
                      height: 6,

                      borderRadius: "50%",

                      background: statusColor[status]?.dot || "#94A3B8",
                    }}
                  />
                )}

                {status === "all" ? "All" : status}

                <span
                  style={{
                    padding: "1px 5px",

                    borderRadius: 5,

                    background: active ? "#F1F5F9" : "#E2E8F0",

                    color: "#64748B",

                    fontSize: 9,
                    fontWeight: 650,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",

            gap: 8,

            minWidth: 230,

            padding: "8px 11px",

            background: "#FFFFFF",

            border: "1px solid #E2E8F0",

            borderRadius: 9,

            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.025)",
          }}
        >
          <Search size={14} color="#94A3B8" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets..."
            style={{
              width: "100%",

              background: "transparent",

              border: "none",
              outline: "none",

              color: "#0F172A",

              fontSize: 11.5,
            }}
          />
        </div>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      {loading ? (
        <SkeletonTable />
      ) : filtered.length === 0 ? (
        <EmptyState hasAssets={assets.length > 0} onAdd={openCreate} />
      ) : (
        <div
          style={{
            width: "100%",

            overflowX: "auto",

            background: "#FFFFFF",

            border: "1px solid #E2E8F0",

            borderRadius: 12,

            boxShadow: "0 2px 6px rgba(15, 23, 42, 0.035)",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: 980,

              borderCollapse: "collapse",

              fontSize: 11.5,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#F8FAFC",

                  borderBottom: "1px solid #E2E8F0",
                }}
              >
                {[
                  "Asset",
                  "Type",
                  "Status",
                  "CPU",
                  "Memory",
                  "Disk",
                  "Network",
                  "Last checked",
                  "",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      textAlign: "left",

                      padding: "10px 12px",

                      color: "#64748B",

                      fontSize: 9.5,
                      fontWeight: 700,

                      textTransform: "uppercase",

                      letterSpacing: "0.055em",

                      whiteSpace: "nowrap",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginated.map((asset, index) => {
                const Icon = typeIcon[asset.type] || Server;

                const status = asset.status || "HEALTHY";

                const statusInfo = statusColor[status] || statusColor.HEALTHY;

                const assetIdStr = String(asset.assetId || asset.id || index);

                return (
                  <tr
                    key={assetIdStr}
                    style={{
                      borderBottom: "1px solid #F1F5F9",

                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#FAFBFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#FFFFFF";
                    }}
                  >
                    {/* Asset */}
                    <td
                      style={{
                        padding: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                        }}
                      >
                        <div
                          style={{
                            width: 31,
                            height: 31,

                            flexShrink: 0,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            borderRadius: 8,

                            background: "#F8FAFC",

                            border: "1px solid #E2E8F0",

                            color: typeColor[asset.type] || "#4F46E5",
                          }}
                        >
                          <Icon size={15} strokeWidth={1.9} />
                        </div>

                        <div
                          style={{
                            minWidth: 0,
                          }}
                        >
                          <div
                            className="mono"
                            style={{
                              color: "#0F172A",

                              fontSize: 11.5,

                              fontWeight: 650,

                              overflow: "hidden",

                              textOverflow: "ellipsis",

                              whiteSpace: "nowrap",
                            }}
                          >
                            {asset.name || asset.assetName}
                          </div>

                          <div
                            className="mono"
                            style={{
                              marginTop: 2,

                              color: "#94A3B8",

                              fontSize: 8.5,
                            }}
                          >
                            {assetIdStr.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td
                      style={{
                        padding: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,

                          padding: "5px 8px",

                          borderRadius: 7,

                          background: "#F8FAFC",

                          color: "#475569",

                          fontSize: 9.5,

                          fontWeight: 600,
                        }}
                      >
                        <Icon
                          size={12}
                          color={typeColor[asset.type] || "#64748B"}
                        />

                        {asset.type || "SERVER"}
                      </div>
                    </td>

                    {/* Status */}
                    <td
                      style={{
                        padding: "12px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,

                          padding: "5px 8px",

                          borderRadius: 999,

                          background: statusInfo.bg,

                          border: `1px solid ${statusInfo.border}`,

                          color: statusInfo.text,

                          fontSize: 9.5,

                          fontWeight: 700,

                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,

                            borderRadius: "50%",

                            background: statusInfo.dot,
                          }}
                        />

                        {status}
                      </span>
                    </td>

                    {/* CPU */}
                    <td
                      style={{
                        padding: "12px",
                      }}
                    >
                      <MiniMetric value={asset.cpuUsage} color="#4F46E5" />
                    </td>

                    {/* Memory */}
                    <td
                      style={{
                        padding: "12px",
                      }}
                    >
                      <MiniMetric value={asset.memoryUsage} color="#8B5CF6" />
                    </td>

                    {/* Disk */}
                    <td
                      style={{
                        padding: "12px",
                      }}
                    >
                      <MiniMetric value={asset.diskUsage} color="#F59E0B" />
                    </td>

                    {/* Network */}
                    <td
                      style={{
                        padding: "12px",
                      }}
                    >
                      <MiniMetric value={asset.networkUsage} color="#06B6D4" />
                    </td>

                    {/* Last checked */}
                    <td
                      className="mono"
                      style={{
                        padding: "12px",

                        color: "#64748B",

                        fontSize: 9.5,

                        whiteSpace: "nowrap",
                      }}
                    >
                      {asset.lastCheckedAt
                        ? new Date(asset.lastCheckedAt).toLocaleString()
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td
                      style={{
                        padding: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 4,
                        }}
                      >
                        {MetricsModal && (
                          <IconButton
                            onClick={() => setMetricsTarget(asset)}
                            title="Update metrics"
                          >
                            <Zap size={13} />
                          </IconButton>
                        )}

                        <IconButton
                          onClick={() => openEdit(asset)}
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </IconButton>

                        <IconButton
                          onClick={() => setDeleteTarget(asset)}
                          title="Delete"
                          danger
                        >
                          <Trash2 size={13} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* =================================================
          PAGINATION
      ================================================= */}

      {!loading && filtered.length > PAGE_SIZE && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          onChange={setPage}
        />
      )}

      {/* =================================================
          MODALS
      ================================================= */}

      {formOpen && AssetFormModal && (
        <AssetFormModal
          initialAsset={editingAsset}
          submitting={saving}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {deleteTarget && ConfirmDialog && (
        <ConfirmDialog
          title="Delete asset?"
          message={`This permanently removes "${deleteTarget.name || deleteTarget.assetName}" from monitoring. This can't be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {metricsTarget && MetricsModal && (
        <MetricsModal
          asset={metricsTarget}
          submitting={updatingMetrics}
          onClose={() => setMetricsTarget(null)}
          onSubmit={handleMetricsSubmit}
        />
      )}
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div
      style={{
        position: "relative",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        minHeight: 88,

        padding: "14px 15px",

        background: "#FFFFFF",

        border: "1px solid #E2E8F0",

        borderRadius: 12,

        boxShadow: "0 2px 5px rgba(15, 23, 42, 0.035)",

        overflow: "hidden",
      }}
    >
      <div>
        <div
          style={{
            color: "#64748B",

            fontSize: 9.5,
            fontWeight: 700,

            textTransform: "uppercase",

            letterSpacing: "0.055em",
          }}
        >
          {label}
        </div>

        <div
          className="mono"
          style={{
            marginTop: 7,

            color: "#0F172A",

            fontSize: 25,
            fontWeight: 700,

            lineHeight: 1,
          }}
        >
          {value}
        </div>
      </div>

      <div
        style={{
          width: 36,
          height: 36,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          borderRadius: 10,

          background: bg,

          border: `1px solid ${color}20`,

          color,
        }}
      >
        <Icon size={18} strokeWidth={2} />
      </div>

      <div
        style={{
          position: "absolute",

          left: 0,
          bottom: 0,

          width: 34,

          height: 3,

          borderRadius: "0 4px 0 0",

          background: color,
        }}
      />
    </div>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({ page, totalPages, totalItems, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        gap: 15,

        marginTop: 12,

        padding: "10px 13px",

        background: "#FFFFFF",

        border: "1px solid #E2E8F0",

        borderRadius: 10,
      }}
    >
      <span
        style={{
          color: "#64748B",

          fontSize: 10.5,
        }}
      >
        Page {page} of {totalPages} · {totalItems} item
        {totalItems !== 1 ? "s" : ""}
      </span>

      <div
        style={{
          display: "flex",
          gap: 6,
        }}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          style={navBtnStyle(page === 1)}
        >
          ‹ Prev
        </button>

        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          style={navBtnStyle(page === totalPages)}
        >
          Next ›
        </button>
      </div>
    </div>
  );
}

function navBtnStyle(disabled) {
  return {
    padding: "6px 12px",

    borderRadius: 7,

    fontSize: 10.5,
    fontWeight: 600,

    border: "1px solid #E2E8F0",

    background: disabled ? "#F8FAFC" : "#FFFFFF",

    color: disabled ? "#CBD5E1" : "#475569",

    cursor: disabled ? "default" : "pointer",
  };
}

/* =========================================================
   MINI METRIC
========================================================= */

function MiniMetric({ value, color }) {
  const numericValue = Number(value ?? 0);

  const safeValue = Math.min(Math.max(numericValue, 0), 100);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,

        minWidth: 82,
      }}
    >
      <div
        style={{
          width: 43,
          height: 5,

          flexShrink: 0,

          borderRadius: 999,

          background: "#E2E8F0",

          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",

            width: `${safeValue}%`,

            borderRadius: 999,

            background: color,

            transition: "width 0.3s ease",
          }}
        />
      </div>

      <span
        className="mono"
        style={{
          color: "#64748B",

          fontSize: 9.5,

          whiteSpace: "nowrap",
        }}
      >
        {numericValue}%
      </span>
    </div>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function LegendDot({ color, label }) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,

        color: "#64748B",

        fontSize: 9.5,
        fontWeight: 550,

        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,

          borderRadius: "50%",

          background: color,
        }}
      />

      {label}
    </span>
  );
}

/* =========================================================
   ICON BUTTON
========================================================= */

function IconButton({ children, onClick, title, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        width: 29,
        height: 29,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        padding: 0,

        background: "#FFFFFF",

        border: "1px solid #E2E8F0",

        borderRadius: 7,

        color: danger ? "#DC2626" : "#64748B",

        cursor: "pointer",

        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? "#FEF2F2" : "#F8FAFC";

        e.currentTarget.style.borderColor = danger ? "#FECACA" : "#CBD5E1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#FFFFFF";

        e.currentTarget.style.borderColor = "#E2E8F0";
      }}
    >
      {children}
    </button>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function SkeletonTable() {
  return (
    <div
      style={{
        background: "#FFFFFF",

        border: "1px solid #E2E8F0",

        borderRadius: 12,

        padding: 14,
      }}
    >
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          style={{
            height: 42,

            borderRadius: 7,

            background: "#F1F5F9",

            marginBottom: item < 5 ? 7 : 0,

            animation: "fade-up 0.5s ease",
          }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ hasAssets, onAdd }) {
  return (
    <div
      style={{
        minHeight: 270,

        display: "flex",
        flexDirection: "column",

        alignItems: "center",
        justifyContent: "center",

        textAlign: "center",

        background: "#FFFFFF",

        border: "1px dashed #CBD5E1",

        borderRadius: 12,

        padding: 30,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          marginBottom: 12,

          borderRadius: 12,

          background: "#F8FAFC",

          border: "1px solid #E2E8F0",

          color: "#94A3B8",
        }}
      >
        <Activity size={21} strokeWidth={1.8} />
      </div>

      <p
        style={{
          margin: "0 0 5px",

          color: "#0F172A",

          fontSize: 13,
          fontWeight: 650,
        }}
      >
        {hasAssets ? "No assets match this filter" : "No assets yet"}
      </p>

      <p
        style={{
          maxWidth: 400,

          margin: "0 0 16px",

          color: "#94A3B8",

          fontSize: 10.5,
          lineHeight: 1.5,
        }}
      >
        {hasAssets
          ? "Try another status filter or clear your search."
          : "Add your first server, cloud resource, or network device to start monitoring."}
      </p>

      {!hasAssets && (
        <button type="button" onClick={onAdd} style={primaryBtnStyle}>
          <Plus size={14} />
          Add Asset
        </button>
      )}
    </div>
  );
}

/* =========================================================
   BUTTONS
========================================================= */

const primaryBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",

  gap: 7,

  background: "linear-gradient(135deg, #4F46E5, #6366F1)",

  color: "#FFFFFF",

  border: "none",

  borderRadius: 8,

  padding: "8px 13px",

  fontSize: 11,
  fontWeight: 650,

  cursor: "pointer",

  boxShadow: "0 4px 10px rgba(79, 70, 229, 0.18)",
};

function secondaryButtonStyle(disabled) {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    gap: 6,

    background: "#FFFFFF",

    color: disabled ? "#CBD5E1" : "#475569",

    border: "1px solid #E2E8F0",

    borderRadius: 8,

    padding: "8px 12px",

    fontSize: 11,
    fontWeight: 600,

    cursor: disabled ? "default" : "pointer",
  };
}
