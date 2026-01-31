import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', email); // OAuth2 expects 'username'
            formData.append('password', password);

            const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
            login(response.data.access_token);
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Login failed');
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-slate-900">
            <div className="w-full max-w-md bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition font-semibold"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-400">
                    Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
