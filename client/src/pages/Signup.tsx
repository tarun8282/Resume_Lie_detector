import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Loader2, UserPlus, ArrowRight } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'applicant' // Default role
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/auth/signup`, formData);
            toast.success('Account created! Please login.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#030712] overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">

            {/* --- Matte Background Architecture --- */}
            <div className="absolute inset-0 z-0">
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                {/* Bottom Fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent"></div>
            </div>

            {/* --- Signup Card --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md p-8 bg-[#0B0F1A] border border-white/10 rounded-xl shadow-2xl"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#151b2e] text-indigo-400 border border-white/10 mb-4 shadow-inner">
                        <UserPlus size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
                    <p className="text-slate-400 text-sm">Join the platform to verify your career history</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Username Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 ml-1 uppercase tracking-wider">Username</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-[#030712] border border-white/10 rounded-lg text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-200 sm:text-sm"
                                placeholder="johndoe"
                                required
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 ml-1 uppercase tracking-wider">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 bg-[#030712] border border-white/10 rounded-lg text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-200 sm:text-sm"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 ml-1 uppercase tracking-wider">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2.5 bg-[#030712] border border-white/10 rounded-lg text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-200 sm:text-sm"
                                placeholder="Create a strong password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button - High Contrast White */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 mt-4
                            ${isLoading
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-white text-[#030712] hover:bg-slate-200 border border-transparent hover:shadow-lg'
                            }`}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin mr-2" size={18} />
                        ) : (
                            <span className="flex items-center gap-2">
                                Get Started <ArrowRight size={16} />
                            </span>
                        )}
                    </motion.button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-slate-500">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-all">
                            Log in here
                        </Link>
                    </p>
                </div>
            </motion.div>

            {/* Footer Trust */}
            <div className="absolute bottom-6 text-xs text-slate-600">
                Secured by VeriResume Intelligence
            </div>
        </div>
    );
};

export default Signup;