"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, MapPin, CheckCircle } from "lucide-react";
import Image from "next/image";
import { getEvents } from "@/redux/slices/eventsSlice";
import { bookEvent } from "@/redux/slices/bookingsSlice";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";

export default function EventsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { events, loading } = useSelector((state: any) => state.events);
  const { token } = useSelector((state: any) => state.auth);

  const [popupVisible, setPopupVisible] = useState(false);

  const [redirectCountdown, setRedirectCountdown] = useState(3); // 3 sec timer

  useEffect(() => {
    dispatch(getEvents() as any);
  }, [dispatch]);
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
  }, [popupVisible]);

  const handleRSVP = (eventId: string) => {
    if (!token) {
      alert("Please login to RSVP for events!");
      router.push("/login");
      return;
    }

    dispatch(bookEvent({ eventId }))
      .unwrap()
      .then(() => {
        setPopupVisible(true);
        setTimeout(() => {
          setPopupVisible(false);
          router.push("/profile");
        }, 3000);
      })
      .catch(() => alert("Failed to RSVP. Try again."));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-200">
        Loading events...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-16 pt-24">
      {/* Overlay blur effect for glassmorphism look */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-blue-900/40 backdrop-blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text drop-shadow-lg">
          Discover Local Events
        </h1>
        <p className="text-center text-gray-200 mt-4 max-w-2xl mx-auto">
          Join exciting community meetups, sales, and more happening near you.
        </p>

        {/* Success Popup */}
        {popupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="rounded-2xl shadow-xl p-8 max-w-sm w-full text-center animate-fade-in bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3 animate-bounce" />

              <h2 className="text-2xl font-bold text-black-600 mb-2">
                RSVP Successful!
              </h2>

              <p className="text-gray-700 mb-4">
                Your booking is confirmed ✅ <br />
                Redirecting to <b>Upcoming Bookings</b> in your profile in{" "}
                <span className="text-blue-600 font-semibold">
                  {redirectCountdown}
                </span>{" "}
                sec...
              </p>

              <button
                onClick={() => router.push("/profile")}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-lg hover:scale-105 transition shadow-md"
              >
                Go to Profile Now
              </button>
            </div>
          </div>
        )}

        {/* Event Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.length === 0 ? (
            <p className="col-span-3 text-center text-gray-200">
              No events available right now.
            </p>
          ) : (
            events.map((event: any) => (
              <div
                key={event._id}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition transform duration-300"
              >
                {/* Event Image */}
                <div className="relative w-full h-56">
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
                    unoptimized
                  />
                </div>

                {/* Event Content */}
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                  <div className="flex items-center text-sm gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-yellow-300" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm gap-2 mb-5">
                    <MapPin className="w-4 h-4 text-pink-300" />
                    {event.location}
                  </div>
                  <button
                    onClick={() => handleRSVP(event._id)}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-2 rounded-lg hover:scale-105 transition shadow-md"
                  >
                    RSVP Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
