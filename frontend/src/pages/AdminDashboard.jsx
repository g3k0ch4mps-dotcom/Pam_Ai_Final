import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Building, Activity, ShieldCheck, ArrowLeft, ExternalLink, Search, Bot, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../apiConfig';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            try {
                // Fetch Stats
                const statsRes = await fetch(API_URLS.admin.stats, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const statsData = await statsRes.json();
                if (statsData.success) setStats(statsData.data);

                // Fetch Tenants
                const tenantsRes = await fetch(API_URLS.admin.tenants, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const tenantsData = await tenantsRes.json();
                if (tenantsData.success) setTenants(tenantsData.data);

            } catch (err) {
                console.error('Admin Dashboard Load Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <ShieldCheck className="w-12 h-12 text-blue-500 mb-4" />
                <p className="text-white font-black uppercase tracking-[0.3em]">System Admin Secure Boot</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-sm font-black text-blue-500 uppercase tracking-widest">Global Controller</h2>
                        </div>
                        <h1 className="text-4xl font-black">System Administration</h1>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center hover:bg-white/10 transition-all font-bold group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Workspace
                    </button>
                </div>

                {/* Stats Grid */}
                {[
                    { label: 'Total Businesses', value: stats?.counts?.businesses || 0, icon: Building, color: 'blue' },
                    { label: 'Total User Accounts', value: stats?.counts?.users || 0, icon: Users, color: 'indigo' },
                    { label: 'Active Sessions', value: stats?.counts?.activeBusinesses || 0, icon: Activity, color: 'emerald' },
                ].map((s, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-blue-500/50 transition-colors">
                        <div className={`w-12 h-12 bg-${s.color}-500/20 rounded-2xl flex items-center justify-center mb-6 text-${s.color}-400`}>
                            <s.icon className="w-6 h-6" />
                        </div>
                        <p className="text-white/40 text-xs font-black uppercase tracking-widest">{s.label}</p>
                        <p className="text-4xl font-black mt-2">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Platform Training Section */}
            <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6 text-center md:text-left">
                    <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-600/20">
                        <Bot className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white">Platform Global AI</h3>
                        <p className="text-white/60 font-medium">Train the Pamilo AI that visitors interact with on the landing page.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/dashboard?as=pamilo')}
                    className="px-10 py-4 bg-white text-blue-600 font-black uppercase text-sm rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-white/5 flex items-center"
                >
                    Train Pamilo AI <ArrowRight className="ml-2 w-5 h-5" />
                </button>
            </div>

            {/* Main Content */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="text-xl font-black">Global Businesses</h3>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search by name or slug..."
                            className="bg-black/20 border border-white/5 rounded-full pl-10 pr-6 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.01]">
                                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Business Identity</th>
                                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Tier</th>
                                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Created</th>
                                <th className="px-8 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {tenants.map(t => (
                                <tr key={t._id} className="hover:bg-white/[0.03] transition-colors">
                                    <td className="px-8 py-6">
                                        <p className="font-black text-white">{t.businessName}</p>
                                        <p className="text-xs text-white/40 font-mono mt-0.5">slug://{t.businessSlug}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${t.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {t.isActive ? 'Active' : 'Suspended'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-black border border-white/10 px-2 py-1 rounded-lg uppercase tracking-tighter text-white/60">
                                            {t.subscription?.plan || 'Free'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-white/50 font-medium">
                                        {new Date(t.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-3 bg-white/5 rounded-xl hover:bg-blue-600 transition-all group">
                                            <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
