import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* =========================================================
   COLORS
========================================================= */

const STATUS_COLORS = {
  HEALTHY: "#10B981",
  WARNING: "#F59E0B",
  CRITICAL: "#EF4444",
};

const TYPE_COLORS = {
  SERVER: "#4F46E5",
  CLOUD: "#8B5CF6",
  NETWORK: "#06B6D4",
};

/* =========================================================
   TOOLTIP
========================================================= */

const tooltipStyle = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 10,
  fontSize: 11.5,
  color: "#0F172A",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.10)",
};

/* =========================================================
   STATUS PIE CHART
========================================================= */

export function StatusPieChart({ counts }) {
  const data = Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([status, value]) => ({
      name: status,
      value,
    }));

  if (data.length === 0) {
    return <EmptyChart label="No assets available" />;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      style={{
        width: "100%",
        height: 270,
        position: "relative",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="46%"
            innerRadius={62}
            outerRadius={88}
            paddingAngle={4}
            cornerRadius={5}
            stroke="#FFFFFF"
            strokeWidth={3}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={STATUS_COLORS[entry.name] || "#94A3B8"}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [value, name]}
          />

          <Legend
            verticalAlign="bottom"
            height={34}
            iconType="circle"
            iconSize={7}
            formatter={(value) => (
              <span
                style={{
                  color: "#475569",
                  fontSize: 10.5,
                  fontWeight: 600,
                  marginLeft: 2,
                }}
              >
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center information */}
      <div
        style={{
          position: "absolute",
          top: "46%",
          left: "50%",

          transform: "translate(-50%, -50%)",

          textAlign: "center",

          pointerEvents: "none",
        }}
      >
        <div
          className="mono"
          style={{
            color: "#0F172A",
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {total}
        </div>

        <div
          style={{
            marginTop: 4,
            color: "#94A3B8",
            fontSize: 9.5,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Assets
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ASSETS BY TYPE BAR CHART
========================================================= */

export function TypeBarChart({ assets }) {
  const counts = assets.reduce(
    (acc, asset) => ({
      ...acc,
      [asset.type]: (acc[asset.type] || 0) + 1,
    }),
    {},
  );

  const data = Object.entries(counts).map(([type, value]) => ({
    type,
    value,
  }));

  if (data.length === 0) {
    return <EmptyChart label="No assets available" />;
  }

  return (
    <div
      style={{
        width: "100%",
        height: 270,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 12,
            right: 12,
            left: -18,
            bottom: 8,
          }}
          barCategoryGap="28%"
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#E2E8F0"
            vertical={false}
          />

          <XAxis
            dataKey="type"
            tick={{
              fill: "#64748B",
              fontSize: 10.5,
              fontWeight: 600,
            }}
            axisLine={{
              stroke: "#E2E8F0",
            }}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={{
              fill: "#94A3B8",
              fontSize: 10,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{
              fill: "#F8FAFC",
            }}
            formatter={(value) => [value, "Assets"]}
          />

          <Bar dataKey="value" radius={[7, 7, 2, 2]} maxBarSize={52}>
            {data.map((entry) => (
              <Cell
                key={entry.type}
                fill={TYPE_COLORS[entry.type] || "#4F46E5"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* =========================================================
   EMPTY CHART
========================================================= */

function EmptyChart({ label }) {
  return (
    <div
      style={{
        height: 270,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        color: "#94A3B8",

        fontSize: 11.5,
        fontWeight: 500,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          marginBottom: 10,

          borderRadius: "50%",

          background: "#F8FAFC",
          border: "1px solid #E2E8F0",

          color: "#CBD5E1",
        }}
      >
        —
      </div>

      {label}
    </div>
  );
}
