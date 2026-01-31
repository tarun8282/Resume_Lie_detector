import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface Question {
    id: number;
    skill: string;
    type: "MCQ" | "SYNTAX";
    question: string;
    options: string[];
}

const TestInterface = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { testId, questions } = location.state || {}; // Duration in minutes (optional)

    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState<number>(30 * 60); // 30 mins default
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Trust Metrics
    const [tabSwitches, setTabSwitches] = useState(0);
    const [copyAttempts, setCopyAttempts] = useState(0);

    const submitTest = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                answers,
                trust_metrics: {
                    tab_switches: tabSwitches,
                    copy_attempts: copyAttempts
                }
            };
            // Note: Updated to send JSON body correctly. Before it was just 'answers'.
            // The backend endpoint signature will need to match this structure.
            const res = await axios.post(`${API_BASE_URL}/tests/submit?test_id=${testId}`, payload);
            navigate('/results', { state: { result: res.data } });
            toast.success("Test submitted!");
        } catch (error: any) {
            toast.error("Submission failed");
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!testId || !questions) {
            toast.error("Invalid test session");
            navigate('/dashboard');
        }

        // Timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    submitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // --- Trust / Anti-Cheat Monitoring ---
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitches(prev => {
                    const newVal = prev + 1;
                    if (newVal <= 3) {
                        toast("⚠️ Warning: switching tabs affects your Trust Score!", { icon: "👀" });
                    }
                    return newVal;
                });
            }
        };

        const handleCopyPaste = (e: Event) => {
            e.preventDefault();
            setCopyAttempts(prev => {
                const newVal = prev + 1;
                toast("⚠️ Copying/Pasting is disabled during the test!", { icon: "🚫" });
                return newVal;
            });
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("copy", handleCopyPaste);
        document.addEventListener("paste", handleCopyPaste);
        document.addEventListener("cut", handleCopyPaste);
        document.addEventListener("contextmenu", handleCopyPaste); // Disable right click

        return () => {
            clearInterval(timer);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("copy", handleCopyPaste);
            document.removeEventListener("paste", handleCopyPaste);
            document.removeEventListener("cut", handleCopyPaste);
            document.removeEventListener("contextmenu", handleCopyPaste);
        };
    }, []);

    const handleOptionSelect = (questionId: number, option: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleFinishClick = async () => {
        if (Object.keys(answers).length < questions.length) {
            if (!confirm("You haven't answered all questions. Submit anyway?")) return;
        }
        await submitTest();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!questions) return null;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-slate-800 p-4 shadow-lg z-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-blue-400">Skill Assessment</h2>
                <div className={`flex items-center gap-2 font-mono text-xl ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                    <Clock size={20} />
                    {formatTime(timeLeft)}
                </div>
                <button
                    onClick={handleFinishClick}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold transition flex items-center gap-2"
                >
                    {isSubmitting ? 'Submitting...' : 'Finish Test'} <CheckCircle size={18} />
                </button>
            </header>

            {/* Main Content - Scrollable List of Questions */}
            <div className="max-w-4xl mx-auto mt-20 pb-20 space-y-8">
                {questions.map((q: Question, idx: number) => (
                    <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500/30 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-slate-700 text-xs text-slate-300 px-2 py-1 rounded uppercase tracking-wider">
                                {q.skill} • {q.type}
                            </span>
                            <span className="text-slate-500 text-sm">Question {idx + 1} of {questions.length}</span>
                        </div>

                        <h3 className="text-lg font-semibold mb-6 leading-relaxed whitespace-pre-wrap font-mono">
                            {q.question}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((option, optIdx) => (
                                <button
                                    key={optIdx}
                                    onClick={() => handleOptionSelect(q.id, option)}
                                    className={`p-4 rounded-lg text-left transition-all border ${answers[q.id] === option
                                        ? 'bg-blue-600/20 border-blue-500 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                        : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500'
                                        }`}
                                >
                                    <span className="font-bold mr-3 text-slate-400">{String.fromCharCode(65 + optIdx)}.</span>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TestInterface;
