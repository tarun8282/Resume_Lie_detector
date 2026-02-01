import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Cpu, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';

const Home = () => {
    return (
        <div className="relative min-h-screen bg-[#030712] text-white overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">

            {/* --- Background Architecture --- */}
            <div className="absolute inset-0 z-0">
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Matte Spotlight Effect (Top Center) */}
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>

                {/* Bottom Fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent"></div>
            </div>

            {/* --- Navigation --- */}
            <nav className="relative z-50 px-6 py-6 max-w-7xl mx-auto flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-white text-black">
                        <Activity size={18} strokeWidth={3} />
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-white">
                        Veri<span className="text-slate-400">Resume</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
                    <a href="#features" className="hover:text-white transition-colors">Product</a>
                    <a href="#solution" className="hover:text-white transition-colors">Solutions</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                </div>

                <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Sign In
                    </Link>
                    <Link to="/signup" className="px-5 py-2 text-sm font-medium text-[#030712] bg-white hover:bg-slate-200 rounded transition-all">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-24 pb-32 text-center max-w-5xl mx-auto">

                {/* Precision Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    AI Verification Engine 2.0 Live
                </motion.div>

                {/* Main Heading - Metallic Matte Look */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400"
                >
                    Authenticity is the <br />
                    new currency.
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed font-light"
                >
                    Eliminate resume fraud with military-grade AI analysis.
                    We cross-reference claims, test skills, and generate a
                    <span className="text-white font-medium"> Trust Score</span> you can rely on.
                </motion.p>

                {/* Action Buttons - Matte & Flat */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Link
                        to="/signup"
                        className="group flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all"
                    >
                        Start Verification
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/login"
                        className="flex items-center justify-center px-8 py-4 bg-[#0B0F1A] hover:bg-[#121726] text-slate-200 border border-slate-800 hover:border-slate-700 rounded-lg font-medium transition-all"
                    >
                        View Interactive Demo
                    </Link>
                </motion.div>

                {/* --- Matte Feature Cards --- */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full"
                >
                    <MatteCard
                        icon={<FileText size={24} />}
                        title="Document Parsing"
                        desc="Instant extraction of key data points from any PDF format."
                        delay={0}
                    />
                    <MatteCard
                        icon={<Cpu size={24} />}
                        title="AI Cross-Check"
                        desc="Neural networks verify experience against skill assessments."
                        delay={1}
                    />
                    <MatteCard
                        icon={<ShieldCheck size={24} />}
                        title="Trust Index"
                        desc="A definitive 0-100 score on candidate authenticity."
                        delay={2}
                    />
                </motion.div>

                {/* Trust Signals */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-20 pt-10 border-t border-white/5 w-full max-w-4xl"
                >
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-6">Trusted by modern hiring teams</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
                        {/* Simple placeholders for logos to maintain the minimalist vibe */}
                        <div className="h-6 w-24 bg-slate-600 rounded"></div>
                        <div className="h-6 w-24 bg-slate-600 rounded"></div>
                        <div className="h-6 w-24 bg-slate-600 rounded"></div>
                        <div className="h-6 w-24 bg-slate-600 rounded"></div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

// Custom Matte Card Component
const MatteCard = ({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) => (
    <div className="group relative p-8 text-left bg-[#0B0F1A] border border-white/5 hover:border-indigo-500/30 transition-colors duration-500 rounded-xl overflow-hidden">

        {/* Hover Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative z-10">
            <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#151b2e] text-indigo-400 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>

            <div className="mt-6 flex items-center text-xs font-medium text-indigo-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Learn more <ArrowRight size={12} className="ml-1" />
            </div>
        </div>
    </div>
);

export default Home;