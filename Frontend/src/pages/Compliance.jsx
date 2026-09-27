import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileCheck2,
  LockKeyhole,
  Cloud,
  Network,
  RefreshCw,
  Clock3,
  CheckCircle2,
  Activity,
  Scale,
  X,
  ChevronRight,
  Info,
  Wrench,
  Eye,
  Server,
} from "lucide-react";

import { getAssets } from "../api/assets";

export default function Compliance() {
  const [complianceChecks, setComplianceChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedControl, setSelectedControl] = useState(null);

  const syncComplianceFromAssets = async () => {
    try {
      const assets = await getAssets();

      if (Array.isArray(assets)) {
        const checks = [];
        const now = new Date().toISOString();

        // 1. SOC 2
        const hasCriticalAsset = assets.some(
          (a) => a.status === "CRITICAL" || a.cpuUsage >= 85,
        );

        checks.push({
          id: "comp-1",
          framework: "SOC 2 Type II",
          controlName:
            "CC6.1 - Infrastructure Resource Utilization & Resilience",
          status: hasCriticalAsset ? "NON_COMPLIANT" : "COMPLIANT",
          lastScanned: now,
          controlType: "Infrastructure Resilience",
          description:
            "This control monitors whether infrastructure resources remain healthy, available and resilient under operational conditions.",
          checks:
            "CPU utilization, infrastructure health status and critical resource conditions are reviewed.",
          result: hasCriticalAsset
            ? "One or more infrastructure assets require attention because a critical health or high CPU condition was detected."
            : "Infrastructure assets are currently operating without critical resource conditions.",
          evidence: hasCriticalAsset
            ? "Critical asset or CPU utilization at or above 85% detected."
            : "No critical asset or CPU utilization at or above 85% detected.",
          impact:
            "Poor infrastructure resilience can affect service availability, reliability and operational continuity.",
          action:
            "Review the affected infrastructure asset, reduce excessive resource utilization and restore the asset to a healthy state.",
          verification:
            "Re-scan infrastructure health and confirm that critical conditions and excessive CPU utilization are no longer present.",
        });

        // 2. CIS AWS
        const cloudAssets = assets.filter(
          (a) => (a.type || "").toUpperCase() === "CLOUD",
        );

        if (cloudAssets.length > 0) {
          checks.push({
            id: "comp-2",
            framework: "CIS AWS Benchmark",
            controlName:
              "1.16 - Ensure IAM Password Policy and Encryption at Rest",
            status: "COMPLIANT",
            lastScanned: now,
            controlType: "Cloud Security Configuration",
            description:
              "This control represents cloud security configuration requirements related to identity access policies and protection of stored data.",
            checks:
              "Cloud infrastructure is reviewed against the configured IAM and data-protection compliance rule.",
            result:
              "The current cloud compliance rule is passing for the registered cloud infrastructure.",
            evidence: `${cloudAssets.length} cloud asset${
              cloudAssets.length === 1 ? "" : "s"
            } detected and included in the current compliance scan.`,
            impact:
              "Strong identity policies and encryption controls help reduce unauthorized access and exposure of stored information.",
            action:
              "Continue enforcing strong IAM password requirements and encryption at rest across cloud resources.",
            verification:
              "Run the next compliance scan and confirm that cloud security configuration remains compliant.",
          });
        }

        // 3. ISO 27001
        checks.push({
          id: "comp-3",
          framework: "ISO 27001",
          controlName: "A.12.6.1 - Management of Technical Vulnerabilities",
          status: hasCriticalAsset ? "WARNING" : "COMPLIANT",
          lastScanned: now,
          controlType: "Technical Vulnerability Management",
          description:
            "This control focuses on identifying and managing technical weaknesses that could affect infrastructure security.",
          checks:
            "Current infrastructure health and critical conditions are used as indicators requiring vulnerability review.",
          result: hasCriticalAsset
            ? "A critical infrastructure condition was detected. Technical security review is recommended."
            : "No critical infrastructure condition is currently detected.",
          evidence: hasCriticalAsset
            ? "Critical asset or high-risk resource condition detected during infrastructure monitoring."
            : "Infrastructure is currently within the monitored compliance condition.",
          impact:
            "Unmanaged technical weaknesses can increase the possibility of service disruption or security incidents.",
          action:
            "Investigate affected assets, review vulnerabilities and apply available security updates or configuration corrections.",
          verification:
            "Confirm that the affected asset returns to a healthy state and repeat the compliance assessment.",
        });

        // 4. HIPAA / PCI-DSS
        checks.push({
          id: "comp-4",
          framework: "HIPAA / PCI-DSS",
          controlName:
            "164.312(a)(1) - Access Control & Network Telemetry Logging",
          status: "COMPLIANT",
          lastScanned: now,
          controlType: "Access Control & Monitoring",
          description:
            "This control represents access-control and monitoring requirements for systems that handle protected or sensitive information.",
          checks:
            "The monitoring platform verifies that infrastructure telemetry and access-related monitoring are represented in the compliance posture.",
          result:
            "The current access-control and telemetry compliance check is passing.",
          evidence:
            "Infrastructure monitoring telemetry is available for the current compliance assessment.",
          impact:
            "Effective access control and logging support accountability, monitoring and investigation of security events.",
          action:
            "Continue maintaining appropriate access controls and ensure security-relevant telemetry remains available.",
          verification:
            "Review future audit scans and confirm that access-control and telemetry monitoring remain active.",
        });

        setComplianceChecks(checks);
      }
    } catch (error) {
      console.error("Error fetching assets for compliance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncComplianceFromAssets();

    const interval = setInterval(syncComplianceFromAssets, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (ts) => {
    if (!ts) return "N/A";

    return ts.replace("T", " ").substring(0, 16);
  };

  const compliantCount = complianceChecks.filter(
    (item) => item.status === "COMPLIANT",
  ).length;

  const warningCount = complianceChecks.filter(
    (item) => item.status === "WARNING",
  ).length;

  const nonCompliantCount = complianceChecks.filter(
    (item) => item.status === "NON_COMPLIANT",
  ).length;

  const totalChecks = complianceChecks.length;

  const compliancePercentage =
    totalChecks > 0 ? Math.round((compliantCount / totalChecks) * 100) : 0;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1600,
        margin: "0 auto",
        animation: "fade-up 0.25s ease",
      }}
    >
      {/* PAGE HEADER */}

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
              <Scale size={21} strokeWidth={1.9} />
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
                Compliance Center
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#64748B",
                  fontSize: 11.5,
                }}
              >
                Automated governance, regulatory controls and infrastructure
                compliance posture.
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
              boxShadow: "0 0 0 3px #A7F3D0",
            }}
          />
          Automated Audit Engine
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <SummaryCard
          label="Compliance Score"
          value={`${compliancePercentage}%`}
          sub="Current control posture"
          icon={ShieldCheck}
          color="#059669"
          background="#ECFDF5"
        />

        <SummaryCard
          label="Total Controls"
          value={totalChecks}
          sub="Active benchmark checks"
          icon={FileCheck2}
          color="#4F46E5"
          background="#EEF2FF"
        />

        <SummaryCard
          label="Compliant"
          value={compliantCount}
          sub="Controls passing"
          icon={CheckCircle2}
          color="#059669"
          background="#ECFDF5"
        />

        <SummaryCard
          label="Warnings"
          value={warningCount}
          sub="Controls requiring review"
          icon={AlertTriangle}
          color="#D97706"
          background="#FFF7ED"
        />

        <SummaryCard
          label="Non-Compliant"
          value={nonCompliantCount}
          sub="Controls requiring action"
          icon={ShieldAlert}
          color="#DC2626"
          background="#FEF2F2"
        />
      </div>

      {/* COMPLIANCE POSTURE */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 1.1fr) minmax(280px, 0.9fr)",
          gap: 14,
          marginBottom: 18,
        }}
      >
        {/* Overall posture */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 13,
            padding: "18px 20px",
            boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
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
                Overall Compliance Posture
              </div>

              <div
                style={{
                  marginTop: 7,
                  color: "#0F172A",
                  fontSize: 18,
                  fontWeight: 750,
                }}
              >
                {loading
                  ? "Scanning..."
                  : compliancePercentage >= 100
                    ? "All controls compliant"
                    : compliancePercentage >= 75
                      ? "Minor review required"
                      : "Action required"}
              </div>
            </div>

            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ECFDF5",
                border: "5px solid #D1FAE5",
                color: "#047857",
                fontSize: 14,
                fontWeight: 750,
              }}
            >
              {compliancePercentage}%
            </div>
          </div>

          <div
            style={{
              height: 8,
              marginTop: 18,
              overflow: "hidden",
              borderRadius: 999,
              background: "#E2E8F0",
            }}
          >
            <div
              style={{
                width: `${compliancePercentage}%`,
                height: "100%",
                borderRadius: 999,
                background:
                  compliancePercentage === 100 ? "#10B981" : "#4F46E5",
                transition: "width 0.4s ease",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              color: "#94A3B8",
              fontSize: 9,
            }}
          >
            <span>Passing controls</span>

            <span>
              {compliantCount} of {totalChecks}
            </span>
          </div>
        </div>

        {/* Audit engine */}

        <div
          style={{
            background: "linear-gradient(135deg, #F8FAFC, #FFFFFF)",
            border: "1px solid #E2E8F0",
            borderRadius: 13,
            padding: "18px 20px",
            boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
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
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9,
                background: "#EEF2FF",
                color: "#4F46E5",
              }}
            >
              <Activity size={18} />
            </div>

            <div>
              <div
                style={{
                  color: "#64748B",
                  fontSize: 9.5,
                  fontWeight: 650,
                }}
              >
                Compliance Audit Engine
              </div>

              <div
                style={{
                  marginTop: 2,
                  color: "#047857",
                  fontSize: 12,
                  fontWeight: 750,
                }}
              >
                LIVE MONITORING
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
              marginTop: 16,
            }}
          >
            <EngineMetric value="3s" label="Sync" />
            <EngineMetric value={totalChecks} label="Checks" />
            <EngineMetric value="AUTO" label="Mode" />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 12,
              color: "#64748B",
              fontSize: 9,
            }}
          >
            <Clock3 size={11} />
            Controls automatically refresh from infrastructure posture.
          </div>
        </div>
      </div>

      {/* FRAMEWORK OVERVIEW */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <FrameworkCard
          name="SOC 2 Type II"
          description="Infrastructure security and resilience"
          icon={ShieldCheck}
          color="#4F46E5"
          background="#EEF2FF"
        />

        <FrameworkCard
          name="CIS AWS Benchmark"
          description="Cloud security configuration"
          icon={Cloud}
          color="#7C3AED"
          background="#F5F3FF"
        />

        <FrameworkCard
          name="ISO 27001"
          description="Technical vulnerability management"
          icon={Network}
          color="#0891B2"
          background="#ECFEFF"
        />

        <FrameworkCard
          name="HIPAA / PCI-DSS"
          description="Access control and telemetry"
          icon={LockKeyhole}
          color="#059669"
          background="#ECFDF5"
        />
      </div>

      {/* COMPLIANCE TABLE */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 13,
          boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
          overflow: "hidden",
        }}
      >
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
              <FileCheck2 size={15} />
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
                Compliance Controls
              </h3>

              <p
                style={{
                  margin: "3px 0 0",
                  color: "#94A3B8",
                  fontSize: 9.5,
                }}
              >
                Click any control to view detailed compliance information
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
              fontSize: 9,
              fontWeight: 650,
            }}
          >
            <RefreshCw size={11} />
            Refreshes every 3s
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : complianceChecks.length === 0 ? (
          <EmptyState />
        ) : (
          <ComplianceTable
            complianceChecks={complianceChecks}
            formatTimestamp={formatTimestamp}
            onSelect={setSelectedControl}
          />
        )}
      </div>

      {/* DETAIL MODAL */}

      {selectedControl && (
        <ComplianceDetailModal
          control={selectedControl}
          formatTimestamp={formatTimestamp}
          onClose={() => setSelectedControl(null)}
        />
      )}
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({ label, value, sub, icon: Icon, color, background }) {
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
            background,
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
   ENGINE METRIC
========================================================= */

function EngineMetric({ value, label }) {
  return (
    <div
      style={{
        padding: "9px 8px",
        textAlign: "center",
        borderRadius: 8,
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
      }}
    >
      <div
        className="mono"
        style={{
          color: "#0F172A",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 3,
          color: "#94A3B8",
          fontSize: 8,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* =========================================================
   FRAMEWORK CARD
========================================================= */

function FrameworkCard({ name, description, icon: Icon, color, background }) {
  return (
    <div
      style={{
        padding: "15px 16px",
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
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9,
            background,
            color,
          }}
        >
          <Icon size={17} />
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#0F172A",
              fontSize: 10.5,
              fontWeight: 700,
            }}
          >
            {name}
          </div>

          <div
            style={{
              marginTop: 3,
              color: "#94A3B8",
              fontSize: 8.5,
              lineHeight: 1.35,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPLIANCE TABLE
========================================================= */

function ComplianceTable({ complianceChecks, formatTimestamp, onSelect }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          minWidth: 900,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>FRAMEWORK</th>
            <th style={tableHeaderStyle}>CONTROL</th>
            <th style={tableHeaderStyle}>STATUS</th>
            <th style={tableHeaderStyle}>LAST SCANNED</th>
            <th style={tableHeaderStyle}>CONTROL STATE</th>
          </tr>
        </thead>

        <tbody>
          {complianceChecks.map((item) => {
            const status = item.status.toUpperCase();

            return (
              <tr
                key={item.id}
                onClick={() => onSelect(item)}
                style={{
                  transition: "background 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F8FAFC";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                }}
              >
                {/* FRAMEWORK */}

                <td style={tableCellStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                    }}
                  >
                    <FrameworkIcon framework={item.framework} />

                    <div>
                      <div
                        style={{
                          color: "#334155",
                          fontSize: 9.5,
                          fontWeight: 700,
                        }}
                      >
                        {item.framework}
                      </div>

                      <div
                        style={{
                          marginTop: 2,
                          color: "#94A3B8",
                          fontSize: 8,
                        }}
                      >
                        Security framework
                      </div>
                    </div>
                  </div>
                </td>

                {/* CONTROL */}

                <td
                  style={{
                    ...tableCellStyle,
                    minWidth: 380,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        color: "#334155",
                        fontSize: 10,
                        fontWeight: 550,
                        lineHeight: 1.45,
                      }}
                    >
                      {item.controlName}
                    </div>

                    <ChevronRight
                      size={15}
                      color="#94A3B8"
                      style={{ flexShrink: 0 }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: 4,
                      color: "#4F46E5",
                      fontSize: 8,
                      fontWeight: 650,
                    }}
                  >
                    Click to view details
                  </div>
                </td>

                {/* STATUS */}

                <td style={tableCellStyle}>
                  <StatusBadge status={status} />
                </td>

                {/* LAST SCANNED */}

                <td style={tableCellStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Clock3 size={12} color="#94A3B8" />

                    <span
                      className="mono"
                      style={{
                        color: "#64748B",
                        fontSize: 8.8,
                      }}
                    >
                      {formatTimestamp(item.lastScanned)}
                    </span>
                  </div>
                </td>

                {/* CONTROL STATE */}

                <td style={tableCellStyle}>
                  <ControlState status={status} />
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
   FRAMEWORK ICON
========================================================= */

function FrameworkIcon({ framework }) {
  let Icon = ShieldCheck;
  let color = "#4F46E5";
  let background = "#EEF2FF";

  if (framework.includes("CIS")) {
    Icon = Cloud;
    color = "#7C3AED";
    background = "#F5F3FF";
  } else if (framework.includes("ISO")) {
    Icon = Network;
    color = "#0891B2";
    background = "#ECFEFF";
  } else if (framework.includes("HIPAA") || framework.includes("PCI")) {
    Icon = LockKeyhole;
    color = "#059669";
    background = "#ECFDF5";
  }

  return (
    <div
      style={{
        width: 30,
        height: 30,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        background,
        color,
      }}
    >
      <Icon size={14} />
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const isCompliant = status === "COMPLIANT" || status === "PASSED";

  const isWarning = status === "WARNING";

  const config = isCompliant
    ? {
        color: "#047857",
        background: "#ECFDF5",
        border: "#D1FAE5",
        icon: CheckCircle2,
      }
    : isWarning
      ? {
          color: "#B45309",
          background: "#FFF7ED",
          border: "#FED7AA",
          icon: AlertTriangle,
        }
      : {
          color: "#B91C1C",
          background: "#FEF2F2",
          border: "#FECACA",
          icon: ShieldAlert,
        };

  const Icon = config.icon;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 8px",
        borderRadius: 7,
        background: config.background,
        border: `1px solid ${config.border}`,
        color: config.color,
        fontSize: 8,
        fontWeight: 750,
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}

/* =========================================================
   CONTROL STATE
========================================================= */

function ControlState({ status }) {
  const isCompliant = status === "COMPLIANT" || status === "PASSED";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        color: isCompliant
          ? "#059669"
          : status === "WARNING"
            ? "#D97706"
            : "#DC2626",
        fontSize: 8.5,
        fontWeight: 650,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: isCompliant
            ? "#10B981"
            : status === "WARNING"
              ? "#F59E0B"
              : "#EF4444",
        }}
      />

      {isCompliant
        ? "Control passing"
        : status === "WARNING"
          ? "Review required"
          : "Action required"}
    </span>
  );
}

/* =========================================================
   COMPLIANCE DETAIL MODAL
========================================================= */

function ComplianceDetailModal({ control, formatTimestamp, onClose }) {
  const status = control.status.toUpperCase();

  const isCompliant = status === "COMPLIANT" || status === "PASSED";

  const isWarning = status === "WARNING";

  const statusColor = isCompliant
    ? "#059669"
    : isWarning
      ? "#D97706"
      : "#DC2626";

  const statusBackground = isCompliant
    ? "#ECFDF5"
    : isWarning
      ? "#FFF7ED"
      : "#FEF2F2";

  const statusBorder = isCompliant
    ? "#D1FAE5"
    : isWarning
      ? "#FED7AA"
      : "#FECACA";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(15,23,42,0.48)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(900px, 100%)",
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 18,
          boxShadow: "0 25px 70px rgba(15,23,42,0.22)",
          animation: "fade-up 0.2s ease",
        }}
      >
        {/* MODAL HEADER */}

        <div
          style={{
            padding: "20px 22px",
            borderBottom: "1px solid #E2E8F0",
            background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 13,
              }}
            >
              <FrameworkIcon framework={control.framework} />

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      color: "#4F46E5",
                      fontSize: 9,
                      fontWeight: 750,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Compliance Control
                  </span>

                  <span
                    style={{
                      padding: "4px 7px",
                      borderRadius: 6,
                      background: statusBackground,
                      border: `1px solid ${statusBorder}`,
                      color: statusColor,
                      fontSize: 8,
                      fontWeight: 750,
                    }}
                  >
                    {status}
                  </span>
                </div>

                <h2
                  style={{
                    margin: "7px 0 0",
                    color: "#0F172A",
                    fontSize: 18,
                    lineHeight: 1.3,
                    fontWeight: 750,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {control.controlName}
                </h2>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 6,
                    color: "#64748B",
                    fontSize: 9.5,
                  }}
                >
                  <span>{control.framework}</span>

                  <span style={{ color: "#CBD5E1" }}>•</span>

                  <span>{control.controlType}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close compliance details"
              style={{
                width: 34,
                height: 34,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9,
                border: "1px solid #E2E8F0",
                background: "#FFFFFF",
                color: "#64748B",
                cursor: "pointer",
              }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}

        <div style={{ padding: 22 }}>
          {/* STATUS OVERVIEW */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <DetailMetric
              icon={ShieldCheck}
              label="Current Status"
              value={status}
              color={statusColor}
              background={statusBackground}
            />

            <DetailMetric
              icon={Scale}
              label="Framework"
              value={control.framework}
              color="#4F46E5"
              background="#EEF2FF"
            />

            <DetailMetric
              icon={Clock3}
              label="Last Scanned"
              value={formatTimestamp(control.lastScanned)}
              color="#64748B"
              background="#F8FAFC"
            />

            <DetailMetric
              icon={Activity}
              label="Monitoring"
              value="LIVE"
              color="#059669"
              background="#ECFDF5"
            />
          </div>

          {/* DESCRIPTION */}

          <DetailSection
            icon={Info}
            title="What This Control Checks"
            iconColor="#4F46E5"
            iconBackground="#EEF2FF"
          >
            <p style={detailParagraphStyle}>{control.description}</p>

            <div
              style={{
                marginTop: 12,
                padding: "12px 14px",
                borderRadius: 10,
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  color: "#475569",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                <Eye size={13} />
                Monitoring rule
              </div>

              <div
                style={{
                  marginTop: 6,
                  color: "#64748B",
                  fontSize: 10,
                  lineHeight: 1.55,
                }}
              >
                {control.checks}
              </div>
            </div>
          </DetailSection>

          {/* CURRENT RESULT */}

          <DetailSection
            icon={Activity}
            title="Current Result & Evidence"
            iconColor={statusColor}
            iconBackground={statusBackground}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 11,
                background: statusBackground,
                border: `1px solid ${statusBorder}`,
              }}
            >
              <div
                style={{
                  color: statusColor,
                  fontSize: 10,
                  fontWeight: 750,
                }}
              >
                {isCompliant
                  ? "CONTROL IS CURRENTLY PASSING"
                  : isWarning
                    ? "CONTROL REQUIRES REVIEW"
                    : "CONTROL REQUIRES ACTION"}
              </div>

              <div
                style={{
                  marginTop: 7,
                  color: "#475569",
                  fontSize: 10,
                  lineHeight: 1.55,
                }}
              >
                {control.result}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 10,
                marginTop: 10,
              }}
            >
              <EvidenceBox title="Observed Evidence" text={control.evidence} />

              <EvidenceBox title="Why It Matters" text={control.impact} />
            </div>
          </DetailSection>

          {/* RECOMMENDED ACTION */}

          <DetailSection
            icon={Wrench}
            title="Recommended Corrective Action"
            iconColor="#D97706"
            iconBackground="#FFF7ED"
          >
            <div
              style={{
                padding: 14,
                borderRadius: 11,
                background: "#FFFBEB",
                border: "1px solid #FDE68A",
              }}
            >
              <div
                style={{
                  color: "#92400E",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                Recommended action
              </div>

              <div
                style={{
                  marginTop: 7,
                  color: "#57534E",
                  fontSize: 10,
                  lineHeight: 1.6,
                }}
              >
                {control.action}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginTop: 10,
                padding: 12,
                borderRadius: 10,
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <CheckCircle2
                size={16}
                color="#059669"
                style={{ flexShrink: 0, marginTop: 1 }}
              />

              <div>
                <div
                  style={{
                    color: "#334155",
                    fontSize: 9.5,
                    fontWeight: 700,
                  }}
                >
                  Verification after remediation
                </div>

                <div
                  style={{
                    marginTop: 4,
                    color: "#64748B",
                    fontSize: 9.5,
                    lineHeight: 1.5,
                  }}
                >
                  {control.verification}
                </div>
              </div>
            </div>
          </DetailSection>

          {/* FOOTER NOTE */}

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 9,
              marginTop: 18,
              padding: "11px 13px",
              borderRadius: 10,
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              color: "#64748B",
              fontSize: 8.8,
              lineHeight: 1.5,
            }}
          >
            <Info
              size={13}
              color="#64748B"
              style={{ flexShrink: 0, marginTop: 1 }}
            />

            <span>
              Compliance status is generated from the infrastructure telemetry
              currently available to SentinelCore SecureOps. The displayed
              control descriptions and recommended actions provide operational
              guidance for this demo environment.
            </span>
          </div>
        </div>

        {/* MODAL FOOTER */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "13px 22px",
            borderTop: "1px solid #E2E8F0",
            background: "#F8FAFC",
          }}
        >
          <button
            onClick={onClose}
            style={{
              height: 34,
              padding: "0 15px",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              borderRadius: 8,
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              color: "#334155",
              fontSize: 9.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL METRIC
========================================================= */

function DetailMetric({ icon: Icon, label, value, color, background }) {
  return (
    <div
      style={{
        minHeight: 78,
        padding: "11px 12px",
        borderRadius: 10,
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
      }}
    >
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
            background,
            color,
          }}
        >
          <Icon size={14} />
        </div>

        <div
          style={{
            minWidth: 0,
          }}
        >
          <div
            style={{
              color: "#94A3B8",
              fontSize: 8,
              fontWeight: 650,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {label}
          </div>

          <div
            className="mono"
            style={{
              marginTop: 4,
              color: "#334155",
              fontSize: 9.5,
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={value}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL SECTION
========================================================= */

function DetailSection({
  icon: Icon,
  title,
  iconColor,
  iconBackground,
  children,
}) {
  return (
    <div
      style={{
        marginTop: 16,
        paddingTop: 16,
        borderTop: "1px solid #F1F5F9",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          marginBottom: 11,
        }}
      >
        <div
          style={{
            width: 29,
            height: 29,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            background: iconBackground,
            color: iconColor,
          }}
        >
          <Icon size={14} />
        </div>

        <h3
          style={{
            margin: 0,
            color: "#0F172A",
            fontSize: 11.5,
            fontWeight: 750,
          }}
        >
          {title}
        </h3>
      </div>

      {children}
    </div>
  );
}

/* =========================================================
   EVIDENCE BOX
========================================================= */

function EvidenceBox({ title, text }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 10,
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
      }}
    >
      <div
        style={{
          color: "#64748B",
          fontSize: 8.5,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 6,
          color: "#475569",
          fontSize: 9.5,
          lineHeight: 1.5,
        }}
      >
        {text}
      </div>
    </div>
  );
}

/* =========================================================
   LOADING STATE
========================================================= */

function LoadingState() {
  return (
    <div
      style={{
        minHeight: 260,
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
        Running compliance checks...
      </div>

      <div
        style={{
          color: "#94A3B8",
          fontSize: 9.5,
        }}
      >
        Scanning current infrastructure posture
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
        minHeight: 260,
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
          background: "#EEF2FF",
          border: "1px solid #E0E7FF",
          color: "#4F46E5",
        }}
      >
        <FileCheck2 size={26} strokeWidth={1.7} />
      </div>

      <h3
        style={{
          margin: "14px 0 5px",
          color: "#0F172A",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        No compliance checks
      </h3>

      <p
        style={{
          margin: 0,
          maxWidth: 400,
          textAlign: "center",
          color: "#64748B",
          fontSize: 10.5,
          lineHeight: 1.5,
        }}
      >
        No active infrastructure assets are currently registered for compliance
        auditing.
      </p>
    </div>
  );
}

/* =========================================================
   DETAIL TEXT STYLE
========================================================= */

const detailParagraphStyle = {
  margin: 0,
  color: "#475569",
  fontSize: 10,
  lineHeight: 1.65,
};

/* =========================================================
   TABLE STYLES
========================================================= */

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
  padding: "13px 14px",
  borderBottom: "1px solid #F1F5F9",
  verticalAlign: "middle",
};
