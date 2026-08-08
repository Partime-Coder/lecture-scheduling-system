import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Footer } from "../components/index.js";

function InstructorLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />

            <main className="flex-1 p-4 sm:p-6">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default InstructorLayout;