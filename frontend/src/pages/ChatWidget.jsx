import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, MessageCircle } from 'lucide-react';

export default function ChatWidget() {
    const [searchParams] = useSearchParams();
    const slug = searchParams.get('slug');
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hello! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // In a real widget, we would fetch the business settings (branding, welcome message) first.

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !slug) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat/public', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessSlug: slug,
                    question: userMsg.text
                })
            });
            const data = await res.json();

            if (data.success) {
                setMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error.' }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Network error.' }]);
        } finally {
            setLoading(false);
        }
    };

    if (!slug) return <div className="p-10 text-center text-red-500">Missing Business Slug in URL</div>;

    return (
        <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
            {/* Phone Simulator */}
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px]">

                {/* Header */}
                <div className="bg-blue-600 p-4 flex items-center text-white">
                    <MessageCircle className="w-6 h-6 mr-2" />
                    <div>
                        <h3 className="font-bold">Support Chat</h3>
                        <p className="text-xs opacity-80">Powered by AI</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-200 rounded-full px-4 py-2 text-xs text-gray-500 animate-pulse">
                                Typing...
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-3 bg-white border-t flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
