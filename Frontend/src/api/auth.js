// Matches the auth API contract Person B's backend will expose:
//   POST /api/auth/signup  { username, email, password, role? } -> { token, username, role }
//   POST /api/auth/login   { username, password }               -> { token, username, role }
// Until that's merged, these calls will fail with a clear "backend unreachable"
// style error — that's expected, not a bug in this code.
const BASE = import.meta.env.VITE_API_BASE_URL || '';
const TOKEN_KEY = 'sentinelcore_token';
const USER_KEY = 'sentinelcore_user';

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.text();
      if (body) message = body;
    } catch {
      // ignore — fall back to the status-based message above
    }
    throw new Error(message);
  }
  return res.json();
}

function persistSession(data) {
  if (data?.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({ username: data.username, role: data.role }));
  }
  return data;
}

export async function login(username, password) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await handleResponse(res);
  return persistSession(data);
}

export async function signup({ username, email, password, role }) {
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, role }),
  });
  const data = await handleResponse(res);
  return persistSession(data);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}
// TEMPORARY — dev-only bypass until Person B's real auth endpoints exist.
// Sets a fake local session so the rest of the app is usable and testable.
// Remove this function (and its button in AuthPage.jsx) once real login works.
export function devBypassLogin() {
  const fakeData = { token: 'dev-mode-fake-token', username: 'dev-admin', role: 'ADMIN' };
  persistSession(fakeData);
  return fakeData;
}