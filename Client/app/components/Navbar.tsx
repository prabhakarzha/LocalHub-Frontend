"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showAccessDeniedPopup, setShowAccessDeniedPopup] = useState(false);

  const { token, user } = useSelector((state: any) => state.auth);

  const navItems = [
    { href: "/", label: "Home", protected: false },
    { href: "/events", label: "Events", protected: true },
    { href: "/services", label: "Services", protected: true },
    ...(user?.role === "admin"
      ? []
      : [{ href: "/profile", label: "Profile", protected: true }]),
  ];

  if (user?.role === "admin") {
    const isHome = pathname === "/";
    navItems.push({
      href: "/admin/dashboard",
      label: isHome ? "Admin Panel" : "Admin",
      protected: true,
    });
  }

  const handleNavClick = (href: string, protectedRoute: boolean) => {
    setIsMenuOpen(false);

    if (protectedRoute && !token) {
      setShowLoginPopup(true);
      return;
    }

    if (href.startsWith("/admin") && user?.role !== "admin") {
      setShowAccessDeniedPopup(true);
      return;
    }

    router.push(href);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 backdrop-blur-md bg-opacity-95 text-white shadow-lg z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          {/* Brand */}
          <Link
            href="/"
            prefetch={false}
            className="text-2xl font-extrabold tracking-wide hover:opacity-90 transition"
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
                  pathname === item.href ? "font-bold underline" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {!token ? (
              <>
                <Link
                  href="/login"
                  prefetch={false}
                  className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  prefetch={false}
                  className="px-4 py-2 bg-white text-purple-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 text-white px-6 py-4 space-y-4 shadow-md">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href, item.protected)}
                className={`block w-full text-left transition hover:opacity-80 ${
                  pathname === item.href ? "font-bold underline" : ""
                }`}
              >
                {item.label}
              </button>
            ))}

            {!token ? (
              <>
                <Link
                  href="/login"
                  prefetch={false}
                  className="block w-full text-left px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  prefetch={false}
                  className="block w-full text-left px-4 py-2 bg-white text-purple-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Login Required Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Login Required
            </h3>
            <p className="text-gray-600 mb-6">
              Please login to access this section.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
            >
              Go to Login
            </button>
            <button
              onClick={() => setShowLoginPopup(false)}
              className="ml-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Access Denied Popup */}
      {showAccessDeniedPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
            <h3 className="text-lg font-bold mb-4 text-red-600">
              Access Denied
            </h3>
            <p className="text-gray-600 mb-6">
              You don’t have access to this section.
            </p>
            <button
              onClick={() => setShowAccessDeniedPopup(false)}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
