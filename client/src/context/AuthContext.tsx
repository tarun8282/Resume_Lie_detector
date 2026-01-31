import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode, FC } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Fixed import import { jwtDecode } ...
import toast from 'react-hot-toast';

interface User {
    sub: string;
    username: string; // Add username
    role: string;
    exp: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    // Configure global Axios headers
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }

    useEffect(() => {
        console.log("AuthContext: Checking token...", token);
        if (token) {
            try {
                const decoded = jwtDecode<User>(token);
                console.log("AuthContext: Decoded token", decoded);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    console.log("AuthContext: Token expired");
                    logout();
                } else {
                    console.log("AuthContext: User set");
                    setUser(decoded);
                }
            } catch (error) {
                console.error("AuthContext: Invalid token:", error);
                logout();
            }
        } else {
            console.log("AuthContext: No token");
            setUser(null)
        }
        setIsLoading(false);
    }, [token]);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        toast.success('Successfully logged in!');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.success('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
