import React, { useState, useEffect } from 'react';

export default function UsersPage() {
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users');
            if (response.ok) {
                const data = await response.json();
                setUsersList(data);
            }
        } catch (error) {
            console.error("Error fetching users from backend:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 5000);
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
                    <h1 className="text-2xl font-bold mb-1">User Access & Management</h1>
                    <p className="text-gray-400 text-sm">Manage system administrators, operators, and role-based access control.</p>
                </div>
                <div className="text-xs text-gray-400 bg-[#161F30] px-3 py-1.5 rounded-full border border-gray-800">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                    IAM & RBAC Directory
                </div>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading user accounts...</div>
                ) : usersList.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No registered users found in backend database.</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-[#1F2937]/50 text-gray-400 uppercase text-xs tracking-wider border-b border-gray-800">
                        <tr>
                            <th className="p-4">User ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Last Active</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/60">
                        {usersList.map((u, index) => (
                            <tr key={u.id || index} className="hover:bg-[#1A2234]/60 transition-colors">
                                <td className="p-4 font-mono text-cyan-400 text-xs font-semibold">{u.userId || u.id || `USR-0${index + 1}`}</td>
                                <td className="p-4 text-white font-medium">{u.name || u.username}</td>
                                <td className="p-4 text-gray-400 text-xs font-mono">{u.email}</td>
                                <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                                            u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                            {u.role || 'USER'}
                                        </span>
                                </td>
                                <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                                            u.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'
                                        }`}>
                                            {u.status || 'ACTIVE'}
                                        </span>
                                </td>
                                <td className="p-4 font-mono text-xs text-gray-400">{formatTimestamp(u.lastLogin)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}