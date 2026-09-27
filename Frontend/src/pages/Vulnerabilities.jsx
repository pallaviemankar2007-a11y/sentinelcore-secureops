import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Bug,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Server,
  Cloud,
  Network,
  RefreshCw,
  Activity,
  X,
  ArrowRight,
  LockKeyhole,
  Wrench,
  FileSearch,
  Target,
  CircleCheck,
  ExternalLink,
  Shield,
} from "lucide-react";

import { getAssets } from "../api/assets";

export default function Vulnerabilities() {
  const [vulnerabilities, setVulnerabilities] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =====================================================
     SELECTED VULNERABILITY
  ===================================================== */

  const [selectedVulnerability, setSelectedVulnerability] = useState(null);

  /* =====================================================
     GENERATE VULNERABILITIES FROM LIVE ASSETS
  ===================================================== */

  const syncVulnerabilitiesFromAssets = async () => {
    try {
      const assets = await getAssets();

      if (Array.isArray(assets)) {
        const generatedList = [];

        assets.forEach((asset, index) => {
          const cpu = asset.cpuUsage || 0;

          const memory = asset.memoryUsage || 0;

          const assetName = asset.name || "Unknown Asset";

          const assetType = (asset.type || "CLOUD").toUpperCase();

          /* =============================================
             1. CRITICAL / HIGH LOAD CVEs
          ============================================= */

          if (cpu >= 80 || memory >= 80) {
            generatedList.push({
              id: `vun-${index}-1`,

              cveId: `CVE-2026-${1042 + index}`,

              description:
                "Unquoted Service Path / Kernel Memory Pressure Vulnerability",

              assetName: assetName,

              assetType: assetType,

              severity: "CRITICAL",

              patchStatus: "AVAILABLE",

              cpuUsage: cpu,

              memoryUsage: memory,
            });
          }

          /* =============================================
             2. TYPE-SPECIFIC INFRASTRUCTURE CVEs
          ============================================= */

          if (assetType === "CLOUD") {
            generatedList.push({
              id: `vun-${index}-2`,

              cveId: `CVE-2026-${2189 + index}`,

              description:
                "IAM Privilege Escalation in Cloud Metadata Endpoint",

              assetName: assetName,

              assetType: assetType,

              severity: asset.status === "CRITICAL" ? "CRITICAL" : "HIGH",

              patchStatus: "APPLIED",

              cpuUsage: cpu,

              memoryUsage: memory,
            });
          } else if (assetType === "SERVER") {
            generatedList.push({
              id: `vun-${index}-2`,

              cveId: `CVE-2026-${3310 + index}`,

              description:
                "OpenSSH Remote Code Execution (RCE) via Buffer Overflow",

              assetName: assetName,

              assetType: assetType,

              severity: "HIGH",

              patchStatus: "AVAILABLE",

              cpuUsage: cpu,

              memoryUsage: memory,
            });
          } else {
            generatedList.push({
              id: `vun-${index}-2`,

              cveId: `CVE-2026-${4105 + index}`,

              description: "TLS 1.1 Weak Cipher Suite Exposure",

              assetName: assetName,

              assetType: assetType,

              severity: "MEDIUM",

              patchStatus: "PENDING",

              cpuUsage: cpu,

              memoryUsage: memory,
            });
          }
        });

        setVulnerabilities(generatedList);
      }
    } catch (error) {
      console.error("Error fetching assets for vulnerabilities:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LIVE REFRESH
  ===================================================== */

  useEffect(() => {
    syncVulnerabilitiesFromAssets();

    const interval = setInterval(syncVulnerabilitiesFromAssets, 4000);

    return () => clearInterval(interval);
  }, []);

  /* =====================================================
     SUMMARY COUNTS
  ===================================================== */

  const totalCount = vulnerabilities.length;

  const criticalCount = vulnerabilities.filter(
    (v) => v.severity === "CRITICAL",
  ).length;

  const highCount = vulnerabilities.filter((v) => v.severity === "HIGH").length;

  const mediumCount = vulnerabilities.filter(
    (v) => v.severity === "MEDIUM",
  ).length;

  const patchesAvailableCount = vulnerabilities.filter(
    (v) => v.patchStatus === "AVAILABLE",
  ).length;

  const patchesAppliedCount = vulnerabilities.filter(
    (v) => v.patchStatus === "APPLIED",
  ).length;

  const patchesPendingCount = vulnerabilities.filter(
    (v) => v.patchStatus === "PENDING",
  ).length;

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <>
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
                  Vulnerability Management
                </h2>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#64748B",
                    fontSize: 11.5,
                  }}
                >
                  Identify CVE exposure, assess severity and track remediation
                  status.
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
              background: "#F5F3FF",
              border: "1px solid #EDE9FE",
              color: "#6D28D9",
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
                background: "#8B5CF6",
                boxShadow: "0 0 0 3px #EDE9FE",
              }}
            />
            Live CVE Telemetry
          </div>
        </div>

        {/* =====================================================
            TOP SUMMARY CARDS
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
            label="Detected"
            value={totalCount}
            sub="Total vulnerabilities"
            icon={Bug}
            color="#7C3AED"
            bg="#F5F3FF"
          />

          <SummaryCard
            label="Critical"
            value={criticalCount}
            sub="Immediate attention"
            icon={ShieldAlert}
            color="#DC2626"
            bg="#FEF2F2"
          />

          <SummaryCard
            label="High"
            value={highCount}
            sub="High-risk findings"
            icon={AlertTriangle}
            color="#D97706"
            bg="#FFF7ED"
          />

          <SummaryCard
            label="Patches Ready"
            value={patchesAvailableCount}
            sub="Available to deploy"
            icon={ShieldCheck}
            color="#2563EB"
            bg="#EFF6FF"
          />
        </div>

        {/* =====================================================
            SEVERITY / PATCH OVERVIEW
        ===================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <OverviewPanel
            title="Severity Distribution"
            subtitle="Current vulnerability exposure"
            icon={ShieldAlert}
          >
            <SeverityRow
              label="Critical"
              value={criticalCount}
              total={totalCount}
              color="#DC2626"
            />

            <SeverityRow
              label="High"
              value={highCount}
              total={totalCount}
              color="#D97706"
            />

            <SeverityRow
              label="Medium"
              value={mediumCount}
              total={totalCount}
              color="#CA8A04"
            />
          </OverviewPanel>

          <OverviewPanel
            title="Patch Tracking"
            subtitle="Remediation progress"
            icon={CheckCircle2}
          >
            <PatchRow
              label="Available"
              value={patchesAvailableCount}
              color="#2563EB"
            />

            <PatchRow
              label="Applied"
              value={patchesAppliedCount}
              color="#059669"
            />

            <PatchRow
              label="Pending"
              value={patchesPendingCount}
              color="#D97706"
            />
          </OverviewPanel>
        </div>

        {/* =====================================================
            VULNERABILITY TABLE
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
                <Bug size={15} strokeWidth={2} />
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
                  Vulnerability Findings
                </h3>

                <p
                  style={{
                    margin: "3px 0 0",
                    color: "#94A3B8",
                    fontSize: 9.5,
                  }}
                >
                  Click any finding to view complete vulnerability intelligence
                  and remediation.
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
              4s scan cycle
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : vulnerabilities.length === 0 ? (
            <EmptyState />
          ) : (
            <VulnerabilityTable
              vulnerabilities={vulnerabilities}
              onSelect={setSelectedVulnerability}
            />
          )}
        </div>
      </div>

      {/* =====================================================
          VULNERABILITY DETAILS MODAL
      ===================================================== */}

      {selectedVulnerability && (
        <VulnerabilityDetails
          vulnerability={selectedVulnerability}
          onClose={() => setSelectedVulnerability(null)}
        />
      )}
    </>
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
   OVERVIEW PANEL
========================================================= */

function OverviewPanel({ title, subtitle, icon: Icon, children }) {
  return (
    <div
      style={{
        padding: "15px 17px",
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
          gap: 9,
          marginBottom: 13,
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
            color: "#64748B",
          }}
        >
          <Icon size={15} strokeWidth={2} />
        </div>

        <div>
          <div
            style={{
              color: "#0F172A",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 2,
              color: "#94A3B8",
              fontSize: 8.8,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   SEVERITY ROW
========================================================= */

function SeverityRow({ label, value, total, color }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
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

          <span
            style={{
              color: "#475569",
              fontSize: 9.5,
              fontWeight: 600,
            }}
          >
            {label}
          </span>
        </div>

        <span
          className="mono"
          style={{
            color: "#334155",
            fontSize: 9,
            fontWeight: 650,
          }}
        >
          {value}
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: 5,
          borderRadius: 999,
          background: "#F1F5F9",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
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
   PATCH ROW
========================================================= */

function PatchRow({ label, value, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 10px",
        borderRadius: 8,
        background: "#F8FAFC",
        border: "1px solid #F1F5F9",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: color,
          }}
        />

        <span
          style={{
            color: "#475569",
            fontSize: 9.5,
            fontWeight: 600,
          }}
        >
          {label}
        </span>
      </div>

      <span
        className="mono"
        style={{
          color: "#0F172A",
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   VULNERABILITY TABLE
========================================================= */

function VulnerabilityTable({ vulnerabilities, onSelect }) {
  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          minWidth: 900,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>CVE ID</th>

            <th style={tableHeaderStyle}>VULNERABILITY</th>

            <th style={tableHeaderStyle}>TARGET ASSET</th>

            <th style={tableHeaderStyle}>SEVERITY</th>

            <th style={tableHeaderStyle}>PATCH STATUS</th>

            <th style={tableHeaderStyle}>RISK</th>

            <th style={tableHeaderStyle}>VIEW</th>
          </tr>
        </thead>

        <tbody>
          {vulnerabilities.map((vulnerability) => (
            <tr
              key={vulnerability.id}
              onClick={() => onSelect(vulnerability)}
              style={{
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F8FAFC";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
              }}
            >
              {/* CVE ID */}

              <td style={tableCellStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
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
                      background: "#F5F3FF",
                      color: "#7C3AED",
                    }}
                  >
                    <Bug size={13} />
                  </div>

                  <span
                    className="mono"
                    style={{
                      color: "#6D28D9",
                      fontSize: 9.5,
                      fontWeight: 700,
                    }}
                  >
                    {vulnerability.cveId}
                  </span>
                </div>
              </td>

              {/* DESCRIPTION */}

              <td
                style={{
                  ...tableCellStyle,
                  minWidth: 300,
                }}
              >
                <div
                  style={{
                    color: "#0F172A",
                    fontSize: 10,
                    fontWeight: 650,
                    lineHeight: 1.45,
                  }}
                >
                  {vulnerability.description}
                </div>

                <div
                  style={{
                    marginTop: 3,
                    color: "#94A3B8",
                    fontSize: 8.5,
                  }}
                >
                  Click to view full vulnerability analysis
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
                  <AssetIcon type={vulnerability.assetType} />

                  <span
                    style={{
                      color: "#475569",
                      fontSize: 9.5,
                      fontWeight: 600,
                    }}
                  >
                    {vulnerability.assetName}
                  </span>
                </div>
              </td>

              {/* SEVERITY */}

              <td style={tableCellStyle}>
                <SeverityBadge severity={vulnerability.severity} />
              </td>

              {/* PATCH */}

              <td style={tableCellStyle}>
                <PatchBadge status={vulnerability.patchStatus} />
              </td>

              {/* RISK */}

              <td style={tableCellStyle}>
                <RiskIndicator
                  severity={vulnerability.severity}
                  patchStatus={vulnerability.patchStatus}
                />
              </td>

              {/* VIEW */}

              <td style={tableCellStyle}>
                <div
                  style={{
                    width: 29,
                    height: 29,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    background: "#EEF2FF",
                    border: "1px solid #E0E7FF",
                    color: "#4F46E5",
                  }}
                >
                  <ArrowRight size={14} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   VULNERABILITY DETAILS MODAL
========================================================= */

function VulnerabilityDetails({ vulnerability, onClose }) {
  const {
    cveId,
    description,
    assetName,
    assetType,
    severity,
    patchStatus,
    cpuUsage,
    memoryUsage,
  } = vulnerability;

  const severityInfo = getSeverityInfo(severity);

  const details = getVulnerabilityDetails(description, assetType, severity);

  const risk = getRiskLevel(severity, patchStatus);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        padding: 24,

        background: "rgba(15, 23, 42, 0.48)",

        backdropFilter: "blur(7px)",
        WebkitBackdropFilter: "blur(7px)",

        animation: "vulnerabilityOverlayIn 0.18s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          maxHeight: "calc(100vh - 48px)",

          display: "flex",
          flexDirection: "column",

          background: "#FFFFFF",

          border: "1px solid #DCE3ED",

          borderRadius: 18,

          boxShadow: "0 24px 70px rgba(15,23,42,0.22)",

          overflow: "hidden",

          animation: "vulnerabilityModalIn 0.22s ease",
        }}
      >
        {/* =================================================
            MODAL HEADER
        ================================================= */}

        <div
          style={{
            position: "relative",

            padding: "20px 22px 18px",

            borderBottom: "1px solid #E2E8F0",

            background: "linear-gradient(180deg,#FFFFFF 0%,#FBFCFE 100%)",
          }}
        >
          {/* top accent */}

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: severityInfo.accent,
            }}
          />

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
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  flexShrink: 0,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 12,

                  background: severityInfo.soft,

                  border: `1px solid ${severityInfo.border}`,

                  color: severityInfo.accent,
                }}
              >
                <Bug size={22} strokeWidth={1.8} />
              </div>

              <div
                style={{
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      color: "#4338CA",
                      fontSize: 12,
                      fontWeight: 750,
                    }}
                  >
                    {cveId}
                  </span>

                  <SeverityBadge severity={severity} />

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "4px 8px",
                      borderRadius: 999,
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      color: "#64748B",
                      fontSize: 8.5,
                      fontWeight: 700,
                    }}
                  >
                    <FileSearch size={11} />
                    Security Finding
                  </span>
                </div>

                <h2
                  style={{
                    margin: "8px 0 0",

                    color: "#0F172A",

                    fontSize: 19,

                    fontWeight: 750,

                    lineHeight: 1.3,

                    letterSpacing: "-0.025em",
                  }}
                >
                  {description}
                </h2>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 7,
                    color: "#64748B",
                    fontSize: 10,
                  }}
                >
                  <Target size={12} />
                  Affected asset:
                  <strong
                    style={{
                      color: "#334155",
                      fontWeight: 700,
                    }}
                  >
                    {assetName}
                  </strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close vulnerability details"
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
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F8FAFC";
                e.currentTarget.style.color = "#0F172A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.color = "#64748B";
              }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* =================================================
            MODAL BODY
        ================================================= */}

        <div
          style={{
            overflowY: "auto",
            padding: 20,

            background: "#F8FAFC",
          }}
        >
          {/* =================================================
              QUICK STATUS STRIP
          ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,minmax(0,1fr))",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <DetailStat
              label="Severity"
              value={severity}
              icon={ShieldAlert}
              color={severityInfo.accent}
              bg={severityInfo.soft}
            />

            <DetailStat
              label="Risk Level"
              value={risk.label}
              icon={Shield}
              color={risk.color}
              bg={risk.background}
            />

            <DetailStat
              label="Patch Status"
              value={patchStatus}
              icon={Wrench}
              color={getPatchColor(patchStatus)}
              bg={getPatchBackground(patchStatus)}
            />

            <DetailStat
              label="Asset Type"
              value={assetType || "INFRASTRUCTURE"}
              icon={getAssetIcon(assetType)}
              color="#4F46E5"
              bg="#EEF2FF"
            />
          </div>

          {/* =================================================
              MAIN DETAIL GRID
          ================================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1.55fr) minmax(280px,0.9fr)",
              gap: 14,
            }}
          >
            {/* LEFT COLUMN */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {/* DESCRIPTION */}

              <DetailSection
                icon={FileSearch}
                title="Vulnerability Description"
                subtitle="Security analysis"
                color="#4F46E5"
              >
                <p
                  style={{
                    margin: 0,
                    color: "#475569",
                    fontSize: 11.5,
                    lineHeight: 1.75,
                  }}
                >
                  {details.description}
                </p>
              </DetailSection>

              {/* WHY IT MATTERS */}

              <DetailSection
                icon={AlertTriangle}
                title="Why This Matters"
                subtitle="Security significance"
                color="#D97706"
              >
                <div
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: "#FFFDF8",
                    border: "1px solid #FEF3C7",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#78350F",
                      fontSize: 10.8,
                      lineHeight: 1.7,
                    }}
                  >
                    {details.whyItMatters}
                  </p>
                </div>
              </DetailSection>

              {/* POTENTIAL IMPACT */}

              <DetailSection
                icon={Target}
                title="Potential Impact"
                subtitle="Possible security consequences"
                color="#DC2626"
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
                    gap: 9,
                  }}
                >
                  {details.impacts.map((impact, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        padding: 10,
                        borderRadius: 9,
                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 6,
                          background: "#FEF2F2",
                          color: "#DC2626",
                        }}
                      >
                        <ShieldAlert size={12} />
                      </div>

                      <span
                        style={{
                          color: "#475569",
                          fontSize: 9.8,
                          lineHeight: 1.5,
                          fontWeight: 550,
                        }}
                      >
                        {impact}
                      </span>
                    </div>
                  ))}
                </div>
              </DetailSection>

              {/* REMEDIATION */}

              <DetailSection
                icon={Wrench}
                title="Recommended Remediation"
                subtitle="How to solve the vulnerability"
                color="#059669"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                  }}
                >
                  {details.remediation.map((step, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 25,
                          height: 25,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          background: "#ECFDF5",
                          border: "1px solid #D1FAE5",
                          color: "#047857",
                          fontSize: 9.5,
                          fontWeight: 750,
                        }}
                      >
                        {index + 1}
                      </div>

                      <div
                        style={{
                          padding: "3px 0",
                          color: "#334155",
                          fontSize: 10.5,
                          lineHeight: 1.6,
                        }}
                      >
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>

              {/* VERIFICATION */}

              <DetailSection
                icon={CircleCheck}
                title="Verification Steps"
                subtitle="Confirm that remediation was successful"
                color="#2563EB"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {details.verification.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 10px",
                        borderRadius: 8,
                        background: "#EFF6FF",
                        border: "1px solid #DBEAFE",
                        color: "#1E40AF",
                        fontSize: 9.8,
                        lineHeight: 1.4,
                      }}
                    >
                      <CheckCircle2 size={13} strokeWidth={2} />

                      {item}
                    </div>
                  ))}
                </div>
              </DetailSection>
            </div>

            {/* RIGHT COLUMN */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {/* SECURITY POSTURE */}

              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(15,23,42,0.035)",
                }}
              >
                <div
                  style={{
                    padding: "13px 14px",
                    borderBottom: "1px solid #E2E8F0",
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
                        width: 29,
                        height: 29,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        background: "#F5F3FF",
                        color: "#7C3AED",
                      }}
                    >
                      <Shield size={15} />
                    </div>

                    <div>
                      <div
                        style={{
                          color: "#0F172A",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        Security Posture
                      </div>

                      <div
                        style={{
                          marginTop: 2,
                          color: "#94A3B8",
                          fontSize: 8.5,
                        }}
                      >
                        Current finding assessment
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: risk.background,
                      border: `1px solid ${risk.border}`,
                    }}
                  >
                    <div
                      style={{
                        color: risk.color,
                        fontSize: 9,
                        fontWeight: 750,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Current Risk
                    </div>

                    <div
                      style={{
                        marginTop: 5,
                        color: "#0F172A",
                        fontSize: 18,
                        fontWeight: 750,
                      }}
                    >
                      {risk.label}
                    </div>

                    <div
                      style={{
                        marginTop: 5,
                        color: "#64748B",
                        fontSize: 9.5,
                        lineHeight: 1.5,
                      }}
                    >
                      {risk.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* AFFECTED ASSET */}

              <DetailSection
                icon={getAssetIcon(assetType)}
                title="Affected Asset"
                subtitle="Infrastructure target"
                color="#4F46E5"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 11,
                    borderRadius: 9,
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <AssetIcon type={assetType} />

                  <div
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        color: "#0F172A",
                        fontSize: 11,
                        fontWeight: 700,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {assetName}
                    </div>

                    <div
                      style={{
                        marginTop: 3,
                        color: "#64748B",
                        fontSize: 9,
                      }}
                    >
                      {assetType || "INFRASTRUCTURE"} RESOURCE
                    </div>
                  </div>
                </div>
              </DetailSection>

              {/* LIVE METRICS */}

              <DetailSection
                icon={Activity}
                title="Observed Metrics"
                subtitle="Latest infrastructure telemetry"
                color="#0891B2"
              >
                <MetricLine
                  label="CPU Utilization"
                  value={typeof cpuUsage === "number" ? `${cpuUsage}%` : "N/A"}
                  percentage={typeof cpuUsage === "number" ? cpuUsage : 0}
                />

                <MetricLine
                  label="Memory Utilization"
                  value={
                    typeof memoryUsage === "number" ? `${memoryUsage}%` : "N/A"
                  }
                  percentage={typeof memoryUsage === "number" ? memoryUsage : 0}
                />
              </DetailSection>

              {/* PATCH STATUS */}

              <DetailSection
                icon={Wrench}
                title="Remediation Status"
                subtitle="Patch lifecycle"
                color="#059669"
              >
                <PatchBadge status={patchStatus} />

                <p
                  style={{
                    margin: "9px 0 0",
                    color: "#64748B",
                    fontSize: 9.8,
                    lineHeight: 1.55,
                  }}
                >
                  {getPatchDescription(patchStatus)}
                </p>
              </DetailSection>
            </div>
          </div>
        </div>

        {/* =================================================
            MODAL FOOTER
        ================================================= */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 15,

            padding: "13px 20px",

            borderTop: "1px solid #E2E8F0",

            background: "#FFFFFF",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              color: "#64748B",
              fontSize: 9.5,
            }}
          >
            <LockKeyhole size={13} />
            Security remediation guidance
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,

              height: 35,
              padding: "0 14px",

              borderRadius: 9,

              border: "1px solid #CBD5E1",

              background: "#FFFFFF",

              color: "#334155",

              fontSize: 10.5,

              fontWeight: 700,

              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F8FAFC";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FFFFFF";
            }}
          >
            Close Details
          </button>
        </div>
      </div>

      {/* =================================================
          MODAL ANIMATIONS
      ================================================= */}

      <style>
        {`
          @keyframes vulnerabilityOverlayIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes vulnerabilityModalIn {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.985);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @media (max-width: 900px) {
            .vulnerability-modal-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 700px) {
            .vulnerability-detail-stats {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }
        `}
      </style>
    </div>
  );
}

/* =========================================================
   DETAIL SECTION
========================================================= */

function DetailSection({ icon: Icon, title, subtitle, color, children }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: 14,
        boxShadow: "0 1px 3px rgba(15,23,42,0.035)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          marginBottom: 12,
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
            background: `${color}10`,
            color,
          }}
        >
          <Icon size={15} strokeWidth={2} />
        </div>

        <div>
          <div
            style={{
              color: "#0F172A",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 2,
              color: "#94A3B8",
              fontSize: 8.5,
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}

/* =========================================================
   DETAIL STAT
========================================================= */

function DetailStat({ label, value, icon: Icon, color, bg }) {
  return (
    <div
      style={{
        minWidth: 0,
        padding: "11px 12px",
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <div
          style={{
            width: 25,
            height: 25,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 7,
            background: bg,
            color,
          }}
        >
          <Icon size={13} />
        </div>

        <div
          style={{
            minWidth: 0,
          }}
        >
          <div
            style={{
              color: "#94A3B8",
              fontSize: 7.8,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.045em",
            }}
          >
            {label}
          </div>

          <div
            style={{
              marginTop: 3,
              color: "#0F172A",
              fontSize: 9.5,
              fontWeight: 750,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   METRIC LINE
========================================================= */

function MetricLine({ label, value, percentage }) {
  const safePercentage = Math.max(0, Math.min(100, percentage || 0));

  const barColor =
    safePercentage >= 90
      ? "#DC2626"
      : safePercentage >= 70
        ? "#D97706"
        : "#4F46E5";

  return (
    <div
      style={{
        marginBottom: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <span
          style={{
            color: "#475569",
            fontSize: 9.5,
            fontWeight: 600,
          }}
        >
          {label}
        </span>

        <span
          className="mono"
          style={{
            color: "#0F172A",
            fontSize: 9,
            fontWeight: 700,
          }}
        >
          {value}
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: 5,
          borderRadius: 999,
          background: "#F1F5F9",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${safePercentage}%`,
            height: "100%",
            borderRadius: 999,
            background: barColor,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   VULNERABILITY DETAILS DATA
========================================================= */

function getVulnerabilityDetails(description, assetType, severity) {
  if (description.includes("Unquoted Service Path")) {
    return {
      description:
        "This finding represents a potentially unsafe service execution path combined with elevated infrastructure resource pressure. An improperly quoted service path may allow an unauthorized executable to be loaded when the affected service starts. High CPU or memory pressure can also reduce system resilience and increase the operational impact of an exploitation attempt.",

      whyItMatters:
        "A vulnerable service configuration can provide an attacker with an opportunity to execute unauthorized code under the security context of the affected service. The combination with elevated resource utilization also makes the host more difficult to operate reliably during a security event.",

      impacts: [
        "Unauthorized code execution",
        "Privilege escalation opportunities",
        "Service disruption",
        "Reduced system resilience",
      ],

      remediation: [
        "Identify the affected service and review its executable path configuration.",
        "Ensure service executable paths are properly quoted and point only to trusted locations.",
        "Review service permissions and remove unnecessary write access from service directories.",
        "Apply the latest approved operating-system and security updates.",
        "Investigate elevated CPU or memory utilization and determine whether it is expected.",
      ],

      verification: [
        "Restart the affected service and confirm normal operation.",
        "Verify the service executable path is correctly configured.",
        "Run a vulnerability scan against the affected asset.",
        "Confirm CPU and memory utilization return to expected levels.",
      ],
    };
  }

  if (description.includes("IAM Privilege Escalation")) {
    return {
      description:
        "This finding indicates a cloud identity and access management exposure involving access to a cloud metadata endpoint. An improperly protected metadata service can potentially expose temporary credentials or information that could be used to obtain permissions beyond those intended for the workload.",

      whyItMatters:
        "Cloud credentials can provide access to multiple resources depending on the assigned role. Restricting metadata access and applying least-privilege permissions reduces the possibility of an attacker moving from a compromised workload to other cloud resources.",

      impacts: [
        "Unauthorized cloud resource access",
        "Credential exposure",
        "Privilege escalation",
        "Potential lateral movement",
      ],

      remediation: [
        "Review the IAM role attached to the affected cloud resource.",
        "Apply least-privilege permissions and remove unnecessary actions.",
        "Restrict access to the cloud metadata endpoint where supported.",
        "Enable appropriate cloud audit logging and monitor unusual IAM activity.",
        "Rotate exposed credentials if there is evidence of unauthorized access.",
      ],

      verification: [
        "Confirm the workload can access only required cloud resources.",
        "Verify metadata endpoint restrictions are active.",
        "Review IAM policy permissions for excessive privileges.",
        "Perform a follow-up cloud security assessment.",
      ],
    };
  }

  if (description.includes("OpenSSH Remote Code Execution")) {
    return {
      description:
        "This finding represents a remote-code-execution risk associated with the OpenSSH service and a memory-handling weakness. A vulnerable SSH service can become a significant entry point because it is commonly exposed for remote administration.",

      whyItMatters:
        "SSH provides privileged remote access to servers. A vulnerability in the SSH service can therefore have a significant security impact, particularly when the service is exposed to untrusted networks.",

      impacts: [
        "Remote code execution",
        "Unauthorized server access",
        "Potential privilege escalation",
        "Server compromise",
      ],

      remediation: [
        "Identify the installed OpenSSH version on the affected server.",
        "Upgrade OpenSSH to the vendor-approved patched version.",
        "Restart the SSH service after applying the approved update.",
        "Restrict SSH access using network controls and trusted administrative sources.",
        "Review authentication logs for suspicious or unexpected connection attempts.",
      ],

      verification: [
        "Confirm the patched OpenSSH version is installed.",
        "Verify the SSH service is operating normally.",
        "Run a vulnerability scan to confirm the finding is resolved.",
        "Review recent SSH authentication events.",
      ],
    };
  }

  if (description.includes("TLS 1.1 Weak Cipher")) {
    return {
      description:
        "This finding indicates that the network service may permit TLS 1.1 or other weak cryptographic configurations. Older TLS protocols and weak cipher suites provide less robust protection for data transmitted between systems.",

      whyItMatters:
        "Weak encryption settings can reduce the confidentiality and integrity of network communications and may expose systems to downgrade or cryptographic attacks.",

      impacts: [
        "Reduced transport security",
        "Potential downgrade attacks",
        "Weak encryption",
        "Sensitive data exposure",
      ],

      remediation: [
        "Disable TLS 1.0 and TLS 1.1 where they are not required.",
        "Enable TLS 1.2 and TLS 1.3 where supported.",
        "Remove weak and deprecated cipher suites.",
        "Review certificates and secure protocol configuration.",
        "Test all dependent applications before enforcing the new configuration.",
      ],

      verification: [
        "Run a TLS configuration scan.",
        "Confirm deprecated TLS protocols are disabled.",
        "Verify approved cipher suites are active.",
        "Perform an application connectivity test.",
      ],
    };
  }

  return {
    description: `The security monitoring engine identified a ${severity.toLowerCase()}-severity infrastructure finding on the affected ${(
      assetType || "infrastructure"
    ).toLowerCase()} resource. The finding should be reviewed and remediated according to the organization's approved security procedures.`,

    whyItMatters:
      "Unresolved vulnerabilities can increase the attack surface of an infrastructure environment and may create opportunities for unauthorized access or service disruption.",

    impacts: [
      "Increased attack surface",
      "Unauthorized access",
      "Potential service disruption",
      "Security control degradation",
    ],

    remediation: [
      "Identify the affected component and confirm the vulnerability.",
      "Apply the vendor-approved security update or configuration change.",
      "Review related access controls and security configuration.",
      "Run a follow-up security assessment.",
    ],

    verification: [
      "Confirm the remediation has been applied.",
      "Review system security logs.",
      "Perform a follow-up vulnerability scan.",
      "Confirm normal infrastructure operation.",
    ],
  };
}

/* =========================================================
   SEVERITY INFO
========================================================= */

function getSeverityInfo(severity) {
  if (severity === "CRITICAL") {
    return {
      accent: "#DC2626",
      soft: "#FEF2F2",
      border: "#FECACA",
    };
  }

  if (severity === "HIGH") {
    return {
      accent: "#D97706",
      soft: "#FFF7ED",
      border: "#FED7AA",
    };
  }

  return {
    accent: "#CA8A04",
    soft: "#FEFCE8",
    border: "#FEF08A",
  };
}

/* =========================================================
   RISK LEVEL
========================================================= */

function getRiskLevel(severity, patchStatus) {
  if (severity === "CRITICAL" && patchStatus !== "APPLIED") {
    return {
      label: "URGENT",
      color: "#DC2626",
      background: "#FEF2F2",
      border: "#FECACA",
      description:
        "Immediate remediation is recommended because the finding is critical and has not yet been marked as applied.",
    };
  }

  if (severity === "HIGH" && patchStatus !== "APPLIED") {
    return {
      label: "ELEVATED",
      color: "#D97706",
      background: "#FFF7ED",
      border: "#FED7AA",
      description:
        "The finding represents elevated security exposure and should be addressed through the normal remediation workflow.",
    };
  }

  if (patchStatus === "APPLIED") {
    return {
      label: "CONTROLLED",
      color: "#059669",
      background: "#ECFDF5",
      border: "#D1FAE5",
      description:
        "The associated patch is marked as applied. Continue monitoring and verify the remediation.",
    };
  }

  return {
    label: "MONITORED",
    color: "#2563EB",
    background: "#EFF6FF",
    border: "#DBEAFE",
    description:
      "The finding remains under security monitoring and should be addressed according to remediation priority.",
  };
}

/* =========================================================
   PATCH DESCRIPTION
========================================================= */

function getPatchDescription(status) {
  if (status === "APPLIED") {
    return "The remediation record indicates that the applicable patch has been applied. A follow-up verification scan should still be performed.";
  }

  if (status === "AVAILABLE") {
    return "A security patch is available for deployment. The recommended next step is to validate the patch in the approved environment and deploy it through the normal change process.";
  }

  return "The remediation is currently pending. Review the finding, confirm the appropriate vendor update or configuration change, and schedule remediation.";
}

/* =========================================================
   PATCH COLORS
========================================================= */

function getPatchColor(status) {
  if (status === "APPLIED") {
    return "#047857";
  }

  if (status === "AVAILABLE") {
    return "#1D4ED8";
  }

  return "#B45309";
}

function getPatchBackground(status) {
  if (status === "APPLIED") {
    return "#ECFDF5";
  }

  if (status === "AVAILABLE") {
    return "#EFF6FF";
  }

  return "#FFF7ED";
}

/* =========================================================
   ASSET ICON
========================================================= */

function AssetIcon({ type }) {
  const normalized = (type || "").toUpperCase();

  let Icon = Server;

  if (normalized === "CLOUD") {
    Icon = Cloud;
  } else if (normalized === "NETWORK") {
    Icon = Network;
  }

  return (
    <div
      style={{
        width: 27,
        height: 27,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 7,
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
        color: "#64748B",
      }}
    >
      <Icon size={13} />
    </div>
  );
}

/* =========================================================
   GET ASSET ICON
========================================================= */

function getAssetIcon(type) {
  const normalized = (type || "").toUpperCase();

  if (normalized === "CLOUD") {
    return Cloud;
  }

  if (normalized === "NETWORK") {
    return Network;
  }

  return Server;
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

    MEDIUM: {
      color: "#A16207",
      background: "#FEFCE8",
      border: "#FEF08A",
      dot: "#EAB308",
    },
  };

  const style = styles[severity] || styles.MEDIUM;

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
   PATCH BADGE
========================================================= */

function PatchBadge({ status }) {
  const styles = {
    AVAILABLE: {
      color: "#1D4ED8",
      background: "#EFF6FF",
      border: "#BFDBFE",
      dot: "#3B82F6",
    },

    APPLIED: {
      color: "#047857",
      background: "#ECFDF5",
      border: "#D1FAE5",
      dot: "#10B981",
    },

    PENDING: {
      color: "#B45309",
      background: "#FFF7ED",
      border: "#FED7AA",
      dot: "#F59E0B",
    },
  };

  const style = styles[status] || styles.PENDING;

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
   RISK INDICATOR
========================================================= */

function RiskIndicator({ severity, patchStatus }) {
  let label = "MONITORED";

  let color = "#059669";

  let background = "#ECFDF5";

  if (severity === "CRITICAL" && patchStatus !== "APPLIED") {
    label = "URGENT";
    color = "#DC2626";
    background = "#FEF2F2";
  } else if (severity === "HIGH" && patchStatus !== "APPLIED") {
    label = "ELEVATED";
    color = "#D97706";
    background = "#FFF7ED";
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 8px",
        borderRadius: 999,
        background,
        color,
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: "0.03em",
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

      {label}
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
          background: "#F5F3FF",
          color: "#7C3AED",
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
        Scanning infrastructure...
      </div>

      <div
        style={{
          color: "#94A3B8",
          fontSize: 9.5,
        }}
      >
        Evaluating current CVE exposure
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
        <ShieldCheck size={26} strokeWidth={1.7} />
      </div>

      <h3
        style={{
          margin: "14px 0 5px",
          color: "#0F172A",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        No vulnerabilities detected
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
        No active infrastructure assets are currently available for
        vulnerability evaluation.
      </p>
    </div>
  );
}

/* =========================================================
   CARD STYLE
========================================================= */

const cardStyle = {
  width: "100%",

  background: "#FFFFFF",

  border: "1px solid #E2E8F0",

  borderRadius: 13,

  boxShadow: "0 2px 6px rgba(15,23,42,0.04)",

  overflow: "hidden",
};

/* =========================================================
   TABLE HEADER STYLE
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

/* =========================================================
   TABLE CELL STYLE
========================================================= */

const tableCellStyle = {
  padding: "12px 14px",

  borderBottom: "1px solid #F1F5F9",

  verticalAlign: "middle",
};
