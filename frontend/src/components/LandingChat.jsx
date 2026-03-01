import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Maximize2, Minimize2 } from 'lucide-react';
import { API_URLS } from '../apiConfig';

export default function LandingChat({ businessSlug = 'pamilo' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hi! I\'m Pamilo AI. How can I help you today?', type: 'text' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input, type: 'text' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URLS.chat.public}/${businessSlug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: userMsg.text,
                    sessionId: sessionId
                })
            });
            const data = await res.json();

            if (data.success) {
                if (data.sessionId && !sessionId) setSessionId(data.sessionId);
                setMessages(prev => [...prev, { role: 'assistant', text: data.answer, type: 'text' }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: 'I encountered a small hiccup. Try again?', type: 'text' }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Connection is a bit unstable. Try again?', type: 'text' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] h-[500px] bg-white rounded-[2rem] shadow-2xl border border-blue-500/10 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-blue-600 p-6 flex items-center justify-between text-white">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-black text-sm uppercase tracking-widest">Pamilo AI</h3>
                                <p className="text-[10px] opacity-80 font-bold uppercase tracking-tighter">Always Online</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-xl transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-sm font-medium ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/20'
                                        : 'bg-white border text-gray-800 rounded-tl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border rounded-full px-4 py-2 text-[10px] font-black uppercase text-blue-500 tracking-widest animate-pulse">
                                    Analyzing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t flex space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question..."
                            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group bg-blue-600 text-white p-5 rounded-[2rem] shadow-2xl hover:scale-105 active:scale-95 transition-all relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <MessageCircle className="w-8 h-8 relative z-10" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white animate-pulse z-20" />
                </button>
            )}
        </div>
    );
}
