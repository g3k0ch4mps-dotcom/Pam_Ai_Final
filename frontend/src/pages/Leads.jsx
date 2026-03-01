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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Customer Leads</h1>
                    <p className="text-gray-500 mt-1 font-medium">Track and manage your potential customers captured by Pam AI.</p>
                </div>
                <div className="flex gap-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    >
                        <option value="all">All Channels</option>
                        <option value="email">Has Contact Info</option>
                        <option value="hot">High Intent (50+)</option>
                        <option value="veryhot">Immediate Action (70+)</option>
                        <option value="new">Newly Captured</option>
                    </select>

                    <button onClick={exportLeads} className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm font-bold hover:bg-gray-50 transition active:scale-95">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {leads.length === 0 ? (
                    <div className="p-20 text-center text-gray-400">
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <h3 className="text-xl font-black text-gray-900">No leads found</h3>
                        <p className="font-medium">Pam AI hasn't captured any leads matching your criteria yet.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F8FAFC] text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5">Customer Name</th>
                                <th className="px-6 py-5">Contact Details</th>
                                <th className="px-6 py-5 text-center">Intent Score</th>
                                <th className="px-6 py-5">Engagement Status</th>
                                <th className="px-6 py-5">Last Activity</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {leads.map(lead => (
                                <tr key={lead._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{lead.name || 'Anonymous'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            {lead.email && <div className="text-blue-600 truncate max-w-[150px]" title={lead.email}>{lead.email}</div>}
                                            {lead.phone && <div className="text-gray-500 text-xs">{lead.phone}</div>}
                                            {!lead.email && !lead.phone && <span className="text-gray-400">-</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {lead.interests.slice(0, 2).map((interest, i) => (
                                                <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    {interest}
                                                </span>
                                            ))}
                                            {lead.interests.length > 2 && (
                                                <span className="text-gray-400 text-xs px-1">+{lead.interests.length - 2}</span>
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
    <div className={`bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4 transition-all hover:shadow-md ${highlight ? `ring-2 ring-${color}-100 border-${color}-200` : 'border-gray-100'}`}>
        <div className={`w-12 h-12 bg-${color}-50 rounded-xl flex items-center justify-center`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-black text-gray-900">{value}</p>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const colors = {
        new: 'bg-blue-100 text-blue-800',
        contacted: 'bg-yellow-100 text-yellow-800',
        qualified: 'bg-purple-100 text-purple-800',
        converted: 'bg-green-100 text-green-800',
        lost: 'bg-gray-100 text-gray-800'
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${colors[status] || 'bg-gray-100'}`}>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-800">📋 Lead Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Contact Info */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500">Name</label>
                                <div className="font-medium text-lg">{lead.name || 'Not provided'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">First Contact</label>
                                <div className="text-sm">{new Date(lead.firstContact).toLocaleString()}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Email</label>
                                <div className="text-blue-600">{lead.email || '-'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Phone</label>
                                <div className="text-gray-700">{lead.phone || '-'}</div>
                            </div>
                        </div>
                    </section>

                    {/* Interests */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Interests & Engagement</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {lead.interests.length > 0 ? (
                                lead.interests.map((tag, i) => (
                                    <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                                        {tag}
                                    </span>
                                ))
                            ) : <span className="text-gray-400 italic">No specific interests detected</span>}
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-center gap-4">
                            <div className="text-2xl">🔥</div>
                            <div>
                                <div className="font-bold text-gray-800">Lead Score: {lead.leadScore}/100</div>
                                <p className="text-xs text-gray-600">Based on questions asked, contact info provided, and response time.</p>
                            </div>
                        </div>
                    </section>

                    {/* Chat History */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Recent Chat History</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto border">
                            {lead.chatHistory && lead.chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-700 shadow-sm'
                                        }`}>
                                        <p>{msg.message}</p>
                                        <span className={`text-[10px] block mt-1 opacity-70 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!lead.chatHistory || lead.chatHistory.length === 0) && (
                                <p className="text-center text-gray-400 text-sm">No chat history available.</p>
                            )}
                        </div>
                    </section>

                    {/* Management */}
                    <section className="bg-gray-50 p-6 rounded-xl border">
                        <h3 className="text-sm font-bold text-gray-800 mb-4">Lead Management</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="qualified">Qualified</option>
                                    <option value="converted">Converted</option>
                                    <option value="lost">Lost</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Add notes about your interaction..."
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                    <button onClick={onClose} className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition font-medium">
                        Cancel
                    </button>
                    <button
                        onClick={updateLead}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 shadow-md"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Leads;
