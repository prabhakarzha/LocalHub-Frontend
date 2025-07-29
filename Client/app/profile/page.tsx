"use client";

import { useEffect } from "react";
import { Mail, Edit, CalendarX } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/redux/slices/authSlice";
import { fetchBookings, cancelBooking } from "@/redux/slices/bookingsSlice";
import { AppDispatch } from "@/redux/store";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { user, token, loading, error } = useSelector(
    (state: any) => state.auth
  );
  const { list: bookings, loading: bookingsLoading } = useSelector(
    (state: any) => state.bookings
  );

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      if (!user && token) {
        dispatch(fetchProfile(token)); // <-- FIX: token pass kiya
      }
      dispatch(fetchBookings());
    }
  }, [token, user, dispatch, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-400">
        {error}
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="py-16 container mx-auto px-6 min-h-screen text-white">
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px] rounded-xl max-w-xl mx-auto shadow-lg">
        <div className="bg-gray-900 rounded-xl p-8 text-center">
          <div className="flex justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 rounded-full border-4 border-purple-400 shadow"
              />
            ) : (
              <div className="w-28 h-28 rounded-full border-4 border-purple-400 shadow flex items-center justify-center text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                {initials}
              </div>
            )}
          </div>
          <h2 className="text-3xl font-bold mt-4">{user.name}</h2>
          <p className="text-gray-300 flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" /> {user.email}
          </p>
          <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:scale-105 transition flex items-center justify-center gap-2 mx-auto">
            <Edit className="w-5 h-5" /> Edit Profile
          </button>
        </div>
      </div>

      {/* Upcoming Bookings Section */}
      <div className="mt-16">
        <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          Your Upcoming Bookings
        </h3>

        {bookingsLoading ? (
          <p className="text-center mt-6 text-gray-400">
            Loading your bookings...
          </p>
        ) : bookings.length === 0 ? (
          <p className="text-center mt-6 text-gray-400">No bookings yet.</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking: any) => (
              <div
                key={booking._id}
                className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col"
              >
                <h4 className="text-xl font-semibold text-white">
                  {booking.eventId?.title || "Event"}
                </h4>
                <p className="text-gray-400 text-sm mt-2">
                  Date: {booking.eventId?.date || "TBA"}
                </p>
                <p className="text-gray-400 text-sm">
                  Location: {booking.eventId?.location || "TBA"}
                </p>
                <button
                  onClick={() => dispatch(cancelBooking(booking._id))}
                  className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white flex items-center justify-center gap-2"
                >
                  <CalendarX className="w-5 h-5" /> Cancel Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
