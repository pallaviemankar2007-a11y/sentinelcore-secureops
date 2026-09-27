import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  Clock3,
  UserRound,
  Server,
  Radio,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertTriangle,
  Network,
} from "lucide-react";

import { getAssets } from "../api/assets";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const syncAuditLogsFromAssets = async () => {
    try {
      const assets = await getAssets();

      if (Array.isArray(assets)) {
        const generatedLogs = [];

        assets.forEach((asset, index) => {
          const now = new Date();

          const timestamp = asset.lastCheckedAt || now.toISOString();

          const assetName = asset.name || "UNKNOWN-NODE";

          // 1. Critical threshold breach log
          if (asset.status === "CRITICAL" || asset.cpuUsage >= 85) {
            generatedLogs.push({
              id: `log-${index}-breach`,
              timestamp: timestamp,
              user: "system_monitor",
              action: "METRIC_THRESHOLD_BREACH",
              details: `CPU usage on ${assetName} reached critical levels (${asset.cpuUsage}%).`,
              ipAddress: `10.0.${index + 1}.15`,
            });
          } else {
            // Healthy status event log
            generatedLogs.push({
              id: `log-${index}-healthy`,
              timestamp: timestamp,
              user: "system_monitor",
              action: "ASSET_HEALTH_NORMAL",
              details: `Infrastructure asset ${assetName} operating normally within safety bounds.`,
              ipAddress: `10.0.${index + 1}.15`,
            });
          }

          // 2. Metric update telemetry stream event
          generatedLogs.push({
            id: `log-${index}-telemetry`,
            timestamp: new Date(now.getTime() - 10000).toISOString(),
            user: "telemetry_agent",
            action: "METRICS_UPDATED",
            details: `Updated metrics for ${assetName} (CPU: ${asset.cpuUsage}%, Mem: ${asset.memoryUsage}%).`,
            ipAddress: "127.0.0.1",
          });
        });

        setLogs(generatedLogs);
      }
    } catch (error) {
      console.error("Error fetching assets for audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncAuditLogsFromAssets();

    const interval = setInterval(syncAuditLogsFromAssets, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (ts) => {
    if (!ts) return "N/A";

    return ts.replace("T", " ").substring(0, 19);
  };

  const breachCount = logs.filter(
    (log) => log.action === "METRIC_THRESHOLD_BREACH",
  ).length;

  const healthyCount = logs.filter(
    (log) => log.action === "ASSET_HEALTH_NORMAL",
  ).length;

  const telemetryCount = logs.filter(
    (log) => log.action === "METRICS_UPDATED",
  ).length;

  const uniqueUsers = new Set(logs.map((log) => log.user)).size;

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
                background: "#ECFEFF",
                border: "1px solid #CFFAFE",
                color: "#0891B2",
              }}
            >
              <Database size={21} strokeWidth={1.9} />
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
                Security Audit Logs
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#64748B",
                  fontSize: 11.5,
                }}
              >
                Track infrastructure activity, telemetry updates and security
                events in real time.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            height: 36,
            padding: "0 12px",
            borderRadius: 9,
            background: "#ECFEFF",
            border: "1px solid #CFFAFE",
            color: "#0E7490",
            fontSize: 10,
            fontWeight: 650,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#06B6D4",
              boxShadow: "0 0 0 3px #CFFAFE",
            }}
          />
          Live Audit Stream
        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <SummaryCard
          label="Total Events"
          value={logs.length}
          sub="Current audit stream"
          icon={Database}
          color="#0891B2"
          bg="#ECFEFF"
        />

        <SummaryCard
          label="Security Breaches"
          value={breachCount}
          sub="Threshold violations"
          icon={ShieldAlert}
          color="#DC2626"
          bg="#FEF2F2"
        />

        <SummaryCard
          label="Healthy Events"
          value={healthyCount}
          sub="Normal infrastructure"
          icon={CheckCircle2}
          color="#059669"
          bg="#ECFDF5"
        />

        <SummaryCard
          label="Telemetry Updates"
          value={telemetryCount}
          sub="Metric update events"
          icon={Activity}
          color="#2563EB"
          bg="#EFF6FF"
        />

        <SummaryCard
          label="Active Agents"
          value={uniqueUsers}
          sub="Reporting sources"
          icon={Radio}
          color="#7C3AED"
          bg="#F5F3FF"
        />
      </div>

      {/* =====================================================
          STREAM STATUS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <StreamStatus
          title="Audit Pipeline"
          value="ACTIVE"
          description="Security events are being collected from infrastructure telemetry."
          icon={ShieldCheck}
          color="#059669"
          background="#ECFDF5"
        />

        <StreamStatus
          title="Telemetry Agent"
          value="ONLINE"
          description="Metric updates are continuously synchronized with the monitoring layer."
          icon={Radio}
          color="#0891B2"
          background="#ECFEFF"
        />

        <StreamStatus
          title="Sync Interval"
          value="3 SECONDS"
          description="Audit records are refreshed from the live asset monitoring service."
          icon={RefreshCw}
          color="#4F46E5"
          background="#EEF2FF"
        />
      </div>

      {/* =====================================================
          AUDIT TABLE
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
                background: "#ECFEFF",
                color: "#0891B2",
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
                Event Activity
              </h3>

              <p
                style={{
                  margin: "3px 0 0",
                  color: "#94A3B8",
                  fontSize: 9.5,
                }}
              >
                Immutable infrastructure activity and telemetry trail
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
            <Clock3 size={11} />
            Live synchronization
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : logs.length === 0 ? (
          <EmptyState />
        ) : (
          <AuditTable logs={logs} formatTimestamp={formatTimestamp} />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({ label, value, sub, icon: Icon, color, bg }) {
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
   STREAM STATUS
========================================================= */

function StreamStatus({
  title,
  value,
  description,
  icon: Icon,
  color,
  background,
}) {
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
            width: 35,
            height: 35,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9,
            background,
            color,
          }}
        >
          <Icon size={17} strokeWidth={2} />
        </div>

        <div>
          <div
            style={{
              color: "#64748B",
              fontSize: 9.5,
              fontWeight: 650,
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 2,
              color,
              fontSize: 12,
              fontWeight: 750,
              letterSpacing: "0.03em",
            }}
          >
            {value}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          color: "#94A3B8",
          fontSize: 8.8,
          lineHeight: 1.45,
        }}
      >
        {description}
      </div>
    </div>
  );
}

/* =========================================================
   AUDIT TABLE
========================================================= */

function AuditTable({ logs, formatTimestamp }) {
  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          minWidth: 1050,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>TIMESTAMP</th>

            <th style={tableHeaderStyle}>USER / AGENT</th>

            <th style={tableHeaderStyle}>EVENT</th>

            <th style={tableHeaderStyle}>DETAILS</th>

            <th style={tableHeaderStyle}>SOURCE IP</th>

            <th style={tableHeaderStyle}>STATE</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              style={{
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
              }}
            >
              {/* TIMESTAMP */}

              <td style={tableCellStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <Clock3 size={13} color="#94A3B8" />

                  <span
                    className="mono"
                    style={{
                      color: "#475569",
                      fontSize: 8.8,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
              </td>

              {/* USER */}

              <td style={tableCellStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 7,
                      background:
                        log.user === "system_monitor" ? "#EEF2FF" : "#ECFEFF",
                      color:
                        log.user === "system_monitor" ? "#4F46E5" : "#0891B2",
                    }}
                  >
                    {log.user === "system_monitor" ? (
                      <ShieldCheck size={13} />
                    ) : (
                      <Radio size={13} />
                    )}
                  </div>

                  <div>
                    <div
                      className="mono"
                      style={{
                        color: "#334155",
                        fontSize: 9,
                        fontWeight: 650,
                      }}
                    >
                      {log.user}
                    </div>

                    <div
                      style={{
                        marginTop: 2,
                        color: "#94A3B8",
                        fontSize: 8,
                      }}
                    >
                      {log.user === "system_monitor"
                        ? "Monitoring service"
                        : "Telemetry service"}
                    </div>
                  </div>
                </div>
              </td>

              {/* ACTION */}

              <td style={tableCellStyle}>
                <ActionBadge action={log.action} />
              </td>

              {/* DETAILS */}

              <td
                style={{
                  ...tableCellStyle,
                  minWidth: 360,
                }}
              >
                <div
                  style={{
                    color: "#475569",
                    fontSize: 9.5,
                    lineHeight: 1.45,
                  }}
                >
                  {log.details}
                </div>
              </td>

              {/* IP */}

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
                  }}
                >
                  <Network size={11} color="#64748B" />

                  <span
                    className="mono"
                    style={{
                      color: "#64748B",
                      fontSize: 8.5,
                    }}
                  >
                    {log.ipAddress}
                  </span>
                </div>
              </td>

              {/* STATE */}

              <td style={tableCellStyle}>
                <StateBadge action={log.action} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   ACTION BADGE
========================================================= */

function ActionBadge({ action }) {
  const styles = {
    METRIC_THRESHOLD_BREACH: {
      color: "#B91C1C",
      background: "#FEF2F2",
      border: "#FECACA",
      icon: ShieldAlert,
    },

    ASSET_HEALTH_NORMAL: {
      color: "#047857",
      background: "#ECFDF5",
      border: "#D1FAE5",
      icon: CheckCircle2,
    },

    METRICS_UPDATED: {
      color: "#1D4ED8",
      background: "#EFF6FF",
      border: "#BFDBFE",
      icon: Activity,
    },
  };

  const style = styles[action] || styles.METRICS_UPDATED;

  const Icon = style.icon;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 8px",
        borderRadius: 7,
        background: style.background,
        border: `1px solid ${style.border}`,
        color: style.color,
        fontSize: 7.8,
        fontWeight: 700,
        fontFamily: "JetBrains Mono, SF Mono, Consolas, monospace",
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={11} strokeWidth={2} />

      {action}
    </span>
  );
}

/* =========================================================
   STATE BADGE
========================================================= */

function StateBadge({ action }) {
  const isBreach = action === "METRIC_THRESHOLD_BREACH";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 8px",
        borderRadius: 999,
        background: isBreach ? "#FEF2F2" : "#ECFDF5",
        color: isBreach ? "#B91C1C" : "#047857",
        fontSize: 8,
        fontWeight: 700,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: isBreach ? "#EF4444" : "#10B981",
        }}
      />

      {isBreach ? "ALERT" : "NORMAL"}
    </span>
  );
}

/* =========================================================
   LOADING STATE
========================================================= */

function LoadingState() {
  return (
    <div
      style={{
        minHeight: 280,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          background: "#ECFEFF",
          color: "#0891B2",
        }}
      >
        <RefreshCw
          size={20}
          style={{
            animation: "spin 1s linear infinite",
          }}
        />
      </div>

      <div
        style={{
          color: "#475569",
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        Loading audit trail...
      </div>

      <div
        style={{
          color: "#94A3B8",
          fontSize: 9.5,
        }}
      >
        Synchronizing infrastructure activity
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div
      style={{
        minHeight: 280,
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
          background: "#ECFEFF",
          border: "1px solid #CFFAFE",
          color: "#0891B2",
        }}
      >
        <Database size={26} strokeWidth={1.7} />
      </div>

      <h3
        style={{
          margin: "14px 0 5px",
          color: "#0F172A",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        No audit events
      </h3>

      <p
        style={{
          margin: 0,
          maxWidth: 380,
          textAlign: "center",
          color: "#64748B",
          fontSize: 10.5,
          lineHeight: 1.5,
        }}
      >
        No active infrastructure assets are currently generating audit records.
      </p>
    </div>
  );
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
