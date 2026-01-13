import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Upload, FileText, Trash2, Settings, MessageSquare, ExternalLink } from 'lucide-react';
import URLManager from '../components/URLManager';
import Leads from './Leads';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [business, setBusiness] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [activeTab, setActiveTab] = useState('documents');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return navigate('/login');

                // 1. Get Me (and Business Role)
                const meRes = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
                const meData = await meRes.json();

                if (!meData.success) {
                    localStorage.removeItem('token');
                    return navigate('/login');
                }

                // Backend returns { success: true, data: { user: {...}, business: {...} } }
                setUser(meData.data.user);

                // If the token already has a business context, the backend returns it in meData.data.business
                if (meData.data.business) {
                    setBusiness(meData.data.business);
                    fetchDocuments(meData.data.business.id, token);
                } else {
                    console.warn('No business associated with this session');
                }
            } catch (err) {
                console.error('Dashboard Load Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const fetchDocuments = async (businessId, token) => {
        const res = await fetch('/api/documents', { headers: { Authorization: `Bearer ${token}` } });
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
            const res = await fetch('/api/documents/upload', {
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
        await fetch(`/api/documents/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        fetchDocuments(business?.id, token);
    };

    const togglePublicChat = async () => {
        // Toggle logic using PUT /api/business/:id/settings
        // Not fully implemented in this simple UI for brevity but placeholder here
        alert("Feature: Toggle Public Chat (Not implemented in UI demo)");
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <span className="text-xl font-bold text-blue-600">Pamilo AI</span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                        {business?.name || business?.businessName || 'No Business'}
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600 text-sm">Hello, {user?.firstName}</span>
                    <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Sidebar */}
                <div className="col-span-1 space-y-2">
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'documents' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <FileText className="mr-3 h-5 w-5" />
                            Documents
                        </button>
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'leads' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <span className="mr-3 text-xl">👥</span>
                            Leads
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Settings className="mr-3 h-5 w-5" />
                            Settings & Chat
                        </button>
                    </nav>

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-800 mb-2">Public Widget</h4>
                        <p className="text-xs text-blue-600 mb-3">Test your chatbot as a visitor.</p>
                        <a
                            href={`/chat-test?slug=${business?.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-xs font-bold text-blue-700 hover:underline"
                        >
                            Open Simulator <ExternalLink className="ml-1 w-3 h-3" />
                        </a>
                    </div>
                </div>

                {/* Content Area */}
                <div className="col-span-3 bg-white rounded-lg shadow-sm border p-6">
                    {activeTab === 'documents' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Knowledge Base</h2>
                                <label className="flex items-center cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload PDF/Doc
                                    <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.docx,.txt" />
                                </label>
                            </div>

                            <div className="space-y-4">
                                {documents.length === 0 ? (
                                    <p className="text-gray-500 text-center py-10">No documents uploaded yet. Upload one to train your AI.</p>
                                ) : (
                                    documents.map(doc => (
                                        <div key={doc._id} className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
                                            <div className="flex items-center">
                                                <FileText className="w-8 h-8 text-gray-400 mr-4" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{doc.originalName}</p>
                                                    <p className="text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB • {new Date(doc.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteDoc(doc._id)} className="text-red-400 hover:text-red-600 p-2">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* URL Management Section */}
                            <div className="mt-8 pt-8 border-t">
                                <URLManager businessId={business?.id} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'leads' && (
                        <Leads />
                    )}

                    {activeTab === 'settings' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                                    <input type="text" disabled value={business?.name || business?.businessName || ''} className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                                <div>
                                    <input type="text" disabled value={business?.slug || ''} className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                                <div className="mt-6 border-t pt-6">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Chat Widget</h3>
                                    <p className="text-sm text-gray-500 mb-4">Add this code to your website to enable the AI assistant.</p>
                                    <div className="relative">
                                        <pre className="bg-gray-800 text-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                                            {`<script src="${window.location.origin}/chat-widget.js" 
        data-slug="${business?.slug}">
</script>`}
                                        </pre>
                                        <button
                                            onClick={() => {
                                                const code = `<script src="${window.location.origin}/chat-widget.js" data-slug="${business?.slug}"></script>`;
                                                navigator.clipboard.writeText(code);
                                                alert('Code copied!');
                                            }}
                                            className="absolute top-2 right-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <div className="mt-4">
                                        <a
                                            href={`/test-widget.html`}
                                            target="_blank"
                                            className="text-sm text-blue-600 hover:underline flex items-center"
                                        >
                                            Test Widget Page <ExternalLink className="ml-1 w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
