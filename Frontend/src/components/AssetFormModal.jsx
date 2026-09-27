import { useState } from "react";
import { X, Server, Cloud, Network, ShieldCheck } from "lucide-react";

const TYPES = [
  {
    value: "SERVER",
    label: "Server",
    description: "Physical or virtual server",
    icon: Server,
    color: "#4F46E5",
    bg: "#EEF2FF",
  },
  {
    value: "CLOUD",
    label: "Cloud",
    description: "Cloud infrastructure resource",
    icon: Cloud,
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
  {
    value: "NETWORK",
    label: "Network",
    description: "Router or network device",
    icon: Network,
    color: "#0891B2",
    bg: "#ECFEFF",
  },
];

export default function AssetFormModal({
  initialAsset,
  onClose,
  onSubmit,
  submitting,
}) {
  const isEdit = Boolean(initialAsset);

  const [form, setForm] = useState({
    name: initialAsset?.name || "",
    type: initialAsset?.type || "SERVER",
    ipAddress: initialAsset?.ipAddress || "",
  });

  const [error, setError] = useState("");

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Asset name is required.");
      return;
    }

    setError("");

    onSubmit({
      ...initialAsset,

      name: form.name.trim(),

      type: form.type,

      ipAddress: form.ipAddress.trim(),
    });
  }

  const selectedType =
    TYPES.find((item) => item.value === form.type) || TYPES[0];

  return (
    <div style={overlayStyle}>
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

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: 10,

                background: "#EEF2FF",

                border: "1px solid #E0E7FF",

                color: "#4F46E5",
              }}
            >
              {isEdit ? (
                <Server size={18} strokeWidth={2} />
              ) : (
                <ShieldCheck size={18} strokeWidth={2} />
              )}
            </div>

            <div>
              <h2
                style={{
                  margin: 0,

                  color: "#0F172A",

                  fontSize: 16,
                  fontWeight: 700,

                  letterSpacing: "-0.015em",
                }}
              >
                {isEdit ? "Edit Asset" : "Add New Asset"}
              </h2>

              <p
                style={{
                  margin: "3px 0 0",

                  color: "#64748B",

                  fontSize: 10.5,

                  lineHeight: 1.4,
                }}
              >
                {isEdit
                  ? "Update infrastructure asset details."
                  : "Register a resource for infrastructure monitoring."}
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
            padding: "20px 22px 21px",
          }}
        >
          {/* Asset name */}

          <Field label="Asset Name" required>
            <div style={inputWrapperStyle}>
              <Server size={15} color="#94A3B8" />

              <input
                autoFocus
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. PROD-DB-SRV-01"
                style={inputStyle}
              />
            </div>
          </Field>

          {/* Asset type */}

          <Field label="Asset Type" required>
            <div
              style={{
                display: "grid",

                gridTemplateColumns: "repeat(3, 1fr)",

                gap: 7,
              }}
            >
              {TYPES.map((type) => {
                const Icon = type.icon;

                const selected = form.type === type.value;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => update("type", type.value)}
                    style={{
                      position: "relative",

                      minHeight: 76,

                      display: "flex",

                      flexDirection: "column",

                      alignItems: "center",

                      justifyContent: "center",

                      gap: 6,

                      padding: 8,

                      borderRadius: 9,

                      border: selected
                        ? `1.5px solid ${type.color}`
                        : "1px solid #E2E8F0",

                      background: selected ? type.bg : "#FFFFFF",

                      color: selected ? type.color : "#64748B",

                      cursor: "pointer",

                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.9} />

                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                      }}
                    >
                      {type.label}
                    </span>

                    {selected && (
                      <span
                        style={{
                          position: "absolute",

                          top: 6,
                          right: 6,

                          width: 5,
                          height: 5,

                          borderRadius: "50%",

                          background: type.color,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 7,

                color: "#94A3B8",

                fontSize: 9.5,
              }}
            >
              {selectedType.description}
            </div>
          </Field>

          {/* IP Address */}

          <Field label="IP Address / Hostname">
            <div style={inputWrapperStyle}>
              <Network size={15} color="#94A3B8" />

              <input
                value={form.ipAddress}
                onChange={(e) => update("ipAddress", e.target.value)}
                placeholder="e.g. 192.168.1.50 or db.internal"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                marginTop: 5,

                color: "#94A3B8",

                fontSize: 9.5,
              }}
            >
              Optional. You can enter an IP address or hostname.
            </div>
          </Field>

          {/* Error */}

          {error && (
            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: 8,

                marginTop: 4,
                marginBottom: 4,

                padding: "9px 10px",

                borderRadius: 8,

                background: "#FEF2F2",

                border: "1px solid #FECACA",

                color: "#B91C1C",

                fontSize: 10.5,

                fontWeight: 550,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,

                  flexShrink: 0,

                  borderRadius: "50%",

                  background: "#EF4444",
                }}
              />

              {error}
            </div>
          )}

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div
            style={{
              display: "flex",

              alignItems: "center",

              justifyContent: "space-between",

              gap: 10,

              marginTop: 20,

              paddingTop: 16,

              borderTop: "1px solid #F1F5F9",
            }}
          >
            <div
              style={{
                color: "#94A3B8",

                fontSize: 9.5,
              }}
            >
              {isEdit
                ? "Changes will update this monitored asset."
                : "The asset will be added to monitoring."}
            </div>

            <div
              style={{
                display: "flex",
                gap: 7,
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
                    Saving...
                  </>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Create Asset"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({ label, children, required }) {
  return (
    <div
      style={{
        marginBottom: 17,
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",

          gap: 3,

          marginBottom: 7,

          color: "#475569",

          fontSize: 9.5,

          fontWeight: 700,

          textTransform: "uppercase",

          letterSpacing: "0.055em",
        }}
      >
        {label}

        {required && (
          <span
            style={{
              color: "#EF4444",
            }}
          >
            *
          </span>
        )}
      </label>

      {children}
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

  zIndex: 50,
};

const modalStyle = {
  width: 470,

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

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  flexShrink: 0,

  padding: 0,

  border: "1px solid #E2E8F0",

  borderRadius: 8,

  background: "#FFFFFF",

  color: "#64748B",

  cursor: "pointer",
};

const inputWrapperStyle = {
  display: "flex",

  alignItems: "center",

  gap: 8,

  width: "100%",

  minHeight: 38,

  padding: "0 11px",

  background: "#FFFFFF",

  border: "1px solid #CBD5E1",

  borderRadius: 8,

  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.025)",
};

const inputStyle = {
  width: "100%",

  minWidth: 0,

  border: "none",

  outline: "none",

  background: "transparent",

  color: "#0F172A",

  fontSize: 11.5,

  fontFamily: "inherit",
};

const primaryBtnStyle = {
  minWidth: 112,

  height: 35,

  display: "inline-flex",

  alignItems: "center",
  justifyContent: "center",

  gap: 7,

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
  height: 35,

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
