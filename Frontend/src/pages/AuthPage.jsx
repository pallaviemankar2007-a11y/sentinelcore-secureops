import { useState } from 'react';
import { ShieldCheck, User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import * as auth from '../api/auth';

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.username.trim() || !form.password.trim() || (mode === 'signup' && !form.email.trim())) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const data = mode === 'login'
        ? await auth.login(form.username, form.password)
        : await auth.signup({ username: form.username, email: form.email, password: form.password });
      onAuthSuccess({ username: data.username, role: data.role });
    } catch (err) {
      setError(err.message || `Could not ${mode === 'login' ? 'log in' : 'sign up'}.`);
    } finally {
      setLoading(false);
    }
  }

  return (
      <div style={{
      minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: '#0B1220',
      position: 'relative', overflowY: 'auto', overflowX: 'hidden', padding: '48px 24px',
      boxSizing: 'border-box',
    }}>
      {/* Warm-toned-for-them-but-ours glow, centered behind logo + card as one unit */}
      <div style={{
        position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
        width: 640, height: 640, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,140,255,0.16), transparent 65%)',
        filter: 'blur(24px)', pointerEvents: 'none',
      }} />

      {/* Logo + brand, above the card */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, animation: 'fade-up 0.5s ease' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 15, background: 'rgba(108,140,255,0.15)',
          border: '1px solid rgba(108,140,255,0.35)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', marginBottom: 14,
        }}>
          <ShieldCheck size={28} color="#A3B4FF" />
        </div>
        <div style={{ fontSize: 25, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
          SentinelCore SecureOps
        </div>
        <div style={{ fontSize: 13, color: '#8B98B0', marginTop: 4 }}>
          Infrastructure Monitoring
        </div>
      </div>

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 1, width: 440, maxWidth: '100%',
        background: '#141F3D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18,
        padding: '36px 38px', boxShadow: '0 24px 70px rgba(0,0,0,0.4)',
        animation: 'fade-up 0.5s ease 0.08s both',
      }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#F8FAFC', marginBottom: 24, letterSpacing: '-0.01em' }}>
          {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
        </div>

        <div style={{ display: 'flex', marginBottom: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 4 }}>
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(''); }}
              style={{
                flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 700,
                background: mode === m ? '#6C8CFF' : 'transparent',
                color: mode === m ? '#0B1220' : '#9AA6C0',
                textTransform: 'capitalize', cursor: 'pointer',
              }}
            >
              {m === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <Field label="Username">
            <IconInput
              icon={User}
              autoFocus
              value={form.username}
              onChange={(e) => update('username', e.target.value)}
              placeholder="e.g. admin"
            />
          </Field>

          {mode === 'signup' && (
            <Field label="Email">
              <IconInput
                icon={Mail}
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@example.com"
              />
            </Field>
          )}

          <Field label="Password">
            <div style={{ position: 'relative' }}>
              <IconInput
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Enter your password"
                trailingPadding
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={eyeBtnStyle}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          {error && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', fontSize: 12.5, color: '#F87E92', margin: '4px 0 16px' }}>
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading} style={submitBtnStyle}>
            {loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : (mode === 'login' ? 'Sign In' : 'Create account')}
          </button>
        </form>

        <button
          type="button"
          onClick={() => onAuthSuccess(auth.devBypassLogin())}
          style={devBtnStyle}
        >
          ⚠ Skip login (dev mode) — remove before submission
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#C3D0FF', marginBottom: 8, fontWeight: 600 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function IconInput({ icon: Icon, trailingPadding, ...props }) {
  return (
    <div style={{ position: 'relative' }}>
      <Icon size={17} color="#5B6684" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
      <input
        {...props}
        style={{
          width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 9, padding: `12px ${trailingPadding ? 42 : 14}px 12px 42px`,
          color: '#F1F5F9', fontSize: 14, outline: 'none', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

const eyeBtnStyle = {
  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
  background: 'none', border: 'none', color: '#5B6684', display: 'flex', cursor: 'pointer', padding: 4,
};
const submitBtnStyle = {
  width: '100%', background: '#6C8CFF', color: '#0B1220', border: 'none', borderRadius: 10,
  padding: '13px 0', fontSize: 15, fontWeight: 700, marginTop: 6, cursor: 'pointer',
  boxShadow: '0 8px 24px rgba(108,140,255,0.25)',
};
const devBtnStyle = {
  width: '100%', background: 'transparent', color: '#5B6684', border: '1px dashed rgba(255,255,255,0.15)',
  borderRadius: 8, padding: '10px 0', fontSize: 11.5, marginTop: 16, cursor: 'pointer',
};