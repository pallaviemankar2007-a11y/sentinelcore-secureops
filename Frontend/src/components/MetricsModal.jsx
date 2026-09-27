import { useState } from "react";
import { X, Cpu, MemoryStick, HardDrive, Activity, Gauge } from "lucide-react";

export default function MetricsModal({ asset, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState({
    cpuUsage: asset.cpuUsage ?? 0,
    memoryUsage: asset.memoryUsage ?? 0,
    diskUsage: asset.diskUsage ?? 0,
    networkUsage: asset.networkUsage ?? 0,
  });

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      cpuUsage: Number(form.cpuUsage),
      memoryUsage: Number(form.memoryUsage),
      diskUsage: Number(form.diskUsage),
      networkUsage: Number(form.networkUsage),
    });
  }

  const metrics = [
    {
      field: "cpuUsage",
      label: "CPU Usage",
      description: "Processor utilization",
      icon: Cpu,
      color: "#4F46E5",
      bg: "#EEF2FF",
    },
    {
      field: "memoryUsage",
      label: "Memory Usage",
      description: "RAM utilization",
      icon: MemoryStick,
      color: "#8B5CF6",
      bg: "#F5F3FF",
    },
    {
      field: "diskUsage",
      label: "Disk Usage",
      description: "Storage utilization",
      icon: HardDrive,
      color: "#0891B2",
      bg: "#ECFEFF",
    },
    {
      field: "networkUsage",
      label: "Network Usage",
      description: "Network utilization",
      icon: Activity,
      color: "#059669",
      bg: "#ECFDF5",
    },
  ];

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* =================================================
            HEADER
        ================================================= */}

        <div style={headerStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                flexShrink: 0,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: 10,

                background: "#EEF2FF",

                border: "1px solid #E0E7FF",

                color: "#4F46E5",
              }}
            >
              <Gauge size={19} strokeWidth={2} />
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <h2
                style={{
                  margin: 0,

                  color: "#0F172A",

                  fontSize: 16,

                  fontWeight: 700,

                  lineHeight: 1.25,

                  letterSpacing: "-0.015em",
                }}
              >
                Update Live Metrics
              </h2>

              <p
                className="mono"
                style={{
                  margin: "4px 0 0",

                  color: "#64748B",

                  fontSize: 10,

                  lineHeight: 1.3,

                  overflow: "hidden",

                  textOverflow: "ellipsis",

                  whiteSpace: "nowrap",
                }}
              >
                {asset.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={closeButtonStyle}
            aria-label="Close"
          >
            <X size={17} strokeWidth={2} />
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "19px 21px 20px",
          }}
        >
          {/* Information box */}

          <div
            style={{
              display: "flex",

              alignItems: "flex-start",

              gap: 9,

              marginBottom: 17,

              padding: "11px 12px",

              background: "#F8FAFC",

              border: "1px solid #E2E8F0",

              borderRadius: 9,
            }}
          >
            <Activity
              size={15}
              color="#4F46E5"
              strokeWidth={2}
              style={{
                marginTop: 1,
                flexShrink: 0,
              }}
            />

            <div>
              <div
                style={{
                  color: "#334155",

                  fontSize: 10.5,

                  fontWeight: 650,

                  lineHeight: 1.4,
                }}
              >
                Monitoring telemetry
              </div>

              <p
                style={{
                  margin: "3px 0 0",

                  color: "#64748B",

                  fontSize: 9.5,

                  lineHeight: 1.5,
                }}
              >
                Enter the latest resource utilization values. These values
                simulate fresh telemetry reported by the monitoring agent.
              </p>

              <div
                className="mono"
                style={{
                  marginTop: 6,

                  display: "inline-block",

                  padding: "3px 6px",

                  borderRadius: 5,

                  background: "#FFFFFF",

                  border: "1px solid #E2E8F0",

                  color: "#64748B",

                  fontSize: 8.5,
                }}
              >
                PUT /api/monitoring/
                {"{assetId}"}
              </div>
            </div>
          </div>

          {/* =================================================
              METRIC CARDS
          ================================================= */}

          <div
            style={{
              display: "grid",

              gridTemplateColumns: "1fr 1fr",

              gap: 10,
            }}
          >
            {metrics.map((metric) => {
              const Icon = metric.icon;

              const value = Number(form[metric.field]) || 0;

              return (
                <MetricField
                  key={metric.field}
                  metric={metric}
                  value={value}
                  onChange={(newValue) => update(metric.field, newValue)}
                />
              );
            })}
          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div
            style={{
              display: "flex",

              alignItems: "center",

              justifyContent: "flex-end",

              gap: 8,

              marginTop: 20,

              paddingTop: 15,

              borderTop: "1px solid #F1F5F9",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={secondaryBtnStyle}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...primaryBtnStyle,

                opacity: submitting ? 0.65 : 1,

                cursor: submitting ? "default" : "pointer",
              }}
            >
              {submitting ? (
                <>
                  <span
                    style={{
                      width: 12,
                      height: 12,

                      border: "2px solid rgba(255,255,255,0.4)",

                      borderTopColor: "#FFFFFF",

                      borderRadius: "50%",

                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Updating...
                </>
              ) : (
                <>
                  <Activity size={13} strokeWidth={2} />
                  Update Metrics
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   METRIC FIELD
========================================================= */

function MetricField({ metric, value, onChange }) {
  const Icon = metric.icon;

  return (
    <div
      style={{
        padding: 11,

        background: "#FFFFFF",

        border: "1px solid #E2E8F0",

        borderRadius: 10,

        boxShadow: "0 1px 2px rgba(15,23,42,0.025)",
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          gap: 8,

          marginBottom: 9,
        }}
      >
        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: 7,

            minWidth: 0,
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

              background: metric.bg,

              color: metric.color,
            }}
          >
            <Icon size={14} strokeWidth={2} />
          </div>

          <div
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                color: "#334155",

                fontSize: 10,

                fontWeight: 700,

                lineHeight: 1.25,
              }}
            >
              {metric.label}
            </div>

            <div
              style={{
                marginTop: 2,

                color: "#94A3B8",

                fontSize: 8.5,

                lineHeight: 1.2,

                whiteSpace: "nowrap",

                overflow: "hidden",

                textOverflow: "ellipsis",
              }}
            >
              {metric.description}
            </div>
          </div>
        </div>

        <span
          className="mono"
          style={{
            color: metric.color,

            fontSize: 12,

            fontWeight: 700,
          }}
        >
          {value}%
        </span>
      </div>

      {/* Input */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: 8,
        }}
      >
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={value === 0 ? formSafeValue(value) : value}
          onChange={(e) => {
            const raw = e.target.value;

            if (raw === "") {
              onChange(0);
              return;
            }

            const number = Math.min(100, Math.max(0, Number(raw)));

            onChange(Number.isNaN(number) ? 0 : number);
          }}
          style={metricInputStyle}
          aria-label={metric.label}
        />

        <div
          style={{
            flex: 1,

            height: 6,

            overflow: "hidden",

            borderRadius: 999,

            background: "#F1F5F9",
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, value))}%`,

              height: "100%",

              borderRadius: 999,

              background: metric.color,

              transition: "width 0.2s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/*
 * Keeps the input controlled with a numeric value
 * while still allowing the backend behavior to remain
 * unchanged.
 */
function formSafeValue(value) {
  return value ?? 0;
}

/* =========================================================
   STYLES
========================================================= */

const overlayStyle = {
  position: "fixed",

  inset: 0,

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  padding: 20,

  background: "rgba(15, 23, 42, 0.42)",

  backdropFilter: "blur(3px)",

  WebkitBackdropFilter: "blur(3px)",

  zIndex: 50,
};

const modalStyle = {
  width: 500,

  maxWidth: "94vw",

  maxHeight: "92vh",

  overflowY: "auto",

  background: "#FFFFFF",

  border: "1px solid #E2E8F0",

  borderRadius: 14,

  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",

  overflow: "hidden",
};

const headerStyle = {
  display: "flex",

  alignItems: "center",

  justifyContent: "space-between",

  gap: 15,

  padding: "16px 20px",

  background: "#FFFFFF",

  borderBottom: "1px solid #E2E8F0",
};

const closeButtonStyle = {
  width: 31,

  height: 31,

  flexShrink: 0,

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  padding: 0,

  border: "1px solid #E2E8F0",

  borderRadius: 8,

  background: "#FFFFFF",

  color: "#64748B",

  cursor: "pointer",
};

const metricInputStyle = {
  width: 72,

  height: 32,

  padding: "0 8px",

  border: "1px solid #CBD5E1",

  borderRadius: 7,

  outline: "none",

  background: "#FFFFFF",

  color: "#0F172A",

  fontSize: 11,

  fontWeight: 650,

  fontFamily: "JetBrains Mono, SF Mono, Consolas, monospace",

  textAlign: "center",
};

const primaryBtnStyle = {
  minHeight: 35,

  display: "inline-flex",

  alignItems: "center",

  justifyContent: "center",

  gap: 7,

  minWidth: 125,

  border: "none",

  borderRadius: 8,

  padding: "0 13px",

  background: "linear-gradient(135deg, #4F46E5, #6366F1)",

  color: "#FFFFFF",

  fontSize: 10.5,

  fontWeight: 650,

  boxShadow: "0 4px 10px rgba(79, 70, 229, 0.18)",
};

const secondaryBtnStyle = {
  minHeight: 35,

  display: "inline-flex",

  alignItems: "center",

  justifyContent: "center",

  border: "1px solid #E2E8F0",

  borderRadius: 8,

  padding: "0 13px",

  background: "#FFFFFF",

  color: "#475569",

  fontSize: 10.5,

  fontWeight: 600,

  cursor: "pointer",
};
