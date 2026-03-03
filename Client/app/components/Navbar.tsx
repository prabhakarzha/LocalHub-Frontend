"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

// ✅ Lazy load components - files now exist
const NavToast = lazy(() => import("@/app/components/NavToast"));

// Toast types
type ToastType = "auth" | "access";

interface ToastState {
  visible: boolean;
  type: ToastType;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // ✅ Add mounted state for hydration fix
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: "auth",
  });

  const { token, user } = useSelector((state: any) => state.auth);

  // Don't render dashboard in navbar
  if (pathname === "/dashboard") return null;

  const showToast = (type: ToastType) => setToast({ visible: true, type });
  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));

  // Navigation items - defined inside component to access token and user
  const getNavItems = () => {
    const items = [
      { href: "/", label: "Home", protected: false },
      { href: "/events", label: "Events", protected: true },
      { href: "/services", label: "Services", protected: true },
    ];

    // Regular users see profile and dashboard
    if (token && user?.role !== "admin") {
      items.push({ href: "/profile", label: "Profile", protected: true });
      items.push({ href: "/dashboard", label: "Dashboard", protected: true });
    }

    // Admin sees admin dashboard link (but no pending buttons here)
    if (user?.role === "admin") {
      items.push({
        href: "/admin/dashboard",
        label: "Admin Dashboard",
        protected: true,
      });
    }
    return items;
  };

  const navItems = getNavItems();

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
    dispatch(logout() as any);
    setIsMenuOpen(false);
    router.push("/");
  };

  // ✅ SSR placeholder - matches server render exactly
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-md text-white shadow-xl z-50">
        <div className="relative container mx-auto flex justify-between items-center px-6 py-4">
          <span className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
            LocalHub
          </span>
          <div className="hidden md:flex flex-1 justify-center items-center space-x-6">
            {/* Placeholder buttons with same structure */}
            <div className="w-16 h-8"></div>
            <div className="w-16 h-8"></div>
            <div className="w-16 h-8"></div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-20 h-10"></div>
          </div>
          <div className="md:hidden w-8 h-8"></div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Toast component - lazy loaded */}
      <Suspense fallback={null}>
        {toast.visible && (
          <NavToast
            toast={toast}
            onClose={hideToast}
            onLogin={() => router.push("/login")}
          />
        )}
      </Suspense>

      <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-md text-white shadow-xl z-50">
        <div className="relative container mx-auto flex justify-between items-center px-6 py-4">
          {/* Brand */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent"
          >
            LocalHub
          </Link>

          {/* Desktop Navigation */}
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
            {token ? (
              <>
                {/* Only show logout for non-admin users in navbar */}
                {user?.role !== "admin" && (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                )}
                {/* For admin users, no buttons in navbar - they're in admin dashboard */}
              </>
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

          {/* Mobile Menu Toggle */}
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
                className={`block w-full text-left transition hover:opacity-80 ${
                  pathname === item.href
                    ? "font-bold underline text-purple-300"
                    : "text-gray-200"
                }`}
              >
                {item.label}
              </button>
            ))}

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

            {/* Only show logout in mobile menu for non-admin users */}
            {token && user?.role !== "admin" && (
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
