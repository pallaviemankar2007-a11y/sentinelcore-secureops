import React, { useState, useEffect } from 'react';

export default function ReportsPage() {
    const [reportsList, setReportsList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/reports');
            if (response.ok) {
                const data = await response.json();
                setReportsList(data);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleDownload = (report) => {
        // Direct download trigger from backend endpoint
        window.open(`http://localhost:8080/api/reports/download/${report.id}`, '_blank');
    };

    return (
        <div className="p-6 text-white bg-[#0B0F19] min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">System Reports</h1>
                    <p className="text-gray-400 text-sm">Real-time asset telemetry and health summary reports.</p>
                </div>
                <div className="text-xs text-gray-400 bg-[#161F30] px-3 py-1.5 rounded-full border border-gray-800">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                    Live DB Sync
                </div>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Syncing live report data...</div>
                ) : reportsList.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No assets found in database to generate reports.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-[#1F2937]/50 text-gray-400 uppercase text-xs tracking-wider border-b border-gray-800">
                        <tr>
                            <th className="p-4">Report ID</th>
                            <th className="p-4">Report Name</th>
                            <th className="p-4">Format</th>
                            <th className="p-4">Generated Date</th>
                            <th className="p-4">File Size</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/60">
                        {reportsList.map((r) => (
                            <tr key={r.id} className="hover:bg-[#1A2234]/60 transition-colors">
                                <td className="p-4 font-mono text-cyan-400 font-semibold text-xs">{r.id}</td>
                                <td className="p-4 text-white font-medium">{r.name}</td>
                                <td className="p-4">
                                        <span className="px-2 py-0.5 rounded text-xs font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                            {r.type}
                                        </span>
                                </td>
                                <td className="p-4 font-mono text-xs text-gray-400">{r.generatedAt}</td>
                                <td className="p-4 text-gray-400 text-xs font-mono">{r.size}</td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDownload(r)}
                                        className="px-3 py-1.5 bg-[#1F2937] hover:bg-gray-700 text-cyan-400 border border-gray-700 rounded-lg text-xs font-medium transition inline-flex items-center gap-1.5"
                                    >
                                        📥 Download CSV
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