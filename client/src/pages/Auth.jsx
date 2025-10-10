import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock } from 'lucide-react';
import { getWorkingApiBaseUrl } from '../utils/apiBase';

// This component combines Login and Signup into one animated page.
const AuthPage = ({ setUser }) => {
    // State to toggle between Login and Signup panels
    const [isLoginView, setIsLoginView] = useState(true);

    // Form states
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    
    // Shared states
    const [loading, setLoading] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');
    const navigate = useNavigate();

    // --- NEW: State for the animated greeting ---
    const greetings = ['Bonjour', 'नमस्ते', 'Hola', 'Ciao', 'Hello'];
    const [greetingIndex, setGreetingIndex] = useState(0);

    useEffect(() => {
        const resolveBaseUrl = async () => {
            const url = await getWorkingApiBaseUrl();
            setBaseUrl(url);
        };
        resolveBaseUrl();

        // --- NEW: Interval to change the greeting every 3 seconds ---
        const intervalId = setInterval(() => {
            setGreetingIndex(prevIndex => (prevIndex + 1) % greetings.length);
        }, 3000);

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${baseUrl}/api/auth/login`, { email: loginEmail, password: loginPassword });
            const { token, user } = res.data;
            const userId = user?.id;

            if (token && userId) {
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                setUser({ token, userId });
                toast.success("Login successful! Welcome back.");
                navigate('/');
            } else {
                toast.error('Login failed: Invalid response from server.');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${baseUrl}/api/auth/register`, { username: signupUsername, email: signupEmail, password: signupPassword });
            toast.success('Registration successful! Please log in.');
            setIsLoginView(true); // Switch to login view after successful signup
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const AuthStyles = () => (
        <style>{`
            .auth-container {
                background-color: #fff;
                border-radius: 24px;
                box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                position: relative;
                overflow: hidden;
                width: 100%;
                max-width: 868px;
                min-height: 580px;
            }
            .form-container {
                position: absolute;
                top: 0;
                height: 100%;
                transition: all 0.6s ease-in-out;
            }
            .sign-in-container {
                left: 0;
                width: 50%;
                z-index: 2;
            }
            .auth-container.right-panel-active .sign-in-container {
                transform: translateX(100%);
            }
            .sign-up-container {
                left: 0;
                width: 50%;
                opacity: 0;
                z-index: 1;
            }
            .auth-container.right-panel-active .sign-up-container {
                transform: translateX(100%);
                opacity: 1;
                z-index: 5;
                animation: show 0.6s;
            }
            @keyframes show {
                0%, 49.99% { opacity: 0; z-index: 1; }
                50%, 100% { opacity: 1; z-index: 5; }
            }
            .overlay-container {
                position: absolute;
                top: 0;
                left: 50%;
                width: 50%;
                height: 100%;
                overflow: hidden;
                transition: transform 0.6s ease-in-out;
                z-index: 100;
            }
            .auth-container.right-panel-active .overlay-container {
                transform: translateX(-100%);
            }
            .overlay {
                background: #FF416C;
                background: -webkit-linear-gradient(to right, #8A2387, #E94057, #F27121);
                background: linear-gradient(to right, #8A2387, #E94057, #F27121);
                background-repeat: no-repeat;
                background-size: cover;
                background-position: 0 0;
                color: #FFFFFF;
                position: relative;
                left: -100%;
                height: 100%;
                width: 200%;
                transform: translateX(0);
                transition: transform 0.6s ease-in-out;
            }
            .auth-container.right-panel-active .overlay {
                transform: translateX(50%);
            }
            .overlay-panel {
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                padding: 0 40px;
                text-align: center;
                top: 0;
                height: 100%;
                width: 50%;
                transform: translateX(0);
                transition: transform 0.6s ease-in-out;
            }
            .overlay-left {
                transform: translateX(-20%);
            }
            .auth-container.right-panel-active .overlay-left {
                transform: translateX(0);
            }
            .overlay-right {
                right: 0;
                transform: translateX(0);
            }
            .auth-container.right-panel-active .overlay-right {
                transform: translateX(20%);
            }
            .ghost {
                background-color: transparent;
                border-color: #FFFFFF !important;
            }
            /* --- NEW: Animation for the greeting text --- */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .greeting-animate {
                animation: fadeIn 0.8s ease-in-out;
            }
        `}</style>
    );

    const FormInput = ({ id, type, placeholder, value, onChange, icon }) => (
        <div className="relative">
            {icon}
            <input
                id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} required
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
        </div>
    );
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <AuthStyles />
            <div className={`auth-container ${!isLoginView ? "right-panel-active" : ""}`} id="container">
                {/* Sign Up Form */}
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSignupSubmit} className="bg-white flex items-center justify-center flex-col px-12 h-full text-center">
                        <h1 className="text-3xl font-extrabold mb-6">Create Account</h1>
                        <div className="w-full space-y-4">
                           <FormInput id="signup-username" type="text" placeholder="Username" value={signupUsername} onChange={e => setSignupUsername(e.target.value)} icon={<User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />} />
                           <FormInput id="signup-email" type="email" placeholder="Email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} icon={<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />} />
                           <FormInput id="signup-password" type="password" placeholder="Password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} icon={<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />} />
                        </div>
                        <button type="submit" disabled={loading} className="mt-6 w-full inline-flex items-center justify-center gap-3 text-white py-3 px-6 rounded-full text-sm font-bold shadow-lg transition duration-300 ease-in-out bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 disabled:bg-gray-400">
                           {loading ? 'Creating...' : 'Sign Up'}
                        </button>
                    </form>
                </div>

                {/* Sign In Form */}
                <div className="form-container sign-in-container">
                    <form onSubmit={handleLoginSubmit} className="bg-white flex items-center justify-center flex-col px-12 h-full text-center">
                        <h1 className="text-3xl font-extrabold mb-6">Sign in</h1>
                        <div className="w-full space-y-4">
                           <FormInput id="login-email" type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} icon={<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />} />
                           <FormInput id="login-password" type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} icon={<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />} />
                        </div>
                        <button type="submit" disabled={loading} className="mt-6 w-full inline-flex items-center justify-center gap-3 text-white py-3 px-6 rounded-full text-sm font-bold shadow-lg transition duration-300 ease-in-out bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 disabled:bg-gray-400">
                           {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Overlay Panels */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1 className="text-4xl font-extrabold mb-4">Welcome Back!</h1>
                            <p className="text-lg font-light px-8 mb-6">To keep connected with us please login with your personal info</p>
                            <button className="ghost py-3 px-10 border border-white rounded-full text-sm font-bold uppercase tracking-wider transition-transform duration-75 ease-in hover:scale-105" onClick={() => setIsLoginView(true)}>Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            {/* --- MODIFIED: Animated Greeting --- */}
                            <h1
                                key={greetingIndex}
                                className="text-4xl font-extrabold mb-4 greeting-animate"
                            >
                                {greetings[greetingIndex]}, Friend!
                            </h1>
                            <p className="text-lg font-light px-8 mb-6">Enter your personal details and start your journey with us</p>
                            <button className="ghost py-3 px-10 border border-white rounded-full text-sm font-bold uppercase tracking-wider transition-transform duration-75 ease-in hover:scale-105" onClick={() => setIsLoginView(false)}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;