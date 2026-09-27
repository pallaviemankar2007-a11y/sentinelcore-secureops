import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

import { getAtRiskAssets } from "../utils/assetHelpers";

const severityStyle = {
  CRITICAL: {
    color: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
    icon: ShieldAlert,
  },

  WARNING: {
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    icon: AlertTriangle,
  },
};

export default function AlertsPanel({ assets, limit = 4 }) {
  const atRisk = getAtRiskAssets(assets).slice(0, limit);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 300,

        background: "#FFFFFF",

        border: "1px solid #E2E8F0",
        borderRadius: 14,

        boxShadow: "0 2px 6px rgba(15, 23, 42, 0.045)",

        padding: "18px",

        overflow: "hidden",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",

          gap: 12,

          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              color: "#0F172A",

              fontSize: 13,
              fontWeight: 700,

              lineHeight: 1.3,
            }}
          >
            Assets needing attention
          </div>

          <div
            style={{
              marginTop: 4,

              color: "#94A3B8",

              fontSize: 10.5,
              fontWeight: 500,
            }}
          >
            Active infrastructure warnings
          </div>
        </div>

        {/* Alert count */}
        <div
          style={{
            minWidth: 27,
            height: 27,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            padding: "0 8px",

            borderRadius: 8,

            background: atRisk.length > 0 ? "#FEF2F2" : "#ECFDF5",

            border:
              atRisk.length > 0 ? "1px solid #FECACA" : "1px solid #D1FAE5",

            color: atRisk.length > 0 ? "#DC2626" : "#047857",

            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {atRisk.length}
        </div>
      </div>

      {/* =================================================
          NO ALERTS
      ================================================= */}

      {atRisk.length === 0 ? (
        <div
          style={{
            minHeight: 210,

            display: "flex",
            flexDirection: "column",

            alignItems: "center",
            justifyContent: "center",

            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              marginBottom: 11,

              borderRadius: "50%",

              background: "#ECFDF5",
              border: "1px solid #D1FAE5",

              color: "#059669",
            }}
          >
            <ShieldCheck size={22} strokeWidth={1.9} />
          </div>

          <div
            style={{
              color: "#0F172A",

              fontSize: 12,
              fontWeight: 650,
            }}
          >
            Everything is healthy
          </div>

          <div
            style={{
              marginTop: 5,

              color: "#94A3B8",

              fontSize: 10.5,
              fontWeight: 500,
            }}
          >
            No assets currently require attention.
          </div>
        </div>
      ) : (
        /* =================================================
           ALERT LIST
        ================================================= */

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {atRisk.map((asset) => {
            const severity =
              severityStyle[asset.status] || severityStyle.WARNING;

            const Icon = severity.icon;

            return (
              <div
                key={asset.assetId}
                style={{
                  display: "flex",
                  alignItems: "center",

                  gap: 10,

                  minHeight: 55,

                  padding: "9px 10px",

                  borderRadius: 10,

                  background: severity.bg,

                  border: `1px solid ${severity.border}`,

                  transition: "transform 0.16s ease, box-shadow 0.16s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";

                  e.currentTarget.style.boxShadow =
                    "0 4px 10px rgba(15, 23, 42, 0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";

                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Severity icon */}
                <div
                  style={{
                    width: 30,
                    height: 30,

                    flexShrink: 0,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    borderRadius: 8,

                    background: "#FFFFFF",

                    border: `1px solid ${severity.border}`,

                    color: severity.color,
                  }}
                >
                  <Icon size={16} strokeWidth={2} />
                </div>

                {/* Asset information */}
                <div
                  style={{
                    flex: 1,
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
                    {asset.name}
                  </div>

                  <div
                    style={{
                      marginTop: 3,

                      color: "#64748B",

                      fontSize: 10,

                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {asset.trigger?.metric || "Resource usage"} at{" "}
                    {asset.trigger?.value ?? 0}%
                  </div>
                </div>

                {/* Severity */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",

                    gap: 5,

                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,

                      fontWeight: 750,

                      color: severity.color,

                      textTransform: "uppercase",

                      letterSpacing: "0.04em",
                    }}
                  >
                    {asset.status}
                  </span>

                  <ArrowUpRight
                    size={12}
                    color={severity.color}
                    strokeWidth={2}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      {atRisk.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",

            gap: 6,

            marginTop: 12,
            paddingTop: 10,

            borderTop: "1px solid #F1F5F9",

            color: "#94A3B8",

            fontSize: 9.5,
            fontWeight: 500,
          }}
        >
          <ShieldAlert size={12} color="#94A3B8" />
          Showing the {Math.min(atRisk.length, limit)} most recent assets
          requiring attention.
        </div>
      )}
    </div>
  );
}
