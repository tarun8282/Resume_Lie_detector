import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ResumeUpload from '../components/ResumeUpload';
import { API_BASE_URL } from '../config';

const Dashboard = () => {
    const { user } = useAuth();
    const [resume, setResume] = useState<any>(null);
    const [recruiterData, setRecruiterData] = useState<any[]>([]);

    const [filterSkill, setFilterSkill] = useState('');
    const [sortBy, setSortBy] = useState('date_desc');

    useEffect(() => {
        if (user?.role === 'applicant') {
            const fetchResume = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/resumes/my-resume`);
                    setResume(response.data);
                } catch (error) {
                    console.log("No resume found or error fetching resume");
                }
            };
            fetchResume();
        } else if (user?.role === 'recruiter') {
            fetchApplicants();
        }
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
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <div className="max-w-4xl mx-auto">
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-6">
                    <h2 className="text-2xl mb-2">Welcome, {user?.username}</h2>
                    <p className="text-gray-400">Role: <span className="capitalize text-blue-400">{user?.role}</span></p>
                </div>

                {user?.role === 'applicant' && (
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-6">
                        <div className="mb-8 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Your Latest Resume</h2>
                        </div>
                        {resume ? <ResumeUpload initialData={resume.parsed_content} resumeId={resume.id} isTestCompleted={resume.has_taken_test} /> : <ResumeUpload />}
                    </div>
                )}

                {user?.role === 'recruiter' && (
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h3 className="text-xl font-semibold">Applicant Overview</h3>

                            <div className="flex gap-2 w-full md:w-auto">
                                <input
                                    type="text"
                                    placeholder="Filter by Skill..."
                                    value={filterSkill}
                                    onChange={(e) => setFilterSkill(e.target.value)}
                                    className="bg-slate-700 text-white px-3 py-2 rounded text-sm border border-slate-600 focus:border-blue-500 outline-none"
                                />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-slate-700 text-white px-3 py-2 rounded text-sm border border-slate-600 focus:border-blue-500 outline-none"
                                >
                                    <option value="date_desc">Newest First</option>
                                    <option value="score_desc">Highest Score</option>
                                    <option value="exp_desc">Most Experienced</option>
                                </select>
                                <button
                                    onClick={fetchApplicants}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>

                        {recruiterData.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No applicants found yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-700 text-gray-400 text-sm">
                                            <th className="p-3 font-medium">Applicant</th>
                                            <th className="p-3 font-medium">Experience</th>
                                            <th className="p-3 font-medium">Extracted Skills</th>
                                            <th className="p-3 font-medium">Test Score</th>
                                            <th className="p-3 font-medium">Trust Score</th>
                                            <th className="p-3 font-medium">Resume</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {recruiterData.map((app: any) => (
                                            <tr key={app.id} className="hover:bg-slate-700/30 transition">
                                                <td className="p-3">
                                                    <div className="font-medium text-white">{app.username}</div>
                                                    <div className="text-xs text-gray-500">{app.email}</div>
                                                </td>
                                                <td className="p-3">
                                                    <span className="text-white font-medium">{app.resume?.experience_years || 0} Years</span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                                        {app.resume?.skills?.slice(0, 3).map((skill: string, i: number) => (
                                                            <span key={i} className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded border border-blue-800/50">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {app.resume?.skills?.length > 3 && (
                                                            <span className="text-xs text-gray-500 py-0.5">+{app.resume.skills.length - 3} more</span>
                                                        )}
                                                        {!app.resume?.skills?.length && <span className="text-gray-500 text-xs">-</span>}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    {app.test_result ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className={`font-bold text-lg ${app.test_result.score >= 70 ? 'text-green-400' : app.test_result.score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                                {Math.round(app.test_result.score)}%
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(app.test_result.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm italic">Not taken</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    {app.test_result ? (
                                                        <div className={`font-bold text-lg ${app.test_result.trust_score >= 90 ? 'text-green-400' : app.test_result.trust_score >= 70 ? 'text-yellow-400' : 'text-red-500'}`}>
                                                            {Math.round(app.test_result.trust_score || 0)}%
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">-</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    {app.resume?.file_url ? (
                                                        <a
                                                            href={app.resume.file_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-sm text-blue-400 hover:text-white underline decoration-blue-400/30 hover:decoration-white"
                                                        >
                                                            View PDF
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-600 text-sm">No resume</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {user?.role !== 'applicant' && user?.role !== 'recruiter' && (
                    <div className="bg-red-900/50 p-6 rounded-lg border border-red-700 mt-6 text-white">
                        <h3 className="font-bold text-lg">Debug Info</h3>
                        <p>User role "{user?.role}" is not recognized.</p>
                        <pre className="mt-2 text-xs bg-black/50 p-2 overflow-auto rounded">
                            {JSON.stringify(user, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Dashboard;
