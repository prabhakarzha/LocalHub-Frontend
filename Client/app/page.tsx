"use client";

import Link from "next/link";
import { useState, useEffect, lazy, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { MapPin } from "lucide-react";
// ✅ Import lazy loaders
import {
  loadUsersReducer,
  loadEventsReducer,
  loadServicesReducer,
} from "@/src/redux/store";
import { fetchEventCount } from "@/src/redux/slices/eventsSlice";
import { fetchUserCount } from "@/src/redux/slices/userSlice";
import { fetchServiceCount } from "@/src/redux/slices/servicesSlice";

// Lazy load heavy components
const MotionDiv = lazy(() => import("@/app/components/HomePage/MotionDiv"));
const FeatureCard = lazy(() => import("@/app/components/HomePage/FeatureCard"));
const LoginPopup = lazy(() => import("@/app/components/HomePage/LoginPopup"));
const FloatingDots = lazy(
  () => import("@/app/components/HomePage/FloatingDots"),
);

// Lazy load icons
const Calendar = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Calendar })),
);
const Users = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Users })),
);
const Star = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Star })),
);
const ArrowRight = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.ArrowRight })),
);

// Loading fallbacks
const IconFallback = () => (
  <div className="w-5 h-5 bg-gray-700 rounded animate-pulse" />
);
const CardFallback = () => (
  <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
);

const features = [
  {
    title: "Daily Digest",
    desc: "Find local classes, garage sales, and community meetups in your area.",
    color: "from-blue-400 to-blue-600",
    icon: "Calendar",
    route: "/DailyDigestPage",
  },
  {
    title: "Neighborhood Services",
    desc: "Connect with tutors, repair experts, and other local businesses.",
    color: "from-purple-400 to-purple-600",
    icon: "Users",
    route: "/services",
  },
  {
    title: "Build Community",
    desc: "RSVP, comment, and collaborate with your neighbors easily.",
    color: "from-pink-400 to-pink-600",
    icon: "Star",
    route: "/community",
  },
];

export default function HomePage() {
  const token = useAppSelector((state) => state.auth?.token);
  const [showPopup, setShowPopup] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [reducersLoaded, setReducersLoaded] = useState(false); // ✅ Track reducer loading
  const dispatch = useAppDispatch();

  // ✅ Load all required reducers first
  useEffect(() => {
    const loadAllReducers = async () => {
      try {
        // Load users reducer first (needed for user count)
        await loadUsersReducer();
        // Then load events and services reducers
        await Promise.all([loadEventsReducer(), loadServicesReducer()]);
        setReducersLoaded(true);
      } catch (error) {
        console.error("Failed to load reducers:", error);
      }
    };

    loadAllReducers();
  }, []);

  // ✅ Now safely access state after reducers are loaded
  const totalUsers = useAppSelector((state) => state.users?.totalUsers || 0);
  const loadingUsers = useAppSelector((state) => state.users?.loading || false);
  const eventCount = useAppSelector((state) => state.events?.eventCount || 0);
  const serviceCount = useAppSelector(
    (state) => state.services?.serviceCount || 0,
  );
  const totalCount = eventCount + serviceCount;

  // Optimize API calls with prioritization
  useEffect(() => {
    if (!reducersLoaded) return; // ✅ Wait for reducers to load first

    // Load critical data first
    dispatch(fetchUserCount() as any);

    // Load secondary data after a small delay
    const timer = setTimeout(() => {
      dispatch(fetchEventCount() as any);
      dispatch(fetchServiceCount() as any);
      setInitialLoad(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch, reducersLoaded]); // ✅ Add reducersLoaded as dependency

  const handleExploreClick = (e: React.MouseEvent, route: string) => {
    if (!token) {
      e.preventDefault();
      localStorage.setItem("redirectAfterLogin", route);
      setShowPopup(true);
    }
  };

  // ✅ Show loading state while reducers are loading
  if (!reducersLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects - Lazy load heavy animations */}
      <Suspense fallback={null}>
        <FloatingDots count={20} />
      </Suspense>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section - Only animate visible content */}
        <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <Suspense fallback={<div className="h-96 animate-pulse" />}>
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Local
                </span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Hub
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-4 leading-relaxed">
                Events. Services. Community. All in one place.
              </p>

              <div className="flex items-center justify-center gap-2 text-gray-400 mb-12">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>Connecting communities worldwide</span>
              </div>

              {/* CTA buttons - Critical, don't lazy load */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center w-full px-4">
                <Link
                  href={features[0].route}
                  onClick={(e) => handleExploreClick(e, features[0].route)}
                  prefetch={false}
                  className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-xl sm:rounded-2xl font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 text-sm sm:text-base"
                >
                  <Suspense fallback={<IconFallback />}>
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Suspense>
                  <span>Explore Events</span>
                  <Suspense fallback={<IconFallback />}>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </Suspense>
                </Link>

                <Link
                  prefetch={false}
                  href="/signup"
                  className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl sm:rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 text-sm sm:text-base"
                >
                  <Suspense fallback={<IconFallback />}>
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Suspense>
                  <span>Join Community</span>
                </Link>
              </div>

              {/* Stats - Load progressively */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 sm:mt-16 px-4 sm:px-0">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {loadingUsers ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      `${totalUsers}+`
                    )}
                  </div>
                  <div className="text-gray-400 text-sm sm:text-base">
                    Active Users
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {initialLoad ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      `${totalCount}+`
                    )}
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
              </div>
            </MotionDiv>
          </Suspense>
        </section>

        {/* Features Section - Lazy load when in viewport */}
        <section className="container mx-auto py-20 px-6">
          <Suspense fallback={<div className="h-96 animate-pulse" />}>
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "100px" }}
              className="text-center mb-12 sm:mb-16 px-4"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4 sm:mb-6">
                Why Choose LocalHub?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the perfect blend of community connection and modern
                technology
              </p>
            </MotionDiv>
          </Suspense>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Suspense key={index} fallback={<CardFallback />}>
                <FeatureCard
                  feature={feature}
                  index={index}
                  handleExploreClick={handleExploreClick}
                />
              </Suspense>
            ))}
          </div>
        </section>

        {/* Login Popup - Load only when needed */}
        {showPopup && (
          <Suspense fallback={null}>
            <LoginPopup onClose={() => setShowPopup(false)} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
