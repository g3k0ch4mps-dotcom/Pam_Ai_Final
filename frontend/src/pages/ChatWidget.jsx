import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, MessageCircle } from 'lucide-react';
import LeadCaptureForm from '../components/LeadCaptureForm';

export default function ChatWidget() {
    const [searchParams] = useSearchParams();
    const slug = searchParams.get('slug');
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hello! How can I help you today?', type: 'text' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !slug) return;

        const userMsg = { role: 'user', text: input, type: 'text' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch(`/api/chat/public/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: userMsg.text,
                    sessionId: sessionId
                })
            });
            const data = await res.json();

            if (data.success) {
                if (data.sessionId && !sessionId) {
                    setSessionId(data.sessionId);
                }

                const aiText = data.answer;

                // Check if trigger token is present
                if (aiText.includes('<LEAD_CAPTURE_TRIGGER>')) {
                    const cleanText = aiText.replace('<LEAD_CAPTURE_TRIGGER>', '').trim();
                    if (cleanText) {
                        setMessages(prev => [...prev, { role: 'assistant', text: cleanText, type: 'text' }]);
                    }
                    // Add form as a separate 'message' bubble type
                    setMessages(prev => [...prev, { role: 'assistant', type: 'lead_form' }]);
                } else {
                    setMessages(prev => [...prev, { role: 'assistant', text: aiText, type: 'text' }]);
                }
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error.', type: 'text' }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Network error.', type: 'text' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleLeadSubmit = async (formData) => {
        try {
            await fetch('/api/leads/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessSlug: slug,
                    sessionId: sessionId,
                    data: formData
                })
            });
            // Replace form with success message
            setMessages(prev => {
                const newMsgs = [...prev];
                // Find the form interaction and remove/update it
                // Actually, let's just append a success message
                return [...newMsgs, { role: 'assistant', text: `Thanks ${formData.name || ''}! We'll be in touch soon.`, type: 'text' }];
            });
        } catch (error) {
            console.error('Lead capture failed', error);
        }
    };

    const handleSkip = () => {
        setMessages(prev => [...prev, { role: 'assistant', text: "No problem! Let me know if you have any other questions.", type: 'text' }]);
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
                            {msg.type === 'lead_form' ? (
                                <div className="w-[85%]">
                                    <LeadCaptureForm onSubmit={handleLeadSubmit} onSkip={handleSkip} />
                                </div>
                            ) : (
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-200 rounded-full px-4 py-2 text-xs text-gray-500 animate-pulse">
                                Typing...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
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
