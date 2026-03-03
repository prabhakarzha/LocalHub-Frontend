"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, MapPin, CheckCircle, User } from "lucide-react";
import Image from "next/image";
import { getEvents } from "@/redux/slices/eventsSlice";
import { bookEvent } from "@/redux/slices/bookingsSlice";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";

export default function EventsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // ✅ FIX 1: Safe state access with fallbacks
  const eventsState = useSelector((state: any) => state.events);
  const authState = useSelector((state: any) => state.auth);

  const events = eventsState?.events || [];
  const loading = eventsState?.loading || false;
  const token = authState?.token || null;
  const user = authState?.user || null;

  const [popupVisible, setPopupVisible] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  // ✅ Pagination State
  const [page, setPage] = useState(1);
  const limit = 6;

  // ✅ FIX 2: Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Fetch Events with Pagination
  useEffect(() => {
    if (mounted) {
      dispatch(getEvents({ page, limit }) as any);
    }
  }, [dispatch, page, mounted]);

  useEffect(() => {
    if (popupVisible) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/profile");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [popupVisible, router]);

  const handleRSVP = (eventId: string) => {
    if (!token) {
      alert("Please login to RSVP for events!");
      router.push("/login");
      return;
    }

    // ✅ FIX 3: Properly handle the async thunk
    dispatch(bookEvent({ eventId }) as any)
      .unwrap()
      .then(() => {
        setPopupVisible(true);
        setRedirectCountdown(3);
      })
      .catch((err: any) => {
        console.error("RSVP Error:", err);
        alert(err?.message || "Failed to RSVP. Try again.");
      });
  };

  // ✅ FIX 4: Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-200">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  // ✅ FIX 5: Safe filtering with optional chaining
  const approvedEvents =
    events?.filter((event: any) => event?.status === "approved") || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-4 sm:px-8 md:px-16 lg:px-24 py-16 sm:py-24">
      <div className="container mx-auto relative z-10">
        {/* Heading */}
        <div className="mt-8 sm:mt-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text drop-shadow-lg">
            Explore Local Events
          </h1>
          <p className="text-center text-gray-300 mt-5 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base">
            Join exciting community meetups, sales, and more happening near you.
          </p>
        </div>

        {/* Success Popup */}
        {popupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">
            <div className="rounded-2xl shadow-xl p-6 sm:p-8 max-w-sm w-full text-center animate-fade-in bg-gray-900/90 border border-white/20">
              <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-green-400 mx-auto mb-3 animate-bounce" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                RSVP Successful!
              </h2>
              <p className="text-gray-300 mb-4 text-sm sm:text-base">
                Your booking is confirmed ✅ <br />
                Redirecting to{" "}
                <b className="text-purple-400">Upcoming Bookings</b> in{" "}
                <span className="text-blue-400 font-semibold">
                  {redirectCountdown}
                </span>{" "}
                sec...
              </p>
              <button
                onClick={() => router.push("/profile")}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 sm:px-5 py-2 rounded-lg hover:scale-105 transition shadow-md"
              >
                Go to Profile Now
              </button>
            </div>
          </div>
        )}

        {/* Event Cards */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {approvedEvents.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-300 text-lg">
                No approved events available right now.
              </p>
            </div>
          ) : (
            approvedEvents.map((event: any) => (
              <div
                key={event._id}
                className="flex flex-col backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition transform duration-300"
              >
                {/* Event Image */}
                <div className="relative w-full h-48 sm:h-56">
                  <Image
                    src={
                      event.image && event.image.trim() !== ""
                        ? event.image
                        : "/images/default-placeholder.png"
                    }
                    alt={event.title || "Event Image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center rounded-t-2xl"
                  />
                </div>

                {/* Event Content */}
                <div className="flex flex-col flex-1 p-4 sm:p-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 line-clamp-1">
                    {event.title}
                  </h3>

                  {/* Creator Info */}
                  <div className="flex items-center text-sm gap-2 mb-2 text-gray-400">
                    <User className="w-4 h-4 text-blue-300 shrink-0" />
                    <span className="truncate">
                      By{" "}
                      <span className="text-white font-medium">
                        {event.createdBy?.name ||
                          event.createdBy?.username ||
                          "Admin"}
                      </span>
                    </span>
                  </div>

                  <div className="space-y-2 mt-2">
                    <div className="flex items-center text-sm gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-yellow-300 shrink-0" />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center text-sm gap-2 text-gray-300">
                      <MapPin className="w-4 h-4 text-pink-300 shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRSVP(event._id)}
                    className="mt-auto w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-2.5 rounded-lg hover:scale-105 transition shadow-md text-sm sm:text-base font-semibold"
                  >
                    RSVP Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {approvedEvents.length > 0 && (
          <div className="flex justify-center mt-12 gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            <span className="text-gray-300 self-center px-4">
              Page <span className="text-white font-semibold">{page}</span>
            </span>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!events || events.length < limit}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
