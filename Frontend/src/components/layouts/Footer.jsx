import React from "react";

function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 bg-white py-4">
            <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 sm:px-6">
                © {new Date().getFullYear()} Lecture Scheduler. All rights reserved.
            </div>
        </footer>
    );
}
export default Footer;

