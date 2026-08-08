import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function RoleRedirect() {
    const user = useSelector((state) => state.auth.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === "admin") {
        return <Navigate to="/admin/courses" replace />;
    }

    if (user.role === "instructor") {
        return <Navigate to="/instructor/my-lectures" replace />;
    }

    return <Navigate to="/login" replace />;
}

export default RoleRedirect;