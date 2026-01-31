import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'applicant'
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/auth/signup`, formData);
            toast.success('Account created! Please login.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Signup failed');
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-slate-900">
            <div className="w-full max-w-md bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition font-semibold"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-400">
                    Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
