"use client";

import { useEffect, useState } from "react";
import { GradientHeading } from "@/ui/eventHelpers";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  price?: string;
  image_url?: string;
  description?: string;
}

export default function DiscoverEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("🔄 Fetching events from API...");
        setError("");
        setLoading(true);

        const apiUrl = `/api/events?t=${Date.now()}`;
        console.log("Fetching from:", apiUrl);

        const res = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        console.log("📡 API Response status:", res.status);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP ${res.status}: ${res.statusText}`
          );
        }

        const data = await res.json();
        console.log("📊 API Response data:", data);

        if (data.success === false) {
          throw new Error(data.error || "API returned unsuccessful response");
        }

        const eventsData = data.events || [];
        setEvents(eventsData);
        console.log(`✅ Successfully loaded ${eventsData.length} events`);
      } catch (err: any) {
        console.error("❌ Client fetch error:", err);
        setError(
          err.message ||
            "Failed to load events. Please check the console for details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-1200 text-white px-4 sm:px-8 md:px-16 lg:px-24 py-16">
      {/* <GradientHeading text="Discover Events" size="4xl" /> */}

      {loading && (
        <div className="mt-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300 text-sm sm:text-base">
            Loading events...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-8 text-center px-3">
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
            <p className="text-yellow-400 font-medium mb-2 text-sm sm:text-base">
              Using Demo Data
            </p>
            <p className="text-yellow-300 text-xs sm:text-sm">
              External API unavailable. Showing sample events for demonstration.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white text-xs sm:text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="mt-8 text-center px-3">
          <p className="text-gray-300 text-base sm:text-lg">
            No events found for Hyderabad.
          </p>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            Try checking back later!
          </p>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="mt-8">
          <p className="text-gray-300 text-center mb-6 text-sm sm:text-base">
            Found {events.length} events in Hyderabad
            {error && " (using demo data)"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {events.map((event) => (
              <div
                key={event.id || Math.random()}
                className="bg-white/10 p-3 sm:p-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform cursor-pointer backdrop-blur-sm"
              >
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title || "Event"}
                    className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500";
                    }}
                  />
                )}
                <h2 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">
                  {event.title || "Untitled Event"}
                </h2>

                <div className="space-y-1 text-xs sm:text-sm text-gray-300">
                  {event.date && <p>📅 {formatDate(event.date)}</p>}
                  {event.location && <p>📍 {event.location}</p>}
                  {event.price && event.price !== "Free" && (
                    <p className="text-green-400 font-medium">
                      💰 {event.price}
                    </p>
                  )}
                  {(!event.price || event.price === "Free") && (
                    <p className="text-green-400 font-medium">🆓 Free</p>
                  )}
                </div>

                {event.description && (
                  <p className="mt-3 text-xs sm:text-sm text-gray-400 line-clamp-3">
                    {event.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
