"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import axios from "axios";
import { getEvents } from "@/src/redux/slices/eventsSlice";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);

  const { token, user } = useSelector((state: any) => state.auth);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPendingEvents = async () => {
      if (!token || !user || user.role !== "admin") return;

      try {
        const res = await axios.get(`${API_BASE_URL}/api/events/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setPendingEvents(res.data.events || []);
        }
      } catch (err) {
        console.error("Error fetching pending events:", err);
      }
    };

    fetchPendingEvents();
  }, [user, token]);

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
    if (protectedRoute && !token) return alert("Please login first.");
    if (href.startsWith("/admin") && user?.role !== "admin")
      return alert("Access denied");
    router.push(href);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    router.push("/");
  };

  const handleApprove = async (id: string) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/events/${id}/status`,
        { status: "approved" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingEvents((prev) => prev.filter((e) => e._id !== id));
      alert("✅ Event approved!");
      dispatch(getEvents() as any);
    } catch (err) {
      console.error(err);
      alert("Error approving event!");
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/events/${id}/status`,
        { status: "declined" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingEvents((prev) => prev.filter((e) => e._id !== id));
      alert("❌ Event declined!");
      dispatch(getEvents() as any);
    } catch (err) {
      console.error(err);
      alert("Error declining event!");
    }
  };

  return (
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
              className={`transition hover:opacity-80 ${
                pathname === item.href
                  ? "font-bold underline text-purple-300"
                  : "text-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          {token && user?.role === "admin" && (
            <div className="relative">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold">
                Pending Events ({pendingEvents.length})
              </button>
              {pendingEvents.length > 0 && (
                <div className="absolute right-0 mt-5 w-80 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                  {pendingEvents.map((event) => (
                    <div
                      key={event._id}
                      className="flex justify-between items-center p-3 border-b border-gray-200"
                    >
                      <span className="font-medium text-sm">{event.title}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(event._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecline(event._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* ✅ Mobile Menu */}
      {isMenuOpen && (
        <div className="relative z-10 md:hidden bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white px-6 py-4 space-y-4 shadow-md">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href, item.protected)}
              className={`block w-full text-left transition hover:opacity-80 ${
                pathname === item.href
                  ? "font-bold underline text-purple-300"
                  : "text-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Admin Pending Events (Mobile) */}
          {token && user?.role === "admin" && (
            <div className="mt-2">
              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold text-left">
                Pending Events ({pendingEvents.length})
              </button>

              {pendingEvents.length > 0 && (
                <div className="mt-2 w-full bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden">
                  {pendingEvents.map((event) => (
                    <div
                      key={event._id}
                      className="flex justify-between items-center p-3 border-b border-gray-200"
                    >
                      <span className="font-medium text-sm">{event.title}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(event._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecline(event._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ✅ Show Login / Signup when user not logged in */}
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

          {/* Logout (Mobile) */}
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
  );
}
