import { useState } from 'react';
import { ShieldCheck, AlertCircle, Server, Activity, LayoutDashboard } from 'lucide-react';
import * as auth from '../api/auth';

const FEATURES = [
  { icon: Server, text: 'Full asset inventory — create, edit, retire' },
  { icon: Activity, text: 'Live health status across servers, cloud, network' },
  { icon: LayoutDashboard, text: 'One dashboard for the whole fleet' },
];

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
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
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0B1220' }}>
      {/* Left: branded glow panel */}
      <div style={{
        flex: '1 1 420px', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 56px', borderRight: '1px solid rgba(255,255,255,0.06)',
        minWidth: 340,
      }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: 340, height: 340, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,140,255,0.35), transparent 70%)',
          filter: 'blur(10px)', animation: 'float-slow 12s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-5%', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.25), transparent 70%)',
          filter: 'blur(10px)', animation: 'float-slow-reverse 14s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, animation: 'fade-up 0.5s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(108,140,255,0.15)', border: '1px solid rgba(108,140,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={17} color="#A3B4FF" />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#E2E8F0' }}>SentinelCore SecureOps</div>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#E2E8F0', lineHeight: 1.3, margin: '0 0 12px', maxWidth: 340 }}>
            Watch your infrastructure, not your inbox.
          </h1>
          <p style={{ fontSize: 13.5, color: '#8B98B0', lineHeight: 1.6, margin: '0 0 32px', maxWidth: 320 }}>
            One place to track every server, cloud resource, and network device you're responsible for.
          </p>

          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(45,212,191,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={13} color="#5EEAD4" />
                </div>
                <span style={{ fontSize: 12.5, color: '#8B98B0' }}>{f.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: form */}
      <div style={{ flex: '1 1 420px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: 360, maxWidth: '100%', animation: 'fade-up 0.5s ease 0.1s both' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#E2E8F0' }}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </div>
            <div style={{ fontSize: 12.5, color: '#5B6684', marginTop: 3 }}>
              {mode === 'login' ? 'Log in to keep watching your fleet.' : 'Set up access to the monitoring dashboard.'}
            </div>
          </div>

          <div style={{ display: 'flex', marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 3 }}>
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1, padding: '7px 0', borderRadius: 6, border: 'none', fontSize: 12.5, fontWeight: 600,
                  background: mode === m ? '#6C8CFF' : 'transparent',
                  color: mode === m ? '#0B1220' : '#8B98B0',
                  textTransform: 'capitalize', transition: 'background 0.15s ease',
                }}
              >
                {m === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <Field label="Username">
              <input autoFocus value={form.username} onChange={(e) => update('username', e.target.value)} style={inputStyle} />
            </Field>

            {mode === 'signup' && (
              <Field label="Email">
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} style={inputStyle} />
              </Field>
            )}

            <Field label="Password">
              <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} style={inputStyle} />
            </Field>

            {error && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', fontSize: 12, color: '#F87E92', margin: '4px 0 12px' }}>
                <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} style={submitBtnStyle}>
              {loading ? (mode === 'login' ? 'Logging in…' : 'Creating account…') : (mode === 'login' ? 'Log in' : 'Create account')}
            </button>
          </form>

          <button
            type="button"
            onClick={() => onAuthSuccess(auth.devBypassLogin())}
            style={devBtnStyle}
          >
            ⚠ Skip login (dev mode) — remove before submission
          </button>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#3E4867', marginTop: 20 }}>
            Infosys Springboard 7.0 · Milestone 1
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, color: '#8B98B0', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 6, padding: '9px 11px', color: '#E2E8F0', fontSize: 13, outline: 'none',
};
const submitBtnStyle = {
  width: '100%', background: '#6C8CFF', color: '#0B1220', border: 'none', borderRadius: 7,
  padding: '10px 0', fontSize: 13, fontWeight: 600, marginTop: 4,
};
const devBtnStyle = {
  width: '100%', background: 'transparent', color: '#5B6684', border: '1px dashed rgba(255,255,255,0.15)',
  borderRadius: 7, padding: '8px 0', fontSize: 11.5, marginTop: 10, cursor: 'pointer',
};