"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginUser, resetLoading } from "@/redux/slices/authSlice";
import { RootState, useAppDispatch } from "@/redux/store";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error, user, token } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Debug logs
  useEffect(() => {
    console.log("Auth state changed:", { loading, error, user, token });
  }, [loading, error, user, token]);

  // Reset stuck loading after 5s
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.warn("Force resetting stuck loading after 5s");
        dispatch(resetLoading());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading, dispatch]);

  // Redirect after login
  useEffect(() => {
    if (!loading && token && user?.role) {
      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        console.log("Redirecting after login to:", redirectPath);
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        const defaultRoute =
          user.role === "admin" ? "/admin/dashboard" : "/profile";
        console.log("Redirecting to default route:", defaultRoute);
        router.push(defaultRoute);
      }
    }
  }, [loading, token, user?.role, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }) as any)
      .unwrap()
      .then((res: any) => console.log("Login success:", res))
      .catch((err: any) => console.error("Login failed:", err));
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen 
  w-screen max-w-[100vw] px-4 overflow-x-hidden 
  bg-gradient-to-br from-slate-1200 via-purple-1200 to-slate-1200 pt-24"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000 translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500 -translate-x-1/2"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl shadow-2xl rounded-2xl p-8 border border-white/20">
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
          Welcome Back
        </h2>
        <p className="text-center text-gray-300 mt-2">
          Please sign in to continue
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-200 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-white/30 bg-white/10 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-white/30 bg-white/10 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-500/40" />
          <span className="px-3 text-gray-300">or</span>
          <hr className="flex-grow border-gray-500/40" />
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition">
          <span className="text-lg">🔑</span> Sign in with Google
        </button>

        <p className="mt-6 text-center text-gray-300">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-pink-400 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
