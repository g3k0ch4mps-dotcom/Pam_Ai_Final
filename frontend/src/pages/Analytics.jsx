import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, MessageSquare, Clock, Globe } from 'lucide-react';
import { API_URLS } from '../apiConfig';

export default function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(API_URLS.v1.analytics, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const result = await res.json();
                if (result.success) setData(result.data);
            } catch (err) {
                console.error('Analytics Fetch Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="font-bold uppercase tracking-widest text-[10px]">Processing data insights...</p>
        </div>
    );

    const stats = [
        { label: 'Avg Session', value: data?.avgSessionTime || '4m 32s', icon: Clock, color: 'blue', trend: '+12%' },
        { label: 'Conversion Rate', value: data?.conversionRate || '3.2%', icon: TrendingUp, color: 'green', trend: '+5%' },
        { label: 'Bounce Rate', value: data?.bounceRate || '42%', icon: TrendingDown, color: 'red', trend: '-2%' },
        { label: 'Engagement', value: data?.engagementScore || '88', icon: Activity, color: 'purple', trend: '+18%' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors duration-300">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Performance Analytics</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">Deep dive into your AI's impact and customer behavior.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all">Last 30 Days</button>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-none hover:scale-105 active:scale-95 transition-all">Generate Report</button>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start">
                            <div className={`w-12 h-12 bg-${s.color}-50 dark:bg-${s.color}-900/20 rounded-2xl flex items-center justify-center text-${s.color}-600 dark:text-${s.color}-400`}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${s.trend.startsWith('+') ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                                {s.trend}
                            </span>
                        </div>
                        <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mt-6">{s.label}</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Chart Placeholder */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Conversation Trends</h3>
                        <div className="flex space-x-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Successful</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
                                <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Dropped</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between space-x-4">
                        {[40, 70, 45, 90, 65, 80, 50, 95, 75, 60, 85, 40].map((v, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <div
                                    className="w-full bg-blue-50 rounded-t-lg group-hover:bg-blue-600 transition-all duration-500 relative"
                                    style={{ height: `${v}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {v * 10}
                                    </div>
                                </div>
                                <span className="text-[9px] font-black text-gray-300 mt-4 uppercase tracking-tighter">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Topics */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-gray-900 mb-8">Popular Topics</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Pricing Inquiry', value: 85, color: 'blue' },
                            { label: 'API Documentation', value: 65, color: 'purple' },
                            { label: 'Technical Support', value: 45, color: 'orange' },
                            { label: 'Integration Help', value: 30, color: 'green' },
                        ].map((topic, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-gray-900">{topic.label}</span>
                                    <span className="text-gray-400">{topic.value}%</span>
                                </div>
                                <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-${topic.color}-600 rounded-full`}
                                        style={{ width: `${topic.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
