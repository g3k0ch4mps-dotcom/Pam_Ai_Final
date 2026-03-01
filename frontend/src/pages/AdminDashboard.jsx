import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Building, Activity, ShieldCheck, ArrowLeft, ExternalLink, Search, Bot, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../apiConfig';
import ThemeToggle from '../components/ThemeToggle';

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
        <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
            <div className="animate-pulse flex flex-col items-center">
                <ShieldCheck className="w-12 h-12 text-blue-500 mb-4" />
                <p className="text-gray-900 dark:text-white font-black uppercase tracking-[0.3em]">System Admin Secure Boot</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-white p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.2em]">Global Controller</h2>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">System Administration</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl flex items-center hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-bold group shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Workspace
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Total Businesses', value: stats?.counts?.businesses || 0, icon: Building, color: 'blue' },
                        { label: 'Total User Accounts', value: stats?.counts?.users || 0, icon: Users, color: 'indigo' },
                        { label: 'Active Sessions', value: stats?.counts?.activeBusinesses || 0, icon: Activity, color: 'emerald' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-[2rem] hover:border-blue-500/50 transition-all shadow-sm hover:shadow-md">
                            <div className={`w-12 h-12 ${s.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : s.color === 'indigo' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'} rounded-2xl flex items-center justify-center mb-6`}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                            <p className="text-4xl font-black mt-2 text-gray-900 dark:text-white">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Platform Training Section */}
                <div className="bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-600/20 dark:to-indigo-600/20 border border-blue-500/10 dark:border-blue-500/30 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center space-x-8 text-center md:text-left">
                        <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-600/40">
                            <Bot className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Platform Global AI</h3>
                            <p className="text-gray-500 dark:text-slate-400 font-medium max-w-md mt-1">Train the Pamilo AI that visitors interact with on the landing page global interceptor.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard?as=pamilo')}
                        className="px-10 py-5 bg-white dark:bg-white text-blue-600 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-blue-500/20 flex items-center"
                    >
                        Train Pamilo AI <ArrowRight className="ml-3 w-5 h-5" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-white/[0.02]">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Global Businesses</h3>
                        <div className="relative w-full sm:w-auto">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600" />
                            <input
                                type="text"
                                placeholder="Search by name or slug..."
                                className="bg-white dark:bg-black/20 border border-gray-200 dark:border-slate-800 rounded-full pl-10 pr-6 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full sm:w-80 transition-all"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-white/[0.01]">
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Business Identity</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Tier</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Created</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
                                {tenants.map(t => (
                                    <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-black text-gray-900 dark:text-white">{t.businessName}</p>
                                            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-mono mt-1 uppercase">slug://{t.businessSlug}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${t.isActive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' : 'bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-100 dark:border-red-500/20'}`}>
                                                {t.isActive ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg uppercase tracking-widest text-gray-600 dark:text-slate-400">
                                                {t.subscription?.plan || 'Free'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-gray-500 dark:text-slate-500 font-bold uppercase text-[10px] tracking-tighter">
                                            {new Date(t.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all group">
                                                <ExternalLink className="w-4 h-4 text-gray-400 dark:text-white/40 group-hover:text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {tenants.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <Building className="w-12 h-12 text-gray-200 dark:text-slate-800 mx-auto mb-4" />
                                            <p className="text-gray-400 dark:text-slate-600 font-black uppercase tracking-widest">No spectral traces found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
