import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { averageMetrics } from "../utils/assetHelpers";

const METRIC_COLORS = {
  CPU: "#4F46E5",
  Memory: "#8B5CF6",
  Disk: "#06B6D4",
  Network: "#10B981",
};

export default function MetricsOverview({ assets }) {
  const avg = averageMetrics(assets);

  const data = [
    {
      metric: "CPU",
      value: Number(avg.cpu || 0),
    },
    {
      metric: "Memory",
      value: Number(avg.memory || 0),
    },
    {
      metric: "Disk",
      value: Number(avg.disk || 0),
    },
    {
      metric: "Network",
      value: Number(avg.network || 0),
    },
  ];

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

        padding: "18px 18px 14px",

        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",

          gap: 12,

          marginBottom: 4,
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
            Average resource usage
          </div>

          <div
            style={{
              marginTop: 4,

              color: "#94A3B8",

              fontSize: 10.5,
              fontWeight: 500,
            }}
          >
            Current infrastructure utilization
          </div>
        </div>

        {/* Status indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,

            padding: "5px 8px",

            borderRadius: 7,

            background: "#F8FAFC",
            border: "1px solid #E2E8F0",

            color: "#64748B",

            fontSize: 9.5,
            fontWeight: 650,

            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,

              borderRadius: "50%",

              background: "#10B981",
            }}
          />
          Live metrics
        </div>
      </div>

      {assets.length === 0 ? (
        <div
          style={{
            height: 220,

            display: "flex",
            flexDirection: "column",

            alignItems: "center",
            justifyContent: "center",

            color: "#94A3B8",

            fontSize: 11.5,
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

              fontSize: 18,
            }}
          >
            —
          </div>
          No assets available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={235}>
          <BarChart
            data={data}
            margin={{
              top: 18,
              right: 10,
              left: -18,
              bottom: 5,
            }}
            barCategoryGap="24%"
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#E2E8F0"
              vertical={false}
            />

            <XAxis
              dataKey="metric"
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
              unit="%"
              domain={[0, 100]}
              tick={{
                fill: "#94A3B8",
                fontSize: 9.5,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 10,

                fontSize: 11.5,

                color: "#0F172A",

                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.10)",
              }}
              cursor={{
                fill: "#F8FAFC",
              }}
              formatter={(value) => [
                `${Number(value).toFixed(1)}%`,
                "Average usage",
              ]}
            />

            <Bar dataKey="value" radius={[7, 7, 2, 2]} maxBarSize={48}>
              {data.map((entry) => (
                <Cell
                  key={entry.metric}
                  fill={METRIC_COLORS[entry.metric] || "#4F46E5"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
