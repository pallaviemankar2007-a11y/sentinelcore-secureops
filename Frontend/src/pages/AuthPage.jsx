import { useState } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import * as auth from '../api/auth';

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B1220' }}>
      <div style={{ width: 360, maxWidth: '90vw' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(108,140,255,0.15)', border: '1px solid rgba(108,140,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <ShieldCheck size={20} color="#A3B4FF" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#E2E8F0' }}>SentinelCore SecureOps</div>
          <div style={{ fontSize: 12, color: '#5B6684', marginTop: 2 }}>Infrastructure Monitoring</div>
        </div>

        <div style={{ background: '#0F1830', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
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
                  textTransform: 'capitalize',
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
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#3E4867', marginTop: 16 }}>
          Infosys Springboard 7.0 · Milestone 1
        </p>
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