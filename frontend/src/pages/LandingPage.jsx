import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Zap, Shield, Clock, MessageSquare, ArrowRight,
    Bot, Cpu, Globe, Rocket, CheckCircle2,
    Users, BarChart3, Lock
} from 'lucide-react';
import LandingChat from '../components/LandingChat';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-blue-500/30">
            {/* Header / Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-110">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase">Pamilo <span className="text-blue-500">AI</span></span>
                    </div>

                    <div className="hidden md:flex items-center space-x-10 text-sm font-bold uppercase tracking-widest text-white/50">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors px-4 py-2">Login</Link>
                        <Link
                            to="/register"
                            className="bg-white text-black text-xs font-black uppercase px-6 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-white/5"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />
                <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10 animate-pulse" />

                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Phase 4 Live: Team Management Ready</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        The Next Era of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 animate-gradient-x">Business Intelligence</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-white/50 font-medium max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        Deploy custom AI assistants trained on your unique business data. Automate support, capture leads, and scale your operations without overhead.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-black uppercase text-sm rounded-[2rem] hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/20 flex items-center justify-center group"
                        >
                            Build Your Assistant <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase text-sm rounded-[2rem] hover:bg-white/10 transition-all">
                            View Live Demo
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 border-t border-white/5 pt-12 text-white/40">
                        {[
                            { label: 'Uptime', value: '99.9%' },
                            { label: 'Avg Feedback', value: '4.9/5' },
                            { label: 'Setup Time', value: '< 5mins' },
                            { label: 'AI Models', value: 'Global' }
                        ].map((s, i) => (
                            <div key={i} className="space-y-1">
                                <p className="text-white font-black text-2xl tracking-tighter">{s.value}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-4 text-center">Engineered for Scale</h2>
                        <h3 className="text-4xl md:text-6xl font-black tracking-tight">Enterprise Infrastructure. <br /> Startup Agility.</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Neural Knowledge Base',
                                desc: 'Our proprietary engine indexes your documents and websites, providing instant, accurate answers specialized to your business.',
                                icon: Cpu,
                                color: 'blue'
                            },
                            {
                                title: 'Global Multi-Tenant',
                                desc: 'Built on a high-resiliency architecture. Manage multiple businesses and team members with granular RBAC controls.',
                                icon: Globe,
                                color: 'indigo'
                            },
                            {
                                title: 'Advanced Analytics',
                                desc: 'Real-time monitoring of AI performance, visitor intent, and conversion metrics to optimize your customer experience.',
                                icon: BarChart3,
                                color: 'emerald'
                            }
                        ].map((f, i) => (
                            <div key={i} className="group bg-white/[0.02] border border-white/5 p-12 rounded-[3rem] hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden">
                                <div className={`w-16 h-16 bg-${f.color}-500/10 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    <f.icon className={`w-8 h-8 text-${f.color}-500`} />
                                </div>
                                <h4 className="text-2xl font-black mb-4 tracking-tight">{f.title}</h4>
                                <p className="text-white/40 leading-relaxed font-medium">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof Section (Visual Placeholder) */}
            <section className="py-20 border-y border-white/5 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
                <div className="flex flex-wrap justify-center gap-12 md:gap-24 px-6 max-w-7xl mx-auto items-center">
                    <span className="text-2xl font-black tracking-tighter uppercase italic">TECHFLOW</span>
                    <span className="text-2xl font-black tracking-tighter uppercase">NexusAI</span>
                    <span className="text-2xl font-black tracking-tighter uppercase italic text-blue-500">PAMILO</span>
                    <span className="text-2xl font-black tracking-tighter uppercase">CloudMatrix</span>
                    <span className="text-2xl font-black tracking-tighter uppercase italic">Zenith</span>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto relative bg-blue-600 rounded-[4rem] p-12 md:p-24 text-center">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 blur-[100px] rounded-full" />

                    <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-none mb-10 text-white">
                        Ready to automate <br /> your business?
                    </h2>
                    <p className="text-xl text-white/80 font-medium max-w-xl mx-auto mb-12">
                        Join 2,000+ business owners using Pamilo AI to supercharge their customer experience and growth.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-white text-blue-600 px-12 py-6 rounded-[2rem] font-black uppercase text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/10 flex items-center mx-auto group"
                    >
                        Initialize Pamilo Today <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-12">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-black tracking-tighter uppercase">Pamilo <span className="text-blue-500">AI</span></span>
                    </div>

                    <div className="flex space-x-12 text-xs font-black uppercase tracking-widest text-white/30">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>

                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                        © 2026 Pamilo Technologies. Autonomous Infrastructure.
                    </p>
                </div>
            </footer>

            {/* Floating Assistant */}
            <LandingChat businessSlug="pamilo" />
        </div>
    );
}
