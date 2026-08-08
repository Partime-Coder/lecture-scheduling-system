import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    FiBookOpen,
    FiUsers,
    FiVideo,
    FiChevronLeft,
    FiChevronRight,
    FiMenu,
} from "react-icons/fi";

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        {
            name: "Courses",
            path: "/admin/courses",
            icon: FiBookOpen,
        },
        {
            name: "Instructors",
            path: "/admin/instructors",
            icon: FiUsers,
        },
        {
            name: "Lectures",
            path: "/admin/all-lectures",
            icon: FiVideo,
        },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="fixed left-4 top-4 z-40 rounded-lg bg-white p-2 text-xl text-gray-700 shadow md:hidden"
            >
                <FiMenu />
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-50 h-screen shrink-0 border-r border-gray-200 bg-white transition-all duration-200
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                    ${collapsed ? "w-20" : "w-64"}
                    md:relative md:translate-x-0`}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4">
                    {!collapsed && (
                        <h2 className="font-semibold text-gray-900">
                            Admin
                        </h2>
                    )}

                    <button
                        type="button"
                        onClick={() => {
                            setCollapsed(!collapsed);
                            setMobileOpen(false);
                        }}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                        {collapsed ? (
                            <FiChevronRight />
                        ) : (
                            <FiChevronLeft />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 p-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`
                                }
                            >
                                <Icon className="shrink-0 text-lg" />

                                {!collapsed && (
                                    <span>{item.name}</span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;