"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import axios from "axios";
import { getEvents } from "@/src/redux/slices/eventsSlice";
import { getServices } from "@/src/redux/slices/servicesSlice";
import { LogIn, ShieldX, X } from "lucide-react";

// ─── Toast types ─────────────────────────────────────────────────────────────
type ToastType = "auth" | "access";

interface ToastState {
  visible: boolean;
  type: ToastType;
}

// ─── Toast component ─────────────────────────────────────────────────────────
function NavToast({
  toast,
  onClose,
  onLogin,
}: {
  toast: ToastState;
  onClose: () => void;
  onLogin: () => void;
}) {
  useEffect(() => {
    if (!toast.visible) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [toast.visible]);

  if (!toast.visible) return null;

  const isAuth = toast.type === "auth";

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-top-3 duration-300">
      <div
        className={`
          flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl
          min-w-[320px] max-w-sm
          ${
            isAuth
              ? "bg-gray-900/95 border-purple-500/30 shadow-purple-500/20"
              : "bg-gray-900/95 border-red-500/30 shadow-red-500/20"
          }
        `}
      >
        {/* Icon */}
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center shrink-0
            ${isAuth ? "bg-purple-500/20" : "bg-red-500/20"}
          `}
        >
          {isAuth ? (
            <LogIn className="w-5 h-5 text-purple-400" />
          ) : (
            <ShieldX className="w-5 h-5 text-red-400" />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">
            {isAuth ? "Login Required" : "Access Denied"}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            {isAuth
              ? "Please sign in to access this page."
              : "You don't have permission to view this page."}
          </p>
        </div>

        {/* Action + close */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuth && (
            <button
              onClick={() => {
                onLogin();
                onClose();
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white text-xs font-semibold rounded-lg transition"
            >
              Login
            </button>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className={`mt-1.5 h-0.5 rounded-full overflow-hidden mx-1 ${isAuth ? "bg-purple-500/20" : "bg-red-500/20"}`}
      >
        <div
          className={`h-full rounded-full ${isAuth ? "bg-purple-500" : "bg-red-500"} animate-[shrink_4s_linear_forwards]`}
          style={{
            animationName: "shrink",
            animationDuration: "4s",
            animationTimingFunction: "linear",
            animationFillMode: "forwards",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [pendingServices, setPendingServices] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState<"event" | "service" | null>(
    null,
  );
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: "auth",
  });

  const { token, user } = useSelector((state: any) => state.auth);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPendingData = async () => {
      if (!token || !user || user.role !== "admin") return;
      try {
        const [eventsRes, servicesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/events/pending`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/services/pending`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (eventsRes.data.success)
          setPendingEvents(eventsRes.data.events || []);
        if (servicesRes.data.success)
          setPendingServices(servicesRes.data.services || []);
      } catch (err) {
        console.error("Error fetching pending data:", err);
      }
    };
    fetchPendingData();
  }, [user, token]);

  // ── All hooks above — safe to early return now ────────────────────────────
  if (pathname === "/dashboard") return null;

  const showToast = (type: ToastType) => setToast({ visible: true, type });
  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));

  const navItems = [
    { href: "/", label: "Home", protected: false },
    { href: "/events", label: "Events", protected: true },
    { href: "/services", label: "Services", protected: true },
  ];

  if (token && user?.role !== "admin") {
    navItems.push({ href: "/profile", label: "Profile", protected: true });
    navItems.push({ href: "/dashboard", label: "Dashboard", protected: true });
  }

  if (user?.role === "admin") {
    navItems.push({
      href: "/admin/dashboard",
      label: "Admin Dashboard",
      protected: true,
    });
  }

  const handleNavClick = (href: string, protectedRoute: boolean) => {
    setIsMenuOpen(false);
    if (protectedRoute && !token) {
      showToast("auth");
      return;
    }
    if (href.startsWith("/admin") && user?.role !== "admin") {
      showToast("access");
      return;
    }
    router.push(href);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    router.push("/");
  };

  const handleApprove = async (id: string, type: "event" | "service") => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/${type}s/${id}/status`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (type === "event")
        setPendingEvents((prev) => prev.filter((e) => e._id !== id));
      else setPendingServices((prev) => prev.filter((s) => s._id !== id));
      alert(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} approved!`);
      if (type === "event") dispatch(getEvents({ page: 1, limit: 6 }) as any);
      else dispatch(getServices() as any);
    } catch (err) {
      console.error(err);
      alert(`Error approving ${type}!`);
    }
  };

  const handleDecline = async (id: string, type: "event" | "service") => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/${type}s/${id}/status`,
        { status: "declined" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (type === "event")
        setPendingEvents((prev) => prev.filter((e) => e._id !== id));
      else setPendingServices((prev) => prev.filter((s) => s._id !== id));
      alert(`❌ ${type.charAt(0).toUpperCase() + type.slice(1)} declined!`);
      if (type === "event") dispatch(getEvents({ page: 1, limit: 6 }) as any);
      else dispatch(getServices() as any);
    } catch (err) {
      console.error(err);
      alert(`Error declining ${type}!`);
    }
  };

  const renderPendingItems = (items: any[], type: "event" | "service") => {
    if (openDropdown !== type) return null;
    return (
      <div className="absolute right-0 mt-5 w-80 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
        {items.length === 0 ? (
          <div className="p-3 text-sm text-gray-500">No pending {type}s</div>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center p-3 border-b border-gray-200"
            >
              <span className="font-medium text-sm">{item.title}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(item._id, type)}
                  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecline(item._id, type)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const toggleDropdown = (type: "event" | "service") =>
    setOpenDropdown((prev) => (prev === type ? null : type));

  return (
    <>
      {/* Toast — rendered outside nav so it's always on top */}
      <NavToast
        toast={toast}
        onClose={hideToast}
        onLogin={() => router.push("/login")}
      />

      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-md text-white shadow-xl z-50">
        <div className="relative container mx-auto flex justify-between items-center px-6 py-4">
          {/* Brand */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent"
          >
            LocalHub
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href, item.protected)}
                className={`transition hover:opacity-80 ${pathname === item.href ? "font-bold underline text-purple-300" : "text-gray-200"}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center space-x-4">
            {token && user?.role === "admin" && (
              <div className="relative flex gap-4">
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("event")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Pending Events ({pendingEvents.length})
                  </button>
                  {renderPendingItems(pendingEvents, "event")}
                </div>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("service")}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Pending Services ({pendingServices.length})
                  </button>
                  {renderPendingItems(pendingServices, "service")}
                </div>
              </div>
            )}
            {token ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-white text-purple-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white text-2xl relative z-10"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="relative z-10 md:hidden bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white px-6 py-4 space-y-4 shadow-md">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href, item.protected)}
                className={`block w-full text-left transition hover:opacity-80 ${pathname === item.href ? "font-bold underline text-purple-300" : "text-gray-200"}`}
              >
                {item.label}
              </button>
            ))}

            {token && user?.role === "admin" && (
              <div className="mt-2 flex flex-col gap-2">
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("event")}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold text-left"
                  >
                    Pending Events ({pendingEvents.length})
                  </button>
                  {renderPendingItems(pendingEvents, "event")}
                </div>
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("service")}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-left"
                  >
                    Pending Services ({pendingServices.length})
                  </button>
                  {renderPendingItems(pendingServices, "service")}
                </div>
              </div>
            )}

            {!token && (
              <div className="flex flex-col gap-3 mt-4">
                <Link
                  href="/login"
                  className="w-full px-4 py-2 border border-white rounded-lg text-center hover:bg-white hover:text-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="w-full px-4 py-2 bg-white text-purple-700 font-semibold rounded-lg text-center hover:bg-gray-100 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {token && (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
