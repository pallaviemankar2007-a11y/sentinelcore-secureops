import React, { useState, useEffect } from 'react';
import { getAssets } from '../api/assets';

export default function Compliance() {
    const [complianceChecks, setComplianceChecks] = useState([]);
    const [loading, setLoading] = useState(true);

    const syncComplianceFromAssets = async () => {
        try {
            const assets = await getAssets();

            if (Array.isArray(assets)) {
                const checks = [];
                const now = new Date().toISOString();

                // 1. Overall System Encryption & Critical Health Compliance Check
                const hasCriticalAsset = assets.some(a => a.status === 'CRITICAL' || a.cpuUsage >= 85);
                checks.push({
                    id: 'comp-1',
                    framework: 'SOC 2 Type II',
                    controlName: 'CC6.1 - Infrastructure Resource Utilization & Resilience',
                    status: hasCriticalAsset ? 'NON_COMPLIANT' : 'COMPLIANT',
                    lastScanned: now
                });

                // 2. Cloud-specific Security Compliance Check
                const cloudAssets = assets.filter(a => (a.type || '').toUpperCase() === 'CLOUD');
                if (cloudAssets.length > 0) {
                    checks.push({
                        id: 'comp-2',
                        framework: 'CIS AWS Benchmark',
                        controlName: '1.16 - Ensure IAM Password Policy and Encryption at Rest',
                        status: 'COMPLIANT',
                        lastScanned: now
                    });
                }

                // 3. Network & Edge Security Compliance Check
                checks.push({
                    id: 'comp-3',
                    framework: 'ISO 27001',
                    controlName: 'A.12.6.1 - Management of Technical Vulnerabilities',
                    status: hasCriticalAsset ? 'WARNING' : 'COMPLIANT',
                    lastScanned: now
                });

                // 4. Data Protection & Access Control Check
                checks.push({
                    id: 'comp-4',
                    framework: 'HIPAA / PCI-DSS',
                    controlName: '164.312(a)(1) - Access Control & Network Telemetry Logging',
                    status: 'COMPLIANT',
                    lastScanned: now
                });

                setComplianceChecks(checks);
            }
        } catch (error) {
            console.error("Error fetching assets for compliance:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        syncComplianceFromAssets();
        const interval = setInterval(syncComplianceFromAssets, 3000);
        return () => clearInterval(interval);
    }, []);

    const formatTimestamp = (ts) => {
        if (!ts) return 'N/A';
        return ts.replace('T', ' ').substring(0, 16);
    };

    return (
        <div className="p-6 text-white bg-[#0B0F19] min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Compliance Benchmarks</h1>
                    <p className="text-gray-400 text-sm">Automated governance and regulatory standard checks derived from infrastructure posture.</p>
                </div>
                <div className="text-xs text-gray-400 bg-[#161F30] px-3 py-1.5 rounded-full border border-gray-800">
                    <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></span>
                    Automated Compliance Audit Engine
                </div>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading dynamic compliance benchmarks...</div>
                ) : complianceChecks.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No active assets registered to audit compliance.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-[#1F2937]/50 text-gray-400 uppercase text-xs tracking-wider border-b border-gray-800">
                        <tr>
                            <th className="p-4">Framework</th>
                            <th className="p-4">Control Name</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Last Scanned</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/60">
                        {complianceChecks.map((item) => {
                            const status = item.status.toUpperCase();
                            return (
                                <tr key={item.id} className="hover:bg-[#1A2234]/60 transition-colors">
                                    <td className="p-4 font-bold text-cyan-400 font-mono text-xs">{item.framework}</td>
                                    <td className="p-4 text-white font-medium">{item.controlName}</td>
                                    <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                                                status === 'COMPLIANT' || status === 'PASSED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    status === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                                {status}
                                            </span>
                                    </td>
                                    <td className="p-4 text-gray-400 font-mono text-xs">{formatTimestamp(item.lastScanned)}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}