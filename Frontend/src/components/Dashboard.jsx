import { Server, ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";
import StatCard from "./StatCard";
import { StatusPieChart, TypeBarChart } from "./AssetCharts";
import MetricsOverview from "./MetricsOverview";
import AlertsPanel from "./AlertsPanel";

export default function Dashboard({ assets, counts, uptimePct, onGoToAssets }) {
  const recent = [...assets]
    .sort(
      (a, b) => new Date(b.lastCheckedAt || 0) - new Date(a.lastCheckedAt || 0),
    )
    .slice(0, 5);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1600,
        margin: "0 auto",
        padding: "24px",
      }}
    >
      {/* =========================
          STAT CARDS
      ========================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard
          label="Total assets"
          value={assets.length}
          sub="Devices registered"
          icon={Server}
          accent="#4F46E5"
        />

        <StatCard
          label="Healthy"
          value={counts.HEALTHY}
          sub="No action needed"
          icon={ShieldCheck}
          accent="#0F9F8F"
        />

        <StatCard
          label="Warning"
          value={counts.WARNING}
          sub="Worth a look"
          icon={AlertTriangle}
          accent="#D97706"
        />

        <StatCard
          label="Critical"
          value={counts.CRITICAL}
          sub="Needs attention"
          icon={ShieldAlert}
          accent="#DC2626"
        />
      </div>

      {/* =========================
          CHARTS
      ========================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <ChartCard title="Status distribution">
          <StatusPieChart counts={counts} />
        </ChartCard>

        <ChartCard title="Assets by type">
          <TypeBarChart assets={assets} />
        </ChartCard>
      </div>

      {/* =========================
          METRICS + ALERTS
      ========================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <MetricsOverview assets={assets} />
        </div>

        <div style={{ minWidth: 0 }}>
          <AlertsPanel assets={assets} />
        </div>
      </div>

      {/* =========================
          UPTIME + RECENTLY CHECKED
      ========================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 1fr) minmax(380px, 2fr)",
          gap: 20,
          alignItems: "stretch",
        }}
      >
        {/* Uptime Card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
            minHeight: 150,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#475569",
              marginBottom: 8,
            }}
          >
            Estimated uptime
          </div>

          <div
            className="mono"
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: "#0F172A",
              lineHeight: 1.2,
            }}
          >
            {assets.length ? `${uptimePct}%` : "—"}
          </div>

          <div
            style={{
              fontSize: 11.5,
              color: "#64748B",
              marginTop: 8,
              lineHeight: 1.5,
            }}
          >
            Calculated from live asset status — not a fixed target.
          </div>
        </div>

        {/* Recently Checked Card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#475569",
              }}
            >
              Recently checked
            </span>

            <button
              onClick={onGoToAssets}
              style={{
                background: "transparent",
                border: "none",
                color: "#4F46E5",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                padding: 4,
                whiteSpace: "nowrap",
              }}
            >
              View all assets →
            </button>
          </div>

          {recent.length === 0 ? (
            <p
              style={{
                fontSize: 12.5,
                color: "#64748B",
                margin: 0,
                padding: "12px 0",
              }}
            >
              No assets yet — add one from the Assets page.
            </p>
          ) : (
            <div>
              {recent.map((a, index) => (
                <div
                  key={a.assetId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "11px 0",
                    borderBottom:
                      index === recent.length - 1
                        ? "none"
                        : "1px solid #E2E8F0",
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      fontSize: 12.5,
                      color: "#0F172A",
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.name}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: statusText(a.status),
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS TEXT COLORS
   ========================================================= */

function statusText(status) {
  if (status === "HEALTHY") return "#0F9F8F";
  if (status === "WARNING") return "#D97706";
  return "#DC2626";
}

/* =========================================================
   CHART CARD
   ========================================================= */

function ChartCard({ title, children }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#334155",
          marginBottom: 12,
        }}
      >
        {title}
      </div>

      {children}
    </div>
  );
}
