"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";

// ✅ Import lazy loaders
import {
  loadEventsReducer,
  loadServicesReducer,
  loadBookingsReducer,
  loadServiceBookingsReducer,
} from "@/src/redux/store";

import Sidebar, { NavKey } from "@/app/components/shared/Sidebar";
import Pagination from "@/app/components/dashboard/Pagination";
import ItemCard from "@/app/components/dashboard/ItemCard";
import StatsCard from "@/app/components/dashboard/StatsCard";
import AddEventModal from "@/app/components/shared/AddEventModal";
import AddServiceModal from "@/app/components/shared/AddServiceModal";

import { getUserEvents } from "@/src/redux/slices/eventsSlice";
import { getUserServices } from "@/src/redux/slices/servicesSlice";
import { fetchProfile, logout } from "@/redux/slices/authSlice";
import {
  getBookings,
  cancelBooking,
  bookEvent,
} from "@/redux/slices/bookingsSlice";
import {
  fetchServiceBookings,
  bookService,
  cancelServiceBooking,
} from "@/redux/slices/serviceBookingSlice";

import {
  Calendar,
  ClipboardList,
  Users,
  DollarSign,
  Bell,
  CheckCircle,
  Star,
  PlusCircle,
  MapPin,
  User,
  Phone,
  CalendarX,
  RefreshCw,
} from "lucide-react";

// ... (keep all existing component definitions: SimpleModal, RsvpPopup, BookingCard)

function SimpleModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-80 max-w-full text-center shadow-2xl">
        <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-7 h-7 text-green-400" />
        </div>
        <h2 className="text-lg font-bold mb-2 text-white">{title}</h2>
        <div className="text-gray-400 text-sm">{children}</div>
        <button
          onClick={onClose}
          className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold px-6 py-2.5 rounded-xl transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}

function RsvpPopup({
  visible,
  countdown,
  onGoNow,
}: {
  visible: boolean;
  countdown: number;
  onGoNow: () => void;
}) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4 backdrop-blur-sm">
      <div className="rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center bg-white/10 backdrop-blur-lg border border-white/20">
        <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-3 animate-bounce" />
        <h2 className="text-2xl font-bold text-white mb-2">RSVP Successful!</h2>
        <p className="text-gray-300 mb-5 text-sm">
          Your booking is confirmed ✅<br />
          Redirecting to <b>Bookings</b> in{" "}
          <span className="text-blue-400 font-semibold">{countdown}</span>{" "}
          sec...
        </p>
        <button
          onClick={onGoNow}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-xl hover:scale-105 transition shadow-md text-sm"
        >
          Go to Bookings Now
        </button>
      </div>
    </div>
  );
}

function BookingCard({
  children,
  accentClass,
}: {
  children: React.ReactNode;
  accentClass: string;
}) {
  return (
    <div
      className={`group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/8 ${accentClass} transition-all duration-300 hover:shadow-xl flex flex-col gap-4`}
    >
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const reduxDispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [activeNav, setActiveNav] = useState<NavKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [rsvpVisible, setRsvpVisible] = useState(false);
  const [rsvpCountdown, setRsvpCountdown] = useState(3);
  const [eventsPage, setEventsPage] = useState(1);
  const eventsLimit = 6;
  const [servicesPage, setServicesPage] = useState(1);
  const servicesLimit = 6;

  // ✅ Add mounted state for hydration fix
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Track reducer loading states
  const [reducersLoaded, setReducersLoaded] = useState({
    events: false,
    services: false,
    bookings: false,
    serviceBookings: false,
  });

  const { token, user } = useAppSelector((state: any) => state.auth);

  // ✅ Lazy load reducers based on active navigation
  useEffect(() => {
    const loadRequiredReducers = async () => {
      try {
        // Always load events and services for overview
        if (!reducersLoaded.events) {
          await loadEventsReducer();
          setReducersLoaded((prev) => ({ ...prev, events: true }));
        }
        if (!reducersLoaded.services) {
          await loadServicesReducer();
          setReducersLoaded((prev) => ({ ...prev, services: true }));
        }

        // Load bookings reducers when needed
        if (activeNav === "bookings" && !reducersLoaded.bookings) {
          await loadBookingsReducer();
          setReducersLoaded((prev) => ({ ...prev, bookings: true }));
        }
        if (activeNav === "bookings" && !reducersLoaded.serviceBookings) {
          await loadServiceBookingsReducer();
          setReducersLoaded((prev) => ({ ...prev, serviceBookings: true }));
        }
      } catch (error) {
        console.error("Failed to load reducers:", error);
      }
    };

    loadRequiredReducers();
  }, [activeNav, reducersLoaded]);

  // ✅ Safely access state with optional chaining
  const { events: userEvents, loading: eventsLoading } = useAppSelector(
    (state: any) => state.events || { events: [], loading: false },
  );
  const { services: userServices, loading: servicesLoading } = useAppSelector(
    (state: any) => state.services || { services: [], loading: false },
  );
  const { loading: authLoading } = useSelector(
    (state: RootState) => state.auth,
  );
  const { list: bookings, loading: bookingsLoading } = useSelector(
    (state: RootState) => state.bookings || { list: [], loading: false },
  );
  const { List: serviceBookings, loading: serviceBookingsLoading } =
    useSelector(
      (state: RootState) =>
        state.servicebookings || { List: [], loading: false },
    );

  // ─── DEBUG: paste this page, open browser console, look for "=== MY EVENTS DEBUG ===" ───
  useEffect(() => {
    if (!userEvents) return;
    console.log("=== MY EVENTS DEBUG ===");
    console.log("Total events from API:", userEvents.length);
    console.log("Unique status values:", [
      ...new Set(userEvents.map((e: any) => e.status)),
    ]);
    console.log(
      "Approved count:",
      userEvents.filter((e: any) => e.status === "approved").length,
    );
    if (userEvents.length > 0) {
      console.log(
        "Sample event (check 'status' field):",
        JSON.stringify(userEvents[0], null, 2),
      );
    }
  }, [userEvents]);

  // const API_BASE_URL =
  //   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const userId = user?._id as string | undefined;

  // Initial fetch - only when reducers are loaded
  // Initial fetch - only when reducers are loaded
  useEffect(() => {
    if (!token || !userId) return;

    if (reducersLoaded.events) dispatch(getUserEvents() as any);

    // ✅ Fix: Add pagination params
    if (reducersLoaded.services) {
      dispatch(
        getUserServices({
          page: 1,
          limit: 100,
        }) as any,
      );
    }

    if (reducersLoaded.bookings) reduxDispatch(getBookings() as any);

    if (reducersLoaded.serviceBookings) {
      reduxDispatch(fetchServiceBookings() as any)
        .unwrap()
        .catch((err: any) => console.error("Service Booking Error:", err));
    }
  }, [userId, token, reducersLoaded, dispatch, reduxDispatch]);

  // Fetch profile if missing
  useEffect(() => {
    if (token && !user) reduxDispatch(fetchProfile(token) as any);
  }, [token, user, reduxDispatch]);

  // Re-fetch when tab gets focus
  // Re-fetch when tab gets focus
  useEffect(() => {
    const onFocus = () => {
      if (token && userId) {
        if (reducersLoaded.events) dispatch(getUserEvents() as any);
        if (reducersLoaded.services) {
          // ✅ Pass object with pagination params
          dispatch(
            getUserServices({
              page: 1,
              limit: 100,
            }) as any,
          );
        }
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [userId, token, reducersLoaded, dispatch]);

  // RSVP countdown
  useEffect(() => {
    if (rsvpVisible) {
      const timer = setInterval(() => {
        setRsvpCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setActiveNav("bookings");
            setRsvpVisible(false);
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [rsvpVisible]);

  const castUser = user as any;

  // ✅ FIX: Calculate initials with mounted check to prevent hydration mismatch
  const initials = !mounted
    ? "" // Empty string during server render
    : castUser?.name
      ? castUser.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
      : "?";

  // Safe array guards
  const safeUserEvents = Array.isArray(userEvents) ? userEvents : [];
  const safeUserServices = Array.isArray(userServices) ? userServices : [];

  const approvedEvents = safeUserEvents.filter(
    (e: any) => e.status === "approved",
  );
  const paginatedEvents = approvedEvents.slice(
    (eventsPage - 1) * eventsLimit,
    eventsPage * eventsLimit,
  );
  const hasNextPage = eventsPage * eventsLimit < approvedEvents.length;

  const approvedServices = safeUserServices.filter(
    (s: any) => s.status === "approved",
  );
  const paginatedServices = approvedServices.slice(
    (servicesPage - 1) * servicesLimit,
    servicesPage * servicesLimit,
  );
  const hasNextServicePage =
    servicesPage * servicesLimit < approvedServices.length;

  const handleLogout = () => {
    reduxDispatch(logout() as any);
    router.push("/");
  };
  const handleGoHome = () => router.push("/");

  const handleRSVP = (eventId: string) => {
    if (!token) {
      router.push("/login");
      return;
    }
    reduxDispatch(bookEvent({ eventId }) as any)
      .unwrap()
      .then(() => {
        setRsvpVisible(true);
        setRsvpCountdown(3);
      })
      .catch(() => alert("Failed to RSVP. Try again."));
  };

  const handleServiceBooking = (serviceId: string) => {
    if (!token) {
      router.push("/login");
      return;
    }
    reduxDispatch(
      bookService({
        serviceId,
        message: "Interested in this service",
        contactInfo: castUser?.email || "N/A",
      }) as any,
    )
      .unwrap()
      .then(() => {
        setRsvpVisible(true);
        setRsvpCountdown(3);
      })
      .catch((err: any) => alert(err || "Failed to book service. Try again."));
  };

  const sectionTitle: Record<NavKey, string> = {
    // User keys
    overview: "Dashboard Overview",
    profile: "My Profile",
    events: "My Events",
    services: "My Services",
    bookings: "Bookings",
    earnings: "Earnings",

    // Admin keys (add defaults for user view)
    users: "User Management",
    analytics: "Analytics",
    settings: "Settings", // This is common
  };

  // ... rest of your render functions remain the same

  // ... (keep all render functions: renderOverview, renderProfile, renderEvents, renderServices, renderBookings)
  // They remain exactly the same as in your original code

  const renderOverview = () => (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg">
            {initials}
          </div>
          <div>
            <p className="text-gray-400 text-sm">Welcome back 👋</p>
            {/* ✅ FIX: Add mounted check */}
            <h2 className="text-3xl font-bold text-white">
              {!mounted ? "" : castUser?.name || ""}
            </h2>
            {/* ✅ FIX: Add mounted check */}
            <p className="text-gray-400 text-sm mt-1">
              {!mounted ? "" : castUser?.email || ""}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="My Events"
          value={approvedEvents.length}
          icon={<Calendar className="w-6 h-6" />}
          gradient="from-blue-400 to-blue-600"
        />
        <StatsCard
          title="My Services"
          value={approvedServices.length}
          icon={<ClipboardList className="w-6 h-6" />}
          gradient="from-green-400 to-green-600"
        />
        <StatsCard
          title="Event Bookings"
          value={bookings?.length || 0}
          icon={<Users className="w-6 h-6" />}
          gradient="from-purple-400 to-purple-600"
        />
        <StatsCard
          title="Earnings"
          value="$1,250"
          icon={<DollarSign className="w-6 h-6" />}
          gradient="from-pink-400 to-pink-600"
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            onClick={() => setShowEventModal(true)}
            className="flex flex-col items-center justify-center gap-6 h-33 rounded-2xl bg-[#0f172a] border border-white/5 hover:bg-[#131c31] transition-all duration-300"
          >
            <div className="w-16 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">
              +
            </div>
            <span className="text-base font-semibold text-gray-300">
              Add Event
            </span>
          </button>
          <button
            onClick={() => setShowServiceModal(true)}
            className="flex flex-col items-center justify-center gap-6 h-33 rounded-2xl bg-[#0f172a] border border-white/5 hover:bg-[#131c31] transition-all duration-300"
          >
            <div className="w-16 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg">
              +
            </div>
            <span className="text-base font-semibold text-gray-300">
              Add Service
            </span>
          </button>
          <button
            onClick={() => setActiveNav("bookings")}
            className="flex flex-col items-center justify-center gap-6 h-33 rounded-2xl bg-[#0f172a] border border-white/5 hover:bg-[#131c31] transition-all duration-300"
          >
            <div className="w-16 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xl shadow-lg">
              👥
            </div>
            <span className="text-base font-semibold text-gray-300">
              View Bookings
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (authLoading)
      return (
        <div className="flex items-center justify-center py-24 text-gray-400">
          Loading profile...
        </div>
      );
    if (!user)
      return (
        <div className="flex items-center justify-center py-24 text-gray-400">
          No profile data.
        </div>
      );
    return (
      <div className="space-y-8 max-w-3xl">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold">
            {initials}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{castUser?.name}</h2>
            <p className="text-gray-400 text-sm mt-1">{castUser?.email}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderEvents = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">My Events</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            Your admin-approved events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(getUserEvents() as any)}
            className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowEventModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-sm font-semibold hover:opacity-90 hover:scale-105 transition"
          >
            <PlusCircle className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>
      {eventsLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading events...</p>
        </div>
      ) : approvedEvents.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center max-w-sm mx-auto">
          <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No approved events yet.</p>
          <p className="text-gray-500 text-sm mt-1">
            Submit an event and wait for admin approval!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedEvents.map((event: any) => (
              <div
                key={event._id}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-purple-500/30 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative w-full h-44 bg-gray-800">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="w-10 h-10 text-gray-600" />
                    </div>
                  )}
                  <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm bg-green-500/20 text-green-300 border-green-500/40">
                    ✓ Approved
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <div className="space-y-1.5 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRSVP(event._id)}
                    className="w-full mt-1 py-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-200"
                  >
                    RSVP Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            page={eventsPage}
            hasNext={hasNextPage}
            onPrev={() => setEventsPage((p) => Math.max(p - 1, 1))}
            onNext={() => setEventsPage((p) => p + 1)}
          />
        </>
      )}
    </div>
  );

  const renderServices = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">My Services</h2>
          <p className="text-gray-400 text-sm mt-0.5">Your approved services</p>
        </div>
        <button
          onClick={() => setShowServiceModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-sm font-semibold hover:opacity-90 hover:scale-105 transition"
        >
          <PlusCircle className="w-4 h-4" /> Add Service
        </button>
      </div>
      {servicesLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading services...</p>
        </div>
      ) : approvedServices.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center max-w-sm mx-auto">
          <ClipboardList className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No approved services yet.</p>
          <p className="text-gray-500 text-sm mt-1">
            Submit a service and wait for admin approval!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedServices.map((service: any) => (
              <ItemCard
                key={service._id}
                image={service.image}
                title={service.title}
                createdBy={
                  service.createdBy?.name || service.createdBy?.username
                }
                location={service.location}
                actionLabel="Book Service"
                onAction={() => handleServiceBooking(service._id)}
              />
            ))}
          </div>
          <Pagination
            page={servicesPage}
            hasNext={hasNextServicePage}
            onPrev={() => setServicesPage((p) => Math.max(p - 1, 1))}
            onNext={() => setServicesPage((p) => p + 1)}
          />
        </>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-white/5" />
          <h2 className="text-base font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent whitespace-nowrap">
            Upcoming Events
          </h2>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        {bookingsLoading ? (
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            Loading event bookings...
          </div>
        ) : bookings?.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center max-w-sm">
            <Calendar className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No event bookings yet.</p>
            <p className="text-gray-500 text-xs mt-1">
              Start exploring and book your first event!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {bookings?.map((booking: any) => (
              <BookingCard
                key={booking._id}
                accentClass="hover:border-purple-500/30 hover:shadow-purple-500/10"
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full font-medium">
                    Event
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">
                  {booking.eventId?.title || "Event"}
                </h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    {booking.eventId?.date || "TBA"}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-pink-400" />
                    {booking.eventId?.location || "TBA"}
                  </div>
                </div>
                <button
                  onClick={() => dispatch(cancelBooking(booking._id) as any)}
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <CalendarX className="w-4 h-4" /> Cancel Event
                </button>
              </BookingCard>
            ))}
          </div>
        )}
      </section>
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-white/5" />
          <h2 className="text-base font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
            Service Bookings
          </h2>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        {serviceBookingsLoading ? (
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            Loading service bookings...
          </div>
        ) : serviceBookings?.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center max-w-sm">
            <Star className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No service bookings yet.</p>
            <p className="text-gray-500 text-xs mt-1">
              Discover amazing services and book your first one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {serviceBookings?.map((booking: any) => (
              <BookingCard
                key={booking._id}
                accentClass="hover:border-green-500/30 hover:shadow-green-500/10"
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl">
                    <Star className="w-5 h-5 text-green-400" />
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full font-medium">
                    Service
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">
                  {booking.serviceId?.title || "Service"}
                </h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-green-400" />
                    {booking.serviceId?.provider || "N/A"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    {booking.serviceId?.contact || "N/A"}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="font-medium text-white">
                      {booking.serviceId?.price || "TBA"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    reduxDispatch(cancelServiceBooking(booking._id) as any)
                  }
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <CalendarX className="w-4 h-4" /> Cancel Service
                </button>
              </BookingCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      <RsvpPopup
        visible={rsvpVisible}
        countdown={rsvpCountdown}
        onGoNow={() => {
          setRsvpVisible(false);
          setActiveNav("bookings");
        }}
      />
      {/* <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        initials={initials}
        onLogout={handleLogout}
        onGoHome={handleGoHome}
      /> */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        initials={initials}
        onLogout={handleLogout}
        onGoHome={handleGoHome}
        userRole="user"
        // pendingCounts={{
        //   events: pendingUserEvents,
        //   services: pendingUserServices,
        // }}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div>
            <h1 className="text-base font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              {sectionTitle[activeNav]}
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-300">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <button
              onClick={() => setActiveNav("profile")}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold hover:scale-105 transition"
            >
              {initials}
            </button>
          </div>
        </header>
        <main className="flex-1 px-6 py-8 overflow-y-auto">
          {activeNav === "overview" && renderOverview()}
          {activeNav === "profile" && renderProfile()}
          {activeNav === "events" && renderEvents()}
          {activeNav === "services" && renderServices()}
          {activeNav === "bookings" && renderBookings()}
          {activeNav === "earnings" && (
            <div className="text-gray-400 text-center py-24">
              Earnings Coming Soon
            </div>
          )}
          {activeNav === "settings" && (
            <div className="text-gray-400 text-center py-24">
              Settings Coming Soon
            </div>
          )}
        </main>
      </div>
      {showEventModal && (
        <AddEventModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          onSave={async (formData: any) => {
            try {
              if (!token) {
                alert("You must be logged in to create an event!");
                return;
              }
              const res = await fetch(`${API_BASE_URL}/events`, {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!res.ok) {
                const d = await res.json();
                throw new Error(d.message || "Failed to create event");
              }
              dispatch(getUserEvents() as any);
              setSuccessMessage("Event Created Successfully!");
              setShowSuccess(true);
            } catch (err: any) {
              alert(`Failed to save event: ${err.message}`);
            }
            setShowEventModal(false);
          }}
        />
      )}
      {showServiceModal && (
        <AddServiceModal
          isOpen={showServiceModal}
          onClose={() => setShowServiceModal(false)}
          onSave={async (formData: FormData) => {
            try {
              if (!token) {
                alert("You must be logged in to add a service!");
                return;
              }
              const res = await fetch(`${API_BASE_URL}/services`, {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!res.ok) {
                const d = await res.json();
                throw new Error(d.message || "Failed to add service");
              }
              // ✅ Fix: Add pagination params
              dispatch(
                getUserServices({
                  page: 1,
                  limit: 100,
                }) as any,
              );

              setSuccessMessage("Service Added Successfully!");
              setShowSuccess(true);
            } catch (err: any) {
              alert(`Failed to save service: ${err.message}`);
            }
            setShowServiceModal(false);
          }}
        />
      )}
      <SimpleModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={successMessage}
      >
        <p>
          Your request has been submitted successfully.
          <br />
          Please wait for admin approval.
        </p>
      </SimpleModal>
    </div>
  );
}
