// All calls go through /api — Vite's dev proxy (see vite.config.js) forwards
// these to http://localhost:8080. In production, set VITE_API_BASE_URL in a
// .env file to point at the deployed backend instead.
const BASE = import.meta.env.VITE_API_BASE_URL || '';

// Reads token from localStorage so every request carries JWT for protected endpoints
function authHeaders() {
  const token = localStorage.getItem('token') || localStorage.getItem('sentinelcore_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.text();
      if (body) message = body;
    } catch {
      // ignore — fall back to status-based message
    }
    throw new Error(message);
  }
  // DELETE returns 204 No Content — no body to parse
  if (res.status === 204) return null;
  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${BASE}/api/health`);
  return handleResponse(res);
}

export async function getAssets() {
  const res = await fetch(`${BASE}/api/assets`, {
    headers: { ...authHeaders() }
  });
  return handleResponse(res);
}

export async function getAsset(assetId) {
  const res = await fetch(`${BASE}/api/assets/${assetId}`, {
    headers: { ...authHeaders() }
  });
  return handleResponse(res);
}

export async function createAsset(asset) {
  const res = await fetch(`${BASE}/api/assets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(asset),
  });
  return handleResponse(res);
}

export async function updateAsset(assetId, asset) {
  const res = await fetch(`${BASE}/api/assets/${assetId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(asset),
  });
  return handleResponse(res);
}

export async function deleteAsset(assetId) {
  const res = await fetch(`${BASE}/api/assets/${assetId}`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  });
  return handleResponse(res);
}

export async function updateMetrics(assetId, { cpuUsage, memoryUsage, diskUsage, networkUsage }) {
  const params = new URLSearchParams({
    cpuUsage: String(cpuUsage),
    memoryUsage: String(memoryUsage),
    diskUsage: String(diskUsage),
    networkUsage: String(networkUsage),
  });
  const res = await fetch(`${BASE}/api/monitoring/${assetId}?${params.toString()}`, {
    method: 'PUT',
    headers: { ...authHeaders() },
  });
  return handleResponse(res);
}