"use client";

import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Calendar,
  Wrench,
  DollarSign,
  Users,
  ClipboardList,
  Settings,
  TrendingUp,
} from "lucide-react";
import { AdminNavKey } from "@/src/types/admin";

import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  getEvents,
  updateEventStatus,
  removeEvent,
} from "@/src/redux/slices/eventsSlice";
import {
  getServices,
  updateServiceStatus,
  removeService,
} from "@/src/redux/slices/servicesSlice";
import { getBookings } from "@/src/redux/slices/bookingsSlice";
import { fetchProfile, logout } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import withAdminAuth from "@/app/components/withAdminAuth";

// Import shared sidebar
import Sidebar from "@/app/components/shared/Sidebar";

// Import admin components
import { LoadingSpinner } from "@/app/components/admin/LoadingSpinner";
import { PageFallback } from "@/app/components/admin/PageFallback";
import { ErrorDisplay } from "@/app/components/admin/ErrorDisplay";
import { ConfirmModal } from "@/app/components/admin/ConfirmModal";
import { DetailModal } from "@/app/components/admin/DetailModal";
import { Header } from "@/app/components/admin/Header"; // This will be updated separately
import { Overview } from "@/app/components/admin/overview";
import { BookingsView } from "@/app/components/admin/BookingsView";
import { Placeholder } from "@/app/components/admin/Placeholder";

// Lazy load components
const EventsPage = lazy(() => import("@/app/admin/dashboard/events/page"));
const ServicesPage = lazy(() => import("@/app/admin/dashboard/services/page"));

function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const reduxDispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const dataFetchedRef = useRef(false); // Prevent double fetching

  const [activeNav, setActiveNav] = useState<AdminNavKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [detailType, setDetailType] = useState<"event" | "service" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    danger?: boolean;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
    danger: false,
  });

  // Safe state access
  const eventsState = useAppSelector((state: any) => state.events);
  const servicesState = useAppSelector((state: any) => state.services);
  const bookingsState = useAppSelector((state: any) => state.bookings);
  const authState = useAppSelector((state: any) => state.auth);
  const pagination = servicesState?.pagination || { page: 1 };

  // Access state directly from the regular fields
  const events = eventsState?.events || [];
  const services = servicesState?.services || [];
  const bookings = bookingsState?.list || [];

  const { token, user } = authState || {};

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load all data - but only once
  useEffect(() => {
    // Prevent double fetching in development (React StrictMode)
    if (dataFetchedRef.current) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setDataLoaded(false);

        // Load data in parallel
        await Promise.all([
          dispatch(getEvents({ page: 1, limit: 1000 }) as any),
          dispatch(getServices({ page: 1, limit: 1000 }) as any),
          dispatch(getBookings() as any),
        ]);

        if (token && !user) {
          await reduxDispatch(fetchProfile(token) as any);
        }

        setDataLoaded(true);
        dataFetchedRef.current = true;
      } catch (error) {
        console.error("Failed to load admin data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load data",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      loadData();
    }
  }, [dispatch, reduxDispatch, token, user, mounted]); // Remove dataFetchedRef from deps

  const castUser = user as any;
  const initials = castUser?.name
    ? castUser.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "A";

  // Memoize filtered arrays to prevent recalculation on every render
  const pendingEventsCount = useMemo(
    () => events.filter((e: any) => e?.status === "pending").length,
    [events],
  );

  const pendingServicesCount = useMemo(
    () => services.filter((s: any) => s?.status === "pending").length,
    [services],
  );

  // Get full pending items for header
  const pendingEvents = useMemo(
    () => events.filter((e: any) => e?.status === "pending"),
    [events],
  );

  const pendingServices = useMemo(
    () => services.filter((s: any) => s?.status === "pending"),
    [services],
  );

  // Calculate stats only when data is loaded
  const stats = useMemo(() => {
    if (!dataLoaded) {
      // Return placeholder values while loading
      return [
        {
          title: "Total Events",
          value: "...",
          sub: "loading",
          icon: <Calendar className="w-6 h-6" />,
          color: "from-blue-400 to-blue-600",
        },
        {
          title: "Total Services",
          value: "...",
          sub: "loading",
          icon: <Wrench className="w-6 h-6" />,
          color: "from-green-400 to-green-600",
        },
        {
          title: "Total Bookings",
          value: "...",
          sub: "loading",
          icon: <ClipboardList className="w-6 h-6" />,
          color: "from-purple-400 to-purple-600",
        },
        {
          title: "Revenue",
          value: "$5,200",
          sub: "this month",
          icon: <DollarSign className="w-6 h-6" />,
          color: "from-pink-400 to-pink-600",
        },
      ];
    }

    return [
      {
        title: "Total Events",
        value: events.length || 0,
        sub: `${pendingEventsCount} pending`,
        icon: <Calendar className="w-6 h-6" />,
        color: "from-blue-400 to-blue-600",
      },
      {
        title: "Total Services",
        value: services.length || 0,
        sub: `${pendingServicesCount} pending`,
        icon: <Wrench className="w-6 h-6" />,
        color: "from-green-400 to-green-600",
      },
      {
        title: "Total Bookings",
        value: bookings.length || 0,
        sub: "all time",
        icon: <ClipboardList className="w-6 h-6" />,
        color: "from-purple-400 to-purple-600",
      },
      {
        title: "Revenue",
        value: "$5,200",
        sub: "this month",
        icon: <DollarSign className="w-6 h-6" />,
        color: "from-pink-400 to-pink-600",
      },
    ];
  }, [
    dataLoaded,
    events.length,
    services.length,
    bookings.length,
    pendingEventsCount,
    pendingServicesCount,
  ]);

  // Handlers
  const handleLogout = useCallback(() => {
    reduxDispatch(logout());
    router.push("/");
  }, [reduxDispatch, router]);

  const handleGoHome = useCallback(() => router.push("/"), [router]);

  const triggerConfirm = useCallback(
    (title: string, message: string, onConfirm: () => void, danger = false) =>
      setConfirm({ open: true, title, message, onConfirm, danger }),
    [],
  );

  const handleApproveEvent = useCallback(
    (id: string) => {
      triggerConfirm("Approve Event", "Approve this event?", () =>
        dispatch(updateEventStatus({ id, status: "approved" }) as any),
      );
    },
    [dispatch, triggerConfirm],
  );

  const handleRejectEvent = useCallback(
    (id: string) => {
      triggerConfirm("Reject Event", "Reject this event?", () =>
        dispatch(updateEventStatus({ id, status: "rejected" }) as any),
      );
    },
    [dispatch, triggerConfirm],
  );

  const handleDeleteEvent = useCallback(
    (id: string) => {
      triggerConfirm(
        "Delete Event",
        "This cannot be undone. Continue?",
        () => dispatch(removeEvent(id) as any),
        true,
      );
    },
    [dispatch, triggerConfirm],
  );

  const handleApproveService = useCallback(
    (id: string) => {
      triggerConfirm("Approve Service", "Approve this service?", () =>
        dispatch(updateServiceStatus({ id, status: "approved" }) as any),
      );
    },
    [dispatch, triggerConfirm],
  );

  const handleRejectService = useCallback(
    (id: string) => {
      triggerConfirm("Reject Service", "Reject this service?", () =>
        dispatch(updateServiceStatus({ id, status: "rejected" }) as any),
      );
    },
    [dispatch, triggerConfirm],
  );

  const handleDeleteService = useCallback(
    (id: string) => {
      triggerConfirm(
        "Delete Service",
        "This cannot be undone. Continue?",
        () => dispatch(removeService({ id, page: pagination.page }) as any),
        true,
      );
    },
    [dispatch, triggerConfirm, pagination.page],
  );

  // Wrapper function for setActiveNav
  const handleSetActiveNav = useCallback(
    (key: any) => {
      if (
        [
          "overview",
          "events",
          "services",
          "bookings",
          "users",
          "settings",
          "analytics",
        ].includes(key)
      ) {
        setActiveNav(key as AdminNavKey);
      }
    },
    [setActiveNav],
  );

  // Show mounted loading state
  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0f] text-white">
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0f] text-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-400">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      <ConfirmModal
        isOpen={confirm.open}
        onClose={() => setConfirm((c) => ({ ...c, open: false }))}
        onConfirm={confirm.onConfirm}
        title={confirm.title}
        message={confirm.message}
        danger={confirm.danger}
      />

      <Sidebar
        activeNav={activeNav}
        setActiveNav={handleSetActiveNav}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        initials={initials}
        onLogout={handleLogout}
        onGoHome={handleGoHome}
        userRole="admin"
        pendingCounts={{
          events: pendingEventsCount,
          services: pendingServicesCount,
        }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeNav={activeNav}
          onMenuClick={() => setSidebarOpen(true)}
          notificationCount={pendingEventsCount + pendingServicesCount}
          initials={initials}
          token={token} // Pass token for pending buttons
          pendingEvents={pendingEvents} // Pass pending events data
          pendingServices={pendingServices} // Pass pending services data
          onApproveEvent={handleApproveEvent}
          onRejectEvent={handleRejectEvent}
          onApproveService={handleApproveService}
          onRejectService={handleRejectService}
        />

        {error && (
          <div className="px-6 pt-4">
            <ErrorDisplay
              message={error}
              onRetry={() => window.location.reload()}
            />
          </div>
        )}

        {selectedItem && detailType && (
          <DetailModal
            item={selectedItem}
            type={detailType}
            onClose={() => {
              setSelectedItem(null);
              setDetailType(null);
            }}
          />
        )}

        <main className="flex-1 px-6 py-8 overflow-y-auto">
          {activeNav === "overview" && (
            <Overview
              stats={stats}
              pendingEvents={pendingEventsCount}
              pendingServices={pendingServicesCount}
              bookingsCount={bookings.length}
              user={user}
              initials={initials}
              onNavigate={setActiveNav}
            />
          )}

          {activeNav === "events" && (
            <Suspense fallback={<PageFallback />}>
              <EventsPage />
            </Suspense>
          )}

          {activeNav === "services" && (
            <Suspense fallback={<PageFallback />}>
              <ServicesPage />
            </Suspense>
          )}

          {activeNav === "bookings" && <BookingsView bookings={bookings} />}

          {activeNav === "users" && (
            <Placeholder
              title="User Management"
              icon={<Users className="w-8 h-8 text-gray-600" />}
            />
          )}

          {activeNav === "settings" && (
            <Placeholder
              title="Settings"
              icon={<Settings className="w-8 h-8 text-gray-600" />}
            />
          )}

          {activeNav === "analytics" && (
            <Placeholder
              title="Analytics"
              icon={<TrendingUp className="w-8 h-8 text-gray-600" />}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default withAdminAuth(React.memo(AdminDashboardPage));
