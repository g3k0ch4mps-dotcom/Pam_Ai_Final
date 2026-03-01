import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { API_URLS } from '../apiConfig';

export default function Billing() {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_URLS.v1.subscription, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setSubscription(data.data);
        } catch (err) {
            console.error('Fetch subscription error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (planId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URLS.v1.subscription}/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ planId })
            });
            const data = await res.json();
            if (data.success) window.location.href = data.url;
        } catch (err) {
            alert('Checkout error');
        }
    };

    const handleManage = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URLS.v1.subscription}/portal`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) window.location.href = data.url;
        } catch (err) {
            alert('Portal error');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="font-bold uppercase tracking-widest text-[10px]">Loading billing details...</p>
        </div>
    );

    const plans = [
        { id: 'price_starter_id', name: 'Starter', price: '$29', features: ['10 Documents', '3 Team Members', '500 Conversations'] },
        { id: 'price_pro_id', name: 'Professional', price: '$99', features: ['100 Documents', '10 Team Members', '1000 Conversations', 'Custom Widget'] },
        { id: 'price_enterprise_id', name: 'Enterprise', price: 'Custom', features: ['Unlimited Documents', 'Unlimited Team Members', 'Advanced Analytics'] },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <p className="text-blue-300 text-[10px] font-black uppercase tracking-[0.2em]">Active Subscription</p>
                        <h2 className="text-5xl font-black mt-3 tracking-tight">{subscription?.plan || 'Free Plan'}</h2>
                        <div className="mt-6 flex items-center space-x-3">
                            <span className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-black uppercase tracking-widest">
                                Status: {subscription?.status || 'active'}
                            </span>
                            {subscription?.currentPeriodEnd && (
                                <span className="text-xs text-blue-200 font-medium">
                                    Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                    {subscription?.stripeCustomerId && (
                        <button
                            onClick={handleManage}
                            className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95 flex items-center"
                        >
                            Manage Account <ExternalLink className="w-4 h-4 ml-3" />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map(plan => (
                    <div key={plan.name} className={`bg-white border-[3px] rounded-[2rem] p-10 flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${subscription?.plan?.toLowerCase() === plan.name.toLowerCase() ? 'border-blue-600 shadow-xl relative' : 'border-gray-50'}`}>
                        {subscription?.plan?.toLowerCase() === plan.name.toLowerCase() && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Recommended for you
                            </div>
                        )}
                        <h3 className="text-2xl font-black text-gray-900">{plan.name}</h3>
                        <div className="mt-4 flex items-baseline">
                            <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                            <span className="ml-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">/ month</span>
                        </div>
                        <ul className="mt-10 space-y-5 flex-1">
                            {plan.features.map(f => (
                                <li key={f} className="flex items-center text-sm font-bold text-gray-600">
                                    <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                        <Check className="h-3.5 w-3.5 text-green-600" />
                                    </div>
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleUpgrade(plan.id)}
                            disabled={subscription?.plan?.toLowerCase() === plan.name.toLowerCase()}
                            className={`mt-12 w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 ${subscription?.plan?.toLowerCase() === plan.name.toLowerCase() ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
                        >
                            {subscription?.plan?.toLowerCase() === plan.name.toLowerCase() ? 'Currently Active' : 'Upgrade Now'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
