import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { getWorkingApiBaseUrl } from '../utils/apiBase';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        const resolveBaseUrl = async () => {
            const url = await getWorkingApiBaseUrl();
            setBaseUrl(url);
        };
        resolveBaseUrl();
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${baseUrl}/api/auth/register`, { username, email, password });
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Section: Welcome Message */}
                <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-gradient-to-br from-purple-600 to-indigo-700 text-white relative overflow-hidden">
                    <div className="absolute w-64 h-64 bg-purple-500/20 rounded-full animate-float-one -top-10 -left-20"></div>
                    <div className="absolute w-72 h-72 bg-indigo-500/20 rounded-full animate-float-two -bottom-20 -right-10"></div>
                    <div className="relative z-10 text-center">
                        <h2 className="text-5xl font-extrabold mb-4 animate-fade-in-up">Join Us Today!</h2>
                        <p className="text-lg opacity-90 animate-fade-in-up delay-100">Create your account to start practicing with our AI interviewer.</p>
                    </div>
                </div>

                {/* Right Section: Signup Form */}
                <div className="md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12">
                    <div className="w-full max-w-sm">
                        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Create an Account</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                             <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="username">Username</label>
                                <User className="absolute left-4 top-1/2 -translate-y-0.5 w-5 h-5 text-gray-400" />
                                <input
                                    id="username" type="text" value={username} onChange={e => setUsername(e.target.value)}
                                    placeholder="Choose a username" required
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-200 focus:border-purple-400 transition"
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">Email</label>
                                <Mail className="absolute left-4 top-1/2 -translate-y-0.5 w-5 h-5 text-gray-400" />
                                <input
                                    id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="your.email@example.com" required
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-200 focus:border-purple-400 transition"
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">Password</label>
                                <Lock className="absolute left-4 top-1/2 -translate-y-0.5 w-5 h-5 text-gray-400" />
                                <input
                                    id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="Create a strong password" required
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-purple-200 focus:border-purple-400 transition"
                                />
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full inline-flex items-center justify-center gap-3 text-white py-3 px-6 rounded-lg text-lg font-bold shadow-lg transition duration-300 ease-in-out bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign Up</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                        <p className="mt-8 text-center text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-purple-600 hover:text-purple-800 font-bold hover:underline transition-colors">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;