"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  DollarSign,
  PlusCircle,
  ClipboardList,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  Menu,
  X,
  Mail,
  Edit,
  CalendarX,
  MapPin,
  User,
  Phone,
  Star,
  Shield,
  Home,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import AddEventModal from "@/app/components/shared/AddEventModal";
import AddServiceModal from "@/app/components/shared/AddServiceModal";
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
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
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";

// ─── Simple success modal ────────────────────────────────────────────────────
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

// ─── RSVP success popup (mirrors events page) ────────────────────────────────
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

// ─── Nav config ──────────────────────────────────────────────────────────────
type NavKey =
  | "overview"
  | "profile"
  | "events"
  | "services"
  | "bookings"
  | "earnings"
  | "settings";

const navItems: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  { key: "profile", label: "My Profile", icon: <User className="w-5 h-5" /> },
  { key: "events", label: "My Events", icon: <Calendar className="w-5 h-5" /> },
  {
    key: "services",
    label: "My Services",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  { key: "bookings", label: "Bookings", icon: <Users className="w-5 h-5" /> },
  {
    key: "earnings",
    label: "Earnings",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

// ─── Booking card shell ───────────────────────────────────────────────────────
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

// ════════════════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const reduxDispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [activeNav, setActiveNav] = useState<NavKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editServiceData, setEditServiceData] = useState<any | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // RSVP popup state (mirrors events page)
  const [rsvpVisible, setRsvpVisible] = useState(false);
  const [rsvpCountdown, setRsvpCountdown] = useState(3);

  // Events pagination
  const [eventsPage, setEventsPage] = useState(1);
  const eventsLimit = 6;
  // Events pagination
  const [servicesPage, setServicesPage] = useState(1);
  const servicesLimit = 6;

  const { token, user } = useAppSelector((state: any) => state.auth);
  const { events: userEvents, loading: eventsLoading } = useAppSelector(
    (state: any) => state.events,
  );
  const { services: userServices, loading: servicesLoading } = useAppSelector(
    (state: any) => state.services,
  );
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const { loading: authLoading, error: authError } = useSelector(
    (state: RootState) => state.auth,
  );
  const { list: bookings, loading: bookingsLoading } = useSelector(
    (state: RootState) => state.bookings,
  );
  const { List: serviceBookings, loading: serviceBookingsLoading } =
    useSelector((state: RootState) => state.servicebookings);

  // Initial data load
  useEffect(() => {
    if (user?._id) {
      dispatch(getUserEvents(user._id));
      dispatch(getUserServices(user._id));
    }
    if (token) {
      if (!user) reduxDispatch(fetchProfile(token));
      reduxDispatch(getBookings());
      reduxDispatch(fetchServiceBookings())
        .unwrap()
        .catch((err: any) => console.error("Service Booking Error:", err));
    }
  }, [user, token, dispatch, reduxDispatch]);

  // RSVP countdown — mirrors events page logic exactly
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

  // const userServices = AllServices.filter(
  //   (s: any) => s.createdBy?._id === user?._id,
  // );
  const castUser = user as any;
  const initials = castUser?.name
    ? castUser.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  // Only current user's approved events
  const approvedEvents = userEvents.filter((e: any) => e.status === "approved");
  // Client-side pagination
  const paginatedEvents = approvedEvents.slice(
    (eventsPage - 1) * eventsLimit,
    eventsPage * eventsLimit,
  );
  const hasNextPage = eventsPage * eventsLimit < approvedEvents.length;

  // Only current user's approved Services
  const approvedServices = userServices.filter(
    (e: any) => e.status === "approved",
  );
  // Client-side pagination
  const paginatedServices = approvedServices.slice(
    (servicesPage - 1) * servicesLimit,
    servicesPage * servicesLimit,
  );
  const hasNextServicePage =
    servicesPage * servicesLimit < approvedServices.length;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleLogout = () => {
    reduxDispatch(logout());
    router.push("/");
  };

  const handleGoHome = () => router.push("/");

  const handleRSVP = (eventId: string) => {
    if (!token) {
      router.push("/login");
      return;
    }
    reduxDispatch(bookEvent({ eventId }))
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

    reduxDispatch(bookService({ serviceId }))
      .unwrap()
      .then(() => {
        setRsvpVisible(true);
        setRsvpCountdown(3);
      })
      .catch(() => alert("Failed to book service. Try again."));
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = [
    {
      title: "My Events",
      value: approvedEvents.length,
      icon: <Calendar className="w-6 h-6" />,
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "My Services",
      value: userServices.length,
      icon: <ClipboardList className="w-6 h-6" />,
      color: "from-green-400 to-green-600",
    },
    {
      title: "Event Bookings",
      value: bookings.length,
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-400 to-purple-600",
    },
    {
      title: "Earnings",
      value: "$1,250",
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-pink-400 to-pink-600",
    },
  ];

  const actions = [
    {
      label: "Add Event",
      icon: <PlusCircle className="w-5 h-5" />,
      onClick: () => setShowEventModal(true),
    },
    {
      label: "Add Service",
      icon: <ClipboardList className="w-5 h-5" />,
      onClick: () => setShowServiceModal(true),
    },
    {
      label: "View Bookings",
      icon: <Users className="w-5 h-5" />,
      onClick: () => setActiveNav("bookings"),
    },
  ];

  const sectionTitle: Record<NavKey, string> = {
    overview: "Dashboard Overview",
    profile: "My Profile",
    events: "My Events",
    services: "My Services",
    bookings: "Bookings",
    earnings: "Earnings",
    settings: "Settings",
  };

  // ════════════════════════════════════════════════════════════════════════
  // Section renderers
  // ════════════════════════════════════════════════════════════════════════

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 p-6 sm:p-8">
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold shrink-0 shadow-lg">
            {initials}
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-0.5">Welcome back 👋</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {castUser?.name || "User"}
            </h2>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> {castUser?.email}
            </p>
          </div>
          {castUser?.isAdmin && (
            <span className="sm:ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" /> Admin
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.color} p-5 text-white shadow-lg`}
          >
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-4 -right-1 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="p-2 bg-white/20 rounded-xl w-fit mb-3">
                {item.icon}
              </div>
              <p className="text-3xl font-bold mb-0.5">{item.value}</p>
              <p className="text-xs text-white/70 font-medium">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className="group flex flex-col items-center justify-center gap-3 py-8 rounded-2xl border border-white/5 bg-gray-900/60 hover:bg-white/5 hover:border-blue-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-md group-hover:scale-110 transition-transform duration-200">
                {action.icon}
              </div>
              <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-white/5 bg-gray-900/60 p-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
          Recent Activity
        </p>
        <div className="space-y-1">
          {[
            {
              label: "New booking received",
              time: "2 min ago",
              dot: "bg-blue-500",
            },
            {
              label: "Event approved by admin",
              time: "1 hr ago",
              dot: "bg-green-500",
            },
            {
              label: "Service listed successfully",
              time: "3 hr ago",
              dot: "bg-purple-500",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3.5 border-b border-white/5 last:border-0"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
              <p className="text-sm text-gray-300 flex-1">{item.label}</p>
              <p className="text-xs text-gray-500 shrink-0">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── MY EVENTS — approved events with RSVP (mirrors events page) ───────────
  const renderEvents = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Approved Events</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            Browse and RSVP to community events near you
          </p>
        </div>
        <button
          onClick={() => setShowEventModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-sm font-semibold hover:opacity-90 hover:scale-105 transition"
        >
          <PlusCircle className="w-4 h-4" /> Add Event
        </button>
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
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30 hover:scale-[1.02] transition-all duration-300"
              >
                {/* Event image */}
                <div className="relative w-full h-48">
                  <Image
                    src={
                      event.image && event.image.trim() !== ""
                        ? event.image
                        : "/images/default-placeholder.png"
                    }
                    alt={event.title || "Event"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center rounded-t-2xl"
                    unoptimized
                  />
                  {/* Approved badge */}
                  <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-green-500/20 border border-green-500/40 backdrop-blur-sm rounded-full text-green-300 text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" /> Approved
                  </span>
                </div>

                {/* Event content */}
                <div className="p-5 text-white flex flex-col gap-3">
                  <h3 className="text-lg font-bold group-hover:text-purple-300 transition-colors line-clamp-1">
                    {event.title}
                  </h3>

                  {/* Creator */}
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      By{" "}
                      <span className="text-white font-medium">
                        {event.createdBy?.name ||
                          event.createdBy?.username ||
                          "Admin"}
                      </span>
                    </span>
                  </div>

                  {/* Date & Location */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Calendar className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  {/* RSVP button */}
                  <button
                    onClick={() => handleRSVP(event._id)}
                    className="w-full mt-1 py-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
                  >
                    RSVP Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination — mirrors events page */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setEventsPage((prev) => Math.max(prev - 1, 1))}
              disabled={eventsPage === 1}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-gray-400 text-sm px-2">
              Page {eventsPage}
            </span>
            <button
              onClick={() => {
                if (hasNextPage) setEventsPage((prev) => prev + 1);
              }}
              disabled={!hasNextPage}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );

  // ── MY SERVICES — approved services with booking ───────────

  const renderServices = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Approved Services</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            Browse and book trusted services near you
          </p>
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
          <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No approved services yet.</p>
          <p className="text-gray-500 text-sm mt-1">
            Submit a service and wait for admin approval!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedServices.map((service: any) => (
              <div
                key={service._id}
                className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/30 hover:scale-[1.02] transition-all duration-300"
              >
                {/* Service image */}
                <div className="relative w-full h-48">
                  <Image
                    src={
                      service.image && service.image.trim() !== ""
                        ? service.image
                        : "/images/default-placeholder.png"
                    }
                    alt={service.title || "Service"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center rounded-t-2xl"
                    unoptimized
                  />
                  {/* Approved badge */}
                  <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-green-500/20 border border-green-500/40 backdrop-blur-sm rounded-full text-green-300 text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" /> Approved
                  </span>
                </div>

                {/* Service content */}
                <div className="p-5 text-white flex flex-col gap-3">
                  <h3 className="text-lg font-bold group-hover:text-purple-300 transition-colors line-clamp-1">
                    {service.title}
                  </h3>

                  {/* Provider */}
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      By{" "}
                      <span className="text-white font-medium">
                        {service.createdBy?.name ||
                          service.createdBy?.username ||
                          "Admin"}
                      </span>
                    </span>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span className="line-clamp-1">{service.location}</span>
                    </div>
                  </div>

                  {/* Booking button */}
                  <button
                    onClick={() => handleServiceBooking(service._id)}
                    className="w-full mt-1 py-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
                  >
                    Book Service
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setServicesPage((prev) => Math.max(prev - 1, 1))}
              disabled={servicesPage === 1}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-gray-400 text-sm px-2">
              Page {servicesPage}
            </span>
            <button
              onClick={() => {
                if (hasNextServicePage) setServicesPage((prev) => prev + 1);
              }}
              disabled={!hasNextServicePage}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderProfile = () => {
    if (authLoading)
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <div className="absolute top-1.5 left-1.5 w-9 h-9 border-4 border-pink-500 border-t-transparent rounded-full animate-spin opacity-60" />
          </div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      );

    if (authError)
      return (
        <div className="flex items-center justify-center py-24">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-sm">
            <CalendarX className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-300">{authError}</p>
          </div>
        </div>
      );

    return (
      <div className="space-y-8 max-w-3xl">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative shrink-0">
              {castUser?.avatar ? (
                <img
                  src={castUser.avatar}
                  alt={castUser.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-purple-400/40 shadow-xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 border-4 border-purple-400/40 shadow-xl flex items-center justify-center text-3xl font-bold text-white">
                  {initials}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-[#0a0a0f] flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-1">
                {castUser?.name}
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-400 text-sm mb-3">
                <Mail className="w-4 h-4" /> {castUser?.email}
              </div>
              {castUser?.isAdmin && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-xs font-semibold mb-3">
                  <Shield className="w-3.5 h-3.5" /> Admin Account
                </span>
              )}
              <div className="mt-2">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 group">
                  <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{bookings.length}</p>
            <p className="text-gray-400 text-sm">Event Bookings</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {serviceBookings.length}
            </p>
            <p className="text-gray-400 text-sm">Service Bookings</p>
          </div>
        </div>

        <button
          onClick={() => setActiveNav("bookings")}
          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all group"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-gray-300 group-hover:text-white">
            <Users className="w-5 h-5 text-purple-400" />
            View All Bookings
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
        </button>
      </div>
    );
  };

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
        ) : bookings.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center max-w-sm">
            <Calendar className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No event bookings yet.</p>
            <p className="text-gray-500 text-xs mt-1">
              Start exploring and book your first event!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {bookings.map((booking: any) => (
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
                <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
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
                  onClick={() => dispatch(cancelBooking(booking._id))}
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-red-500/20"
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
        ) : serviceBookings.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center max-w-sm">
            <Star className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No service bookings yet.</p>
            <p className="text-gray-500 text-xs mt-1">
              Discover amazing services and book your first one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {serviceBookings.map((booking: any) => (
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
                <h4 className="text-base font-bold text-white group-hover:text-green-300 transition-colors">
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
                    reduxDispatch(cancelServiceBooking(booking._id))
                  }
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-red-500/20"
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

  const renderPlaceholder = (label: string) => (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
        <Settings className="w-8 h-8 text-gray-600" />
      </div>
      <p className="text-gray-400 font-medium">{label}</p>
      <p className="text-gray-600 text-sm mt-1">Coming soon...</p>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      {/* RSVP popup */}
      <RsvpPopup
        visible={rsvpVisible}
        countdown={rsvpCountdown}
        onGoNow={() => {
          setRsvpVisible(false);
          setActiveNav("bookings");
        }}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 w-64 flex flex-col
          bg-gray-900/90 backdrop-blur-xl border-r border-white/5
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text tracking-tight">
            EventPro
          </span>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User mini card */}
        <div className="px-4 py-4 border-b border-white/5">
          <button
            onClick={() => {
              setActiveNav("profile");
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl px-3 py-3 transition group text-left"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-semibold truncate group-hover:text-white transition">
                {castUser?.name || "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {castUser?.email || ""}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest px-3 mb-3">
            Menu
          </p>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveNav(item.key);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${
                  activeNav === item.key
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {activeNav === item.key && (
                <ChevronRight className="w-4 h-4 text-blue-400" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <button
            onClick={handleGoHome}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
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

        {/* Content */}
        <main className="flex-1 px-6 py-8 overflow-y-auto">
          {activeNav === "overview" && renderOverview()}
          {activeNav === "profile" && renderProfile()}
          {activeNav === "events" && renderEvents()}
          {activeNav === "bookings" && renderBookings()}
          {activeNav === "services" && renderServices()}
          {activeNav === "earnings" && renderPlaceholder("Earnings")}
          {activeNav === "settings" && renderPlaceholder("Settings")}
        </main>
      </div>

      {/* ── Modals ── */}
      {showEventModal && (
        <AddEventModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          onSave={async (formData: any, isEdit: any) => {
            try {
              if (!token) {
                alert("You must be logged in to create an event!");
                return;
              }
              const res = await fetch(`${API_BASE_URL}/api/events`, {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!res.ok) {
                const d = await res.json();
                throw new Error(d.message || "Failed to create event");
              }
              dispatch(getUserEvents(user._id));
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
              const res = await fetch(`${API_BASE_URL}/api/services`, {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!res.ok) {
                const d = await res.json();
                throw new Error(d.message || "Failed to add service");
              }
              dispatch(getUserServices());
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
