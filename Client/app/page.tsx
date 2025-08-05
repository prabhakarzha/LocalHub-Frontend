"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useState } from "react";

const features = [
  {
    title: "Discover Events",
    desc: "Find local classes, garage sales, and community meetups in your area.",
    color: "from-blue-400 to-blue-600",
  },
  {
    title: "Neighborhood Services",
    desc: "Connect with tutors, repair experts, and other local businesses.",
    color: "from-purple-400 to-purple-600",
  },
  {
    title: "Build Community",
    desc: "RSVP, comment, and collaborate with your neighbors easily.",
    color: "from-pink-400 to-pink-600",
  },
];

export default function HomePage() {
  const token = useSelector((state: any) => state.auth.token);
  const [showPopup, setShowPopup] = useState(false);

  const handleExploreClick = (e: React.MouseEvent) => {
    if (!token) {
      e.preventDefault(); // Stop navigation
      setShowPopup(true);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Welcome to LocalHub
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl mb-6">
          Discover events, find services, and connect with your neighborhood
          community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/events"
            onClick={handleExploreClick}
            prefetch={false}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition w-full sm:w-auto text-center"
          >
            Explore Events
          </Link>
          <Link
            prefetch={false}
            href="/signup"
            className="bg-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition w-full sm:w-auto text-center"
          >
            Join Now
          </Link>
        </div>
      </section>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h2 className="text-xl font-bold text-gray-800">Login Required</h2>
            <p className="mt-2 text-gray-600">
              Please login to view and explore events.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => (window.location.href = "/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="container mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {features.map((f, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${f.color} text-white`}
          >
            <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
            <p className="text-sm opacity-90">{f.desc}</p>
          </div>
        ))}
      </section>
    </>
  );
}
