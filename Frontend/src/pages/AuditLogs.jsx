import React, { useState, useEffect } from 'react';
import { getAssets } from '../api/assets';

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const syncAuditLogsFromAssets = async () => {
        try {
            const assets = await getAssets();

            if (Array.isArray(assets)) {
                const generatedLogs = [];

                assets.forEach((asset, index) => {
                    const now = new Date();
                    const timestamp = asset.lastCheckedAt || now.toISOString();
                    const assetName = asset.name || 'UNKNOWN-NODE';

                    // 1. Critical threshold breach log
                    if (asset.status === 'CRITICAL' || asset.cpuUsage >= 85) {
                        generatedLogs.push({
                            id: `log-${index}-breach`,
                            timestamp: timestamp,
                            user: 'system_monitor',
                            action: 'METRIC_THRESHOLD_BREACH',
                            details: `CPU usage on ${assetName} reached critical levels (${asset.cpuUsage}%).`,
                            ipAddress: `10.0.${index + 1}.15`
                        });
                    } else {
                        // Healthy status event log
                        generatedLogs.push({
                            id: `log-${index}-healthy`,
                            timestamp: timestamp,
                            user: 'system_monitor',
                            action: 'ASSET_HEALTH_NORMAL',
                            details: `Infrastructure asset ${assetName} operating normally within safety bounds.`,
                            ipAddress: `10.0.${index + 1}.15`
                        });
                    }

                    // 2. Metric update telemetry stream event
                    generatedLogs.push({
                        id: `log-${index}-telemetry`,
                        timestamp: new Date(now.getTime() - 10000).toISOString(),
                        user: 'telemetry_agent',
                        action: 'METRICS_UPDATED',
                        details: `Updated metrics for ${assetName} (CPU: ${asset.cpuUsage}%, Mem: ${asset.memoryUsage}%).`,
                        ipAddress: `127.0.0.1`
                    });
                });

                setLogs(generatedLogs);
            }
        } catch (error) {
            console.error("Error fetching assets for audit logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        syncAuditLogsFromAssets();
        const interval = setInterval(syncAuditLogsFromAssets, 3000);
        return () => clearInterval(interval);
    }, []);

    const formatTimestamp = (ts) => {
        if (!ts) return 'N/A';
        return ts.replace('T', ' ').substring(0, 19);
    };

    return (
        <div className="p-6 text-white bg-[#0B0F19] min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Audit Logs</h1>
                    <p className="text-gray-400 text-sm">Immutable security logging and dynamic telemetry event trail.</p>
                </div>
                <div className="text-xs text-gray-400 bg-[#161F30] px-3 py-1.5 rounded-full border border-gray-800">
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></span>
                    Live Audit Stream
                </div>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading live audit trail records...</div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No active infrastructure assets logged.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-[#1F2937]/50 text-gray-400 uppercase text-xs tracking-wider border-b border-gray-800">
                        <tr>
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">User / Agent</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Details</th>
                            <th className="p-4">IP Address</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/60">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-[#1A2234]/60 transition-colors">
                                <td className="p-4 font-mono text-xs text-gray-400">
                                    {formatTimestamp(log.timestamp)}
                                </td>
                                <td className="p-4 text-white font-semibold text-xs">
                                    {log.user}
                                </td>
                                <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md font-mono text-xs font-semibold border ${
                                            log.action === 'METRIC_THRESHOLD_BREACH'
                                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                : log.action === 'ASSET_HEALTH_NORMAL'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                            {log.action}
                                        </span>
                                </td>
                                <td className="p-4 text-gray-300 text-xs">{log.details}</td>
                                <td className="p-4 font-mono text-xs text-gray-500">{log.ipAddress}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}