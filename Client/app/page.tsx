"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  Calendar,
  Users,
  Star,
  ArrowRight,
  X,
  LogIn,
  MapPin,
} from "lucide-react";
import { fetchEventCount } from "@/src/redux/slices/eventsSlice";
import { fetchUserCount } from "@/src/redux/slices/userSlice";
import { fetchServiceCount } from "@/src/redux/slices/servicesSlice";

const features = [
  {
    title: "Discover Events",
    desc: "Find local classes, garage sales, and community meetups in your area.",
    color: "from-blue-400 to-blue-600",
    icon: Calendar,
    route: "/discovereventpage", // updated to match your Discover Events page
  },
  {
    title: "Neighborhood Services",
    desc: "Connect with tutors, repair experts, and other local businesses.",
    color: "from-purple-400 to-purple-600",
    icon: Users,
    route: "/services",
  },
  {
    title: "Build Community",
    desc: "RSVP, comment, and collaborate with your neighbors easily.",
    color: "from-pink-400 to-pink-600",
    icon: Star,
    route: "/community",
  },
];

export default function HomePage() {
  const token = useAppSelector((state) => state.auth.token);
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useAppDispatch();

  const totalUsers = useAppSelector((state) => state.users.totalUsers || 0);
  const loadingUsers = useAppSelector((state) => state.users.loading);
  const eventCount = useAppSelector((state) => state.events.eventCount || 0);
  const serviceCount = useAppSelector(
    (state) => state.services.serviceCount || 0
  );
  const totalCount = eventCount + serviceCount;

  useEffect(() => {
    dispatch(fetchUserCount());
    dispatch(fetchEventCount());
    dispatch(fetchServiceCount());
  }, [dispatch]);

  const handleExploreClick = (e: React.MouseEvent, route: string) => {
    if (!token) {
      e.preventDefault();
      localStorage.setItem("redirectAfterLogin", route);
      setShowPopup(true);
    }
    // If token exists, navigation works normally
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-10 right-4 sm:right-10 w-24 sm:w-32 h-24 sm:h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-4 sm:left-10 w-32 sm:w-40 h-32 sm:h-40 bg-green-500/10 rounded-2xl blur-2xl"></div>

        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Local
              </span>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Hub
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-4 leading-relaxed"
            >
              Discover amazing events, find trusted services, and connect with
              your neighborhood community like never before.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex items-center justify-center gap-2 text-gray-400 mb-12"
            >
              <MapPin className="w-5 h-5 text-purple-400" />
              <span>Connecting communities worldwide</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center w-full px-4"
            >
              <Link
                href={features[0].route}
                onClick={(e) => handleExploreClick(e, features[0].route)}
                prefetch={false}
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 text-sm sm:text-base"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                prefetch={false}
                href="/signup"
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl sm:rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 text-sm sm:text-base"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Join Community</span>
              </Link>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 sm:mt-16 px-4 sm:px-0"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {loadingUsers ? "..." : `${totalUsers}+`}
                </div>
                <div className="text-gray-400 text-sm sm:text-base">
                  Active Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {totalCount}+
                </div>
                <div className="text-gray-400 text-sm sm:text-base">
                  Events & Services
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
                  50+
                </div>
                <div className="text-gray-400 text-sm sm:text-base">
                  Communities
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto py-20 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 px-4"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4 sm:mb-6">
              Why Choose LocalHub?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the perfect blend of community connection and modern
              technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={feature.route}
                    onClick={(e) => handleExploreClick(e, feature.route)}
                    className="group relative block"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl sm:rounded-3xl blur-xl"></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center hover:bg-white/10 hover:border-purple-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                      <div className="relative mb-4 sm:mb-6">
                        <div
                          className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-purple-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                        {feature.desc}
                      </p>
                      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500"></div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Login Popup */}
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center max-w-md w-full"
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>

              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <LogIn className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                Login Required
              </h2>
              <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2">
                Join our amazing community to explore events and connect with
                your neighbors!
              </p>

              <div className="flex flex-col gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                  className="w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  Login Now
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="w-full px-4 sm:px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
