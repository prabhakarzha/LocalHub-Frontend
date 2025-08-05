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

  useEffect(() => {
    dispatch(getEvents() as any);
  }, [dispatch]);

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
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading events...
      </div>
    );
  }

  return (
    <div className="py-16 container mx-auto px-6">
      <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Discover Local Events
      </h1>
      <p className="text-center text-gray-600 mt-4">
        Join community meetups, sales, and more happening near you.
      </p>

      {/* Success Popup */}
      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center animate-fade-in">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              RSVP Successful!
            </h2>
            <p className="text-gray-700 mb-4">
              Your booking is confirmed. Redirecting to <b>Upcoming Bookings</b>{" "}
              in your profile...
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
            >
              Go to Profile Now
            </button>
          </div>
        </div>
      )}

      {/* Event Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500">
            No events available right now.
          </p>
        ) : (
          events.map((event: any, index: number) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <div className="relative w-full h-48">
                <Image
                  src={
                    event.image && event.image.trim() !== ""
                      ? event.image
                      : "/images/default-placeholder.png"
                  }
                  alt={event.title || "Event Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="w-full h-[250px] object-cover object-center rounded-t-xl"
                  unoptimized
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <div className="flex items-center text-gray-500 text-sm gap-2 mb-2">
                  <Calendar className="w-4 h-4" />{" "}
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-500 text-sm gap-2 mb-4">
                  <MapPin className="w-4 h-4" /> {event.location}
                </div>
                <button
                  onClick={() => handleRSVP(event._id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
                >
                  RSVP Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
