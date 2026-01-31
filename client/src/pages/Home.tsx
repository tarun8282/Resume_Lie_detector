import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-center bg-linear-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Resume Lie Detector
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 text-center max-w-2xl">
                AI-powered verification to ensure candidate authenticity.
                Upload a resume, take a skill test, and get a Trust Score.
            </p>
            <div className="flex gap-4">
                <Link to="/signup" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition">
                    Get Started
                </Link>
                <Link to="/login" className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-lg font-semibold transition">
                    Login
                </Link>
            </div>
        </div>
    );
};
export default Home;
