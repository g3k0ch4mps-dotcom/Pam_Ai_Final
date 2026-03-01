import React, { useState } from 'react';
import { Settings as SettingsIcon, Globe, Shield, CreditCard, Bell, Copy, Check } from 'lucide-react';

export default function Settings({ business, user }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const code = `<script src="${window.location.origin}/chat-widget.js" data-slug="${business?.businessSlug}"></script>`;
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">System Settings</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage your workspace, credentials, and AI integrations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Integration Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

                        <div className="relative z-10">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
                                    <Globe className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black">Live Chat Integration</h3>
                                    <p className="text-blue-300/60 text-sm font-medium">Embed Pam AI on your website in seconds.</p>
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-3xl p-6 border border-white/5">
                                <p className="text-gray-400 mb-4 text-xs font-bold uppercase tracking-widest">Code Snippet</p>
                                <pre className="text-blue-200 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                                    {`<script \n  src="${window.location.origin}/chat-widget.js" \n  data-slug="${business?.businessSlug}">\n</script>`}
                                </pre>
                                <button
                                    onClick={handleCopy}
                                    className={`mt-6 w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center ${copied ? 'bg-green-600 text-white' : 'bg-white text-gray-900 hover:bg-blue-50'}`}
                                >
                                    {copied ? <><Check className="w-4 h-4 mr-2" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy Snippet</>}
                                </button>
                            </div>
                            <p className="mt-6 text-gray-500 text-[10px] font-medium leading-relaxed">
                                Paste this code right before the closing <code className="text-blue-300">&lt;/body&gt;</code> tag. The widget will automatically appear and use your Knowledge Base to answer visitor questions.
                            </p>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center">
                            <Shield className="w-6 h-6 mr-3 text-blue-600" /> Workspace Credentials
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Business Identity</label>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-900">{business?.businessName}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Unique Workspace Slug</label>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-mono text-xs text-gray-500 font-bold">{business?.businessSlug}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Primary Email</label>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-900">{user?.email}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Account Role</label>
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 font-black text-blue-600 uppercase text-[10px] tracking-widest inline-block px-6">Owner</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-6">Quick Actions</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Notification Prefs', icon: Bell },
                                { label: 'Security & Auth', icon: Shield },
                                { label: 'Payment Methods', icon: CreditCard },
                                { label: 'General Preferences', icon: SettingsIcon },
                            ].map((item, i) => (
                                <button key={i} className="w-full p-4 flex items-center justify-between bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors group">
                                    <div className="flex items-center">
                                        <item.icon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600" />
                                        <span className="text-xs font-bold text-gray-700 group-hover:text-blue-900">{item.label}</span>
                                    </div>
                                    <div className="w-6 h-6 flex items-center justify-center text-gray-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1">
                                        <Copy className="w-3 h-3 rotate-45 transform" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-red-50 rounded-[2rem] p-8 border border-red-100">
                        <h3 className="text-red-900 font-black text-sm uppercase tracking-widest mb-2">Danger Zone</h3>
                        <p className="text-red-700/60 text-xs font-medium mb-6 leading-relaxed">Permanently delete your workspace and all associated Knowledge Base documents.</p>
                        <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95">
                            Delete Workspace
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
