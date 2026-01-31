import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-slate-800 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Resume Lie Detector
                </Link>
                <div className="space-x-4">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-300">Login</Link>
                            <Link
                                to="/signup"
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
