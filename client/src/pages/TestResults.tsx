import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Award, Home, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

const TestResults = () => {
    const location = useLocation();
    const { result } = location.state || {}; // { score: 80, correct_count: 8, total: 10, trust_score: 85, details: [] }

    if (!result) return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white font-sans">
            <div className="text-center p-8 bg-[#0B0F1A] border border-white/10 rounded-xl max-w-md w-full mx-4">
                <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-500 mb-4 border border-amber-500/20">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-xl font-bold mb-2">No results found</h2>
                <p className="text-slate-400 text-sm mb-6">It looks like you haven't completed an assessment yet.</p>
                <Link
                    to="/dashboard"
                    className="block w-full py-3 bg-white text-[#030712] font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="relative min-h-screen bg-[#030712] text-white overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200 pb-20">

            {/* --- Matte Background Architecture --- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

                {/* --- Header Section --- */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="inline-flex items-center justify-center p-6 rounded-2xl bg-[#0B0F1A] border border-white/10 mb-8 shadow-2xl relative group"
                    >
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <Award size={48} className="text-indigo-400 relative z-10" strokeWidth={1.5} />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
                    >
                        Assessment <span className="text-slate-500">Analysis</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-slate-400 text-lg max-w-2xl mx-auto"
                    >
                        Performance data has been finalized and recorded on your profile.
                    </motion.p>
                </div>

                {/* --- KPI Grid --- */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
                >
                    {/* Total Score */}
                    <StatsCard
                        title="Total Score"
                        value={`${result.score.toFixed(0)}%`}
                        subtext="Final Result"
                        color="text-indigo-400"
                        borderColor="border-indigo-500/20"
                    >
                        <CircularProgress percentage={result.score} color="#818cf8" />
                    </StatsCard>

                    {/* Trust Score */}
                    <StatsCard
                        title="Trust Index"
                        value={`${Math.round(result.trust_score || 0)}%`}
                        subtext="AI Verification"
                        color={result.trust_score >= 80 ? "text-emerald-400" : result.trust_score >= 50 ? "text-amber-400" : "text-rose-400"}
                        borderColor={result.trust_score >= 80 ? "border-emerald-500/20" : result.trust_score >= 50 ? "border-amber-500/20" : "border-rose-500/20"}
                    >
                        <div className={`p-3 rounded-lg border bg-opacity-10 ${result.trust_score >= 80 ? 'bg-emerald-500 border-emerald-500/20 text-emerald-400' :
                                result.trust_score >= 50 ? 'bg-amber-500 border-amber-500/20 text-amber-400' :
                                    'bg-rose-500 border-rose-500/20 text-rose-400'
                            }`}>
                            <ShieldCheck size={28} strokeWidth={1.5} />
                        </div>
                    </StatsCard>

                    {/* Correct */}
                    <StatsCard
                        title="Correct"
                        value={result.correct_count}
                        subtext={`Out of ${result.total}`}
                        color="text-emerald-400"
                        borderColor="border-emerald-500/20"
                    >
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <CheckCircle2 size={28} strokeWidth={1.5} />
                        </div>
                    </StatsCard>

                    {/* Incorrect */}
                    <StatsCard
                        title="Incorrect"
                        value={result.total - result.correct_count}
                        subtext="Areas to improve"
                        color="text-rose-400"
                        borderColor="border-rose-500/20"
                    >
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                            <XCircle size={28} strokeWidth={1.5} />
                        </div>
                    </StatsCard>
                </motion.div>

                {/* --- Detailed Analysis --- */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                        <div className="p-2 bg-[#151b2e] rounded-lg border border-white/5 text-slate-400">
                            <HelpCircle size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Detailed Breakdown</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {result.details.map((item: any, idx: number) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="group relative bg-[#0B0F1A] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors"
                            >
                                {/* Status Indicator Strip */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.is_correct ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                                <div className="p-6 pl-8">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <h3 className="text-base font-medium text-slate-200 leading-relaxed pr-8">
                                            {item.question}
                                        </h3>
                                        <span className="shrink-0 text-xs font-mono text-slate-500 bg-[#151b2e] px-2 py-1 rounded border border-white/5">
                                            Q{idx + 1}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* User Answer */}
                                        <div className={`p-4 rounded-lg border ${item.is_correct
                                                ? 'bg-emerald-500/5 border-emerald-500/10'
                                                : 'bg-rose-500/5 border-rose-500/10'
                                            }`}>
                                            <span className={`text-[10px] uppercase tracking-wider font-bold mb-1 block ${item.is_correct ? 'text-emerald-500' : 'text-rose-500'
                                                }`}>
                                                Your Selection
                                            </span>
                                            <span className={`text-sm font-medium ${item.is_correct ? 'text-emerald-400' : 'text-rose-400'
                                                }`}>
                                                {item.selected}
                                            </span>
                                        </div>

                                        {/* Correct Answer (only show if wrong) */}
                                        {!item.is_correct && (
                                            <div className="p-4 rounded-lg bg-[#151b2e] border border-white/5 opacity-60">
                                                <span className="text-[10px] uppercase tracking-wider font-bold mb-1 block text-slate-500">
                                                    Correct Answer
                                                </span>
                                                <span className="text-sm font-medium text-slate-300">
                                                    {item.correct}
                                                </span>
                                            </div>
                                        )}

                                        {/* If correct, fill empty space for symmetry (Optional) */}
                                        {item.is_correct && (
                                            <div className="hidden md:flex items-center px-4 text-emerald-500/30 text-xs font-mono">
                                                <CheckCircle2 size={14} className="mr-2" /> Correct
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* --- Footer --- */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 flex justify-center"
                >
                    <Link
                        to="/dashboard"
                        className="group flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-200 text-[#030712] rounded-lg font-bold text-sm transition-all border border-transparent"
                    >
                        <Home size={16} />
                        Return to Dashboard
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

// --- Reusable Components ---

const StatsCard = ({ title, value, subtext, color, borderColor, children }: any) => (
    <motion.div
        variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
        }}
        className={`bg-[#0B0F1A] border ${borderColor} p-6 rounded-xl flex items-center justify-between relative overflow-hidden group`}
    >
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <h3 className={`text-3xl font-bold ${color} tracking-tight font-sans`}>{value}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">{subtext}</p>
        </div>
        <div className="relative z-10">
            {children}
        </div>
    </motion.div>
);

// Minimal Circular Progress for Matte Theme
const CircularProgress = ({ percentage, color }: { percentage: number, color: string }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="transform -rotate-90 w-full h-full">
                {/* Background Circle */}
                <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-[#1a2030]"
                />
                {/* Progress Circle */}
                <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    stroke={color}
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
        </div>
    );
};

export default TestResults;