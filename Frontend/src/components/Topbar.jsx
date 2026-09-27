import { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, Clock3 } from "lucide-react";

export default function Topbar({ title, subtitle, backendUp, lastSync, user }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const initial = user?.username?.[0]?.toUpperCase() || "?";

  return (
    <header
      style={{
        width: "100%",
        minHeight: 72,

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        gap: 24,

        padding: "12px 28px",

        background: "#FFFFFF",

        borderBottom: "1px solid #E2E8F0",

        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.025)",

        flexShrink: 0,

        position: "relative",
        zIndex: 20,
      }}
    >
      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <div
        style={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <h1
            style={{
              margin: 0,

              color: "#0F172A",

              fontSize: 19,
              fontWeight: 700,

              lineHeight: 1.2,

              letterSpacing: "-0.025em",

              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </h1>

          {/* Live indicator */}
          {backendUp === true && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,

                padding: "4px 8px",

                borderRadius: 999,

                background: "#ECFDF5",

                border: "1px solid #D1FAE5",

                color: "#047857",

                fontSize: 9.5,
                fontWeight: 700,

                letterSpacing: "0.04em",

                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,

                  borderRadius: "50%",

                  background: "#10B981",

                  boxShadow: "0 0 0 2px #A7F3D0",
                }}
              />
              Live
            </span>
          )}
        </div>

        {subtitle && (
          <p
            style={{
              margin: "4px 0 0",

              color: "#64748B",

              fontSize: 11.5,

              lineHeight: 1.4,

              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div
        style={{
          display: "flex",
          alignItems: "center",

          gap: 10,

          flexShrink: 0,
        }}
      >
        {/* Backend status */}
        <BackendStatus up={backendUp} lastSync={lastSync} />

        {/* Time */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,

            height: 36,

            padding: "0 11px",

            borderRadius: 9,

            background: "#F8FAFC",

            border: "1px solid #E2E8F0",

            color: "#475569",

            fontSize: 11.5,
            fontWeight: 600,

            whiteSpace: "nowrap",
          }}
        >
          <Clock3 size={14} strokeWidth={1.8} color="#64748B" />

          <span className="mono">{now.toLocaleTimeString()}</span>
        </div>

        {/* User */}
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",

              gap: 9,

              height: 40,

              padding: "3px 9px 3px 4px",

              borderRadius: 11,

              background: "#FFFFFF",

              border: "1px solid #E2E8F0",

              boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 32,
                height: 32,

                flexShrink: 0,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: "50%",

                background: "linear-gradient(135deg, #4F46E5, #6366F1)",

                color: "#FFFFFF",

                fontSize: 12,
                fontWeight: 700,

                boxShadow: "0 3px 8px rgba(79, 70, 229, 0.2)",
              }}
            >
              {initial}
            </div>

            {/* User information */}
            <div
              style={{
                minWidth: 70,
                maxWidth: 130,
              }}
            >
              <div
                style={{
                  color: "#0F172A",

                  fontSize: 11.5,
                  fontWeight: 650,

                  lineHeight: 1.25,

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.username}
              </div>

              <div
                style={{
                  marginTop: 2,

                  color: "#64748B",

                  fontSize: 9.5,
                  fontWeight: 500,

                  lineHeight: 1.2,

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.role}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* =========================================================
   BACKEND STATUS
   ========================================================= */

function BackendStatus({ up, lastSync }) {
  if (up === null) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,

          height: 36,

          padding: "0 11px",

          borderRadius: 9,

          background: "#F8FAFC",

          border: "1px solid #E2E8F0",

          color: "#64748B",

          fontSize: 10.5,
          fontWeight: 600,

          whiteSpace: "nowrap",
        }}
      >
        <RefreshCw
          size={13}
          style={{
            animation: "spin 1.2s linear infinite",
          }}
        />
        Connecting...
      </div>
    );
  }

  if (up) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,

          height: 36,

          padding: "0 11px",

          borderRadius: 9,

          background: "#ECFDF5",

          border: "1px solid #D1FAE5",

          color: "#047857",

          fontSize: 10.5,
          fontWeight: 600,

          whiteSpace: "nowrap",
        }}
      >
        <Wifi size={14} strokeWidth={2} />

        <span>System online</span>

        {lastSync && (
          <span
            style={{
              color: "#6B7280",
              fontWeight: 500,
            }}
          >
            · {lastSync.toLocaleTimeString()}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,

        height: 36,

        padding: "0 11px",

        borderRadius: 9,

        background: "#FEF2F2",

        border: "1px solid #FECACA",

        color: "#B91C1C",

        fontSize: 10.5,
        fontWeight: 600,

        whiteSpace: "nowrap",
      }}
    >
      <WifiOff size={14} strokeWidth={2} />
      Backend offline
    </div>
  );
}
