import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  UserCog,
  Activity,
  Mail,
  Clock3,
  RefreshCw,
  Search,
  Shield,
  UserRound,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";

export default function UsersPage() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users");

      if (response.ok) {
        const data = await response.json();
        setUsersList(data);
      }
    } catch (error) {
      console.error("Error fetching users from backend:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    const interval = setInterval(fetchUsers, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (ts) => {
    if (!ts) return "N/A";

    return ts.replace("T", " ").substring(0, 16);
  };

  const adminCount = usersList.filter((u) => u.role === "ADMIN").length;

  const activeCount = usersList.filter(
    (u) => !u.status || u.status === "ACTIVE",
  ).length;

  const inactiveCount = usersList.filter(
    (u) => u.status && u.status !== "ACTIVE",
  ).length;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1600,
        margin: "0 auto",
        animation: "fade-up 0.25s ease",
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 20,
          marginBottom: 22,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 11,
                background: "#EEF2FF",
                border: "1px solid #E0E7FF",
                color: "#4F46E5",
              }}
            >
              <Users size={21} strokeWidth={1.9} />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#0F172A",
                  fontSize: 21,
                  fontWeight: 750,
                  letterSpacing: "-0.03em",
                }}
              >
                User Access & Management
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  color: "#64748B",
                  fontSize: 11.5,
                }}
              >
                Manage system administrators, operators and role-based access.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            height: 36,
            padding: "0 12px",
            borderRadius: 9,
            background: "#EEF2FF",
            border: "1px solid #E0E7FF",
            color: "#4338CA",
            fontSize: 10,
            fontWeight: 650,
            whiteSpace: "nowrap",
          }}
        >
          <ShieldCheck size={14} />
          IAM & RBAC Directory
        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <SummaryCard
          label="Total Users"
          value={loading ? "—" : usersList.length}
          sub="Registered accounts"
          icon={Users}
          color="#4F46E5"
          background="#EEF2FF"
        />

        <SummaryCard
          label="Administrators"
          value={loading ? "—" : adminCount}
          sub="Privileged accounts"
          icon={Shield}
          color="#7C3AED"
          background="#F5F3FF"
        />

        <SummaryCard
          label="Active Users"
          value={loading ? "—" : activeCount}
          sub="Currently active accounts"
          icon={CheckCircle2}
          color="#059669"
          background="#ECFDF5"
        />

        <SummaryCard
          label="Inactive"
          value={loading ? "—" : inactiveCount}
          sub="Inactive or disabled accounts"
          icon={CircleAlert}
          color="#D97706"
          background="#FFF7ED"
        />
      </div>

      {/* =====================================================
          ACCESS CONTROL STATUS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 1.2fr) minmax(260px, 0.8fr)",
          gap: 14,
          marginBottom: 18,
        }}
      >
        {/* IAM Status */}

        <div
          style={{
            background: "linear-gradient(135deg, #FFFFFF, #F8FAFC)",
            border: "1px solid #E2E8F0",
            borderRadius: 13,
            padding: "17px 19px",
            boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 15,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 9,
                  background: "#ECFDF5",
                  color: "#059669",
                }}
              >
                <ShieldCheck size={19} />
              </div>

              <div>
                <div
                  style={{
                    color: "#64748B",
                    fontSize: 9.5,
                    fontWeight: 650,
                  }}
                >
                  Identity & Access Management
                </div>

                <div
                  style={{
                    marginTop: 2,
                    color: "#059669",
                    fontSize: 12,
                    fontWeight: 750,
                  }}
                >
                  ACCESS CONTROL ACTIVE
                </div>
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 8px",
                borderRadius: 999,
                background: "#ECFDF5",
                border: "1px solid #D1FAE5",
                color: "#047857",
                fontSize: 8.5,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#10B981",
                }}
              />
              SECURE
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
              marginTop: 15,
            }}
          >
            <AccessMetric
              icon={Users}
              value={loading ? "—" : usersList.length}
              label="Accounts"
            />

            <AccessMetric
              icon={Shield}
              value={loading ? "—" : adminCount}
              label="Admins"
            />

            <AccessMetric icon={Activity} value="RBAC" label="Access model" />
          </div>
        </div>

        {/* Live Directory */}

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: 13,
            padding: "17px 19px",
            boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9,
                background: "#EEF2FF",
                color: "#4F46E5",
              }}
            >
              <RefreshCw size={17} />
            </div>

            <div>
              <div
                style={{
                  color: "#64748B",
                  fontSize: 9.5,
                  fontWeight: 650,
                }}
              >
                User Directory
              </div>

              <div
                style={{
                  marginTop: 2,
                  color: "#0F172A",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Live synchronization
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginTop: 15,
              color: "#64748B",
              fontSize: 9,
            }}
          >
            <Clock3 size={11} />
            Directory refreshes automatically every 5 seconds.
          </div>
        </div>
      </div>

      {/* =====================================================
          USER DIRECTORY
      ===================================================== */}

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 13,
          boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Table header */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 15,
            padding: "16px 18px",
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                background: "#EEF2FF",
                color: "#4F46E5",
              }}
            >
              <UserCog size={15} />
            </div>

            <div>
              <h3
                style={{
                  margin: 0,
                  color: "#0F172A",
                  fontSize: 12.5,
                  fontWeight: 700,
                }}
              >
                User Directory
              </h3>

              <p
                style={{
                  margin: "3px 0 0",
                  color: "#94A3B8",
                  fontSize: 9.5,
                }}
              >
                Registered accounts and access roles
              </p>
            </div>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 9px",
              borderRadius: 999,
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              color: "#64748B",
              fontSize: 9,
              fontWeight: 650,
            }}
          >
            <Activity size={11} />
            RBAC Directory
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : usersList.length === 0 ? (
          <EmptyState />
        ) : (
          <UsersTable usersList={usersList} formatTimestamp={formatTimestamp} />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({ label, value, sub, icon: Icon, color, background }) {
  return (
    <div
      style={{
        minHeight: 116,
        padding: "16px 17px",
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 13,
        boxShadow: "0 2px 6px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div>
          <div
            style={{
              color: "#64748B",
              fontSize: 9.5,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </div>

          <div
            className="mono"
            style={{
              marginTop: 8,
              color: "#0F172A",
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {value}
          </div>
        </div>

        <div
          style={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9,
            background,
            color,
          }}
        >
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 11,
          color: "#94A3B8",
          fontSize: 9.5,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: color,
          }}
        />

        {sub}
      </div>
    </div>
  );
}

/* =========================================================
   ACCESS METRIC
========================================================= */

function AccessMetric({ icon: Icon, value, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 9px",
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: 8,
      }}
    >
      <Icon size={13} color="#64748B" />

      <div>
        <div
          className="mono"
          style={{
            color: "#0F172A",
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {value}
        </div>

        <div
          style={{
            marginTop: 2,
            color: "#94A3B8",
            fontSize: 7.5,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   USERS TABLE
========================================================= */

function UsersTable({ usersList, formatTimestamp }) {
  return (
    <div
      style={{
        overflowX: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          minWidth: 900,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>USER ID</th>

            <th style={tableHeaderStyle}>USER</th>

            <th style={tableHeaderStyle}>EMAIL</th>

            <th style={tableHeaderStyle}>ROLE</th>

            <th style={tableHeaderStyle}>STATUS</th>

            <th style={tableHeaderStyle}>LAST ACTIVE</th>
          </tr>
        </thead>

        <tbody>
          {usersList.map((u, index) => {
            const userId = u.userId || u.id || `USR-0${index + 1}`;

            const userName = u.name || u.username || "Unknown User";

            const role = u.role || "USER";

            const status = u.status || "ACTIVE";

            const isAdmin = role === "ADMIN";

            const isActive = status === "ACTIVE";

            return (
              <tr
                key={u.id || index}
                style={{
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F8FAFC";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                }}
              >
                {/* USER ID */}

                <td style={tableCellStyle}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "5px 8px",
                      borderRadius: 7,
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <UserRound size={11} color="#4F46E5" />

                    <span
                      className="mono"
                      style={{
                        color: "#475569",
                        fontSize: 8.8,
                        fontWeight: 650,
                      }}
                    >
                      {userId}
                    </span>
                  </div>
                </td>

                {/* USER */}

                <td
                  style={{
                    ...tableCellStyle,
                    minWidth: 210,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        background: isAdmin ? "#F5F3FF" : "#EEF2FF",
                        border: isAdmin
                          ? "1px solid #DDD6FE"
                          : "1px solid #E0E7FF",
                        color: isAdmin ? "#7C3AED" : "#4F46E5",
                        fontSize: 10,
                        fontWeight: 750,
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div
                        style={{
                          color: "#334155",
                          fontSize: 10,
                          fontWeight: 650,
                        }}
                      >
                        {userName}
                      </div>

                      <div
                        style={{
                          marginTop: 2,
                          color: "#94A3B8",
                          fontSize: 8,
                        }}
                      >
                        {isAdmin ? "Privileged account" : "Standard account"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* EMAIL */}

                <td style={tableCellStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      maxWidth: 230,
                    }}
                  >
                    <Mail size={12} color="#94A3B8" />

                    <span
                      className="mono"
                      style={{
                        color: "#64748B",
                        fontSize: 8.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {u.email || "N/A"}
                    </span>
                  </div>
                </td>

                {/* ROLE */}

                <td style={tableCellStyle}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 8px",
                      borderRadius: 7,
                      background: isAdmin ? "#F5F3FF" : "#EEF2FF",
                      border: isAdmin
                        ? "1px solid #DDD6FE"
                        : "1px solid #E0E7FF",
                      color: isAdmin ? "#7C3AED" : "#4338CA",
                      fontSize: 8,
                      fontWeight: 750,
                    }}
                  >
                    {isAdmin ? <Shield size={10} /> : <UserCog size={10} />}

                    {role}
                  </span>
                </td>

                {/* STATUS */}

                <td style={tableCellStyle}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 8px",
                      borderRadius: 7,
                      background: isActive ? "#ECFDF5" : "#F8FAFC",
                      border: isActive
                        ? "1px solid #D1FAE5"
                        : "1px solid #E2E8F0",
                      color: isActive ? "#047857" : "#64748B",
                      fontSize: 8,
                      fontWeight: 700,
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: isActive ? "#10B981" : "#94A3B8",
                      }}
                    />

                    {status}
                  </span>
                </td>

                {/* LAST ACTIVE */}

                <td style={tableCellStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Clock3 size={12} color="#94A3B8" />

                    <span
                      className="mono"
                      style={{
                        color: "#64748B",
                        fontSize: 8.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatTimestamp(u.lastLogin)}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   LOADING STATE
========================================================= */

function LoadingState() {
  return (
    <div
      style={{
        minHeight: 280,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          background: "#EEF2FF",
          color: "#4F46E5",
        }}
      >
        <RefreshCw
          size={20}
          style={{
            animation: "spin 1s linear infinite",
          }}
        />
      </div>

      <div
        style={{
          color: "#475569",
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        Loading user accounts...
      </div>

      <div
        style={{
          color: "#94A3B8",
          fontSize: 9.5,
        }}
      >
        Synchronizing the IAM directory
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div
      style={{
        minHeight: 280,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          background: "#EEF2FF",
          border: "1px solid #E0E7FF",
          color: "#4F46E5",
        }}
      >
        <Users size={26} strokeWidth={1.7} />
      </div>

      <h3
        style={{
          margin: "14px 0 5px",
          color: "#0F172A",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        No registered users
      </h3>

      <p
        style={{
          margin: 0,
          maxWidth: 400,
          textAlign: "center",
          color: "#64748B",
          fontSize: 10.5,
          lineHeight: 1.5,
        }}
      >
        No user accounts were found in the backend database.
      </p>
    </div>
  );
}

/* =========================================================
   TABLE STYLES
========================================================= */

const tableHeaderStyle = {
  padding: "10px 14px",

  background: "#F8FAFC",

  borderBottom: "1px solid #E2E8F0",

  color: "#64748B",

  fontSize: 8.5,

  fontWeight: 700,

  letterSpacing: "0.045em",

  textAlign: "left",

  whiteSpace: "nowrap",
};

const tableCellStyle = {
  padding: "13px 14px",

  borderBottom: "1px solid #F1F5F9",

  verticalAlign: "middle",
};
