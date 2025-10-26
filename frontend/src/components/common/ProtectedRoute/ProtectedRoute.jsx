import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/services/auth/AuthContextProvider";

const ProtectedRoute = ({ allowedRoles }) => {
    const { role, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!role) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/notfound" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
