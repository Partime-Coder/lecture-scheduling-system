import React from "react";
import { LoginFrom } from "../../components/index.js";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue to your account
            </p>
          </div>
          <LoginFrom />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Don't have an account?{" "}
            <span className="font-medium text-blue-600 cursor-pointer hover:underline">
              Contact Administrator
            </span>
          </p>

          <p className="mt-4 text-xs text-gray-400">
            © 2026 Online Lecture Scheduling Module
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;