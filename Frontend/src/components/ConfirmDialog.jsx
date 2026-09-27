import { AlertTriangle, Trash2, Info, X } from "lucide-react";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  danger,
}) {
  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 15,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                flexShrink: 0,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: 10,

                background: danger ? "#FEF2F2" : "#EEF2FF",

                border: danger ? "1px solid #FECACA" : "1px solid #E0E7FF",

                color: danger ? "#DC2626" : "#4F46E5",
              }}
            >
              {danger ? (
                <Trash2 size={19} strokeWidth={2} />
              ) : (
                <Info size={19} strokeWidth={2} />
              )}
            </div>

            <div
              style={{
                minWidth: 0,
              }}
            >
              <h3
                style={{
                  margin: 0,

                  color: "#0F172A",

                  fontSize: 15,

                  fontWeight: 700,

                  lineHeight: 1.3,

                  letterSpacing: "-0.015em",
                }}
              >
                {title}
              </h3>

              <div
                style={{
                  marginTop: 4,

                  color: danger ? "#B91C1C" : "#4F46E5",

                  fontSize: 9.5,

                  fontWeight: 650,

                  textTransform: "uppercase",

                  letterSpacing: "0.045em",
                }}
              >
                {danger ? "Destructive action" : "Confirmation required"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            style={closeButtonStyle}
            aria-label="Close"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* =================================================
            MESSAGE
        ================================================= */}

        <div
          style={{
            marginTop: 18,

            padding: "12px 13px",

            background: danger ? "#FFF7F7" : "#F8FAFC",

            border: danger ? "1px solid #FEE2E2" : "1px solid #E2E8F0",

            borderRadius: 9,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",

              gap: 9,
            }}
          >
            {danger && (
              <AlertTriangle
                size={15}
                color="#DC2626"
                strokeWidth={2}
                style={{
                  marginTop: 1,
                  flexShrink: 0,
                }}
              />
            )}

            <p
              style={{
                margin: 0,

                color: "#475569",

                fontSize: 11.5,

                lineHeight: 1.55,
              }}
            >
              {message}
            </p>
          </div>
        </div>

        {/* =================================================
            WARNING
        ================================================= */}

        {danger && (
          <div
            style={{
              display: "flex",
              alignItems: "center",

              gap: 7,

              marginTop: 10,

              color: "#64748B",

              fontSize: 9.5,

              lineHeight: 1.4,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,

                flexShrink: 0,

                borderRadius: "50%",

                background: "#EF4444",
              }}
            />
            This action cannot be undone.
          </div>
        )}

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div
          style={{
            display: "flex",

            justifyContent: "flex-end",

            alignItems: "center",

            gap: 8,

            marginTop: 21,

            paddingTop: 15,

            borderTop: "1px solid #F1F5F9",
          }}
        >
          <button type="button" onClick={onCancel} style={secondaryBtnStyle}>
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              ...primaryBtnStyle,

              background: danger ? "#DC2626" : "#4F46E5",

              boxShadow: danger
                ? "0 4px 10px rgba(220, 38, 38, 0.16)"
                : "0 4px 10px rgba(79, 70, 229, 0.16)",
            }}
          >
            {danger && <Trash2 size={13} strokeWidth={2} />}

            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
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

  zIndex: 60,
};

const boxStyle = {
  width: 420,

  maxWidth: "94vw",

  padding: "20px 21px 18px",

  background: "#FFFFFF",

  border: "1px solid #E2E8F0",

  borderRadius: 14,

  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
};

const closeButtonStyle = {
  width: 30,

  height: 30,

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

const primaryBtnStyle = {
  minHeight: 34,

  display: "inline-flex",

  alignItems: "center",

  justifyContent: "center",

  gap: 6,

  border: "none",

  borderRadius: 8,

  padding: "0 13px",

  color: "#FFFFFF",

  fontSize: 10.5,

  fontWeight: 650,

  cursor: "pointer",
};

const secondaryBtnStyle = {
  minHeight: 34,

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
