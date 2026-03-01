import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building, User, Lock, Mail, Chrome } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { API_URLS } from '../apiConfig';

export default function Register() {
    const [formData, setFormData] = useState({
        businessName: '',
        industry: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(API_URLS.auth.register, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log('Registration response:', data); // Debug log

            if (data.success) {
                // Auto login or redirect to login
                localStorage.setItem('token', data.token);
                localStorage.setItem('business_id', data.business?.id); // Store business ID for Leads page
                navigate('/dashboard');
            } else {
                console.error('Registration failed:', data.error); // Debug log
                const errorMsg = data.error?.details ?
                    `${data.error.message}: ${data.error.details.join(', ')}` :
                    (data.error?.message || 'Registration failed');
                setError(errorMsg);
            }
        } catch (err) {
            console.error('Registration error:', err); // Debug log
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        try {
            const response = await fetch(`${API_URLS.auth.base}/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                setError(data.error?.message || 'Google registration failed');
            }
        } catch (err) {
            setError('Google registration error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-950 py-12 px-4 transition-colors duration-300">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-2xl">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-blue-600">
                        Pamilo AI
                    </h2>
                    <p className="mt-2 text-gray-500 dark:text-slate-400 font-medium">Create your business account</p>
                </div>

                {error && (
                    <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl font-bold text-center">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="space-y-6">
                        {/* Business Info */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Business Identity</label>
                            <input
                                name="businessName"
                                type="text"
                                required
                                className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Legal Business Name"
                                onChange={handleChange}
                            />
                            <input
                                name="industry"
                                type="text"
                                className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Industry (e.g. Fintech, Healthcare)"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Owner Info */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Owner Credentials</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    name="firstName"
                                    type="text"
                                    required
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="First Name"
                                    onChange={handleChange}
                                />
                                <input
                                    name="lastName"
                                    type="text"
                                    required
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Last Name"
                                    onChange={handleChange}
                                />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Business Email address"
                                onChange={handleChange}
                            />
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full p-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Secure Password"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing Registration...' : 'Launch Free Trial'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100 dark:border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                        <span className="px-4 bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-500">Or register with</span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Registration Failed')}
                        useOneTap
                        theme="outline"
                        text="signup_with"
                        shape="rectangular"
                    />
                </div>

                <div className="text-center pt-4">
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="font-black text-blue-600 hover:text-blue-500 decoration-2 underline-offset-4">
                            Login Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
