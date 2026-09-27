import {
  ShieldAlert,
  AlertTriangle,
  Siren,
  CheckCircle2,
  Server,
  Cloud,
  Network,
  ArrowRight,
  Activity,
  Clock3,
} from "lucide-react";

import { getAtRiskAssets } from "../utils/assetHelpers";

export default function AlertsPage({ assets, onGoToAssets }) {
  const atRisk = getAtRiskAssets(assets);

  const critical = atRisk.filter(
    (asset) => getSeverity(asset) === "CRITICAL",
  ).length;

  const warning = atRisk.filter(
    (asset) => getSeverity(asset) === "WARNING",
  ).length;

  const totalAlerts = atRisk.length;

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
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#DC2626",
              }}
            >
              <ShieldAlert size={21} strokeWidth={1.9} />
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
                Security Alerts
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#64748B",
                  fontSize: 11.5,
                }}
              >
                Monitor infrastructure conditions that require attention.
              </p>
            </div>
          </div>
        </div>

        <button type="button" onClick={onGoToAssets} style={manageButtonStyle}>
          <Server size={14} strokeWidth={2} />
          View Assets
          <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      {/* =====================================================
          ALERT SUMMARY
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <AlertSummaryCard
          label="Active Alerts"
          value={totalAlerts}
          sub="Assets requiring attention"
          icon={ShieldAlert}
          color="#DC2626"
          bg="#FEF2F2"
        />

        <AlertSummaryCard
          label="Critical"
          value={critical}
          sub="Immediate attention"
          icon={Siren}
          color="#B91C1C"
          bg="#FEF2F2"
        />

        <AlertSummaryCard
          label="Warning"
          value={warning}
          sub="Needs investigation"
          icon={AlertTriangle}
          color="#D97706"
          bg="#FFF7ED"
        />

        <AlertSummaryCard
          label="System Status"
          value={totalAlerts === 0 ? "HEALTHY" : "ATTENTION"}
          sub={totalAlerts === 0 ? "No active alerts" : "Review active alerts"}
          icon={totalAlerts === 0 ? CheckCircle2 : Activity}
          color={totalAlerts === 0 ? "#059669" : "#DC2626"}
          bg={totalAlerts === 0 ? "#ECFDF5" : "#FEF2F2"}
        />
      </div>

      {/* =====================================================
          ALERT STATUS BANNER
      ===================================================== */}

      <div
        style={{
          marginBottom: 18,
          padding: "13px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 15,
          borderRadius: 11,
          border: totalAlerts === 0 ? "1px solid #D1FAE5" : "1px solid #FED7AA",
          background: totalAlerts === 0 ? "#F0FDF4" : "#FFF7ED",
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
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              background: totalAlerts === 0 ? "#DCFCE7" : "#FFEDD5",
              color: totalAlerts === 0 ? "#059669" : "#D97706",
            }}
          >
            {totalAlerts === 0 ? (
              <CheckCircle2 size={16} />
            ) : (
              <ShieldAlert size={16} />
            )}
          </div>

          <div>
            <div
              style={{
                color: "#0F172A",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {totalAlerts === 0
                ? "All systems operating normally"
                : `${totalAlerts} asset${totalAlerts === 1 ? "" : "s"} require attention`}
            </div>

            <div
              style={{
                marginTop: 2,
                color: "#64748B",
                fontSize: 9.5,
              }}
            >
              {totalAlerts === 0
                ? "No infrastructure threshold violations detected."
                : "Review the affected assets below and investigate their current metrics."}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 9px",
            borderRadius: 999,
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            color: "#64748B",
            fontSize: 9,
            fontWeight: 650,
            whiteSpace: "nowrap",
          }}
        >
          <Clock3 size={12} />
          Live monitoring
        </div>
      </div>

      {/* =====================================================
          ALERT LIST
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
                background: "#FEF2F2",
                color: "#DC2626",
              }}
            >
              <Siren size={15} strokeWidth={2} />
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
                Active Alerts
              </h3>

              <p
                style={{
                  margin: "3px 0 0",
                  color: "#94A3B8",
                  fontSize: 9.5,
                }}
              >
                Infrastructure conditions requiring review
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
                background: totalAlerts > 0 ? "#EF4444" : "#10B981",
              }}
            />

            {totalAlerts > 0 ? `${totalAlerts} active` : "All clear"}
          </div>
        </div>

        {totalAlerts === 0 ? (
          <EmptyAlerts onGoToAssets={onGoToAssets} />
        ) : (
          <AlertTable assets={atRisk} />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ALERT SUMMARY CARD
========================================================= */

function AlertSummaryCard({ label, value, sub, icon: Icon, color, bg }) {
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
            className={typeof value === "number" ? "mono" : undefined}
            style={{
              marginTop: 8,
              color: "#0F172A",
              fontSize: typeof value === "number" ? 25 : 17,
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
   ALERT TABLE
========================================================= */

function AlertTable({ assets }) {
  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          minWidth: 850,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>AFFECTED ASSET</th>

            <th style={tableHeaderStyle}>SEVERITY</th>

            <th style={tableHeaderStyle}>TRIGGER</th>

            <th style={tableHeaderStyle}>CURRENT VALUE</th>

            <th style={tableHeaderStyle}>THRESHOLD</th>

            <th style={tableHeaderStyle}>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((asset) => {
            const severity = getSeverity(asset);

            const trigger = getTrigger(asset);

            return (
              <tr key={asset.id ?? asset.name}>
                {/* ASSET */}

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
                        background: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        color: "#475569",
                      }}
                    >
                      <AssetIcon type={asset.type} />
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
                        {asset.ipAddress ||
                          asset.type ||
                          "Infrastructure asset"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* SEVERITY */}

                <td style={tableCellStyle}>
                  <SeverityBadge severity={severity} />
                </td>

                {/* TRIGGER */}

                <td style={tableCellStyle}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 8px",
                      borderRadius: 7,
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      color: "#475569",
                      fontSize: 9,
                      fontWeight: 600,
                    }}
                  >
                    <Activity size={11} />

                    {trigger.label}
                  </div>
                </td>

                {/* VALUE */}

                <td style={tableCellStyle}>
                  <span
                    className="mono"
                    style={{
                      color: severity === "CRITICAL" ? "#DC2626" : "#D97706",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {trigger.value}
                  </span>
                </td>

                {/* THRESHOLD */}

                <td style={tableCellStyle}>
                  <span
                    className="mono"
                    style={{
                      color: "#64748B",
                      fontSize: 9.5,
                      fontWeight: 600,
                    }}
                  >
                    {trigger.threshold}
                  </span>
                </td>

                {/* STATUS */}

                <td style={tableCellStyle}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      color: severity === "CRITICAL" ? "#B91C1C" : "#B45309",
                      fontSize: 9,
                      fontWeight: 650,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background:
                          severity === "CRITICAL" ? "#EF4444" : "#F59E0B",
                      }}
                    />
                    Active
                  </span>
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
   ASSET ICON
========================================================= */

function AssetIcon({ type }) {
  if (String(type).toUpperCase() === "CLOUD") {
    return <Cloud size={15} strokeWidth={2} />;
  }

  if (String(type).toUpperCase() === "NETWORK") {
    return <Network size={15} strokeWidth={2} />;
  }

  return <Server size={15} strokeWidth={2} />;
}

/* =========================================================
   SEVERITY BADGE
========================================================= */

function SeverityBadge({ severity }) {
  const critical = severity === "CRITICAL";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 8px",
        borderRadius: 999,
        background: critical ? "#FEF2F2" : "#FFF7ED",
        border: critical ? "1px solid #FECACA" : "1px solid #FED7AA",
        color: critical ? "#B91C1C" : "#B45309",
        fontSize: 8.5,
        fontWeight: 700,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: critical ? "#EF4444" : "#F59E0B",
        }}
      />

      {severity}
    </span>
  );
}

/* =========================================================
   EMPTY ALERT STATE
========================================================= */

function EmptyAlerts({ onGoToAssets }) {
  return (
    <div
      style={{
        minHeight: 285,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          background: "#ECFDF5",
          border: "1px solid #D1FAE5",
          color: "#059669",
        }}
      >
        <CheckCircle2 size={26} strokeWidth={1.7} />
      </div>

      <h3
        style={{
          margin: "14px 0 5px",
          color: "#0F172A",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        No active alerts
      </h3>

      <p
        style={{
          margin: 0,
          maxWidth: 360,
          textAlign: "center",
          color: "#64748B",
          fontSize: 10.5,
          lineHeight: 1.5,
        }}
      >
        Everything looks healthy. No monitored asset is currently exceeding the
        configured infrastructure thresholds.
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

          border: "1px solid #D1FAE5",

          borderRadius: 8,

          background: "#F0FDF4",

          color: "#047857",

          fontSize: 10,

          fontWeight: 650,

          cursor: "pointer",
        }}
      >
        <Server size={13} />
        View Infrastructure
        <ArrowRight size={13} />
      </button>
    </div>
  );
}

/* =========================================================
   SEVERITY / TRIGGER HELPERS
========================================================= */

function getSeverity(asset) {
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

  return "WARNING";
}

function getTrigger(asset) {
  const metrics = [
    {
      label: "CPU Usage",
      value: Number(asset.cpuUsage) || 0,
      threshold: "70%",
      critical: 90,
    },
    {
      label: "Memory Usage",
      value: Number(asset.memoryUsage) || 0,
      threshold: "70%",
      critical: 90,
    },
    {
      label: "Disk Usage",
      value: Number(asset.diskUsage) || 0,
      threshold: "70%",
      critical: 90,
    },
    {
      label: "Network Usage",
      value: Number(asset.networkUsage) || 0,
      threshold: "70%",
      critical: 90,
    },
  ];

  const trigger = metrics.reduce(
    (highest, metric) => (metric.value > highest.value ? metric : highest),
    metrics[0],
  );

  return {
    label: trigger.label,

    value: `${trigger.value.toFixed(1)}%`,

    threshold:
      trigger.value >= trigger.critical ? "90% critical" : "70% warning",
  };
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
