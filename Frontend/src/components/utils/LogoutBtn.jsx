import React from "react";
import { Button } from "../index.js";
import { useLogoutMutation } from "../../api/userApi.js";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            dispatch(baseApi.util.resetApiState());
            navigate("/login");
        } catch (error) {
            console.log("Logout failed:", error);
        }
    };

    return (
        <Button onClick={handleLogout}>
            Logout
        </Button>
    );
}

export default LogoutBtn;