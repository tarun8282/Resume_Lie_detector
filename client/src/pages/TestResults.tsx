import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award, Home } from 'lucide-react';

const TestResults = () => {
    const location = useLocation();
    const { result } = location.state || {}; // { score: 80, correct_count: 8, total: 10, details: [] }

    if (!result) return <div className="p-10 text-center text-white">No results found.</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-6 rounded-full bg-slate-800 border-4 border-blue-500 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                    >
                        <Award size={64} className="text-blue-400" />
                    </motion.div>
                    <h1 className="text-4xl font-bold mb-2">Test Completed</h1>
                    <p className="text-slate-400">Here is your performance report</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
                        <div className="text-4xl font-bold text-blue-400 mb-2">{result.score.toFixed(0)}%</div>
                        <div className="text-sm text-slate-400">Total Score</div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
                        <div className="text-4xl font-bold text-green-400 mb-2">{result.correct_count}</div>
                        <div className="text-sm text-slate-400">Correct Answers</div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
                        <div className="text-4xl font-bold text-slate-400 mb-2">{result.total}</div>
                        <div className="text-sm text-slate-400">Total Questions</div>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
                        <div className={`text-4xl font-bold mb-2 ${result.trust_score >= 90 ? 'text-green-400' : result.trust_score >= 70 ? 'text-yellow-400' : 'text-red-500'}`}>
                            {Math.round(result.trust_score || 0)}%
                        </div>
                        <div className="text-sm text-slate-400">Trust Score</div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6">Detailed Analysis</h2>
                <div className="space-y-4">
                    {result.details.map((item: any, idx: number) => (
                        <div key={idx} className={`p-4 rounded-lg border ${item.is_correct ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
                            <div className="flex gap-3">
                                {item.is_correct ? <CheckCircle className="text-green-400 shrink-0" /> : <XCircle className="text-red-400 shrink-0" />}
                                <div>
                                    <p className="font-semibold mb-2">{item.question}</p>
                                    <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className={item.is_correct ? 'text-green-300' : 'text-red-300'}>
                                            <span className="opacity-70">Your Answer:</span> {item.selected}
                                        </div>
                                        {!item.is_correct && (
                                            <div className="text-green-400">
                                                <span className="opacity-70">Correct Answer:</span> {item.correct}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-bold transition inline-flex items-center gap-2">
                        <Home size={20} /> Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TestResults;
