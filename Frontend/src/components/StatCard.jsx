import React from "react";

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "#4F46E5",
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: 132,

        padding: "18px 18px 16px",

        background: "#FFFFFF",

        border: "1px solid #E2E8F0",
        borderRadius: 14,

        boxShadow: "0 2px 6px rgba(15, 23, 42, 0.045)",

        overflow: "hidden",

        transition:
          "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";

        e.currentTarget.style.boxShadow = "0 8px 20px rgba(15, 23, 42, 0.08)";

        e.currentTarget.style.borderColor = "#CBD5E1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";

        e.currentTarget.style.boxShadow = "0 2px 6px rgba(15, 23, 42, 0.045)";

        e.currentTarget.style.borderColor = "#E2E8F0";
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: accent,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div
          style={{
            minWidth: 0,
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: 11,
              fontWeight: 650,
              letterSpacing: "0.035em",
              textTransform: "uppercase",
              lineHeight: 1.3,
            }}
          >
            {label}
          </div>

          <div
            className="mono"
            style={{
              marginTop: 9,
              color: "#0F172A",
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.035em",
            }}
          >
            {value}
          </div>
        </div>

        {/* Icon */}
        {Icon && (
          <div
            style={{
              width: 38,
              height: 38,
              flexShrink: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: 10,

              background: `${accent}12`,
              border: `1px solid ${accent}25`,

              color: accent,
            }}
          >
            <Icon size={19} strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Bottom information */}
      <div
        style={{
          marginTop: 12,

          display: "flex",
          alignItems: "center",

          gap: 7,

          minWidth: 0,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            flexShrink: 0,

            borderRadius: "50%",

            background: accent,
          }}
        />

        <span
          style={{
            color: "#64748B",

            fontSize: 10.5,
            fontWeight: 500,

            lineHeight: 1.3,

            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {sub}
        </span>
      </div>
    </div>
  );
}
