"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/src/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";

export default function SignupPage() {
  const dispatch = useAppDispatch(); // Typed dispatch
  const router = useRouter();

  const { loading, error, token } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect after successful signup
  useEffect(() => {
    if (token) {
      router.push("/profile");
    }
  }, [token, router]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup form submitted:", { name, email, password });
    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then((res) => {
        console.log("Signup success:", res);
      })
      .catch((err) => {
        console.error("Signup failed:", err);
      });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md mx-auto mt-8 mb-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Sign Up
        </h2>
        <p className="text-center text-gray-500 mt-2">
          Create a new account and join your local community.
        </p>

        {/* Error message */}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-400 text-gray-800 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>
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
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-400 text-gray-800 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Login (Dummy) */}
        <button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
          <span>🔑</span> Sign up with Google
        </button>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
