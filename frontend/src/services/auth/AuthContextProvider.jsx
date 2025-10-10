import { useState, useEffect, createContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isLoggedIn, setIsLoggedIn] = useState(!!token);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);

    const decodeToken = (tokenToDecode) => {
        try {
            const decoded = jwtDecode(tokenToDecode);
            setRole(decoded.role || null);
            setUserId(decoded.sub || null); // el id lo guardamos en "sub" según tu backend
            setIsLoggedIn(true);
            return decoded;
        } catch (error) {
            console.error("Token inválido", error);
            handleLogout();
            return null;
        }
    };

    useEffect(() => {
        if (token) decodeToken(token);
        else {
            setIsLoggedIn(false);
            setRole(null);
            setUserId(null);
        }
    }, [token]);

    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        decodeToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setRole(null);
        setUserId(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                isLoggedIn,
                role,
                userId,
                login: handleLogin,
                logout: handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
