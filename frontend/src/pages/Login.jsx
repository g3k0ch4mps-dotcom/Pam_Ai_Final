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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-600">Pamilo AI</h1>
                    <p className="mt-2 text-gray-600">Sign in to your dashboard</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {loginMode === 'password' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">OTP Code</label>
                            <div className="relative mt-1 flex space-x-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <KeyRound className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required={otpSent}
                                        disabled={!otpSent}
                                        className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border disabled:bg-gray-50"
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
                                        className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-sm hover:bg-blue-100 disabled:opacity-50"
                                    >
                                        Send OTP
                                    </button>
                                )}
                            </div>
                            {otpSent && <p className="mt-1 text-xs text-green-600">OTP sent to your email!</p>}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || (loginMode === 'otp' && !otpSent)}
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Processing...' : loginMode === 'password' ? 'Sign In' : 'Verify & Login'}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => {
                            setLoginMode(loginMode === 'password' ? 'otp' : 'password');
                            setError('');
                        }}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        {loginMode === 'password' ? (
                            <><KeyRound className="w-5 h-5 mr-2 text-blue-500" /> OTP Login</>
                        ) : (
                            <><Lock className="w-5 h-5 mr-2 text-blue-500" /> Password</>
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

                <div className="text-center text-sm">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Register Business
                    </Link>
                </div>
            </div>
        </div>
    );
}
