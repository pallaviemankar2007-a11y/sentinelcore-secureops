import { useState, useEffect, useMemo, useCallback } from "react";
import * as api from "./api/assets";
import * as auth from "./api/auth";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./components/Dashboard";
import AssetsPage from "./components/AssetsPage";
import CloudMonitoringPage from "./components/CloudMonitoringPage";
import NetworkMonitoringPage from "./components/NetworkMonitoringPage";
import AlertsPage from "./components/AlertsPage";

import AuthPage from "./pages/AuthPage";
import Incidents from "./pages/Incidents";
import Vulnerabilities from "./pages/Vulnerabilities";
import AuditLogs from "./pages/AuditLogs";
import Compliance from "./pages/Compliance";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";

/* =========================================================
   PAGE INFORMATION
   ========================================================= */

const PAGE_META = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Monitor your infrastructure and security environment.",
  },

  assets: {
    title: "Assets",
    subtitle: "Servers, cloud resources, and network devices under monitoring.",
  },

  cloud: {
    title: "Cloud Monitoring",
    subtitle: "Monitor the health and performance of your cloud resources.",
  },

  network: {
    title: "Network Monitoring",
    subtitle: "Monitor network health, traffic, and device performance.",
  },

  alerts: {
    title: "Alerts",
    subtitle: "Review infrastructure events that need attention.",
  },

  incidents: {
    title: "Incidents",
    subtitle: "Track and manage security and infrastructure incidents.",
  },

  vulnerabilities: {
    title: "Vulnerabilities",
    subtitle: "Identify security exposure and track remediation.",
  },

  audit: {
    title: "Audit Logs",
    subtitle: "Monitor system access and security activity.",
  },

  compliance: {
    title: "Compliance",
    subtitle: "Monitor compliance checks and security standards.",
  },

  users: {
    title: "Users",
    subtitle: "Manage users, roles, and system permissions.",
  },

  reports: {
    title: "Reports",
    subtitle: "View and download generated system reports.",
  },
};

/* =========================================================
   MAIN APPLICATION
   ========================================================= */

export default function App() {
  /* =======================================================
     AUTHENTICATED USER
  ======================================================= */

  const [user, setUser] = useState(() => auth.getUser());

  /* =======================================================
     CURRENT PAGE
  ======================================================= */

  const [view, setView] = useState("dashboard");

  /* =======================================================
     ASSETS
  ======================================================= */

  const [assets, setAssets] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  /* =======================================================
     BACKEND STATUS
  ======================================================= */

  const [backendUp, setBackendUp] = useState(null);

  const [lastSync, setLastSync] = useState(null);

  /* =======================================================
     TOAST
  ======================================================= */

  const [toast, setToast] = useState(null);

  /* =======================================================
     TOAST FUNCTION
  ======================================================= */

  const showToast = useCallback((message, type = "success") => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  /* =======================================================
     LOAD ASSETS
  ======================================================= */

  const loadAssets = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const data = await api.getAssets();

      setAssets(data);

      setLoadError("");

      setBackendUp(true);

      setLastSync(new Date());
    } catch (err) {
      setLoadError(err.message || "Could not reach the backend.");

      setBackendUp(false);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  /* =======================================================
     AUTO REFRESH
  ======================================================= */

  useEffect(() => {
    if (!user) {
      return;
    }

    loadAssets();

    const interval = setInterval(() => {
      loadAssets(true);
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [loadAssets, user]);

  /* =======================================================
     ASSET COUNTS
  ======================================================= */

  const counts = useMemo(
    () =>
      assets.reduce(
        (acc, asset) => ({
          ...acc,
          [asset.status]: (acc[asset.status] || 0) + 1,
        }),
        {
          HEALTHY: 0,
          WARNING: 0,
          CRITICAL: 0,
        },
      ),
    [assets],
  );

  /* =======================================================
     UPTIME
  ======================================================= */

  const uptimePct = assets.length
    ? (100 - counts.CRITICAL * 1.4 - counts.WARNING * 0.3).toFixed(2)
    : "—";

  /* =======================================================
     AUTHENTICATION
  ======================================================= */

  if (!user) {
    return <AuthPage onAuthSuccess={setUser} />;
  }

  /* =======================================================
     PAGE META
  ======================================================= */

  const meta = PAGE_META[view] || PAGE_META.dashboard;

  /* =======================================================
     LOGOUT
  ======================================================= */

  function handleLogout() {
    auth.logout();
    setUser(null);
  }

  /* =======================================================
     APPLICATION UI
  ======================================================= */

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",

        background: "#F8FAFC",
        color: "#0F172A",
      }}
    >
      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar
        activePage={view}
        setActivePage={setView}
        onLogout={handleLogout}
      />

      {/* =================================================
          MAIN APPLICATION AREA

          Sidebar is fixed at 238px.
          Therefore the main area starts after it.
      ================================================= */}

      <main
        style={{
          marginLeft: 238,
          width: "calc(100% - 238px)",

          minWidth: 0,
          minHeight: "100vh",

          display: "flex",
          flexDirection: "column",

          background: "#F8FAFC",

          overflow: "hidden",
        }}
      >
        {/* ===============================================
            TOPBAR
        =============================================== */}

        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          backendUp={backendUp}
          lastSync={lastSync}
          user={user}
        />

        {/* ===============================================
            PAGE CONTENT
        =============================================== */}

        <section
          style={{
            flex: 1,

            width: "100%",
            minWidth: 0,
            minHeight: 0,

            overflowY: "auto",
            overflowX: "hidden",

            padding: "24px 32px 40px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "none",
              margin: 0,
            }}
          >
            {/* ===========================================
                DASHBOARD
            =========================================== */}

            {view === "dashboard" && (
              <Dashboard
                assets={assets}
                counts={counts}
                uptimePct={uptimePct}
                onGoToAssets={() => setView("assets")}
              />
            )}

            {/* ===========================================
                ASSETS
            =========================================== */}

            {view === "assets" && (
              <AssetsPage
                assets={assets}
                counts={counts}
                loading={loading}
                loadError={loadError}
                onReload={() => loadAssets(true)}
                showToast={showToast}
              />
            )}

            {/* ===========================================
                CLOUD MONITORING
            =========================================== */}

            {view === "cloud" && (
              <CloudMonitoringPage
                assets={assets}
                onGoToAssets={() => setView("assets")}
              />
            )}

            {/* ===========================================
                NETWORK MONITORING
            =========================================== */}

            {view === "network" && (
              <NetworkMonitoringPage
                assets={assets}
                onGoToAssets={() => setView("assets")}
              />
            )}

            {/* ===========================================
                ALERTS
            =========================================== */}

            {view === "alerts" && (
              <AlertsPage
                assets={assets}
                onGoToAssets={() => setView("assets")}
              />
            )}

            {/* ===========================================
                INCIDENTS
            =========================================== */}

            {view === "incidents" && <Incidents />}

            {/* ===========================================
                VULNERABILITIES
            =========================================== */}

            {view === "vulnerabilities" && <Vulnerabilities />}

            {/* ===========================================
                AUDIT LOGS
            =========================================== */}

            {view === "audit" && <AuditLogs />}

            {/* ===========================================
                COMPLIANCE
            =========================================== */}

            {view === "compliance" && <Compliance />}

            {/* ===========================================
                USERS
            =========================================== */}

            {view === "users" && <UsersPage />}

            {/* ===========================================
                REPORTS
            =========================================== */}

            {view === "reports" && <ReportsPage />}
          </div>
        </section>
      </main>

      {/* =================================================
          TOAST NOTIFICATION
      ================================================= */}

      {toast && (
        <div
          style={{
            position: "fixed",

            right: 24,
            bottom: 24,

            zIndex: 2000,

            minWidth: 280,
            maxWidth: 420,

            display: "flex",
            alignItems: "center",

            gap: 12,

            background: toast.type === "error" ? "#FEF2F2" : "#FFFFFF",

            border:
              toast.type === "error"
                ? "1px solid #FECACA"
                : "1px solid #E2E8F0",

            color: toast.type === "error" ? "#B91C1C" : "#0F172A",

            padding: "14px 18px",

            borderRadius: 12,

            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",

            fontSize: 13,

            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,

              borderRadius: "50%",

              flexShrink: 0,

              background: toast.type === "error" ? "#DC2626" : "#10B981",
            }}
          />

          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
