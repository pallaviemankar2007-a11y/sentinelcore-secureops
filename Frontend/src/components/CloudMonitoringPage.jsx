import {
  Cloud,
  Activity,
  Server,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
} from "lucide-react";

import { filterByType } from "../utils/assetHelpers";

export default function CloudMonitoringPage({ assets, onGoToAssets }) {
  const cloudAssets = filterByType(assets, "CLOUD");

  const total = cloudAssets.length;

  const healthy = cloudAssets.filter(
    (asset) => getStatus(asset) === "HEALTHY",
  ).length;

  const warning = cloudAssets.filter(
    (asset) => getStatus(asset) === "WARNING",
  ).length;

  const critical = cloudAssets.filter(
    (asset) => getStatus(asset) === "CRITICAL",
  ).length;

  const averageCpu =
    total > 0
      ? average(cloudAssets.map((asset) => Number(asset.cpuUsage) || 0))
      : 0;

  const averageMemory =
    total > 0
      ? average(cloudAssets.map((asset) => Number(asset.memoryUsage) || 0))
      : 0;

  const averageDisk =
    total > 0
      ? average(cloudAssets.map((asset) => Number(asset.diskUsage) || 0))
      : 0;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1600,
        margin: "0 auto",
        animation: "fade-up 0.25s ease",
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 20,
          marginBottom: 22,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 11,
                background: "#F5F3FF",
                border: "1px solid #EDE9FE",
                color: "#7C3AED",
              }}
            >
              <Cloud size={21} strokeWidth={1.9} />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#0F172A",
                  fontSize: 21,
                  fontWeight: 750,
                  letterSpacing: "-0.03em",
                }}
              >
                Cloud Monitoring
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#64748B",
                  fontSize: 11.5,
                }}
              >
                Monitor cloud infrastructure health and resource utilization.
              </p>
            </div>
          </div>
        </div>

        <button type="button" onClick={onGoToAssets} style={manageButtonStyle}>
          <Server size={14} strokeWidth={2} />
          Manage Assets
          <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      {/* =====================================================
          OVERVIEW CARDS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <OverviewCard
          label="Cloud Resources"
          value={total}
          sub="Registered cloud assets"
          icon={Cloud}
          color="#7C3AED"
          bg="#F5F3FF"
        />

        <OverviewCard
          label="Healthy"
          value={healthy}
          sub="Operating normally"
          icon={CheckCircle2}
          color="#059669"
          bg="#ECFDF5"
        />

        <OverviewCard
          label="Warning"
          value={warning}
          sub="Needs attention"
          icon={AlertTriangle}
          color="#D97706"
          bg="#FFF7ED"
        />

        <OverviewCard
          label="Critical"
          value={critical}
          sub="Immediate attention"
          icon={XCircle}
          color="#DC2626"
          bg="#FEF2F2"
        />
      </div>

      {/* =====================================================
          RESOURCE SUMMARY
      ===================================================== */}

      {total > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <ResourceCard
            label="Average CPU"
            value={averageCpu}
            icon={Cpu}
            color="#4F46E5"
            bg="#EEF2FF"
          />

          <ResourceCard
            label="Average Memory"
            value={averageMemory}
            icon={MemoryStick}
            color="#8B5CF6"
            bg="#F5F3FF"
          />

          <ResourceCard
            label="Average Disk"
            value={averageDisk}
            icon={HardDrive}
            color="#0891B2"
            bg="#ECFEFF"
          />
        </div>
      )}

      {/* =====================================================
          CLOUD RESOURCE TABLE
      ===================================================== */}

      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 15,
            padding: "16px 18px",
            borderBottom: "1px solid #E2E8F0",
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
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                background: "#F5F3FF",
                color: "#7C3AED",
              }}
            >
              <Activity size={15} strokeWidth={2} />
            </div>

            <div>
              <h3
                style={{
                  margin: 0,
                  color: "#0F172A",
                  fontSize: 12.5,
                  fontWeight: 700,
                }}
              >
                Cloud Resources
              </h3>

              <p
                style={{
                  margin: "3px 0 0",
                  color: "#94A3B8",
                  fontSize: 9.5,
                }}
              >
                Current infrastructure utilization
              </p>
            </div>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 9px",
              borderRadius: 999,
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              color: "#64748B",
              fontSize: 9.5,
              fontWeight: 650,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: total > 0 ? "#10B981" : "#94A3B8",
              }}
            />
            {total > 0 ? `${total} resources` : "No resources"}
          </div>
        </div>

        {total === 0 ? (
          <EmptyState onGoToAssets={onGoToAssets} />
        ) : (
          <CloudTable assets={cloudAssets} />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   OVERVIEW CARD
========================================================= */

function OverviewCard({ label, value, sub, icon: Icon, color, bg }) {
  return (
    <div
      style={{
        minHeight: 116,
        padding: "16px 17px",
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 13,
        boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              color: "#64748B",
              fontSize: 9.5,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </div>

          <div
            className="mono"
            style={{
              marginTop: 8,
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
            borderRadius: 9,
            background: bg,
            color,
          }}
        >
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 11,
          color: "#94A3B8",
          fontSize: 9.5,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: color,
          }}
        />
        {sub}
      </div>
    </div>
  );
}

/* =========================================================
   RESOURCE CARD
========================================================= */

function ResourceCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(15,23,42,0.035)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
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
            background: bg,
            color,
          }}
        >
          <Icon size={17} strokeWidth={2} />
        </div>

        <div
          style={{
            flex: 1,
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: 9.5,
              fontWeight: 650,
            }}
          >
            {label}
          </div>

          <div
            className="mono"
            style={{
              marginTop: 2,
              color: "#0F172A",
              fontSize: 17,
              fontWeight: 700,
            }}
          >
            {value.toFixed(1)}%
          </div>
        </div>

        <div
          style={{
            width: 90,
            height: 6,
            borderRadius: 999,
            overflow: "hidden",
            background: "#F1F5F9",
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, value))}%`,
              height: "100%",
              borderRadius: 999,
              background: color,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CLOUD TABLE
========================================================= */

function CloudTable({ assets }) {
  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          minWidth: 760,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>CLOUD RESOURCE</th>

            <th style={tableHeaderStyle}>STATUS</th>

            <th style={tableHeaderStyle}>CPU</th>

            <th style={tableHeaderStyle}>MEMORY</th>

            <th style={tableHeaderStyle}>DISK</th>

            <th style={tableHeaderStyle}>NETWORK</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((asset) => {
            const status = getStatus(asset);

            return (
              <tr key={asset.id ?? asset.name}>
                <td style={tableCellStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 31,
                        height: 31,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        background: "#F5F3FF",
                        color: "#7C3AED",
                      }}
                    >
                      <Cloud size={15} strokeWidth={2} />
                    </div>

                    <div>
                      <div
                        style={{
                          color: "#0F172A",
                          fontSize: 10.5,
                          fontWeight: 650,
                        }}
                      >
                        {asset.name}
                      </div>

                      <div
                        className="mono"
                        style={{
                          marginTop: 2,
                          color: "#94A3B8",
                          fontSize: 8.5,
                        }}
                      >
                        {asset.ipAddress || "Cloud resource"}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={tableCellStyle}>
                  <StatusBadge status={status} />
                </td>

                <td style={tableCellStyle}>
                  <MetricBar value={asset.cpuUsage} color="#4F46E5" />
                </td>

                <td style={tableCellStyle}>
                  <MetricBar value={asset.memoryUsage} color="#8B5CF6" />
                </td>

                <td style={tableCellStyle}>
                  <MetricBar value={asset.diskUsage} color="#0891B2" />
                </td>

                <td style={tableCellStyle}>
                  <MetricBar value={asset.networkUsage} color="#059669" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   METRIC BAR
========================================================= */

function MetricBar({ value, color }) {
  const numericValue = Number(value) || 0;

  return (
    <div
      style={{
        minWidth: 105,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 7,
          marginBottom: 5,
        }}
      >
        <span
          className="mono"
          style={{
            color: "#334155",
            fontSize: 9.5,
            fontWeight: 650,
          }}
        >
          {numericValue.toFixed(1)}%
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: 5,
          overflow: "hidden",
          borderRadius: 999,
          background: "#F1F5F9",
        }}
      >
        <div
          style={{
            width: `${Math.min(100, Math.max(0, numericValue))}%`,
            height: "100%",
            borderRadius: 999,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const styles = {
    HEALTHY: {
      color: "#047857",
      background: "#ECFDF5",
      border: "#D1FAE5",
      dot: "#10B981",
    },

    WARNING: {
      color: "#B45309",
      background: "#FFF7ED",
      border: "#FED7AA",
      dot: "#F59E0B",
    },

    CRITICAL: {
      color: "#B91C1C",
      background: "#FEF2F2",
      border: "#FECACA",
      dot: "#EF4444",
    },
  };

  const style = styles[status] || styles.HEALTHY;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 8px",
        borderRadius: 999,
        background: style.background,
        border: `1px solid ${style.border}`,
        color: style.color,
        fontSize: 8.5,
        fontWeight: 700,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: style.dot,
        }}
      />

      {status}
    </span>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ onGoToAssets }) {
  return (
    <div
      style={{
        minHeight: 270,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 13,
          background: "#F5F3FF",
          border: "1px solid #EDE9FE",
          color: "#7C3AED",
        }}
      >
        <Cloud size={24} strokeWidth={1.7} />
      </div>

      <h3
        style={{
          margin: "14px 0 5px",
          color: "#0F172A",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        No cloud resources
      </h3>

      <p
        style={{
          margin: 0,
          maxWidth: 330,
          textAlign: "center",
          color: "#64748B",
          fontSize: 10.5,
          lineHeight: 1.5,
        }}
      >
        No cloud resources are currently registered for monitoring. Add a cloud
        asset to start monitoring its infrastructure.
      </p>

      <button
        type="button"
        onClick={onGoToAssets}
        style={{
          marginTop: 15,

          display: "inline-flex",

          alignItems: "center",

          gap: 7,

          padding: "8px 12px",

          border: "1px solid #C7D2FE",

          borderRadius: 8,

          background: "#EEF2FF",

          color: "#4338CA",

          fontSize: 10,

          fontWeight: 650,

          cursor: "pointer",
        }}
      >
        <Cloud size={13} />
        Add Cloud Resource
        <ArrowRight size={13} />
      </button>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function average(values) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getStatus(asset) {
  const values = [
    Number(asset.cpuUsage) || 0,
    Number(asset.memoryUsage) || 0,
    Number(asset.diskUsage) || 0,
    Number(asset.networkUsage) || 0,
  ];

  const highest = Math.max(...values);

  if (highest >= 90) {
    return "CRITICAL";
  }

  if (highest >= 70) {
    return "WARNING";
  }

  return "HEALTHY";
}

/* =========================================================
   STYLES
========================================================= */

const cardStyle = {
  width: "100%",
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 13,
  boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
  overflow: "hidden",
};

const tableHeaderStyle = {
  padding: "10px 14px",
  background: "#F8FAFC",
  borderBottom: "1px solid #E2E8F0",
  color: "#64748B",
  fontSize: 8.5,
  fontWeight: 700,
  letterSpacing: "0.045em",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const tableCellStyle = {
  padding: "12px 14px",
  borderBottom: "1px solid #F1F5F9",
  verticalAlign: "middle",
};

const manageButtonStyle = {
  height: 35,

  display: "inline-flex",

  alignItems: "center",

  gap: 7,

  padding: "0 12px",

  border: "1px solid #E2E8F0",

  borderRadius: 8,

  background: "#FFFFFF",

  color: "#475569",

  fontSize: 10,

  fontWeight: 650,

  cursor: "pointer",

  boxShadow: "0 1px 2px rgba(15,23,42,0.03)",
};
