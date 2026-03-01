import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogOut, Upload, FileText, Trash2, Settings, MessageSquare,
    ExternalLink, LayoutDashboard, Ticket, BarChart3, CreditCard,
    Users, Activity, Globe, ChevronRight, ShieldCheck
} from 'lucide-react';
import { io } from 'socket.io-client';
import { API_URLS } from '../apiConfig';
import URLManager from '../components/URLManager';
import Leads from './Leads';
import Tickets from './Tickets';
import Billing from './Billing';
import Inbox from './Inbox';
import Analytics from './Analytics';
import SettingsView from './Settings';
import Team from './Team';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [business, setBusiness] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [visitors, setVisitors] = useState([]);
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [documents, setDocuments] = useState([]);

    // Load Data & Initialize Socket
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const fetchData = async () => {
            try {
                // 1. Get Me
                const meRes = await fetch(API_URLS.auth.me, { headers: { Authorization: `Bearer ${token}` } });
                const meData = await meRes.json();

                if (!meData.success) {
                    localStorage.removeItem('token');
                    return navigate('/login');
                }

                const currentUser = meData.data.user;
                setUser(currentUser);

                // Handle "Act as" for Super Admin
                const params = new URLSearchParams(window.location.search);
                const actAsSlug = params.get('as');

                let targetBusiness = meData.data.business;
                let businessId = targetBusiness?.id;

                if (actAsSlug && currentUser.role === 'super_admin') {
                    // Fetch target business by slug
                    const bizRes = await fetch(`${API_URLS.admin.tenants}?slug=${actAsSlug}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const bizData = await bizRes.json();
                    if (bizData.success && bizData.data.length > 0) {
                        // Find the specifically requested slug (since listAllBusinesses might return an array)
                        const matchingBiz = bizData.data.find(b => b.businessSlug === actAsSlug) || bizData.data[0];
                        targetBusiness = {
                            id: matchingBiz._id,
                            businessName: matchingBiz.businessName,
                            businessSlug: matchingBiz.businessSlug
                        };
                        businessId = targetBusiness.id;
                        console.log(`Super Admin acting as: ${actAsSlug}`);
                    }
                }

                if (targetBusiness) setBusiness(targetBusiness);

                // 2. Get Stats (Protected by business context on backend)
                const statsRes = await fetch(API_URLS.v1.dashboard, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'x-business-id': businessId // Optional: helper for backend if standard context fails
                    }
                });
                const statsData = await statsRes.json();
                if (statsData.success) setStats(statsData.data);

                // 3. Get Documents
                fetchDocuments(token);

                // 4. Initialize Socket
                const newSocket = io(import.meta.env.VITE_API_BASE_URL || '', {
                    path: '/socket.io',
                    auth: { businessId: businessId }
                });
                setSocket(newSocket);

                newSocket.on('visitor-online', (visitor) => {
                    setVisitors(prev => [...prev.filter(v => v.sessionId !== visitor.sessionId), visitor]);
                });

                newSocket.on('visitor-offline', (sessionId) => {
                    setVisitors(prev => prev.filter(v => v.sessionId !== sessionId));
                });

                newSocket.on('visitor-moved', (data) => {
                    setVisitors(prev => prev.map(v => v.sessionId === data.sessionId ? { ...v, currentPage: data.page } : v));
                });

            } catch (err) {
                console.error('Dashboard Load Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            if (socket) socket.disconnect();
        };
    }, [navigate]);

    const fetchDocuments = async (token) => {
        const res = await fetch(API_URLS.documents.base, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setDocuments(data.data);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('document', file);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(API_URLS.documents.upload, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                alert('Upload Successful');
                fetchDocuments(business?.id, token);
            } else {
                alert('Upload Failed: ' + data.error?.message);
            }
        } catch (err) {
            alert('Upload Error');
        }
    };

    const handleDeleteDoc = async (id) => {
        if (!confirm('Are you sure?')) return;
        const token = localStorage.getItem('token');
        await fetch(`${API_URLS.documents.base}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        fetchDocuments(business?.id, token);
    };

    const togglePublicChat = async () => {
        // Toggle logic using PUT /api/business/:id/settings
        // Not fully implemented in this simple UI for brevity but placeholder here
        alert("Feature: Toggle Public Chat (Not implemented in UI demo)");
    };

    if (loading) return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center animate-bounce shadow-xl shadow-blue-200">
                    <Activity className="text-white w-8 h-8" />
                </div>
                <p className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">Initializing Pamilo AI</p>
            </div>
        </div>
    );

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'inbox', label: 'Inbox', icon: MessageSquare },
        { id: 'tickets', label: 'Tickets', icon: Ticket },
        { id: 'leads', label: 'Leads', icon: Users },
        { id: 'documents', label: 'Knowledge Base', icon: FileText },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'team', label: 'Team', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col fixed h-full z-20">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Pamilo AI</h1>
                    <div className="mt-4 px-3 py-2 bg-blue-50 rounded-lg flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-blue-700 uppercase truncate">
                            {business?.businessName || 'Pro Account'}
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 group'
                                }`}
                        >
                            <item.icon className={`mr-3 h-5 w-5 ${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign Out
                    </button>

                    {user?.role === 'super_admin' && (
                        <button
                            onClick={() => navigate('/admin')}
                            className="w-full mt-2 flex items-center px-4 py-2 text-sm font-bold text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                        >
                            <ShieldCheck className="mr-3 h-4 w-4" />
                            System Admin
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8">
                {user?.role === 'super_admin' && business?.id !== user?.businessId && (
                    <div className="mb-6 bg-amber-500 text-white px-6 py-2 rounded-xl flex items-center justify-between shadow-lg shadow-amber-500/20 animate-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center space-x-3">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-sm font-black uppercase tracking-widest">
                                Oversight Mode: Acting as <span className="underline">{business?.businessName}</span>
                            </span>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-[10px] font-black uppercase bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-all shadow-sm"
                        >
                            Exit Oversight
                        </button>
                    </div>
                )}
                <div className="max-w-6xl mx-auto">
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900">Welcome back!</h2>
                                    <p className="text-gray-500 mt-1 font-medium">Here's what's happening with Pamilo AI today.</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Status</div>
                                    <div className="flex items-center text-green-500 mt-1 font-bold">
                                        <Activity className="w-4 h-4 mr-2" /> Systems Online
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Conversations', value: stats?.conversations || 0, icon: MessageSquare, color: 'blue' },
                                    { label: 'Total Leads', value: stats?.leads || 0, icon: Users, color: 'purple' },
                                    { label: 'Active Tickets', value: stats?.tickets?.open || 0, icon: Ticket, color: 'orange' },
                                    { label: 'Live Visitors', value: visitors.length, icon: Globe, color: 'green' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                                        <div className={`w-12 h-12 bg-${stat.color}-50 rounded-xl flex items-center justify-center mb-4 text-${stat.color}-600`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <p className="text-gray-500 text-sm font-bold uppercase tracking-tight">{stat.label}</p>
                                        <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Online Visitors List */}
                                <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
                                    <div className="p-6 border-b flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-gray-900">Live Traffic</h3>
                                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-black rounded-full uppercase">Real-time</span>
                                    </div>
                                    <div className="divide-y max-h-[400px] overflow-y-auto">
                                        {visitors.length === 0 ? (
                                            <div className="p-12 text-center text-gray-400">
                                                <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                <p className="font-bold">No active visitors right now</p>
                                            </div>
                                        ) : (
                                            visitors.map((v, i) => (
                                                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                                                            {v.location?.country?.slice(0, 2) || '??'}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{v.sessionId.slice(0, 8)}...</p>
                                                            <p className="text-xs text-gray-500">{v.location?.city || 'Unknown Location'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-bold text-blue-600">{v.currentPage}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">Just now</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Active Tickets Summary */}
                                <div className="bg-white rounded-2xl border shadow-sm p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Tickets Overview</h3>
                                    <div className="space-y-4">
                                        {Object.entries(stats?.tickets || {}).filter(([k]) => k !== 'total').map(([status, count]) => (
                                            <div key={status} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className={`w-2 h-2 rounded-full mr-3 ${status === 'open' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                                    <span className="text-sm font-bold text-gray-600 capitalize">{status.replace('_', ' ')}</span>
                                                </div>
                                                <span className="text-sm font-black text-gray-900">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('tickets')}
                                        className="w-full mt-8 py-3 bg-gray-50 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
                                    >
                                        View Board <ChevronRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="bg-white rounded-2xl border shadow-sm p-8 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Knowledge Base</h2>
                                    <p className="text-gray-500 font-medium">Train your AI with documents and website URLs.</p>
                                </div>
                                <label className="flex items-center cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-200">
                                    <Upload className="w-5 h-5 mr-2" />
                                    Upload Data
                                    <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.docx,.txt" />
                                </label>
                            </div>

                            <div className="space-y-4">
                                {documents.length === 0 ? (
                                    <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed">
                                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-bold text-lg">Your Knowledge Base is empty</p>
                                        <p className="text-gray-400 text-sm mt-1">Upload a PDF or Word document to get started.</p>
                                    </div>
                                ) : (
                                    documents.map(doc => (
                                        <div key={doc._id} className="flex items-center justify-between p-5 border rounded-2xl bg-white hover:border-blue-200 transition-colors group">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-black text-gray-900 leading-none">{doc.originalName}</p>
                                                    <p className="text-xs text-gray-500 mt-1 font-bold">{(doc.size / 1024).toFixed(1)} KB • {new Date(doc.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteDoc(doc._id)} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-12 pt-8 border-t">
                                <URLManager businessId={business?.id} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'leads' && <Leads />}
                    {activeTab === 'inbox' && <Inbox />}
                    {activeTab === 'tickets' && <Tickets />}
                    {activeTab === 'billing' && <Billing />}

                    {activeTab === 'analytics' && <Analytics />}
                    {activeTab === 'team' && <Team />}
                    {activeTab === 'settings' && <SettingsView business={business} user={user} />}
                </div>
            </main>
        </div>
    );
}
