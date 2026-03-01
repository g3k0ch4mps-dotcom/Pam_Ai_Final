import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Chrome, KeyRound } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { API_URLS } from '../apiConfig';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = loginMode === 'password' ? API_URLS.auth.login : `${API_URLS.auth.base}/verify-otp`;
            const body = loginMode === 'password'
                ? { email, password }
                : { email, otp };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                setError(data.error?.message || 'Login failed');
            }
        } catch (err) {
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
                setError(data.error?.message || 'Google login failed');
            }
        } catch (err) {
            setError('Google login error');
        }
    };

    const handleRequestOTP = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await fetch(`${API_URLS.auth.base}/request-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (data.success) {
                setOtpSent(true);
            } else {
                setError(data.error?.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Request OTP error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-950 transition-colors duration-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-xl">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-blue-600">Pamilo AI</h1>
                    <p className="mt-2 text-gray-600 dark:text-slate-400 font-medium">Sign in to your dashboard</p>
                </div>

                {error && (
                    <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Mail className="w-5 h-5 text-gray-300 dark:text-slate-600" />
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {loginMode === 'password' ? (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-300 dark:text-slate-600" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">OTP Code</label>
                            <div className="flex space-x-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <KeyRound className="w-5 h-5 text-gray-300 dark:text-slate-600" />
                                    </div>
                                    <input
                                        type="text"
                                        required={otpSent}
                                        disabled={!otpSent}
                                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                {!otpSent && (
                                    <button
                                        type="button"
                                        onClick={handleRequestOTP}
                                        disabled={loading || !email}
                                        className="px-6 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all disabled:opacity-50"
                                    >
                                        Send
                                    </button>
                                )}
                            </div>
                            {otpSent && <p className="mt-1 text-[10px] font-black text-green-500 uppercase tracking-widest ml-1">OTP sent to your email!</p>}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || (loginMode === 'otp' && !otpSent)}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : loginMode === 'password' ? 'Sign In' : 'Verify & Login'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100 dark:border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                        <span className="px-4 bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => {
                            setLoginMode(loginMode === 'password' ? 'otp' : 'password');
                            setError('');
                        }}
                        className="flex items-center justify-center px-4 py-3 border border-gray-100 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                    >
                        {loginMode === 'password' ? (
                            <><KeyRound className="w-4 h-4 mr-2 text-blue-500" /> OTP</>
                        ) : (
                            <><Lock className="w-4 h-4 mr-2 text-blue-500" /> Pass</>
                        )}
                    </button>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Login Failed')}
                            useOneTap
                            theme="outline"
                            text="signin_with"
                            shape="rectangular"
                        />
                    </div>
                </div>

                <div className="text-center pt-4">
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-black text-blue-600 hover:text-blue-500 decoration-2 underline-offset-4">
                            Register Business
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
