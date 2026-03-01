import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Zap, Activity, Download, ChevronRight, MessageCircle } from 'lucide-react';
import { API_URLS } from '../apiConfig';
// import './Leads.css'; // Removing legacy CSS in favor of utility classes

// but will ensure it's clean.

function Leads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedLead, setSelectedLead] = useState(null);

    // In a real app, businessId comes from auth context or local storage after login
    // For this demo, let's assume we retrieve it from localStorage or hardcode for dev if needed
    const businessId = localStorage.getItem('business_id');

    useEffect(() => {
        if (businessId) {
            fetchLeads();
        } else {
            setLoading(false);
            // Maybe redirect to login?
        }
    }, [filter, businessId]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Construct URL with query params
            const url = new URL(`${API_URLS.leads.base}/business/${businessId}`);

            if (filter === 'email') url.searchParams.append('hasEmail', 'true');
            if (filter === 'hot') url.searchParams.append('minScore', '50');
            if (filter === 'veryhot') url.searchParams.append('minScore', '70');
            if (filter === 'new') url.searchParams.append('status', 'new');

            const response = await fetch(url.toString(), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setLeads(data.leads);
            } else {
                console.error('Failed to load leads:', data.message);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportLeads = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${API_URLS.leads.base}/business/${businessId}/export/csv`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting leads:', error);
            alert('Failed to export leads');
        }
    };

    const getScoreColor = (score) => {
        if (score >= 70) return 'text-red-500 font-bold'; // Hot
        if (score >= 40) return 'text-orange-500 font-semibold'; // Warm
        return 'text-blue-400'; // Cold
    };

    const getScoreLabel = (score) => {
        if (score >= 70) return '🔥 Hot';
        if (score >= 40) return '⚡ Warm';
        return '❄️ Cold';
    };

    if (!businessId) {
        return <div className="p-8 text-center">Please log in to view leads.</div>;
    }

    if (loading && leads.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Customer Leads</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">Track and manage your potential customers captured by Pam AI.</p>
                </div>
                <div className="flex gap-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    >
                        <option value="all">All Channels</option>
                        <option value="email">Has Contact Info</option>
                        <option value="hot">High Intent (50+)</option>
                        <option value="veryhot">Immediate Action (70+)</option>
                        <option value="new">Newly Captured</option>
                    </select>

                    <button onClick={exportLeads} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition active:scale-95">
                        <Activity className="w-4 h-4 text-green-500" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={<Users className="w-6 h-6 text-blue-600" />} label="Total Pipeline" value={leads.length} color="blue" />
                <StatCard icon={<Mail className="w-6 h-6 text-purple-600" />} label="With Email" value={leads.filter(l => l.email).length} color="purple" />
                <StatCard icon={<Activity className="w-6 h-6 text-orange-600" />} label="Active Status" value={leads.filter(l => l.status === 'new').length} color="orange" />
                <StatCard icon={<Zap className="w-6 h-6 text-red-600" />} label="High Intent" value={leads.filter(l => l.leadScore >= 50).length} highlight color="red" />
            </div>

            {/* Leads Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
                {leads.length === 0 ? (
                    <div className="p-20 text-center text-gray-400 dark:text-slate-500">
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">No leads found</h3>
                        <p className="font-medium">Pam AI hasn't captured any leads matching your criteria yet.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F8FAFC] dark:bg-slate-800/50 text-gray-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-gray-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-5">Customer Name</th>
                                <th className="px-6 py-5">Contact Details</th>
                                <th className="px-6 py-5 text-center">Intent Score</th>
                                <th className="px-6 py-5">Engagement Status</th>
                                <th className="px-6 py-5">Last Activity</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {leads.map(lead => (
                                <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white">{lead.name || 'Anonymous'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            {lead.email && <div className="text-blue-600 dark:text-blue-400 truncate max-w-[150px]" title={lead.email}>{lead.email}</div>}
                                            {lead.phone && <div className="text-gray-500 dark:text-slate-400 text-xs">{lead.phone}</div>}
                                            {!lead.email && !lead.phone && <span className="text-gray-400 dark:text-slate-600">-</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {lead.interests.slice(0, 2).map((interest, i) => (
                                                <span key={i} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                                                    {interest}
                                                </span>
                                            ))}
                                            {lead.interests.length > 2 && (
                                                <span className="text-gray-400 dark:text-slate-500 text-xs px-1">+{lead.interests.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={`text-lg ${getScoreColor(lead.leadScore)}`}>
                                                {lead.leadScore}
                                            </span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                                                {getScoreLabel(lead.leadScore)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={lead.status} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(lead.lastContact).toLocaleDateString()}
                                        <div className="text-xs opacity-70">
                                            {new Date(lead.lastContact).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedLead(lead)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 hover:border-blue-400 px-3 py-1 rounded-md transition"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Lead Details Modal */}
            {selectedLead && (
                <LeadDetailModal
                    lead={selectedLead}
                    onClose={() => setSelectedLead(null)}
                    onUpdate={fetchLeads}
                />
            )}
        </div>
    );
}

// Sub-components
const StatCard = ({ icon, label, value, highlight, color }) => (
    <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md ${highlight ? `ring-2 ring-${color}-100 dark:ring-${color}-900/20 border-${color}-200 dark:border-${color}-800` : 'border-gray-100 dark:border-slate-800'}`}>
        <div className={`w-12 h-12 bg-${color}-50 dark:bg-${color}-900/20 rounded-xl flex items-center justify-center`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const colors = {
        new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        qualified: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        converted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        lost: 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-500'
    };
    return (
        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${colors[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
};

// --- MODAL ---
function LeadDetailModal({ lead, onClose, onUpdate }) {
    const [status, setStatus] = useState(lead.status);
    const [notes, setNotes] = useState(lead.notes || '');
    const [saving, setSaving] = useState(false);

    const updateLead = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const businessId = localStorage.getItem('business_id');

            const response = await fetch(
                `${API_URLS.leads.base}/business/${businessId}/${lead._id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status, notes })
                }
            );

            if (response.ok) {
                onUpdate();
                onClose();
            } else {
                alert('Failed to update lead');
            }
        } catch (error) {
            console.error('Error updating lead:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Lead Intelligence</h2>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">&times;</button>
                </div>

                <div className="p-8 space-y-10">
                    {/* Contact Info */}
                    <section>
                        <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-6">Identity & Timeline</h3>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Name</label>
                                <div className="font-black text-xl text-gray-900 dark:text-white mt-1">{lead.name || 'Not provided'}</div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Engagement Start</label>
                                <div className="text-sm font-bold text-gray-600 dark:text-slate-300 mt-1">{new Date(lead.firstContact).toLocaleString()}</div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Verified Email</label>
                                <div className="text-blue-600 dark:text-blue-400 font-bold mt-1 truncate">{lead.email || '-'}</div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Phone Number</label>
                                <div className="text-gray-700 dark:text-slate-300 font-bold mt-1">{lead.phone || '-'}</div>
                            </div>
                        </div>
                    </section>

                    {/* Interests */}
                    <section>
                        <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-6">Intent & Insights</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {lead.interests.length > 0 ? (
                                lead.interests.map((tag, i) => (
                                    <span key={i} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-black border border-blue-100 dark:border-blue-800">
                                        {tag}
                                    </span>
                                ))
                            ) : <span className="text-gray-400 italic">No specific interests detected</span>}
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/20 flex items-center gap-6">
                            <div className="text-4xl">🔥</div>
                            <div>
                                <div className="font-black text-orange-900 dark:text-orange-400">Pam AI Intensity: {lead.leadScore}/100</div>
                                <p className="text-xs text-orange-800/60 dark:text-orange-400/60 font-medium">Predictive score based on deep conversation analysis.</p>
                            </div>
                        </div>
                    </section>

                    {/* Chat History */}
                    <section>
                        <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-6">Intelligence History (Last Chat)</h3>
                        <div className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-6 space-y-4 max-h-60 overflow-y-auto border dark:border-slate-700">
                            {lead.chatHistory && lead.chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'bg-white dark:bg-slate-900 border dark:border-slate-700 text-gray-700 dark:text-slate-200 shadow-sm'
                                        }`}>
                                        <p className="font-medium leading-relaxed">{msg.message}</p>
                                        <span className={`text-[9px] font-black block mt-2 opacity-60 uppercase tracking-wider ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400 dark:text-slate-500'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!lead.chatHistory || lead.chatHistory.length === 0) && (
                                <p className="text-center text-gray-400 dark:text-slate-600 text-xs font-bold py-10 uppercase tracking-widest">Intelligence stream empty</p>
                            )}
                        </div>
                    </section>

                    {/* Management */}
                    <section className="bg-gray-50 dark:bg-slate-800 p-8 rounded-[2rem] border dark:border-slate-700">
                        <h3 className="text-[10px] font-black text-gray-800 dark:text-white uppercase tracking-widest mb-6">Pipeline Optimization</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Lifecycle Stage</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                                >
                                    <option value="new">New Prospect</option>
                                    <option value="contacted">In Discussion</option>
                                    <option value="qualified">Qualified</option>
                                    <option value="converted">Closed Won</option>
                                    <option value="lost">Lost / Junk</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Internal Intelligence Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium h-32 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder="Add intelligence about this prospect..."
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="p-6 border-t dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 flex justify-end gap-3 rounded-b-[2.5rem]">
                    <button onClick={onClose} className="px-8 py-3 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-xl transition font-black text-xs uppercase tracking-widest">
                        Close
                    </button>
                    <button
                        onClick={updateLead}
                        disabled={saving}
                        className="px-10 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-black text-xs uppercase tracking-widest disabled:opacity-50 shadow-xl shadow-blue-500/20"
                    >
                        {saving ? 'Synchronizing...' : 'Update Lead'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Leads;
