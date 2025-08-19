"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/src/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error, token } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect after signup
  useEffect(() => {
    if (token) {
      router.push("/profile");
    }
  }, [token, router]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then((res) => console.log("Signup success:", res))
      .catch((err) => console.error("Signup failed:", err));
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center text-white">
          Create Account
        </h2>
        <p className="text-center text-gray-300 mt-2">
          Join us and explore your community
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSignup}>
          <div>
            <label className="block text-gray-200 font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-500/40 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-200 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-500/40 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-200 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-500/40 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-500/40" />
          <span className="px-3 text-gray-300">or</span>
          <hr className="flex-grow border-gray-500/40" />
        </div>

        {/* Google Signup */}
        <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition">
          <span className="text-lg">🔑</span> Sign up with Google
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-pink-400 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
