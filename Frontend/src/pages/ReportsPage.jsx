import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Database,
  BarChart3,
  Activity,
  Clock3,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  HardDrive,
  CalendarDays,
} from "lucide-react";

export default function ReportsPage() {
  const [reportsList, setReportsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/reports");

      if (response.ok) {
        const data = await response.json();

        setReportsList(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownload = (report) => {
    // Direct download trigger from backend endpoint
    window.open(
      `http://localhost:8080/api/reports/download/${report.id}`,
      "_blank",
    );
  };

  const totalReports = reportsList.length;

  const csvReports = reportsList.filter(
    (report) => String(report.type || "").toUpperCase() === "CSV",
  ).length;

  const totalSize = reportsList.reduce((total, report) => {
    const size = String(report.size || "");

    const numeric = parseFloat(size);

    if (Number.isNaN(numeric)) {
      return total;
    }

    if (size.toUpperCase().includes("MB")) {
      return total + numeric * 1024;
    }

    return total + numeric;
  }, 0);

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
              <FileText size={21} strokeWidth={1.9} />
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
                System Reports
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#64748B",
                  fontSize: 11.5,
                }}
              >
                Infrastructure telemetry, asset health and operational summary
                reports.
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
          Live DB Sync
        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <SummaryCard
          label="Total Reports"
          value={totalReports}
          sub="Available system reports"
          icon={FileText}
          color="#4F46E5"
          background="#EEF2FF"
        />

        <SummaryCard
          label="CSV Reports"
          value={csvReports}
          sub="Downloadable CSV files"
          icon={FileSpreadsheet}
          color="#059669"
          background="#ECFDF5"
        />

        <SummaryCard
          label="Report Storage"
          value={totalSize > 0 ? `${Math.round(totalSize)} KB` : "—"}
          sub="Approximate report size"
          icon={HardDrive}
          color="#7C3AED"
          background="#F5F3FF"
        />

        <SummaryCard
          label="Database"
          value="ONLINE"
          sub="Report service connected"
          icon={Database}
          color="#0891B2"
          background="#ECFEFF"
        />
      </div>

      {/* =====================================================
          REPORT SERVICE STATUS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 1.15fr) minmax(260px, 0.85fr)",
          gap: 14,
          marginBottom: 18,
        }}
      >
        {/* Report service */}

        <div
          style={{
            background: "linear-gradient(135deg, #FFFFFF, #F8FAFC)",
            border: "1px solid #E2E8F0",
            borderRadius: 13,
            padding: "17px 19px",
            boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 15,
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
                  width: 37,
                  height: 37,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 9,
                  background: "#EEF2FF",
                  color: "#4F46E5",
                }}
              >
                <BarChart3 size={18} />
              </div>

              <div>
                <div
                  style={{
                    color: "#64748B",
                    fontSize: 9.5,
                    fontWeight: 650,
                  }}
                >
                  Report Generation Service
                </div>

                <div
                  style={{
                    marginTop: 2,
                    color: "#059669",
                    fontSize: 12,
                    fontWeight: 750,
                  }}
                >
                  OPERATIONAL
                </div>
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 8px",
                borderRadius: 999,
                background: "#ECFDF5",
                border: "1px solid #D1FAE5",
                color: "#047857",
                fontSize: 8.5,
                fontWeight: 700,
              }}
            >
              <CheckCircle2 size={11} />
              READY
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
              marginTop: 15,
            }}
          >
            <ServiceMetric
              icon={Database}
              value={reportsList.length}
              label="Reports"
            />

            <ServiceMetric icon={Activity} value="LIVE" label="Telemetry" />

            <ServiceMetric icon={Download} value="CSV" label="Export" />
          </div>
        </div>

        {/* Sync information */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 13,
            padding: "17px 19px",
            boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
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
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9,
                background: "#ECFEFF",
                color: "#0891B2",
              }}
            >
              <RefreshCw size={17} />
            </div>

            <div>
              <div
                style={{
                  color: "#64748B",
                  fontSize: 9.5,
                  fontWeight: 650,
                }}
              >
                Database Report Sync
              </div>

              <div
                style={{
                  marginTop: 2,
                  color: "#0F172A",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Connected to backend
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginTop: 15,
              color: "#64748B",
              fontSize: 9,
            }}
          >
            <Clock3 size={11} />
            Reports are loaded directly from the database service.
          </div>
        </div>
      </div>

      {/* =====================================================
          REPORT TABLE
      ===================================================== */}

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
              <FileText size={15} />
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
                Available Reports
              </h3>

              <p
                style={{
                  margin: "3px 0 0",
                  color: "#94A3B8",
                  fontSize: 9.5,
                }}
              >
                Download generated infrastructure reports
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
            <FileSpreadsheet size={11} />
            CSV Export
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : reportsList.length === 0 ? (
          <EmptyState />
        ) : (
          <ReportsTable
            reportsList={reportsList}
            handleDownload={handleDownload}
          />
        )}
      </div>
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
              fontSize: 24,
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
   SERVICE METRIC
========================================================= */

function ServiceMetric({ icon: Icon, value, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 9px",
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 8,
      }}
    >
      <Icon size={13} color="#64748B" />

      <div>
        <div
          className="mono"
          style={{
            color: "#0F172A",
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {value}
        </div>

        <div
          style={{
            marginTop: 2,
            color: "#94A3B8",
            fontSize: 7.5,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REPORT TABLE
========================================================= */

function ReportsTable({ reportsList, handleDownload }) {
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
            <th style={tableHeaderStyle}>REPORT ID</th>

            <th style={tableHeaderStyle}>REPORT NAME</th>

            <th style={tableHeaderStyle}>FORMAT</th>

            <th style={tableHeaderStyle}>GENERATED DATE</th>

            <th style={tableHeaderStyle}>FILE SIZE</th>

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
          {reportsList.map((report) => (
            <tr
              key={report.id}
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
              {/* REPORT ID */}

              <td style={tableCellStyle}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "5px 8px",
                    borderRadius: 7,
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <FileText size={11} color="#4F46E5" />

                  <span
                    className="mono"
                    style={{
                      color: "#475569",
                      fontSize: 8.8,
                      fontWeight: 650,
                    }}
                  >
                    {report.id}
                  </span>
                </div>
              </td>

              {/* NAME */}

              <td
                style={{
                  ...tableCellStyle,
                  minWidth: 230,
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                      background: "#EEF2FF",
                      color: "#4F46E5",
                    }}
                  >
                    <BarChart3 size={14} />
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#334155",
                        fontSize: 10,
                        fontWeight: 650,
                      }}
                    >
                      {report.name}
                    </div>

                    <div
                      style={{
                        marginTop: 2,
                        color: "#94A3B8",
                        fontSize: 8,
                      }}
                    >
                      Infrastructure report
                    </div>
                  </div>
                </div>
              </td>

              {/* FORMAT */}

              <td style={tableCellStyle}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 8px",
                    borderRadius: 7,
                    background: "#ECFDF5",
                    border: "1px solid #D1FAE5",
                    color: "#047857",
                    fontSize: 8,
                    fontWeight: 750,
                  }}
                >
                  <FileSpreadsheet size={11} />

                  {report.type}
                </span>
              </td>

              {/* DATE */}

              <td style={tableCellStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  <CalendarDays size={12} color="#94A3B8" />

                  <span
                    className="mono"
                    style={{
                      color: "#64748B",
                      fontSize: 8.7,
                    }}
                  >
                    {report.generatedAt}
                  </span>
                </div>
              </td>

              {/* SIZE */}

              <td style={tableCellStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <HardDrive size={12} color="#94A3B8" />

                  <span
                    className="mono"
                    style={{
                      color: "#64748B",
                      fontSize: 8.7,
                    }}
                  >
                    {report.size}
                  </span>
                </div>
              </td>

              {/* DOWNLOAD */}

              <td
                style={{
                  ...tableCellStyle,
                  textAlign: "right",
                }}
              >
                <button
                  onClick={() => handleDownload(report)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    height: 31,
                    padding: "0 10px",
                    borderRadius: 8,
                    background: "#4F46E5",
                    border: "1px solid #4338CA",
                    color: "#FFFFFF",
                    fontSize: 8.5,
                    fontWeight: 650,
                    boxShadow: "0 2px 5px rgba(79,70,229,0.18)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4338CA";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#4F46E5";
                  }}
                >
                  <Download size={13} />
                  Download CSV
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
        Syncing report data...
      </div>

      <div
        style={{
          color: "#94A3B8",
          fontSize: 9.5,
        }}
      >
        Loading reports from the backend service
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
          background: "#EEF2FF",
          border: "1px solid #E0E7FF",
          color: "#4F46E5",
        }}
      >
        <FileText size={26} strokeWidth={1.7} />
      </div>

      <h3
        style={{
          margin: "14px 0 5px",
          color: "#0F172A",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        No reports available
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
        No assets or generated reports were found in the database.
      </p>
    </div>
  );
}

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
