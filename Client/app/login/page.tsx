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

  // Debug: log state changes
  useEffect(() => {
    console.log("Auth state changed:", { loading, error, user, token });
  }, [loading, error, user, token]);

  // Reset loading if stuck for more than 5s
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.warn("Force resetting stuck loading after 5s");
        dispatch(resetLoading());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading, dispatch]);

  // Redirect based on user role after login
  useEffect(() => {
    if (token && user?.role) {
      console.log("Redirecting user with role:", user.role);
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/profile");
      }
    }
  }, [token, user?.role, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting login:", { email, password });

    dispatch(loginUser({ email, password }) as any)
      .unwrap()
      .then((res: any) => {
        console.log("Login success (from thunk):", res);
      })
      .catch((err: any) => {
        console.error("Login failed (from thunk):", err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
        <p className="text-center text-gray-500 mt-2">
          Welcome back! Please sign in to your account.
        </p>

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-400 text-gray-800 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-400 text-gray-800 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
          <span>🔑</span> Sign in with Google
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
