const BASE_URL = '/api';

export async function fetchIncidents() {
    const res = await fetch(`${BASE_URL}/incidents`);
    return res.json();
}

export async function fetchVulnerabilities() {
    const res = await fetch(`${BASE_URL}/vulnerabilities`);
    return res.json();
}

export async function fetchAuditLogs() {
    const res = await fetch(`${BASE_URL}/audit-logs`);
    return res.json();
}

export async function fetchCompliance() {
    const res = await fetch(`${BASE_URL}/compliance`);
    return res.json();
}