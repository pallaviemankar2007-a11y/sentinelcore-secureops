// Shared helpers computing real numbers from the real `assets` array —
// nothing here is mock data. Used by Dashboard, AlertsPage, CloudMonitoringPage,
// and NetworkMonitoringPage so the math stays consistent everywhere.

export function averageMetrics(assets) {
  if (assets.length === 0) return { cpu: 0, memory: 0, disk: 0, network: 0 };
  const sum = assets.reduce((acc, a) => ({
    cpu: acc.cpu + (a.cpuUsage ?? 0),
    memory: acc.memory + (a.memoryUsage ?? 0),
    disk: acc.disk + (a.diskUsage ?? 0),
    network: acc.network + (a.networkUsage ?? 0),
  }), { cpu: 0, memory: 0, disk: 0, network: 0 });
  const n = assets.length;
  return {
    cpu: Math.round(sum.cpu / n),
    memory: Math.round(sum.memory / n),
    disk: Math.round(sum.disk / n),
    network: Math.round(sum.network / n),
  };
}

// Matches the backend's own threshold logic in MonitoringServiceImpl:
// status becomes WARNING/CRITICAL based on cpu/memory/disk (network isn't
// part of the backend's threshold check, so we don't use it here either —
// this mirrors real backend behavior rather than inventing new rules).
export function getTriggeringMetric(asset) {
  const candidates = [
    { metric: 'CPU', value: asset.cpuUsage ?? 0 },
    { metric: 'Memory', value: asset.memoryUsage ?? 0 },
    { metric: 'Disk', value: asset.diskUsage ?? 0 },
  ];
  return candidates.reduce((max, c) => (c.value > max.value ? c : max), candidates[0]);
}

export function getAtRiskAssets(assets) {
  return assets
    .filter((a) => a.status === 'WARNING' || a.status === 'CRITICAL')
    .sort((a, b) => (a.status === 'CRITICAL' ? -1 : 1))
    .map((a) => ({ ...a, trigger: getTriggeringMetric(a) }));
}

export function filterByType(assets, type) {
  return assets.filter((a) => a.type === type);
}

export function countByStatus(assets) {
  return assets.reduce(
    (acc, a) => ({ ...acc, [a.status]: (acc[a.status] || 0) + 1 }),
    { HEALTHY: 0, WARNING: 0, CRITICAL: 0 }
  );
}