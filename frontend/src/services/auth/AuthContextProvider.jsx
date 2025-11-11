import { useState, useEffect, createContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isLoggedIn, setIsLoggedIn] = useState(!!token);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    const decodeToken = (tokenToDecode) => {
        try {
            const decoded = jwtDecode(tokenToDecode);
            setRole(decoded.role || null);
            setUserId(decoded.sub || null);
            setIsLoggedIn(true);
            return decoded;
        } catch (error) {
            handleLogout();
            return null;
        }
    };

    useEffect(() => {
        if (token) {
            decodeToken(token);
        } else {
            setIsLoggedIn(false);
            setRole(null);
            setUserId(null);
        }
        setLoading(false); 
    }, [token]);

    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        decodeToken(newToken);
        setLoading(false); 
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setRole(null);
        setUserId(null);
        setIsLoggedIn(false);
        setLoading(false); 
        navigate("/"); 
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                isLoggedIn,
                role,
                userId,
                loading, 
                login: handleLogin,
                logout: handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}