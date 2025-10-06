import { useState } from "react";
import { AuthContext } from "./AuthContext";

export function AuthContextProvider({ children }) {
    const [auth, setAuth] = useState({
        isLoggedIn: true,
        role: "superadmin", // guest | user | admin | superadmin
    });

    const login = (role = "user") =>
        setAuth({ isLoggedIn: true, role });

    const logout = () =>
        setAuth({ isLoggedIn: false, role: "guest" });

    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
