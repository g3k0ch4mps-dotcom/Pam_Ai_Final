import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Trash2, ShieldAlert, Mail, User as UserIcon, Check, Copy } from 'lucide-react';
import { API_URLS } from '../apiConfig';

export default function Team() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteForm, setInviteForm] = useState({
        email: '',
        firstName: '',
        lastName: '',
        role: 'business_staff'
    });
    const [inviting, setInviting] = useState(false);
    const [tempCreds, setTempCreds] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_URLS.v1.team, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setMembers(data.data);
        } catch (err) {
            console.error('Fetch members error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setInviting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URLS.v1.team}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(inviteForm)
            });
            const data = await res.json();
            if (data.success) {
                setTempCreds(data.data);
                fetchMembers();
                setInviteForm({ email: '', firstName: '', lastName: '', role: 'business_staff' });
            } else {
                alert('Invite failed: ' + data.error);
            }
        } catch (err) {
            alert('Invite error');
        } finally {
            setInviting(false);
        }
    };

    const handleUpdateRole = async (id, newRole) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URLS.v1.team}/${id}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });
            const data = await res.json();
            if (data.success) {
                fetchMembers();
            }
        } catch (err) {
            alert('Update role error');
        }
    };

    const handleRemove = async (id) => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URLS.v1.team}/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchMembers();
            }
        } catch (err) {
            alert('Remove member error');
        }
    };

    const getRoleBadge = (role) => {
        const styles = {
            business_owner: 'bg-blue-600 text-white',
            business_admin: 'bg-indigo-100 text-indigo-700',
            business_staff: 'bg-gray-100 text-gray-700',
            business_viewer: 'bg-amber-100 text-amber-700'
        };
        return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[role] || styles.business_staff}`}>{role.replace('business_', '')}</span>;
    };

    if (loading) return <div className="p-10 text-center animate-pulse font-black text-gray-400">Loading Team...</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors duration-300">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Team Management</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">Manage your workspace members and their access levels.</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
                >
                    <UserPlus className="w-5 h-5 mr-3" /> Add Member
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Member</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                            {members.map(member => (
                                <tr key={member._id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-black mr-4 shadow-sm">
                                                {member.firstName[0]}{member.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 dark:text-white">{member.firstName} {member.lastName}</p>
                                                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {member.role === 'business_owner' ? (
                                            getRoleBadge(member.role)
                                        ) : (
                                            <select
                                                value={member.role}
                                                onChange={(e) => handleUpdateRole(member._id, e.target.value)}
                                                className="bg-transparent text-xs font-bold text-gray-900 dark:text-white border-none focus:ring-0 cursor-pointer"
                                            >
                                                <option value="business_admin">Business Admin</option>
                                                <option value="business_staff">Business Staff</option>
                                                <option value="business_viewer">Business Viewer</option>
                                            </select>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                                            <span className="text-xs font-bold text-gray-600">Active</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {member.role !== 'business_owner' && (
                                            <button
                                                onClick={() => handleRemove(member._id)}
                                                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => { setShowInviteModal(false); setTempCreds(null); }}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {tempCreds ? (
                            <div className="p-10 space-y-6">
                                <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
                                    <Check className="w-10 h-10" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Member Added!</h3>
                                    <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">Please share these temporary credentials with your new team member.</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-3xl space-y-4 border border-gray-100 dark:border-slate-700">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Login Email</p>
                                        <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white">
                                            <span>{tempCreds.user.email}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Temporary Password</p>
                                        <div className="flex items-center justify-between font-black text-blue-600 dark:text-blue-400 text-lg">
                                            <span>{tempCreds.tempPassword}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setShowInviteModal(false); setTempCreds(null); }}
                                    className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black dark:hover:bg-gray-100 transition-all"
                                >
                                    Dismiss
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleInvite} className="p-10 space-y-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mr-4 text-white shadow-lg shadow-blue-200 dark:shadow-none">
                                        <UserPlus className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">Add Team Member</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={inviteForm.firstName}
                                            onChange={e => setInviteForm({ ...inviteForm, firstName: e.target.value })}
                                            className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 font-bold text-sm text-gray-900 dark:text-white outline-none transition-all"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={inviteForm.lastName}
                                            onChange={e => setInviteForm({ ...inviteForm, lastName: e.target.value })}
                                            className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 font-bold text-sm text-gray-900 dark:text-white outline-none transition-all"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={inviteForm.email}
                                        onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                                        className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 font-bold text-sm text-gray-900 dark:text-white outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Workspace Role</label>
                                    <select
                                        value={inviteForm.role}
                                        onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })}
                                        className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 font-bold text-sm text-gray-900 dark:text-white outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="business_admin">Business Admin (Full Management)</option>
                                        <option value="business_staff">Business Staff (Standard Access)</option>
                                        <option value="business_viewer">Business Viewer (Read-only)</option>
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowInviteModal(false)}
                                        className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={inviting}
                                        className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all disabled:opacity-50"
                                    >
                                        {inviting ? 'Inviting...' : 'Add Member'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
