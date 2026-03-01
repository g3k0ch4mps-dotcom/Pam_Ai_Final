import React, { useState, useEffect } from 'react';
import { Link2, RefreshCw, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { API_URLS } from '../apiConfig';
import UrlPreviewModal from './UrlPreviewModal';

export default function URLManager({ businessId }) {
    const [urls, setUrls] = useState([]);
    const [newUrl, setNewUrl] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [frequency, setFrequency] = useState('weekly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    useEffect(() => {
        fetchURLs();
    }, [businessId]);

    const fetchURLs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_URLS.documents.base, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                // Filter only URL documents
                const urlDocs = data.data.filter(doc => doc.sourceType === 'url');
                setUrls(urlDocs);
            }
        } catch (err) {
            console.error('Failed to fetch URLs:', err);
        }
    };

    const handlePreviewURL = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URLS.documents.base}/preview-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ url: newUrl })
            });

            const data = await res.json();

            if (data.success) {
                setPreviewData(data.data);
                setShowPreview(true);
            } else {
                setError(data.error?.message || 'Failed to preview URL');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAdd = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URLS.documents.base}/add-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    url: previewData.url,
                    autoRefresh: autoRefresh ? { enabled: true, frequency } : { enabled: false }
                })
            });

            const data = await res.json();

            if (data.success) {
                setNewUrl('');
                setAutoRefresh(false);
                setShowPreview(false);
                setPreviewData(null);
                fetchURLs();
            } else {
                setError(data.error?.message || 'Failed to add URL');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async (docId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URLS.documents.base}/${docId}/refresh`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            if (data.success) {
                fetchURLs();
            } else {
                alert('Refresh failed: ' + data.error?.message);
            }
        } catch (err) {
            alert('Refresh error');
        }
    };

    const handleDelete = async (docId) => {
        if (!confirm('Remove this URL from your knowledge base?')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URLS.documents.base}/${docId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchURLs();
        } catch (err) {
            alert('Delete error');
        }
    };

    return (
        <div className="space-y-8">
            {/* Add URL Form */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-3xl p-8">
                <h3 className="text-sm font-black text-blue-900 dark:text-blue-400 mb-6 flex items-center uppercase tracking-widest">
                    <Link2 className="w-5 h-5 mr-3" />
                    Expand Intelligence from URL
                </h3>

                <form onSubmit={handlePreviewURL} className="space-y-6">
                    <div>
                        <input
                            type="url"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="https://yourwebsite.com/page"
                            className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-3 text-sm font-bold text-blue-800 dark:text-blue-400 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                className="w-4 h-4 rounded border-blue-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Enable Periodic Sync</span>
                        </label>

                        {autoRefresh && (
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="text-xs font-black uppercase tracking-widest px-3 py-1.5 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-lg text-blue-700 dark:text-blue-400 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        )}
                    </div>

                    {error && (
                        <div className="flex items-center text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/20">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-slate-800 flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 mr-3 animate-spin" />
                                Analyzing Pipeline...
                            </>
                        ) : (
                            'Analyze Content'
                        )}
                    </button>
                </form>
            </div>

            {/* URL List */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Processed Sources ({urls.length})</h3>

                {urls.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/30 rounded-3xl border border-dashed dark:border-slate-800">
                        <p className="text-gray-400 dark:text-slate-600 text-xs font-black uppercase tracking-widest">
                            No external synchronization active.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {urls.map(url => (
                            <div key={url._id} className="border dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-900/50 hover:border-blue-500/30 transition-all group shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                                                <Link2 className="w-4 h-4" />
                                            </div>
                                            <h4 className="text-sm font-black text-gray-900 dark:text-white truncate">
                                                {url.urlTitle || 'Intelligence Stream'}
                                            </h4>
                                        </div>

                                        <a
                                            href={url.sourceURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center mb-3 font-medium opacity-70"
                                        >
                                            {url.sourceURL} <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>

                                        {url.urlDescription && (
                                            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                                                {url.urlDescription}
                                            </p>
                                        )}

                                        <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-gray-400 dark:text-slate-600">
                                                Synced: {new Date(url.lastScrapedAt).toLocaleDateString()}
                                            </span>
                                            {url.autoRefresh?.enabled && (
                                                <span className="flex items-center text-green-600 dark:text-green-400">
                                                    <RefreshCw className="w-3 h-3 mr-1 animate-spin-slow" />
                                                    Auto-Sync: {url.autoRefresh.frequency}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-6">
                                        <button
                                            onClick={() => handleRefresh(url._id)}
                                            className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            title="Re-synchronize content"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(url._id)}
                                            className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-slate-800 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                            title="Terminate connection"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            <UrlPreviewModal
                isOpen={showPreview}
                onClose={() => {
                    setShowPreview(false);
                    setPreviewData(null);
                }}
                previewData={previewData}
                onConfirm={handleConfirmAdd}
                loading={loading}
            />
        </div>
    );
}
