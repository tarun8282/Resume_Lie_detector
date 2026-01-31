import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface ResumeUploadProps {
    initialData?: any;
    resumeId?: number;
    isTestCompleted?: boolean;
}

const ResumeUpload = ({ initialData, resumeId: initialResumeId, isTestCompleted = false }: ResumeUploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [parsedData, setParsedData] = useState<any>(initialData || null);
    const [resumeId, setResumeId] = useState<number | undefined>(initialResumeId);
    const navigate = useNavigate();
    const [isGeneratingTest, setIsGeneratingTest] = useState(false);

    useEffect(() => {
        if (initialData) {
            setParsedData(initialData);
        }
        if (initialResumeId) {
            setResumeId(initialResumeId);
        }
    }, [initialData, initialResumeId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Resume uploaded and parsed!');
            setParsedData(response.data.parsed_data);
            setResumeId(response.data.resume_id); // Capture resume_id
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleTakeTest = async () => {
        setIsGeneratingTest(true);
        try {

            const testRes = await axios.post(`${API_BASE_URL}/tests/generate?resume_id=${resumeId}`);

            navigate('/test', {
                state: {
                    testId: testRes.data.test_id,
                    questions: testRes.data.questions
                }
            });

        } catch (error) {
            toast.error("Could not generate test. Please upload a resume first.");
        } finally {
            setIsGeneratingTest(false);
        }
    };

    return (
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
            {!parsedData ? (
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.txt"
                        className="hidden"
                        id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer block">
                        {file ? (
                            <p className="text-green-400 font-medium">{file.name}</p>
                        ) : (
                            <>
                                <p className="text-gray-300 text-lg">Click to Upload Resume (PDF)</p>
                                <p className="text-gray-500 text-sm mt-1">Maximum size 5MB</p>
                            </>
                        )}
                    </label>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Resume Analysis</h3>
                            <p className="text-slate-400 text-sm max-w-xl">{parsedData.summary}</p>
                        </div>
                        <button
                            onClick={() => setParsedData(null)}
                            className="text-sm text-slate-500 hover:text-white"
                        >
                            Upload Different Resume
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-400 mb-3">Extracted Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {parsedData.skills.map((skill: string, i: number) => (
                                    <span key={i} className="bg-blue-600/20 text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-lg flex flex-col justify-center items-center text-center">
                            <h4 className="font-semibold text-purple-400 mb-2">Experience</h4>
                            <div className="text-3xl font-bold text-white mb-1">{parsedData.experience_years} Years</div>
                            <p className="text-xs text-slate-500">Estimated from work history</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                        {isTestCompleted ? (
                            <div className="bg-green-900/40 border border-green-600 p-4 rounded-lg text-center">
                                <h3 className="text-xl font-bold text-green-400 mb-1">Test Completed</h3>
                                <p className="text-slate-300">You have already taken the assessment for this resume.</p>
                            </div>
                        ) : (
                            <button
                                onClick={handleTakeTest}
                                disabled={isGeneratingTest}
                                className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-4 rounded-lg font-bold text-lg shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-3"
                            >
                                {isGeneratingTest ? (
                                    <>Generating tailored questions...</>
                                ) : (
                                    <><Play fill="currentColor" /> Take Skill Assessment Test</>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {file && !parsedData && ( // Only show upload button if file is selected and not yet parsed
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={`w-full mt-4 py-2 rounded transition font-semibold text-white ${isUploading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {isUploading ? 'Analyzing...' : 'Analyze Resume'}
                </button>
            )}
        </div>
    );
};

export default ResumeUpload;
