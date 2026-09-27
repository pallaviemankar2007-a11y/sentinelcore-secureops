import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Activity,
  Server,
  Users,
  ArrowRight,
  RefreshCw,
  CircleDot,
} from "lucide-react";

import { getAssets } from "../api/assets";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const syncIncidentsFromAssets = async () => {
    try {
      // Fetch live registered assets from Spring Boot backend
      const assets = await getAssets();

      if (Array.isArray(assets)) {
        // Dynamically map incidents based on real asset metrics
        const dynamicIncidents = assets.map((asset, index) => {
          const isCritical =
            asset.status === "CRITICAL" || asset.cpuUsage >= 85;

          const isWarning = asset.status === "WARNING" || asset.cpuUsage >= 70;

          let title = "Normal Operation Monitoring";

          let severity = "LOW";

          let status = "RESOLVED";

          if (isCritical) {
            title = `Critical Threshold Breach (CPU: ${asset.cpuUsage}%)`;
            severity = "CRITICAL";
            status = "OPEN";
          } else if (isWarning) {
            title = `High Resource Consumption (CPU: ${asset.cpuUsage}%)`;
            severity = "HIGH";
            status = "IN_PROGRESS";
          }

          return {
            id: asset.id || `inc-${index}`,

            ticketId: `INC-${(asset.name || "ASSET").toUpperCase().slice(-6)}`,

            title: title,

            assetName: asset.name || "Unknown Node",

            severity: severity,

            status: status,

            assignedTo: isCritical ? "Security Ops Center" : "Unassigned",

            lastChecked: asset.lastCheckedAt || new Date().toLocaleTimeString(),
          };
        });

        setIncidents(dynamicIncidents);
      }
    } catch (error) {
      console.error("Error fetching dynamic incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncIncidentsFromAssets();

    // Polling sync every 3 seconds
    const interval = setInterval(syncIncidentsFromAssets, 3000);

    return () => clearInterval(interval);
  }, []);

  const toggleStatus = (id, currentStatus) => {
    const nextStatus =
      currentStatus === "OPEN"
        ? "IN_PROGRESS"
        : currentStatus === "IN_PROGRESS"
          ? "RESOLVED"
          : "OPEN";

    setIncidents((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
            }
          : item,
      ),
    );
  };

  const criticalCount = incidents.filter(
    (item) => item.severity === "CRITICAL",
  ).length;

  const highCount = incidents.filter((item) => item.severity === "HIGH").length;

  const openCount = incidents.filter((item) => item.status === "OPEN").length;

  const inProgressCount = incidents.filter(
    (item) => item.status === "IN_PROGRESS",
  ).length;

  const resolvedCount = incidents.filter(
    (item) => item.status === "RESOLVED",
  ).length;

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
                background: "#EEF2FF",
                border: "1px solid #E0E7FF",
                color: "#4F46E5",
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
                Incident Management
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#64748B",
                  fontSize: 11.5,
                }}
              >
                Monitor, investigate and manage infrastructure incidents in real
                time.
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
            background: "#ECFDF5",
            border: "1px solid #D1FAE5",
            color: "#047857",
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
              background: "#10B981",
              boxShadow: "0 0 0 3px #D1FAE5",
            }}
          />
          Live Asset Monitoring
        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <SummaryCard
          label="Total Incidents"
          value={incidents.length}
          sub="Monitored assets"
          icon={ShieldAlert}
          color="#4F46E5"
          bg="#EEF2FF"
        />

        <SummaryCard
          label="Critical"
          value={criticalCount}
          sub="Immediate attention"
          icon={AlertTriangle}
          color="#DC2626"
          bg="#FEF2F2"
        />

        <SummaryCard
          label="High"
          value={highCount}
          sub="Requires investigation"
          icon={Activity}
          color="#D97706"
          bg="#FFF7ED"
        />

        <SummaryCard
          label="Open"
          value={openCount}
          sub="Awaiting action"
          icon={Clock3}
          color="#DC2626"
          bg="#FEF2F2"
        />

        <SummaryCard
          label="Resolved"
          value={resolvedCount}
          sub="Closed incidents"
          icon={CheckCircle2}
          color="#059669"
          bg="#ECFDF5"
        />
      </div>

      {/* =====================================================
          INCIDENT WORKFLOW
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <WorkflowCard
          label="Open"
          value={openCount}
          description="Incidents requiring immediate action"
          icon={ShieldAlert}
          color="#DC2626"
          background="#FEF2F2"
        />

        <WorkflowCard
          label="In Progress"
          value={inProgressCount}
          description="Incidents currently being handled"
          icon={Activity}
          color="#4F46E5"
          background="#EEF2FF"
        />

        <WorkflowCard
          label="Resolved"
          value={resolvedCount}
          description="Incidents successfully closed"
          icon={CheckCircle2}
          color="#059669"
          background="#ECFDF5"
        />
      </div>

      {/* =====================================================
          INCIDENT TABLE
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
                background: "#EEF2FF",
                color: "#4F46E5",
              }}
            >
              <Server size={15} strokeWidth={2} />
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
                Incident Queue
              </h3>

              <p
                style={{
                  margin: "3px 0 0",
                  color: "#94A3B8",
                  fontSize: 9.5,
                }}
              >
                Live incidents generated from infrastructure telemetry
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
            <RefreshCw size={11} />
            3s sync
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : incidents.length === 0 ? (
          <EmptyState />
        ) : (
          <IncidentTable incidents={incidents} onToggleStatus={toggleStatus} />
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
   WORKFLOW CARD
========================================================= */

function WorkflowCard({
  label,
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
            {value}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          color: "#94A3B8",
          fontSize: 8.8,
          lineHeight: 1.4,
        }}
      >
        {description}
      </div>
    </div>
  );
}

/* =========================================================
   INCIDENT TABLE
========================================================= */

function IncidentTable({ incidents, onToggleStatus }) {
  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          minWidth: 1000,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>TICKET ID</th>

            <th style={tableHeaderStyle}>INCIDENT / TRIGGER</th>

            <th style={tableHeaderStyle}>TARGET ASSET</th>

            <th style={tableHeaderStyle}>SEVERITY</th>

            <th style={tableHeaderStyle}>STATUS</th>

            <th style={tableHeaderStyle}>ASSIGNED TEAM</th>

            <th style={tableHeaderStyle}>LAST CHECK</th>

            <th
              style={{
                ...tableHeaderStyle,
                textAlign: "right",
              }}
            >
              ACTION
            </th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((incident) => (
            <tr
              key={incident.id}
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
              {/* TICKET */}

              <td style={tableCellStyle}>
                <span
                  className="mono"
                  style={{
                    color: "#4F46E5",
                    fontSize: 9.5,
                    fontWeight: 700,
                  }}
                >
                  {incident.ticketId}
                </span>
              </td>

              {/* TITLE */}

              <td
                style={{
                  ...tableCellStyle,
                  minWidth: 240,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 9,
                  }}
                >
                  <div
                    style={{
                      width: 27,
                      height: 27,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 7,
                      background:
                        incident.severity === "CRITICAL"
                          ? "#FEF2F2"
                          : incident.severity === "HIGH"
                            ? "#FFF7ED"
                            : "#ECFDF5",
                      color:
                        incident.severity === "CRITICAL"
                          ? "#DC2626"
                          : incident.severity === "HIGH"
                            ? "#D97706"
                            : "#059669",
                    }}
                  >
                    {incident.severity === "CRITICAL" ? (
                      <AlertTriangle size={14} />
                    ) : incident.severity === "HIGH" ? (
                      <Activity size={14} />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#0F172A",
                        fontSize: 10,
                        fontWeight: 650,
                        lineHeight: 1.4,
                      }}
                    >
                      {incident.title}
                    </div>

                    <div
                      style={{
                        marginTop: 3,
                        color: "#94A3B8",
                        fontSize: 8.5,
                      }}
                    >
                      Infrastructure telemetry evaluation
                    </div>
                  </div>
                </div>
              </td>

              {/* ASSET */}

              <td style={tableCellStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <Server size={14} color="#64748B" />

                  <span
                    style={{
                      color: "#334155",
                      fontSize: 9.5,
                      fontWeight: 600,
                    }}
                  >
                    {incident.assetName}
                  </span>
                </div>
              </td>

              {/* SEVERITY */}

              <td style={tableCellStyle}>
                <SeverityBadge severity={incident.severity} />
              </td>

              {/* STATUS */}

              <td style={tableCellStyle}>
                <StatusBadge status={incident.status} />
              </td>

              {/* TEAM */}

              <td style={tableCellStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Users size={13} color="#64748B" />

                  <span
                    style={{
                      color: "#475569",
                      fontSize: 9,
                      fontWeight: 550,
                    }}
                  >
                    {incident.assignedTo}
                  </span>
                </div>
              </td>

              {/* LAST CHECK */}

              <td style={tableCellStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    color: "#64748B",
                    fontSize: 8.8,
                  }}
                >
                  <Clock3 size={12} />

                  {incident.lastChecked}
                </div>
              </td>

              {/* ACTION */}

              <td
                style={{
                  ...tableCellStyle,
                  textAlign: "right",
                }}
              >
                <button
                  type="button"
                  onClick={() => onToggleStatus(incident.id, incident.status)}
                  style={actionButtonStyle}
                >
                  {incident.status === "OPEN"
                    ? "Start"
                    : incident.status === "IN_PROGRESS"
                      ? "Resolve"
                      : "Reopen"}

                  <ArrowRight size={12} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   SEVERITY BADGE
========================================================= */

function SeverityBadge({ severity }) {
  const styles = {
    CRITICAL: {
      color: "#B91C1C",
      background: "#FEF2F2",
      border: "#FECACA",
      dot: "#EF4444",
    },

    HIGH: {
      color: "#B45309",
      background: "#FFF7ED",
      border: "#FED7AA",
      dot: "#F59E0B",
    },

    LOW: {
      color: "#047857",
      background: "#ECFDF5",
      border: "#D1FAE5",
      dot: "#10B981",
    },
  };

  const style = styles[severity] || styles.LOW;

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

      {severity}
    </span>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const styles = {
    OPEN: {
      color: "#B91C1C",
      background: "#FEF2F2",
      border: "#FECACA",
      dot: "#EF4444",
    },

    IN_PROGRESS: {
      color: "#4338CA",
      background: "#EEF2FF",
      border: "#E0E7FF",
      dot: "#6366F1",
    },

    RESOLVED: {
      color: "#047857",
      background: "#ECFDF5",
      border: "#D1FAE5",
      dot: "#10B981",
    },
  };

  const style = styles[status] || styles.RESOLVED;

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

      {formatStatus(status)}
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
          background: "#EEF2FF",
          color: "#4F46E5",
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
        Loading live incidents...
      </div>

      <div
        style={{
          color: "#94A3B8",
          fontSize: 9.5,
        }}
      >
        Synchronizing with infrastructure telemetry
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
        No incidents to display
      </h3>

      <p
        style={{
          margin: 0,
          maxWidth: 370,
          textAlign: "center",
          color: "#64748B",
          fontSize: 10.5,
          lineHeight: 1.5,
        }}
      >
        No registered assets are currently available for incident monitoring.
      </p>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatStatus(status) {
  if (status === "IN_PROGRESS") {
    return "IN PROGRESS";
  }

  return status;
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

const actionButtonStyle = {
  display: "inline-flex",

  alignItems: "center",

  gap: 5,

  height: 29,

  padding: "0 9px",

  border: "1px solid #E2E8F0",

  borderRadius: 7,

  background: "#FFFFFF",

  color: "#475569",

  fontSize: 8.5,

  fontWeight: 650,

  cursor: "pointer",

  boxShadow: "0 1px 2px rgba(15,23,42,0.03)",
};
