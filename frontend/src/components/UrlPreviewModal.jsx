import React from 'react';
import { X } from 'lucide-react';

const UrlPreviewModal = ({
    isOpen,
    onClose,
    previewData,
    onConfirm,
    loading
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col shadow-2xl border dark:border-slate-800 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b dark:border-slate-800">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white">Preview Content</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {previewData ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Title */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                                        Source Title
                                    </label>
                                    <p className="text-lg font-black text-gray-900 dark:text-white leading-tight">{previewData.title}</p>
                                </div>

                                {/* URL */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                                        External Link
                                    </label>
                                    <a
                                        href={previewData.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline break-all"
                                    >
                                        {previewData.url}
                                    </a>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-3xl border dark:border-slate-800">
                                <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                                    Content Metrics
                                </label>
                                <div className="grid grid-cols-3 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Words</p>
                                        <p className="text-xl font-black text-gray-900 dark:text-white">
                                            {previewData.stats.words.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Characters</p>
                                        <p className="text-xl font-black text-gray-900 dark:text-white">
                                            {previewData.stats.characters.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Read Time</p>
                                        <p className="text-xl font-black text-gray-900 dark:text-white">
                                            {previewData.stats.estimatedReadTime} min
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content Preview */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                                    Intelligence Fragment
                                </label>
                                <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-3xl max-h-60 overflow-y-auto border dark:border-slate-700">
                                    <p className="text-sm text-gray-800 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                        {previewData.preview}
                                    </p>
                                    {previewData.content.length > 500 && (
                                        <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 mt-4 uppercase tracking-widest">
                                            + {previewData.content.length - 500} additional indicators
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Full Content Toggle */}
                            <details className="group">
                                <summary className="cursor-pointer text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest hover:text-blue-600 dark:hover:text-blue-400 transition-colors list-none flex items-center gap-2">
                                    <span className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-slate-800 rounded group-open:rotate-180 transition-transform">↓</span>
                                    Expose Raw Intelligence Stream
                                </summary>
                                <div className="mt-4 bg-gray-50 dark:bg-slate-800/30 p-6 rounded-3xl max-h-96 overflow-y-auto border dark:border-slate-800 border-dashed">
                                    <p className="text-xs text-gray-600 dark:text-slate-400 whitespace-pre-wrap font-mono">
                                        {previewData.content}
                                    </p>
                                </div>
                            </details>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-dashed dark:border-slate-700">
                            <p className="text-gray-400 dark:text-slate-500 font-black uppercase tracking-widest">Analyzing stream...</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-8 border-t dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 rounded-b-[2.5rem]">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-xl transition font-black text-xs uppercase tracking-widest"
                        disabled={loading}
                    >
                        Abort
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-10 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-black text-xs uppercase tracking-widest disabled:opacity-50 shadow-xl shadow-blue-500/20"
                        disabled={loading || !previewData}
                    >
                        {loading ? 'Processing...' : 'Integrate Intelligence'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UrlPreviewModal;
