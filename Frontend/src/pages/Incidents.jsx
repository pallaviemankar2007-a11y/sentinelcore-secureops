import React, { useState, useEffect } from 'react';
import { getAssets } from '../api/assets';

export default function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    const syncIncidentsFromAssets = async () => {
        try {
            // Fetch live registered assets from Spring Boot backend
            const assets = await getAssets();

            if (Array.isArray(assets)) {
                // Dynamically map incidents based on real asset metrics
                const dynamicIncidents = assets.map((asset, index) => {
                    const isCritical = asset.status === 'CRITICAL' || asset.cpuUsage >= 85;
                    const isWarning = asset.status === 'WARNING' || asset.cpuUsage >= 70;

                    let title = "Normal Operation Monitoring";
                    let severity = "LOW";
                    let status = "RESOLVED";

                    if (isCritical) {
                        title = `Critical Threshold Breach (CPU: ${asset.cpuUsage}%)`;
                        severity = "CRITICAL";
                        status = "OPEN";
                    } else if (isWarning) {
                        title = `High Resource Consumption (CPU: ${asset.cpuUsage}%)`;
                        severity = "HIGH";
                        status = "IN_PROGRESS";
                    }

                    return {
                        id: asset.id || `inc-${index}`,
                        ticketId: `INC-${(asset.name || 'ASSET').toUpperCase().slice(-6)}`,
                        title: title,
                        assetName: asset.name || 'Unknown Node',
                        severity: severity,
                        status: status,
                        assignedTo: isCritical ? "Security Ops Center" : "Unassigned",
                        lastChecked: asset.lastCheckedAt || new Date().toLocaleTimeString()
                    };
                });

                setIncidents(dynamicIncidents);
            }
        } catch (error) {
            console.error("Error fetching dynamic incidents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        syncIncidentsFromAssets();
        // Polling sync every 3 seconds to keep UI matching real-time metrics
        const interval = setInterval(syncIncidentsFromAssets, 3000);
        return () => clearInterval(interval);
    }, []);

    const toggleStatus = (id, currentStatus) => {
        const nextStatus = currentStatus === 'OPEN' ? 'IN_PROGRESS' : currentStatus === 'IN_PROGRESS' ? 'RESOLVED' : 'OPEN';
        setIncidents(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item));
    };

    return (
        <div className="p-6 text-white bg-[#0B0F19] min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Incidents Management</h1>
                    <p className="text-gray-400 text-sm">Real-time incident tickets dynamically evaluated from infrastructure telemetry.</p>
                </div>
                <div className="text-xs text-gray-400 bg-[#161F30] px-3 py-1.5 rounded-full border border-gray-800">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                    Live Asset Monitoring Sync
                </div>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading dynamic incidents...</div>
                ) : incidents.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No assets registered to monitor incidents.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-[#1F2937]/50 text-gray-400 uppercase text-xs tracking-wider border-b border-gray-800">
                        <tr>
                            <th className="p-4">Ticket ID</th>
                            <th className="p-4">Title / Trigger</th>
                            <th className="p-4">Target Asset</th>
                            <th className="p-4">Severity</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Assigned Team</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/60">
                        {incidents.map((inc) => (
                            <tr key={inc.id} className="hover:bg-[#1A2234]/60 transition-colors">
                                <td className="p-4 font-mono text-blue-400 font-semibold">{inc.ticketId}</td>
                                <td className="p-4 font-medium text-white">{inc.title}</td>
                                <td className="p-4 text-gray-300 font-mono text-xs">{inc.assetName}</td>
                                <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                                            inc.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                inc.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        }`}>
                                            {inc.severity}
                                        </span>
                                </td>
                                <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                                            inc.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                inc.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                            {inc.status}
                                        </span>
                                </td>
                                <td className="p-4 text-gray-400 text-xs">{inc.assignedTo}</td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => toggleStatus(inc.id, inc.status)}
                                        className="px-3 py-1.5 bg-[#1F2937] hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-xs font-medium transition"
                                    >
                                        Toggle Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}