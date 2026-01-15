import React, { useState, useEffect } from 'react';
import { Link2, RefreshCw, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { API_URLS } from '../apiConfig';

export default function URLManager({ businessId }) {
    const [urls, setUrls] = useState([]);
    const [newUrl, setNewUrl] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [frequency, setFrequency] = useState('weekly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleAddURL = async (e) => {
        e.preventDefault();
        setError('');
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
                    url: newUrl,
                    autoRefresh: autoRefresh ? { enabled: true, frequency } : { enabled: false }
                })
            });

            const data = await res.json();

            if (data.success) {
                setNewUrl('');
                setAutoRefresh(false);
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
        <div className="space-y-6">
            {/* Add URL Form */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center">
                    <Link2 className="w-4 h-4 mr-2" />
                    Add Content from URL
                </h3>

                <form onSubmit={handleAddURL} className="space-y-3">
                    <div>
                        <input
                            type="url"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="https://yourwebsite.com/page"
                            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 text-sm text-blue-800">
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                className="rounded border-blue-300"
                            />
                            <span>Auto-refresh</span>
                        </label>

                        {autoRefresh && (
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="text-sm px-2 py-1 border border-blue-300 rounded"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        )}
                    </div>

                    {error && (
                        <div className="flex items-center text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            'Add URL'
                        )}
                    </button>
                </form>
            </div>

            {/* URL List */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-700">Added URLs ({urls.length})</h3>

                {urls.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">
                        No URLs added yet. Add a URL above to scrape content from your website.
                    </p>
                ) : (
                    urls.map(url => (
                        <div key={url._id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <Link2 className="w-4 h-4 text-blue-600" />
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {url.urlTitle || 'Untitled'}
                                        </h4>
                                    </div>

                                    <a
                                        href={url.sourceURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline block mb-2"
                                    >
                                        {url.sourceURL}
                                    </a>

                                    {url.urlDescription && (
                                        <p className="text-xs text-gray-600 mb-2">
                                            {url.urlDescription.substring(0, 150)}
                                            {url.urlDescription.length > 150 && '...'}
                                        </p>
                                    )}

                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <span>
                                            Scraped: {new Date(url.lastScrapedAt).toLocaleDateString()}
                                        </span>
                                        {url.autoRefresh?.enabled && (
                                            <span className="flex items-center text-green-600">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Auto-refresh: {url.autoRefresh.frequency}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => handleRefresh(url._id)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        title="Refresh content"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(url._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        title="Remove URL"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
