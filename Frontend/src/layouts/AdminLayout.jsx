import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Sidebar, Footer } from "../components/index.js";

function AdminLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default AdminLayout;

