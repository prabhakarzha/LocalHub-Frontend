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

  const { events, loading } = useSelector((state: any) => state.events);
  const { token, user } = useSelector((state: any) => state.auth); // ✅ get logged in user

  const [popupVisible, setPopupVisible] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

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

  const approvedEvents = events.filter(
    (event: any) => event.status === "approved"
  );

  return (
    <div className="min-h-screen bg-slate-1200 text-white px-4 sm:px-8 md:px-16 lg:px-24 py-16 sm:py-24">
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
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
            <div className="rounded-2xl shadow-xl p-6 sm:p-8 max-w-sm w-full text-center animate-fade-in bg-white/10 backdrop-blur-lg border border-white/20">
              <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-green-400 mx-auto mb-3 animate-bounce" />

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                RSVP Successful!
              </h2>

              <p className="text-gray-300 mb-4 text-sm sm:text-base">
                Your booking is confirmed ✅ <br />
                Redirecting to <b>Upcoming Bookings</b> in your profile in{" "}
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
            <p className="col-span-3 text-center text-gray-300">
              No approved events available right now.
            </p>
          ) : (
            approvedEvents.map((event: any) => (
              <div
                key={event._id}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition transform duration-300"
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
                    unoptimized
                  />
                </div>

                {/* Event Content */}
                <div className="p-4 sm:p-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">
                    {event.title}
                  </h3>

                  {/* ✅ Creator Info */}
                  <div className="flex items-center text-sm gap-2 mb-2 text-gray-400">
                    <User className="w-4 h-4 text-blue-300" />
                    <span>
                      Created by{" "}
                      <b>
                        {event.createdBy?.name || event.createdBy?.username
                          ? event.createdBy?.name || event.createdBy?.username
                          : "Admin"}
                      </b>
                    </span>
                  </div>

                  <div className="flex items-center text-sm gap-2 mb-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-yellow-300" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm gap-2 mb-5 text-gray-300">
                    <MapPin className="w-4 h-4 text-pink-300" />
                    {event.location}
                  </div>
                  <button
                    onClick={() => handleRSVP(event._id)}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-2 rounded-lg hover:scale-105 transition shadow-md text-sm sm:text-base"
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
