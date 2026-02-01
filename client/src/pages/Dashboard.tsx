import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ResumeUpload from '../components/ResumeUpload';
import { API_BASE_URL } from '../config';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Search,
    Filter,
    FileText,
    ShieldAlert,
    ShieldCheck,
    BrainCircuit,
    Clock,
    Download,
    UserCircle,
    LogOut,
    ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [resume, setResume] = useState<any>(null);
    const [recruiterData, setRecruiterData] = useState<any[]>([]);

    const [filterSkill, setFilterSkill] = useState('');
    const [sortBy, setSortBy] = useState('date_desc');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Data Logic
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (user?.role === 'applicant') {
                    const response = await axios.get(`${API_BASE_URL}/resumes/my-resume`);
                    setResume(response.data);
                } else if (user?.role === 'recruiter') {
                    await fetchApplicants();
                }
            } catch (error) {
                console.log("Data fetch error or empty state");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const fetchApplicants = async () => {
        try {
            const params = new URLSearchParams();
            if (filterSkill) params.append('skill', filterSkill);
            params.append('sort_by', sortBy);

            const response = await axios.get(`${API_BASE_URL}/recruiter/applicants?${params.toString()}`);
            setRecruiterData(response.data);
        } catch (error) {
            console.error("Failed to fetch applicants", error);
            toast.error("Could not fetch applicants");
        }
    };

    // Helper for Score Colors - Adjusted for Matte Theme (Higher Contrast)
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
        if (score >= 50) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
        return "text-rose-400 border-rose-500/30 bg-rose-500/10";
    };

    return (
        <div className="relative min-h-screen bg-[#030712] text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-200">

            {/* --- Background Architecture --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent"></div>
            </div>

            {/* --- Navbar --- */}
            <header className="relative z-20 border-b border-white/5 bg-[#030712]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded bg-white text-black">
                            <LayoutDashboard size={18} strokeWidth={3} />
                        </div>
                        <h1 className="text-lg font-semibold tracking-tight text-white">
                            Veri<span className="text-slate-400">Resume</span> <span className="text-slate-600 mx-2">/</span> Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">{user?.username}</p>
                                <p className="text-xs text-indigo-400 font-mono uppercase tracking-wider">{user?.role}</p>
                            </div>
                            <div className="w-9 h-9 rounded bg-[#151b2e] border border-white/10 flex items-center justify-center text-slate-300 font-bold">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                            title="Sign Out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- Main Content --- */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">

                {/* Applicant View */}
                {user?.role === 'applicant' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="bg-[#0B0F1A] border border-white/5 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-[#0f1422]">
                                <div className="p-3 bg-[#1a2030] rounded-lg text-indigo-400 border border-white/5">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Resume Management</h2>
                                    <p className="text-slate-400 text-sm">Upload your latest CV for AI verification.</p>
                                </div>
                            </div>

                            <div className="p-6">
                                {resume ? (
                                    <ResumeUpload
                                        initialData={resume.parsed_content}
                                        resumeId={resume.id}
                                        isTestCompleted={resume.has_taken_test}
                                    />
                                ) : (
                                    <ResumeUpload />
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Recruiter View */}
                {user?.role === 'recruiter' && (
                    <div className="space-y-6">

                        {/* Toolbar - Matte Style */}
                        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-white/5 pb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Applicants</h2>
                                <p className="text-slate-400 text-sm mt-1">Manage and verify incoming candidate applications.</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter by Skill..."
                                        value={filterSkill}
                                        onChange={(e) => setFilterSkill(e.target.value)}
                                        className="pl-9 pr-4 py-2 bg-[#0B0F1A] border border-white/10 rounded-lg text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none w-full sm:w-64 transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={14} />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="pl-9 pr-10 py-2 bg-[#0B0F1A] border border-white/10 rounded-lg text-sm text-white appearance-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer hover:border-white/20 transition-colors"
                                    >
                                        <option value="date_desc">Newest First</option>
                                        <option value="score_desc">Highest Trust Score</option>
                                        <option value="exp_desc">Most Experienced</option>
                                    </select>
                                </div>

                                <button
                                    onClick={fetchApplicants}
                                    className="px-4 py-2 bg-white hover:bg-slate-200 text-[#030712] text-sm font-semibold rounded-lg transition-colors border border-transparent"
                                >
                                    Refresh Data
                                </button>
                            </div>
                        </div>

                        {/* Data Table - Matte Style */}
                        <div className="bg-[#0B0F1A] border border-white/5 rounded-xl overflow-hidden">
                            {recruiterData.length === 0 ? (
                                <div className="p-16 text-center">
                                    <div className="inline-flex p-4 rounded-full bg-[#151b2e] mb-4 text-slate-500 border border-white/5">
                                        <Search size={24} />
                                    </div>
                                    <h3 className="text-white font-medium">No applicants found</h3>
                                    <p className="text-slate-500 text-sm mt-1">Adjust filters or check back later.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-[#0f1422] text-xs uppercase tracking-wider text-slate-400 font-semibold">
                                                <th className="p-4 font-medium">Candidate</th>
                                                <th className="p-4 font-medium">Experience</th>
                                                <th className="p-4 font-medium">Skills Identified</th>
                                                <th className="p-4 font-medium">Test Score</th>
                                                <th className="p-4 font-medium">Trust Index</th>
                                                <th className="p-4 font-medium text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {recruiterData.map((app: any, index: number) => (
                                                <motion.tr
                                                    key={app.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    className="group hover:bg-[#151b2e] transition-colors"
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-[#1a2030] flex items-center justify-center text-slate-300 font-bold border border-white/5 text-xs">
                                                                {app.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-white">{app.username}</div>
                                                                <div className="text-xs text-slate-500">{app.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                            <Clock size={14} />
                                                            <span>{app.resume?.experience_years || 0}y</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                            {app.resume?.skills?.slice(0, 3).map((skill: string, i: number) => (
                                                                <span key={i} className="text-[10px] font-mono bg-[#1a2030] text-slate-300 px-1.5 py-0.5 rounded border border-white/5">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                            {app.resume?.skills?.length > 3 && (
                                                                <span className="text-[10px] text-slate-600 px-1">+{app.resume.skills.length - 3}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        {app.test_result ? (
                                                            <div className="flex items-center gap-2">
                                                                <BrainCircuit size={14} className={app.test_result.score >= 70 ? 'text-emerald-400' : 'text-slate-500'} />
                                                                <span className={`text-sm font-mono font-medium ${app.test_result.score >= 70 ? 'text-emerald-400' : app.test_result.score >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                                    {Math.round(app.test_result.score)}%
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-slate-600">Pending</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {app.test_result ? (
                                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border ${getScoreColor(app.test_result.trust_score)}`}>
                                                                {app.test_result.trust_score >= 80 ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                                                                <span className="text-xs font-bold tracking-wide">{Math.round(app.test_result.trust_score)}%</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-600 text-sm">-</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        {app.resume?.file_url ? (
                                                            <a
                                                                href={app.resume.file_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#151b2e] hover:bg-[#1f2937] text-indigo-400 hover:text-indigo-300 border border-white/5 hover:border-indigo-500/30 rounded text-xs font-medium transition-all"
                                                            >
                                                                <Download size={12} />
                                                                PDF
                                                            </a>
                                                        ) : (
                                                            <span className="text-slate-700 text-xs">Missing</span>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;