import { Navigate, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { useGetCurrentUserQuery } from "../api/userApi.js";
import { login as setUser } from "../slices/authSlice.js";

function ProtectedRoute() {
    const dispatch = useDispatch();

    const { data, isLoading, isError } = useGetCurrentUserQuery();

    useEffect(() => {
        if (data?.data) {
            dispatch(setUser(data.data));
        }
    }, [data, dispatch]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;