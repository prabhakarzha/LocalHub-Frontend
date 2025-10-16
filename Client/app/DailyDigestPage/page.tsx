"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { fetchDailyDigest } from "@/src/redux/slices/dailyDigestSlice";
import { Calendar, ClipboardList, Star, Bolt } from "lucide-react";

export default function DailyDigestPage() {
  const dispatch = useAppDispatch();
  const {
    data: digest,
    loading,
    error,
  } = useAppSelector((state: any) => state.digest);

  useEffect(() => {
    dispatch(fetchDailyDigest());
  }, [dispatch]);

  if (loading)
    return (
      <p className="text-white text-center mt-16">
        Loading your daily digest...
      </p>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-16">
        Failed to load digest: {error}
      </p>
    );

  if (!digest)
    return <p className="text-white text-center mt-16">No digest available.</p>;

  return (
    <div className="container mx-auto px-6 py-12 text-white">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Good Morning! Here's Your Daily Digest
      </h1>

      {/* Insights */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {digest.insights.map((insight: string, i: number) => (
          <div
            key={i}
            className="bg-gray-800 p-6 rounded-xl shadow-md flex items-center gap-4"
          >
            <Star className="w-6 h-6 text-yellow-400" />
            <p>{insight}</p>
          </div>
        ))}
      </div>

      {/* Top Services */}
      <h2 className="text-2xl font-semibold mt-12 mb-4">
        Top Services For You
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {digest.topServices.map((service: any) => (
          <div
            key={service._id}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-md"
          >
            {service.image && (
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg">{service.title}</h3>
              <p className="text-gray-300">{service.category}</p>
              <button className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm">
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Top Events */}
      <h2 className="text-2xl font-semibold mt-12 mb-4">Top Events For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {digest.topEvents.map((event: any) => (
          <div
            key={event._id}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-md p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <p className="text-gray-300">{event.category}</p>
            <button className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm">
              Join
            </button>
          </div>
        ))}
      </div>

      {/* AI Suggestions */}
      <h2 className="text-2xl font-semibold mt-12 mb-4">Suggestions For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {digest.suggestions.map((sugg: string, i: number) => (
          <div
            key={i}
            className="bg-gray-800 p-4 rounded-xl shadow-md flex items-center gap-3"
          >
            <Bolt className="w-5 h-5 text-purple-400" />
            <p>{sugg}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
