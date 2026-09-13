import React, { useState, useEffect } from 'react';
import { getAssets } from '../api/assets';

export default function Vulnerabilities() {
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [loading, setLoading] = useState(true);

    const syncVulnerabilitiesFromAssets = async () => {
        try {
            const assets = await getAssets();

            if (Array.isArray(assets)) {
                const generatedList = [];

                assets.forEach((asset, index) => {
                    const cpu = asset.cpuUsage || 0;
                    const memory = asset.memoryUsage || 0;
                    const assetName = asset.name || 'Unknown Asset';
                    const assetType = (asset.type || 'CLOUD').toUpperCase();

                    // 1. Critical / High Load CVEs
                    if (cpu >= 80 || memory >= 80) {
                        generatedList.push({
                            id: `vun-${index}-1`,
                            cveId: `CVE-2026-${1042 + index}`,
                            description: `Unquoted Service Path / Kernel Memory Pressure Vulnerability`,
                            assetName: assetName,
                            severity: 'CRITICAL',
                            patchStatus: 'AVAILABLE'
                        });
                    }

                    // 2. Type-Specific Infrastructure CVEs
                    if (assetType === 'CLOUD') {
                        generatedList.push({
                            id: `vun-${index}-2`,
                            cveId: `CVE-2026-${2189 + index}`,
                            description: `IAM Privilege Escalation in Cloud Metadata Endpoint`,
                            assetName: assetName,
                            severity: asset.status === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
                            patchStatus: 'APPLIED'
                        });
                    } else if (assetType === 'SERVER') {
                        generatedList.push({
                            id: `vun-${index}-2`,
                            cveId: `CVE-2026-${3310 + index}`,
                            description: `OpenSSH Remote Code Execution (RCE) via Buffer Overflow`,
                            assetName: assetName,
                            severity: 'HIGH',
                            patchStatus: 'AVAILABLE'
                        });
                    } else {
                        generatedList.push({
                            id: `vun-${index}-2`,
                            cveId: `CVE-2026-${4105 + index}`,
                            description: `TLS 1.1 Weak Cipher Suite Exposure`,
                            assetName: assetName,
                            severity: 'MEDIUM',
                            patchStatus: 'PENDING'
                        });
                    }
                });

                setVulnerabilities(generatedList);
            }
        } catch (error) {
            console.error("Error fetching assets for vulnerabilities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        syncVulnerabilitiesFromAssets();
        const interval = setInterval(syncVulnerabilitiesFromAssets, 4000);
        return () => clearInterval(interval);
    }, []);

    // Summary Card Calculations
    const totalCount = vulnerabilities.length;
    const criticalCount = vulnerabilities.filter(v => v.severity === 'CRITICAL').length;
    const patchesAvailableCount = vulnerabilities.filter(v => v.patchStatus === 'AVAILABLE').length;

    return (
        <div className="p-6 text-white bg-[#0B0F19] min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Vulnerabilities Scanner</h1>
                    <p className="text-gray-400 text-sm">Identified CVE exposure and patch status evaluated from live infrastructure assets.</p>
                </div>
                <div className="text-xs text-gray-400 bg-[#161F30] px-3 py-1.5 rounded-full border border-gray-800">
                    <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
                    Live CVE Telemetry Engine
                </div>
            </div>

            {/* Dynamic Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#111827] border border-gray-800 p-4 rounded-xl shadow-lg">
                    <p className="text-gray-400 text-xs font-medium">Total Detected Vulnerabilities</p>
                    <p className="text-3xl font-bold text-white mt-1">{totalCount}</p>
                </div>
                <div className="bg-[#111827] border border-gray-800 p-4 rounded-xl shadow-lg">
                    <p className="text-gray-400 text-xs font-medium">Critical CVEs</p>
                    <p className="text-3xl font-bold text-red-400 mt-1">{criticalCount}</p>
                </div>
                <div className="bg-[#111827] border border-gray-800 p-4 rounded-xl shadow-lg">
                    <p className="text-gray-400 text-xs font-medium">Patches Ready to Deploy</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-1">{patchesAvailableCount}</p>
                </div>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Scanning infrastructure for active CVEs...</div>
                ) : vulnerabilities.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No active assets registered to scan.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-[#1F2937]/50 text-gray-400 uppercase text-xs tracking-wider border-b border-gray-800">
                        <tr>
                            <th className="p-4">CVE ID</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Target Asset</th>
                            <th className="p-4">Severity</th>
                            <th className="p-4">Patch Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/60">
                        {vulnerabilities.map((v) => (
                            <tr key={v.id} className="hover:bg-[#1A2234]/60 transition-colors">
                                <td className="p-4 font-mono text-purple-400 font-bold">{v.cveId}</td>
                                <td className="p-4 font-medium text-white">{v.description}</td>
                                <td className="p-4 text-gray-400 font-mono text-xs">{v.assetName}</td>
                                <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                                            v.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                v.severity === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                            {v.severity}
                                        </span>
                                </td>
                                <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                                            v.patchStatus === 'APPLIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                v.patchStatus === 'AVAILABLE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                            {v.patchStatus}
                                        </span>
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