"use client";

import { useEffect } from "react";
import { Mail, Edit, CalendarX } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/redux/slices/authSlice";
import { fetchBookings, cancelBooking } from "@/redux/slices/bookingsSlice";
import {
  fetchServiceBookings,
  cancelServiceBooking,
} from "@/redux/slices/serviceBookingSlice";
import { AppDispatch, RootState } from "@/redux/store";

// ✅ Define a temporary user type if not already declared globally
interface ExtendedUser {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  avatar?: string; // ✅ avatar is optional
}

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    user,
    token,
    loading: authLoading,
    error,
  } = useSelector((state: RootState) => state.auth);

  const { list: bookings, loading: bookingsLoading } = useSelector(
    (state: RootState) => state.bookings
  );

  const { List: serviceBookings, loading: serviceBookingsLoading } =
    useSelector((state: RootState) => state.servicebookings);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      if (!user) dispatch(fetchProfile(token));
      dispatch(fetchBookings());
      dispatch(fetchServiceBookings())
        .unwrap()
        .then((res) => console.log("Fetched Service Bookings:", res))
        .catch((err) => console.error("Service Booking Error:", err));
    }
  }, [token, dispatch]);

  if (authLoading) {
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

  const castUser = user as ExtendedUser;

  const initials = castUser.name
    ? castUser.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="py-16 container mx-auto px-6 min-h-screen text-white">
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px] rounded-xl max-w-xl mx-auto shadow-lg">
        <div className="bg-gray-900 rounded-xl p-8 text-center">
          <div className="flex justify-center">
            {castUser.avatar ? (
              <img
                src={castUser.avatar}
                alt={castUser.name}
                className="w-28 h-28 rounded-full border-4 border-purple-400 shadow"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-4 border-purple-400 shadow flex items-center justify-center text-3xl font-bold text-white">
                {initials}
              </div>
            )}
          </div>
          <h2 className="text-3xl font-bold mt-4">{castUser.name}</h2>
          <p className="text-gray-300 flex items-center justify-center gap-2 mt-1">
            <Mail className="w-5 h-5" /> {castUser.email}
          </p>
          <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:scale-105 transition flex items-center justify-center gap-2 mx-auto">
            <Edit className="w-5 h-5" /> Edit Profile
          </button>
        </div>
      </div>

      {/* Event Bookings */}
      <div className="mt-16">
        <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          Your Upcoming Events
        </h3>

        {bookingsLoading ? (
          <p className="text-center mt-6 text-gray-400">
            Loading your events...
          </p>
        ) : bookings.length === 0 ? (
          <p className="text-center mt-6 text-gray-400">
            No event bookings yet.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
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
                  <CalendarX className="w-5 h-5" /> Cancel event
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Bookings */}
      <div className="mt-16">
        <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
          Your Service Bookings
        </h3>

        {serviceBookingsLoading ? (
          <p className="text-center mt-6 text-gray-400">
            Loading your service bookings...
          </p>
        ) : serviceBookings.length === 0 ? (
          <p className="text-center mt-6 text-gray-400">
            No service bookings yet.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col"
              >
                <h4 className="text-xl font-semibold text-white">
                  {booking.serviceId?.title || "Service"}
                </h4>
                <p className="text-gray-400 text-sm mt-2">
                  Provider: {booking.serviceId?.provider || "N/A"}
                </p>
                <p className="text-gray-400 text-sm">
                  Contact: {booking.serviceId?.contact || "N/A"}
                </p>
                <p className="text-gray-400 text-sm">
                  Price: {booking.serviceId?.price || "Free"}
                </p>
                <button
                  onClick={() => dispatch(cancelServiceBooking(booking._id))}
                  className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white flex items-center justify-center gap-2"
                >
                  <CalendarX className="w-5 h-5" /> Cancel service
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
