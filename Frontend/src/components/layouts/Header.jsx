import React from "react";
import { useSelector } from "react-redux";
import { LogoutBtn } from "../index.js";

function Header() {
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

   
          <h1 className="text-xl font-bold text-gray-900">
            Lecture Scheduler
          </h1>
        
        
        <div className="flex items-center gap-5">

          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              Hello, {user?.firstName} {user?.lastName}
            </p>
          </div>

          <LogoutBtn />

        </div>

      </div>
    </header>
  );
}

export default Header;