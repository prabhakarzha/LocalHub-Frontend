"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice"; // Logout action

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const { token } = useSelector((state: any) => state.auth); // Redux se token

  const navItems = [
    { href: "/", label: "Home", protected: false },
    { href: "/events", label: "Events", protected: true },
    { href: "/services", label: "Services", protected: true }, // <-- Added Services
    { href: "/profile", label: "Profile", protected: true },
    { href: "/dashboard", label: "Dashboard", protected: true },
  ];

  const handleNavClick = (href: string, protectedRoute: boolean) => {
    setIsMenuOpen(false); // Close mobile menu when navigating
    if (protectedRoute && !token) {
      setShowLoginPopup(true);
    } else {
      router.push(href);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <Link
            href="/"
            prefetch={false}
            className="text-2xl font-bold hover:opacity-90 transition"
          >
            LocalHub
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
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

            {!token ? (
              <>
                <Link
                  href="/login"
                  prefetch={false}
                  className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  prefetch={false}
                  className="px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition"
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

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-4 space-y-4">
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

            {/* Auth Buttons in Mobile */}
            {!token ? (
              <>
                <Link
                  href="/login"
                  prefetch={false}
                  className="block w-full text-left px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  prefetch={false}
                  className="block w-full text-left px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition"
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
    </>
  );
}
