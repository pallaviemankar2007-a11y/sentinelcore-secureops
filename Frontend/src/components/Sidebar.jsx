import React from "react";
import {
  LayoutDashboard,
  Boxes,
  Cloud,
  Network,
  BellRing,
  ShieldAlert,
  Bug,
  FileClock,
  ShieldCheck,
  Users,
  FileText,
  LogOut,
  ChevronRight,
  Activity,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "MONITORING",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        key: "assets",
        label: "Assets",
        icon: Boxes,
      },
      {
        key: "cloud",
        label: "Cloud Monitoring",
        icon: Cloud,
      },
      {
        key: "network",
        label: "Network Monitoring",
        icon: Network,
      },
      {
        key: "alerts",
        label: "Alerts",
        icon: BellRing,
      },
    ],
  },
  {
    label: "SECURITY & OPERATIONS",
    items: [
      {
        key: "incidents",
        label: "Incidents",
        icon: ShieldAlert,
      },
      {
        key: "vulnerabilities",
        label: "Vulnerabilities",
        icon: Bug,
      },
      {
        key: "audit",
        label: "Audit Logs",
        icon: FileClock,
      },
      {
        key: "compliance",
        label: "Compliance",
        icon: ShieldCheck,
      },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      {
        key: "users",
        label: "Users",
        icon: Users,
      },
      {
        key: "reports",
        label: "Reports",
        icon: FileText,
      },
    ],
  },
];

export default function Sidebar({
  activePage,
  setActivePage,

  // These are included so the sidebar also works
  // if App.jsx uses the older page/setPage naming.
  page,
  setPage,

  currentPage,
  onPageChange,

  onLogout,
}) {
  /*
   * Use whichever naming convention App.jsx provides.
   * This prevents the sidebar navigation from becoming
   * disconnected from the main application.
   */
  const selectedPage = activePage ?? page ?? currentPage ?? "dashboard";

  const changePage = setActivePage ?? setPage ?? onPageChange;

  function handleNavigation(pageKey) {
    if (typeof changePage === "function") {
      changePage(pageKey);
    } else {
      console.error(
        "Sidebar navigation error: No page change function was provided.",
      );
    }
  }

  return (
    <aside
      style={{
        width: 238,
        minWidth: 238,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,

        display: "flex",
        flexDirection: "column",

        background: "#FFFFFF",
        borderRight: "1px solid #E2E8F0",
        boxShadow: "1px 0 5px rgba(15, 23, 42, 0.035)",

        overflow: "hidden",
        flexShrink: 0,

        zIndex: 1000,
      }}
    >
      {/* =====================================================
          BRAND
      ===================================================== */}
      <div
        style={{
          height: 72,
          minHeight: 72,

          display: "flex",
          alignItems: "center",

          padding: "0 18px",

          borderBottom: "1px solid #E2E8F0",
          background: "#FFFFFF",
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

            borderRadius: 11,

            background: "linear-gradient(135deg, #4F46E5, #6366F1)",

            color: "#FFFFFF",

            boxShadow: "0 5px 12px rgba(79, 70, 229, 0.20)",
          }}
        >
          <ShieldCheck size={21} strokeWidth={2.2} />
        </div>

        <div
          style={{
            marginLeft: 10,
            minWidth: 0,
          }}
        >
          <div
            style={{
              color: "#0F172A",
              fontSize: 13.5,
              fontWeight: 750,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            SentinelCore
          </div>

          <div
            style={{
              marginTop: 3,
              color: "#64748B",
              fontSize: 8.5,
              fontWeight: 650,
              letterSpacing: "0.10em",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            SECUREOPS
          </div>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}
      <div
        style={{
          flex: 1,
          minHeight: 0,

          overflowY: "auto",
          overflowX: "hidden",

          padding: "13px 10px 12px",

          scrollbarWidth: "thin",
          scrollbarColor: "#CBD5E1 transparent",
        }}
      >
        {NAV_SECTIONS.map((section) => (
          <div
            key={section.label}
            style={{
              marginBottom: 17,
            }}
          >
            {/* Section title */}
            <div
              style={{
                padding: "0 14px",
                marginBottom: 6,

                color: "#94A3B8",
                fontSize: 9.5,
                fontWeight: 750,
                letterSpacing: "0.095em",
                lineHeight: 1.3,

                textTransform: "uppercase",
              }}
            >
              {section.label}
            </div>

            {/* Navigation buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {section.items.map((item) => {
                const Icon = item.icon;

                const isActive = selectedPage === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleNavigation(item.key)}
                    style={{
                      position: "relative",

                      width: "100%",
                      height: 38,

                      display: "flex",
                      alignItems: "center",

                      gap: 11,

                      padding: "0 12px",

                      border: "none",
                      borderRadius: 9,

                      background: isActive ? "#EEF2FF" : "transparent",

                      color: isActive ? "#4338CA" : "#475569",

                      fontFamily: "inherit",
                      fontSize: 12.5,
                      fontWeight: isActive ? 650 : 550,

                      textAlign: "left",

                      cursor: "pointer",

                      transition:
                        "background-color 0.18s ease, color 0.18s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "#F8FAFC";

                        e.currentTarget.style.color = "#0F172A";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";

                        e.currentTarget.style.color = "#475569";
                      }
                    }}
                  >
                    {/* Active left indicator */}
                    {isActive && (
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 8,
                          bottom: 8,

                          width: 3,

                          borderRadius: "0 4px 4px 0",

                          background: "#4F46E5",
                        }}
                      />
                    )}

                    <Icon
                      size={17}
                      strokeWidth={isActive ? 2.15 : 1.8}
                      style={{
                        flexShrink: 0,
                      }}
                    />

                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,

                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </span>

                    {isActive && (
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          flexShrink: 0,

                          borderRadius: "50%",

                          background: "#4F46E5",

                          boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.08)",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          BOTTOM SECTION
      ===================================================== */}
      <div
        style={{
          flexShrink: 0,

          padding: "10px 10px 12px",

          borderTop: "1px solid #E2E8F0",

          background: "#FFFFFF",
        }}
      >
        {/* SecureOps active */}
        <div
          style={{
            height: 38,

            display: "flex",
            alignItems: "center",

            gap: 9,

            padding: "0 11px",

            marginBottom: 6,

            borderRadius: 9,

            background: "#F8FAFC",
            border: "1px solid #E8EEF5",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              flexShrink: 0,

              borderRadius: "50%",

              background: "#10B981",

              boxShadow: "0 0 0 3px #D1FAE5",
            }}
          />

          <span
            style={{
              flex: 1,

              color: "#475569",

              fontSize: 10.5,
              fontWeight: 600,

              whiteSpace: "nowrap",
            }}
          >
            SecureOps active
          </span>

          <Activity size={13} strokeWidth={1.8} color="#10B981" />
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          style={{
            width: "100%",
            height: 38,

            display: "flex",
            alignItems: "center",

            gap: 11,

            padding: "0 12px",

            border: "none",
            borderRadius: 9,

            background: "transparent",
            color: "#64748B",

            fontFamily: "inherit",
            fontSize: 12.5,
            fontWeight: 550,

            textAlign: "left",

            cursor: "pointer",

            transition: "background-color 0.18s ease, color 0.18s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FEF2F2";

            e.currentTarget.style.color = "#DC2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";

            e.currentTarget.style.color = "#64748B";
          }}
        >
          <LogOut size={17} strokeWidth={1.8} />

          <span
            style={{
              flex: 1,
            }}
          >
            Logout
          </span>

          <ChevronRight size={14} strokeWidth={1.7} />
        </button>
      </div>

      {/* =====================================================
          SCROLLBAR
      ===================================================== */}
      <style>{`
        aside::-webkit-scrollbar {
          width: 5px;
        }

        aside::-webkit-scrollbar-track {
          background: transparent;
        }

        aside::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 999px;
        }

        aside::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}</style>
    </aside>
  );
}
