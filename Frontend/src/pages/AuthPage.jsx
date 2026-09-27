import { useState } from "react";
import {
  ShieldCheck,
  AlertCircle,
  Server,
  Activity,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  UserRound,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Shield,
  Wifi,
} from "lucide-react";
import * as auth from "../api/auth";

const FEATURES = [
  {
    icon: Server,
    text: "Full asset inventory — create, edit, retire",
  },
  {
    icon: Activity,
    text: "Live health status across servers, cloud, network",
  },
  {
    icon: LayoutDashboard,
    text: "One dashboard for the whole fleet",
  },
];

/* =========================================================
   AUTH PAGE
========================================================= */

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function update(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !form.username.trim() ||
      !form.password.trim() ||
      (mode === "signup" && !form.email.trim())
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const data =
        mode === "login"
          ? await auth.login(form.username, form.password)
          : await auth.signup({
              username: form.username,
              email: form.email,
              password: form.password,
            });

      onAuthSuccess({
        username: data.username,
        role: data.role,
      });
    } catch (err) {
      setError(
        err.message || `Could not ${mode === "login" ? "log in" : "sign up"}.`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="secureops-auth-page">
      {/* =====================================================
          LEFT BRANDING SECTION
      ===================================================== */}

      <section className="secureops-auth-brand">
        {/* Background decoration */}

        <div className="auth-glow auth-glow-one" />
        <div className="auth-glow auth-glow-two" />
        <div className="auth-grid" />

        <div className="auth-brand-content">
          {/* Logo */}

          <div className="auth-logo-row">
            <div className="auth-logo">
              <ShieldCheck size={23} strokeWidth={2} />
            </div>

            <div>
              <div className="auth-brand-name">SentinelCore</div>

              <div className="auth-brand-subtitle">SECUREOPS</div>
            </div>
          </div>

          {/* Label */}

          <div className="auth-security-label">
            <Shield size={11} />
            CLOUD SECURITY MONITORING
          </div>

          {/* Main heading */}

          <h1 className="auth-main-heading">
            Watch your
            <br />
            infrastructure.
            <br />
            <span>Protect your operations.</span>
          </h1>

          <p className="auth-description">
            One centralized platform to monitor servers, cloud resources and
            network infrastructure from a single secure workspace.
          </p>

          {/* Features */}

          <div className="auth-features">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div className="auth-feature" key={index}>
                  <div className="auth-feature-icon">
                    <Icon size={15} strokeWidth={1.9} />
                  </div>

                  <span>{feature.text}</span>

                  <CheckCircle2 className="auth-feature-check" size={14} />
                </div>
              );
            })}
          </div>

          {/* Security information */}

          <div className="auth-security-strip">
            <SecurityItem icon={ShieldCheck} text="Secure Access" />

            <SecurityItem icon={Activity} text="Live Monitoring" />

            <SecurityItem icon={Wifi} text="Connected" />
          </div>
        </div>
      </section>

      {/* =====================================================
          RIGHT LOGIN SECTION
      ===================================================== */}

      <section className="secureops-auth-form-section">
        <div className="auth-form-container">
          {/* Secure status */}

          <div className="auth-secure-status">
            <span className="auth-status-dot" />
            SECURE AUTHENTICATION
          </div>

          {/* Heading */}

          <div className="auth-form-heading">
            <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>

            <p>
              {mode === "login"
                ? "Sign in to continue monitoring your infrastructure."
                : "Create your SecureOps account to access the monitoring dashboard."}
            </p>
          </div>

          {/* Login / Signup switch */}

          <div className="auth-mode-switch">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className={
                  mode === m ? "auth-mode-button active" : "auth-mode-button"
                }
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Form */}

          <form onSubmit={handleSubmit}>
            {/* Username */}

            <Field label="Username" icon={UserRound}>
              <input
                autoFocus
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
                placeholder="Enter your username"
                className="auth-input"
              />
            </Field>

            {/* Email */}

            {mode === "signup" && (
              <Field label="Email" icon={Mail}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="Enter your email address"
                  className="auth-input"
                />
              </Field>
            )}

            {/* Password */}

            <Field label="Password" icon={LockKeyhole}>
              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Enter your password"
                  className="auth-input auth-password-input"
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>

            {/* Error */}

            {error && (
              <div className="auth-error">
                <AlertCircle size={14} className="auth-error-icon" />

                <span>{error}</span>
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-button"
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />

                  {mode === "login" ? "Logging in..." : "Creating account..."}
                </>
              ) : (
                <>
                  {mode === "login"
                    ? "Log in to SecureOps"
                    : "Create SecureOps account"}

                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Development bypass */}

          <button
            type="button"
            onClick={() => onAuthSuccess(auth.devBypassLogin())}
            className="auth-dev-button"
          >
            <AlertCircle size={12} color="#D97706" />
            Skip login — development mode
          </button>

          {/* Footer */}

          <div className="auth-footer">
            <ShieldCheck size={11} />
            Infosys Springboard 7.0 · Milestone 1
          </div>
        </div>
      </section>

      {/* =====================================================
          PAGE-SPECIFIC CSS
      ===================================================== */}

      <style>{`
        /* ================================
           MAIN AUTH PAGE
        ================================= */

        .secureops-auth-page {
          width: 100%;
          min-height: 100vh;
          display: flex;
          background: #F8FAFC;
          color: #0F172A;
          overflow: hidden;
        }

        /* ================================
           LEFT BRAND SECTION
        ================================= */

        .secureops-auth-brand {
          position: relative;
          flex: 1 1 52%;
          min-width: 420px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 55px 7%;
          background:
            linear-gradient(
              145deg,
              #F8FAFF 0%,
              #EEF2FF 55%,
              #F0FDFA 100%
            );
          border-right: 1px solid #E2E8F0;
        }

        .auth-brand-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 590px;
          animation: authFadeUp 0.55s ease both;
        }

        /* ================================
           BACKGROUND EFFECTS
        ================================= */

        .auth-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(8px);
        }

        .auth-glow-one {
          width: 430px;
          height: 430px;
          top: -150px;
          left: -150px;
          background:
            radial-gradient(
              circle,
              rgba(99, 102, 241, 0.16),
              transparent 68%
            );
          animation:
            float-slow 12s ease-in-out infinite;
        }

        .auth-glow-two {
          width: 390px;
          height: 390px;
          right: -140px;
          bottom: -150px;
          background:
            radial-gradient(
              circle,
              rgba(20, 184, 166, 0.14),
              transparent 68%
            );
          animation:
            float-slow-reverse 14s ease-in-out infinite;
        }

        .auth-grid {
          position: absolute;
          inset: 0;
          opacity: 0.42;
          pointer-events: none;
          background-image:
            linear-gradient(
              #CBD5E1 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              #CBD5E1 1px,
              transparent 1px
            );
          background-size: 42px 42px;
          mask-image:
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.75),
              transparent 80%
            );
          -webkit-mask-image:
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.75),
              transparent 80%
            );
        }

        /* ================================
           BRAND
        ================================= */

        .auth-logo-row {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 34px;
        }

        .auth-logo {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #FFFFFF;
          background:
            linear-gradient(
              135deg,
              #4F46E5,
              #6366F1
            );
          box-shadow:
            0 8px 20px
            rgba(79, 70, 229, 0.22);
        }

        .auth-brand-name {
          color: #0F172A;
          font-size: 16px;
          font-weight: 750;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .auth-brand-subtitle {
          margin-top: 3px;
          color: #64748B;
          font-size: 9px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: 0.09em;
        }

        /* ================================
           SECURITY LABEL
        ================================= */

        .auth-security-label {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 15px;
          padding: 6px 9px;
          border: 1px solid #E0E7FF;
          border-radius: 999px;
          background: #FFFFFF;
          color: #4338CA;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.045em;
          box-shadow:
            0 2px 5px
            rgba(15, 23, 42, 0.04);
        }

        /* ================================
           MAIN HEADING
        ================================= */

        .auth-main-heading {
          max-width: 540px;
          margin: 0 0 15px;
          color: #0F172A;
          font-size: clamp(30px, 3.3vw, 46px);
          font-weight: 780;
          line-height: 1.08;
          letter-spacing: -0.045em;
        }

        .auth-main-heading span {
          color: #4F46E5;
        }

        .auth-description {
          max-width: 500px;
          margin: 0 0 31px;
          color: #64748B;
          font-size: 13.5px;
          line-height: 1.7;
        }

        /* ================================
           FEATURES
        ================================= */

        .auth-features {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .auth-feature {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 31px;
          color: #475569;
          font-size: 11.5px;
          font-weight: 550;
        }

        .auth-feature-icon {
          width: 31px;
          height: 31px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #E2E8F0;
          border-radius: 9px;
          background: #FFFFFF;
          color: #4F46E5;
          box-shadow:
            0 2px 5px
            rgba(15, 23, 42, 0.04);
        }

        .auth-feature-check {
          margin-left: auto;
          flex-shrink: 0;
          color: #10B981;
        }

        /* ================================
           SECURITY STRIP
        ================================= */

        .auth-security-strip {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 34px;
          padding-top: 18px;
          border-top: 1px solid #E2E8F0;
        }

        .auth-security-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748B;
          font-size: 8.5px;
          font-weight: 650;
        }

        /* ================================
           RIGHT FORM SECTION
        ================================= */

        .secureops-auth-form-section {
          flex: 0 1 540px;
          min-width: 390px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 50px;
          background: #FFFFFF;
        }

        .auth-form-container {
          width: 390px;
          max-width: 100%;
          animation:
            authFadeUp 0.55s ease 0.1s both;
        }

        /* ================================
           SECURE STATUS
        ================================= */

        .auth-secure-status {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 19px;
          color: #059669;
          font-size: 9px;
          font-weight: 750;
          letter-spacing: 0.05em;
        }

        .auth-status-dot {
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #10B981;
          box-shadow:
            0 0 0 3px #D1FAE5;
        }

        /* ================================
           FORM HEADING
        ================================= */

        .auth-form-heading {
          margin-bottom: 22px;
        }

        .auth-form-heading h2 {
          margin: 0;
          color: #0F172A;
          font-size: 25px;
          font-weight: 750;
          line-height: 1.2;
          letter-spacing: -0.035em;
        }

        .auth-form-heading p {
          margin: 7px 0 0;
          color: #64748B;
          font-size: 11.5px;
          line-height: 1.55;
        }

        /* ================================
           MODE SWITCH
        ================================= */

        .auth-mode-switch {
          display: flex;
          gap: 3px;
          margin-bottom: 22px;
          padding: 3px;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          background: #F1F5F9;
        }

        .auth-mode-button {
          flex: 1;
          height: 35px;
          border: none;
          border-radius: 7px;
          background: transparent;
          color: #64748B;
          font-family: inherit;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background 0.18s ease,
            color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .auth-mode-button:hover {
          color: #4338CA;
        }

        .auth-mode-button.active {
          background: #FFFFFF;
          color: #312E81;
          box-shadow:
            0 2px 5px
            rgba(15, 23, 42, 0.08);
        }

        /* ================================
           FIELD
        ================================= */

        .auth-field {
          margin-bottom: 14px;
        }

        .auth-field-label {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 6px;
          color: #475569;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.035em;
          text-transform: uppercase;
        }

        /* ================================
           INPUT
        ================================= */

        .auth-input {
          width: 100%;
          height: 40px;
          box-sizing: border-box;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          background: #FFFFFF;
          padding: 0 11px;
          color: #0F172A;
          font-family: inherit;
          font-size: 11.5px;
          outline: none;
          box-shadow:
            0 1px 2px
            rgba(15, 23, 42, 0.02);
        }

        .auth-input::placeholder {
          color: #94A3B8;
        }

        .auth-input:hover {
          border-color: #94A3B8;
        }

        .auth-input:focus {
          border-color: #6366F1;
          box-shadow:
            0 0 0 3px
            rgba(99, 102, 241, 0.10);
        }

        .auth-password-wrapper {
          position: relative;
          width: 100%;
        }

        .auth-password-input {
          padding-right: 42px;
        }

        .auth-password-toggle {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 7px;
          background: transparent;
          color: #64748B;
          cursor: pointer;
        }

        .auth-password-toggle:hover {
          background: #F1F5F9;
          color: #4338CA;
        }

        /* ================================
           ERROR
        ================================= */

        .auth-error {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 4px 0 13px;
          padding: 10px 11px;
          border: 1px solid #FECACA;
          border-radius: 9px;
          background: #FEF2F2;
          color: #B91C1C;
          font-size: 10.5px;
          line-height: 1.45;
        }

        .auth-error-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* ================================
           SUBMIT BUTTON
        ================================= */

        .auth-submit-button {
          width: 100%;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 5px;
          border: 1px solid #4338CA;
          border-radius: 9px;
          background:
            linear-gradient(
              135deg,
              #4F46E5,
              #6366F1
            );
          color: #FFFFFF;
          font-family: inherit;
          font-size: 11.5px;
          font-weight: 700;
          box-shadow:
            0 6px 14px
            rgba(79, 70, 229, 0.20);
          cursor: pointer;
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            opacity 0.18s ease;
        }

        .auth-submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 9px 20px
            rgba(79, 70, 229, 0.25);
        }

        .auth-submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .auth-submit-button:disabled {
          opacity: 0.78;
          cursor: not-allowed;
        }

        .auth-spinner {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation:
            spin 0.8s linear infinite;
        }

        /* ================================
           DEVELOPMENT BUTTON
        ================================= */

        .auth-dev-button {
          width: 100%;
          min-height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 10px;
          border: 1px dashed #CBD5E1;
          border-radius: 8px;
          background: #FFFFFF;
          color: #64748B;
          font-family: inherit;
          font-size: 9.5px;
          font-weight: 600;
          cursor: pointer;
          transition:
            background 0.18s ease,
            border-color 0.18s ease,
            color 0.18s ease;
        }

        .auth-dev-button:hover {
          border-color: #F59E0B;
          background: #FFFBEB;
          color: #92400E;
        }

        /* ================================
           FOOTER
        ================================= */

        .auth-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 22px;
          color: #94A3B8;
          font-size: 8.5px;
          font-weight: 500;
        }

        /* ================================
           ANIMATION
        ================================= */

        @keyframes authFadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ================================
           RESPONSIVE
        ================================= */

        @media (max-width: 1000px) {
          .secureops-auth-brand {
            padding: 45px 5%;
          }

          .secureops-auth-form-section {
            padding: 35px 30px;
          }
        }

        @media (max-width: 850px) {
          .secureops-auth-brand {
            display: none;
          }

          .secureops-auth-form-section {
            flex: 1;
            min-width: 0;
            padding: 30px 22px;
          }

          .auth-form-container {
            width: 400px;
          }
        }

        @media (max-width: 480px) {
          .secureops-auth-form-section {
            padding: 24px 18px;
          }

          .auth-form-heading h2 {
            font-size: 23px;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   FIELD COMPONENT
========================================================= */

function Field({ label, icon: Icon, children }) {
  return (
    <div className="auth-field">
      <label className="auth-field-label">
        <Icon size={11} color="#64748B" />

        {label}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   SECURITY ITEM
========================================================= */

function SecurityItem({ icon: Icon, text }) {
  return (
    <div className="auth-security-item">
      <Icon size={12} color="#4F46E5" strokeWidth={2} />

      {text}
    </div>
  );
}
