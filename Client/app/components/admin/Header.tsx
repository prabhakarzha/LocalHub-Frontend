import { Bell, Menu } from "lucide-react";
import { AdminNavKey } from "@/src/types/admin";
import { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { useAppDispatch } from "@/src/redux/hooks";
import { getEvents } from "@/src/redux/slices/eventsSlice";
import { getServices } from "@/src/redux/slices/servicesSlice";
import { useRouter } from "next/navigation";

// Lazy load PendingDropdown
const PendingDropdown = lazy(() => import("@/app/components/PendingDropdown"));

interface HeaderProps {
  activeNav: AdminNavKey;
  onMenuClick: () => void;
  notificationCount: number;
  initials: string;
  token?: string;
  pendingEvents?: any[];
  pendingServices?: any[];
  onApproveEvent?: (id: string) => void;
  onRejectEvent?: (id: string) => void;
  onApproveService?: (id: string) => void;
  onRejectService?: (id: string) => void;
}

export function Header({
  activeNav,
  onMenuClick,
  notificationCount,
  initials,
  token,
}: HeaderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // const API_BASE_URL =
  //   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [pendingServices, setPendingServices] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState<"event" | "service" | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch pending data for admin
  useEffect(() => {
    const fetchPendingData = async () => {
      // Don't fetch if no token
      if (!token) {
        console.log("No token available for fetching pending data");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Validate token format
        const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

        const [eventsRes, servicesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/events/pending`, {
            headers: {
              Authorization: `Bearer ${cleanToken}`,
              "Content-Type": "application/json",
            },
          }),
          axios.get(`${API_BASE_URL}/services/pending`, {
            headers: {
              Authorization: `Bearer ${cleanToken}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (eventsRes.data?.success) {
          setPendingEvents(eventsRes.data.events || []);
        } else {
          console.warn(
            "Events pending response not successful:",
            eventsRes.data,
          );
        }

        if (servicesRes.data?.success) {
          setPendingServices(servicesRes.data.services || []);
        } else {
          console.warn(
            "Services pending response not successful:",
            servicesRes.data,
          );
        }
      } catch (err: any) {
        console.error("Error fetching pending data:", err);

        // Handle 401 specifically
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          // Optional: Redirect to login after a delay
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          setError(
            err.response?.data?.message || "Failed to fetch pending data",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPendingData();
  }, [token, API_BASE_URL, router]);

  const handleApprove = async (id: string, type: "event" | "service") => {
    if (!token) {
      alert("You must be logged in to perform this action");
      router.push("/login");
      return;
    }

    try {
      const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

      await axios.patch(
        `${API_BASE_URL}/${type}s/${id}/status`,
        { status: "approved" },
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (type === "event") {
        setPendingEvents((prev) => prev.filter((e) => e._id !== id));
        dispatch(getEvents({ page: 1, limit: 1000 }) as any);
      } else {
        setPendingServices((prev) => prev.filter((s) => s._id !== id));
        dispatch(getServices({ page: 1, limit: 1000 }) as any);
      }

      alert(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} approved!`);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        router.push("/login");
      } else {
        alert(err.response?.data?.message || `Error approving ${type}!`);
      }
    }
  };

  const handleDecline = async (id: string, type: "event" | "service") => {
    if (!token) {
      alert("You must be logged in to perform this action");
      router.push("/login");
      return;
    }

    try {
      const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

      await axios.patch(
        `${API_BASE_URL}/${type}s/${id}/status`,
        { status: "declined" },
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (type === "event") {
        setPendingEvents((prev) => prev.filter((e) => e._id !== id));
        dispatch(getEvents({ page: 1, limit: 1000 }) as any);
      } else {
        setPendingServices((prev) => prev.filter((s) => s._id !== id));
        dispatch(getServices({ page: 1, limit: 1000 }) as any);
      }

      alert(`❌ ${type.charAt(0).toUpperCase() + type.slice(1)} declined!`);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        router.push("/login");
      } else {
        alert(err.response?.data?.message || `Error declining ${type}!`);
      }
    }
  };

  const toggleDropdown = (type: "event" | "service") => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  // Show error message if any
  if (error) {
    return (
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-base font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-transparent bg-clip-text">
              {activeNav === "overview" && "Admin Overview"}
              {activeNav === "events" && "Manage Events"}
              {activeNav === "services" && "Manage Services"}
              {activeNav === "bookings" && "All Bookings"}
              {activeNav === "users" && "User Management"}
              {activeNav === "settings" && "Settings"}
              {activeNav === "analytics" && "Analytics"}
            </h1>
          </div>
        </div>
        <div className="text-red-400 text-sm">{error}</div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-base font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-transparent bg-clip-text">
            {activeNav === "overview" && "Admin Overview"}
            {activeNav === "events" && "Manage Events"}
            {activeNav === "services" && "Manage Services"}
            {activeNav === "bookings" && "All Bookings"}
            {activeNav === "users" && "User Management"}
            {activeNav === "settings" && "Settings"}
            {activeNav === "analytics" && "Analytics"}
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
        {/* Pending Events Button */}
        {token && (
          <div className="relative hidden md:block">
            <button
              onClick={() => toggleDropdown("event")}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg transition-all"
              disabled={loading}
            >
              <span className="text-yellow-400 font-semibold text-sm">
                Pending Events
              </span>
              {pendingEvents.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingEvents.length}
                </span>
              )}
              {loading && <span className="text-xs text-gray-400">...</span>}
            </button>

            <Suspense fallback={null}>
              {openDropdown === "event" && (
                <PendingDropdown
                  items={pendingEvents}
                  type="event"
                  onApprove={handleApprove}
                  onDecline={handleDecline}
                />
              )}
            </Suspense>
          </div>
        )}

        {/* Pending Services Button */}
        {token && (
          <div className="relative hidden md:block">
            <button
              onClick={() => toggleDropdown("service")}
              className="flex items-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all"
              disabled={loading}
            >
              <span className="text-green-400 font-semibold text-sm">
                Pending Services
              </span>
              {pendingServices.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingServices.length}
                </span>
              )}
              {loading && <span className="text-xs text-gray-400">...</span>}
            </button>

            <Suspense fallback={null}>
              {openDropdown === "service" && (
                <PendingDropdown
                  items={pendingServices}
                  type="service"
                  onApprove={handleApprove}
                  onDecline={handleDecline}
                />
              )}
            </Suspense>
          </div>
        )}

        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-gray-300">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
      </div>

      {/* Mobile Pending Buttons */}
      {token && (
        <div className="absolute top-full left-0 right-0 bg-[#0a0a0f] border-t border-white/5 p-4 md:hidden hidden">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => toggleDropdown("event")}
              className="flex items-center justify-between px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg"
              disabled={loading}
            >
              <span className="text-yellow-400 font-semibold">
                Pending Events
              </span>
              {pendingEvents.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingEvents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => toggleDropdown("service")}
              className="flex items-center justify-between px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg"
              disabled={loading}
            >
              <span className="text-green-400 font-semibold">
                Pending Services
              </span>
              {pendingServices.length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingServices.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
