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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold">Preview URL Content</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {previewData ? (
                        <>
                            {/* Title */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <p className="text-lg font-semibold">{previewData.title}</p>
                            </div>

                            {/* URL */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL
                                </label>
                                <a
                                    href={previewData.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline break-all"
                                >
                                    {previewData.url}
                                </a>
                            </div>

                            {/* Statistics */}
                            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Statistics
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Words</p>
                                        <p className="text-lg font-semibold">
                                            {previewData.stats.words.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Characters</p>
                                        <p className="text-lg font-semibold">
                                            {previewData.stats.characters.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Read Time</p>
                                        <p className="text-lg font-semibold">
                                            {previewData.stats.estimatedReadTime} min
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content Preview */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content Preview
                                </label>
                                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                        {previewData.preview}
                                    </p>
                                    {previewData.content.length > 500 && (
                                        <p className="text-sm text-gray-500 mt-2 italic">
                                            ... and {previewData.content.length - 500} more characters
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Full Content Toggle (Optional) */}
                            <details className="mb-4">
                                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                                    View Full Content
                                </summary>
                                <div className="mt-2 bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                        {previewData.content}
                                    </p>
                                </div>
                            </details>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No preview available</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || !previewData}
                    >
                        {loading ? 'Adding...' : 'Add to Knowledge Base'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UrlPreviewModal;
