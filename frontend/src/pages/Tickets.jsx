import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, Clock, User, CheckCircle } from 'lucide-react';
import { API_URLS } from '../apiConfig';

export default function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: '', priority: '' });

    useEffect(() => {
        fetchTickets();
    }, [filter]);

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const query = new URLSearchParams(filter).toString();
            const res = await fetch(`${API_URLS.v1.tickets}?${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setTickets(data.data);
        } catch (err) {
            console.error('Fetch tickets error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-700';
            case 'in_progress': return 'bg-yellow-100 text-yellow-700';
            case 'resolved': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors duration-300">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Support Tickets</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">Manage and resolve customer inquiries routed from Pam AI.</p>
                </div>
                <div className="flex gap-4">
                    <select
                        className="border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    >
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                    <p className="font-bold">Loading tickets...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {tickets.length === 0 ? (
                        <div className="p-20 text-center text-gray-400 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-gray-100 dark:border-slate-800 transition-colors">
                            <Filter className="w-16 h-16 mx-auto mb-4 opacity-10" />
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">No tickets found</h3>
                            <p className="font-medium">No tickets match your current filter settings.</p>
                        </div>
                    ) : (
                        tickets.map(ticket => (
                            <div key={ticket._id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded tracking-widest uppercase">#{ticket.ticketNumber}</span>
                                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${getStatusColor(ticket.status).replace('bg-blue-100 text-blue-700', 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300').replace('bg-yellow-100 text-yellow-700', 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300').replace('bg-green-100 text-green-700', 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300')}`}>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{ticket.title}</h3>
                                        <div className="flex items-center text-xs text-gray-400 dark:text-slate-500 space-x-6">
                                            <span className="flex items-center font-bold uppercase tracking-wider"><User className="w-4 h-4 mr-2 text-gray-300 dark:text-slate-600" /> {ticket.customerName}</span>
                                            <span className="flex items-center font-bold uppercase tracking-wider"><Clock className="w-4 h-4 mr-2 text-gray-300 dark:text-slate-600" /> {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <button className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm group-hover:scale-110 active:scale-95">
                                        <MessageSquare className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
