"use client";

import { useEffect } from "react";
import {
  Mail,
  Edit,
  CalendarX,
  Calendar,
  MapPin,
  User,
  Phone,
  DollarSign,
  Star,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/redux/slices/authSlice";
import { getBookings, cancelBooking } from "@/redux/slices/bookingsSlice";
import {
  fetchServiceBookings,
  cancelServiceBooking,
} from "@/redux/slices/serviceBookingSlice";
import { AppDispatch, RootState } from "@/redux/store";

interface ExtendedUser {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  avatar?: string;
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
      dispatch(getBookings());
      dispatch(fetchServiceBookings())
        .unwrap()
        .then((res) => console.log("Fetched Service Bookings:", res))
        .catch((err) => console.error("Service Booking Error:", err));
    }
  }, [token, dispatch]);

  if (authLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-2 left-2 w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin opacity-60"></div>
        </div>
        <p className="text-white mt-6 text-lg font-medium">
          Loading your profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarX className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-300 text-lg">{error}</p>
        </div>
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
    <div className="min-h-screen bg-slate-1200 text-white p-6 sm:p-12 md:p-24">
      <div className="relative z-10 py-6 sm:py-12 container mx-auto px-4 sm:px-6">
        {/* Profile Card */}
        <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className="relative">
                {castUser.avatar ? (
                  <img
                    src={castUser.avatar}
                    alt={castUser.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-purple-400/50 shadow-2xl object-cover"
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 border-4 border-purple-400/50 shadow-2xl flex items-center justify-center text-3xl sm:text-4xl font-bold text-white">
                    {initials}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
                  {castUser.name}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 text-gray-300 mb-4 sm:mb-6">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Mail className="w-4 sm:w-5 h-4 sm:h-5" />
                  </div>
                  <span className="text-sm sm:text-lg">{castUser.email}</span>
                </div>
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-2xl shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 flex items-center gap-2 sm:gap-3 mx-auto md:mx-0 group text-sm sm:text-base">
                  <Edit className="w-4 sm:w-5 h-4 sm:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="font-semibold">Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {bookings.length}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">Event Bookings</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Star className="w-5 sm:w-6 h-5 sm:h-6 text-green-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {serviceBookings.length}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Service Bookings
            </p>
          </div>
        </div>

        {/* Event Bookings */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 sm:mb-4">
              Upcoming Events
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
          </div>

          {bookingsLoading ? (
            <div className="flex justify-center">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-300 text-sm sm:text-lg">
                    Loading your events...
                  </span>
                </div>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-500/20 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Calendar className="w-6 sm:w-8 h-6 sm:h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm sm:text-lg">
                  No event bookings yet.
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                  Start exploring and book your first event!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {bookings.map((booking, index) => (
                <div
                  key={booking._id}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                      <Calendar className="w-4 sm:w-6 h-4 sm:h-6 text-blue-400" />
                    </div>
                    <span className="px-2 py-1 text-xs sm:text-sm bg-blue-500/20 text-blue-300 rounded-full font-medium">
                      Event
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 group-hover:text-purple-300 transition-colors">
                    {booking.eventId?.title || "Event"}
                  </h4>

                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-300">
                      <Calendar className="w-3 sm:w-4 h-3 sm:h-4 text-purple-400" />
                      <span className="text-xs sm:text-sm">
                        {booking.eventId?.date || "TBA"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-300">
                      <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-pink-400" />
                      <span className="text-xs sm:text-sm">
                        {booking.eventId?.location || "TBA"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => dispatch(cancelBooking(booking._id))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl text-white font-medium flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 text-xs sm:text-sm"
                  >
                    <CalendarX className="w-4 sm:w-5 h-4 sm:h-5" />
                    Cancel Event
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Service Bookings */}
        <div>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-4">
              Service Bookings
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto"></div>
          </div>

          {serviceBookingsLoading ? (
            <div className="flex justify-center">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-300 text-sm sm:text-lg">
                    Loading your service bookings...
                  </span>
                </div>
              </div>
            </div>
          ) : serviceBookings.length === 0 ? (
            <div className="text-center">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-500/20 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-4">
                  <Star className="w-6 sm:w-8 h-6 sm:h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm sm:text-lg">
                  No service bookings yet.
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                  Discover amazing services and book your first one!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {serviceBookings.map((booking, index) => (
                <div
                  key={booking._id}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 hover:border-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl">
                      <Star className="w-4 sm:w-6 h-4 sm:h-6 text-green-400" />
                    </div>
                    <span className="px-2 py-1 text-xs sm:text-sm bg-green-500/20 text-green-300 rounded-full font-medium">
                      Service
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 group-hover:text-green-300 transition-colors">
                    {booking.serviceId?.title || "Service"}
                  </h4>

                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-300">
                      <User className="w-3 sm:w-4 h-3 sm:h-4 text-green-400" />
                      <span className="text-xs sm:text-sm">
                        {booking.serviceId?.provider || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-300">
                      <Phone className="w-3 sm:w-4 h-3 sm:h-4 text-blue-400" />
                      <span className="text-xs sm:text-sm">
                        {booking.serviceId?.contact || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-300">
                      <DollarSign className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400" />
                      <span className="text-xs sm:text-sm font-medium">
                        {booking.serviceId?.price || "TBA"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => dispatch(cancelServiceBooking(booking._id))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl text-white font-medium flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 text-xs sm:text-sm"
                  >
                    <CalendarX className="w-4 sm:w-5 h-4 sm:h-5" />
                    Cancel Service
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
