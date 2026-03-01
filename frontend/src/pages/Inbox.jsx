import React, { useState, useEffect } from 'react';
import { Search, Send, User, Bot, Clock } from 'lucide-react';
import { API_URLS } from '../apiConfig';

export default function Inbox() {
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URLS.business.base}/v1/tickets`, { // Reusing tickets endpoint if merged
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                // Filter for recently active conversations or tickets
                setConversations(data.data.slice(0, 10));
            }
        } catch (err) {
            console.error('Fetch conversations error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConv) return;

        const msg = {
            id: Date.now(),
            text: newMessage,
            sender: 'agent',
            timestamp: new Date()
        };

        setMessages([...messages, msg]);
        setNewMessage('');
        // Real-time emission logic would go here
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
            {/* Conversations List */}
            <div className="w-80 border-r border-gray-100 dark:border-slate-800 flex flex-col">
                <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
                    {conversations.map(conv => (
                        <button
                            key={conv._id}
                            onClick={() => setSelectedConv(conv)}
                            className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${selectedConv?._id === conv._id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-600' : ''}`}
                        >
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold transition-colors">
                                {conv.customerName?.[0] || 'V'}
                            </div>
                            <div className="flex-1 text-left overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{conv.customerName || 'Visitor'}</p>
                                    <span className="text-[10px] text-gray-400 dark:text-slate-500">{new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{conv.lastMessage || 'Click to view conversation'}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors">
                {selectedConv ? (
                    <>
                        <div className="p-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center shadow-sm transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold transition-colors">
                                    {selectedConv.customerName?.[0] || 'V'}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedConv.customerName || 'Visitor'}</p>
                                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.sender === 'agent' ? 'bg-blue-600 dark:bg-blue-600 text-white rounded-tr-none shadow-lg' : 'bg-white dark:bg-slate-900 text-gray-800 dark:text-white rounded-tl-none border border-gray-100 dark:border-slate-800 shadow-sm'}`}>
                                        {msg.text}
                                        <p className={`text-[10px] mt-1 ${msg.sender === 'agent' ? 'text-blue-100' : 'text-gray-400 dark:text-slate-500'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors">
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
                        <p className="font-bold">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
