"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { loadDigestReducer } from "@/src/redux/store"; // ✅ Import lazy loader
import { fetchDailyDigest } from "@/src/redux/slices/dailyDigestSlice";
import { Calendar, ClipboardList, Star, Bolt } from "lucide-react";

// ✅ Lazy load heavy components (if any - but we'll keep structure for consistency)
// For now, we'll keep components inline since they're small

// ✅ Loading fallbacks
const PageFallback = () => (
  <div className="container mx-auto px-6 py-12 text-white">
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
    </div>
  </div>
);

const InsightsFallback = () => (
  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="bg-gray-800/50 p-6 rounded-xl h-20 animate-pulse"
      ></div>
    ))}
  </div>
);

const ServicesFallback = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-gray-800/50 rounded-xl h-64 animate-pulse"
      ></div>
    ))}
  </div>
);

const EventsFallback = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-gray-800/50 rounded-xl h-48 animate-pulse"
      ></div>
    ))}
  </div>
);

const SuggestionsFallback = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="bg-gray-800/50 p-4 rounded-xl h-16 animate-pulse"
      ></div>
    ))}
  </div>
);

export default function DailyDigestPage() {
  const dispatch = useAppDispatch();

  // ✅ Track reducer loading state
  const [isReducerLoaded, setIsReducerLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Safely access state with fallbacks
  const {
    data: digest,
    loading,
    error,
  } = useAppSelector(
    (state: any) =>
      state.digest || {
        data: null,
        loading: false,
        error: null,
      },
  );

  // ✅ Lazy load digest reducer when component mounts
  useEffect(() => {
    const loadDigest = async () => {
      try {
        await loadDigestReducer();
        setIsReducerLoaded(true);
        // Fetch digest after reducer is loaded
        dispatch(fetchDailyDigest() as any);
      } catch (error) {
        console.error("Failed to load digest reducer:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDigest();
  }, [dispatch]);

  // ✅ Update loading state based on reducer and data loading
  useEffect(() => {
    if (!isReducerLoaded) {
      setIsLoading(true);
    } else {
      setIsLoading(loading);
    }
  }, [isReducerLoaded, loading]);

  // ✅ Show loading state while reducer is loading
  if (!isReducerLoaded || isLoading) {
    return (
      <div className="container mx-auto px-6 py-12 text-white">
        {/* Header skeleton */}
        <div className="h-12 w-96 bg-white/10 rounded animate-pulse mx-auto"></div>

        {/* Insights skeleton */}
        <InsightsFallback />

        {/* Services skeleton */}
        <div className="mt-12">
          <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-4"></div>
          <ServicesFallback />
        </div>

        {/* Events skeleton */}
        <div className="mt-12">
          <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-4"></div>
          <EventsFallback />
        </div>

        {/* Suggestions skeleton */}
        <div className="mt-12">
          <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-4"></div>
          <SuggestionsFallback />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12 text-white">
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-8 text-center">
          <p className="text-red-400 text-lg">Failed to load digest: {error}</p>
          <button
            onClick={() => dispatch(fetchDailyDigest() as any)}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!digest) {
    return (
      <div className="container mx-auto px-6 py-12 text-white">
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-8 text-center">
          <p className="text-yellow-400 text-lg">No digest available.</p>
          <button
            onClick={() => dispatch(fetchDailyDigest() as any)}
            className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 text-white">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Good Morning! Here's Your Daily Digest
      </h1>

      {/* Insights */}
      {digest.insights && digest.insights.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-10 mb-4">✨ Insights</h2>
          <Suspense fallback={<InsightsFallback />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {digest.insights.map((insight: string, i: number) => (
                <div
                  key={i}
                  className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-md flex items-center gap-4 hover:bg-gray-800 transition-all duration-300"
                >
                  <Star className="w-6 h-6 text-yellow-400" />
                  <p className="text-gray-200">{insight}</p>
                </div>
              ))}
            </div>
          </Suspense>
        </>
      )}

      {/* Top Services */}
      {digest.topServices && digest.topServices.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-12 mb-4">
            🛠️ Top Services For You
          </h2>
          <Suspense fallback={<ServicesFallback />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {digest.topServices.map((service: any) => (
                <div
                  key={service._id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:scale-105 transition-all duration-300"
                >
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{service.category}</p>
                    <button className="mt-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm transition">
                      Explore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Suspense>
        </>
      )}

      {/* Top Events */}
      {digest.topEvents && digest.topEvents.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-12 mb-4">
            📅 Top Events For You
          </h2>
          <Suspense fallback={<EventsFallback />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {digest.topEvents.map((event: any) => (
                <div
                  key={event._id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-md p-4 hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300 text-sm">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-white">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{event.category}</p>
                  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm transition">
                    Join
                  </button>
                </div>
              ))}
            </div>
          </Suspense>
        </>
      )}

      {/* AI Suggestions */}
      {digest.suggestions && digest.suggestions.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-12 mb-4">
            ⚡ Suggestions For You
          </h2>
          <Suspense fallback={<SuggestionsFallback />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {digest.suggestions.map((sugg: string, i: number) => (
                <div
                  key={i}
                  className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-md flex items-center gap-3 hover:bg-gray-800 transition-all duration-300"
                >
                  <Bolt className="w-5 h-5 text-purple-400" />
                  <p className="text-gray-200">{sugg}</p>
                </div>
              ))}
            </div>
          </Suspense>
        </>
      )}
    </div>
  );
}
