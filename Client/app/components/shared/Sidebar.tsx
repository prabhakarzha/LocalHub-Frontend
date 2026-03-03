"use client";

import {
  LayoutDashboard,
  User,
  Calendar,
  ClipboardList,
  Users,
  DollarSign,
  Settings,
  Home,
  LogOut,
  ChevronRight,
  X,
  Wrench,
  Shield,
  BarChart,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";

export type UserNavKey =
  | "overview"
  | "profile"
  | "events"
  | "services"
  | "bookings"
  | "earnings"
  | "settings";

export type AdminNavKey =
  | "overview"
  | "events"
  | "services"
  | "bookings"
  | "users"
  | "settings"
  | "analytics";

export type NavKey = UserNavKey | AdminNavKey;

interface SidebarProps {
  activeNav: NavKey;
  setActiveNav: (key: NavKey) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  user: any;
  initials: string;
  onLogout: () => void;
  onGoHome: () => void;
  userRole: "user" | "admin"; // New prop for role
  pendingCounts?: {
    events?: number;
    services?: number;
    users?: number;
  };
}

// User navigation items
const userNavItems: {
  key: UserNavKey;
  label: string;
  icon: React.ReactNode;
}[] = [
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
    icon: <Wrench className="w-5 h-5" />,
  },
  {
    key: "bookings",
    label: "Bookings",
    icon: <ClipboardList className="w-5 h-5" />,
  },
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

// Admin navigation items
const adminNavItems: {
  key: AdminNavKey;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    key: "events",
    label: "Manage Events",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    key: "services",
    label: "Manage Services",
    icon: <Wrench className="w-5 h-5" />,
  },
  {
    key: "bookings",
    label: "All Bookings",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    key: "users",
    label: "Users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: <BarChart className="w-5 h-5" />,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function Sidebar({
  activeNav,
  setActiveNav,
  sidebarOpen,
  setSidebarOpen,
  user,
  initials,
  onLogout,
  onGoHome,
  userRole = "user",
  pendingCounts = {},
}: SidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Select navigation items based on role
  const navItems = userRole === "admin" ? adminNavItems : userNavItems;

  // Get gradient colors based on role
  const gradientColors = {
    user: "from-blue-500 to-purple-600",
    admin: "from-yellow-500 to-orange-600",
  };

  const borderColors = {
    user: "border-blue-500/30",
    admin: "border-yellow-500/30",
  };

  const bgGradient = {
    user: "from-blue-500/20 to-purple-500/20",
    admin: "from-yellow-500/20 to-orange-500/20",
  };

  const textColors = {
    user: "text-blue-400",
    admin: "text-yellow-400",
  };

  // Display values with mounted check
  const displayName = !mounted
    ? ""
    : user?.name || (userRole === "admin" ? "Admin" : "User");
  const displayEmail = !mounted ? "" : user?.email || "";
  const displayInitials = !mounted ? "" : initials;

  // Get role badge color
  const roleBadgeColor =
    userRole === "admin"
      ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"
      : "bg-blue-500/20 border-blue-500/30 text-blue-400";

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-transparent bg-clip-text">
              LocalHUb
            </span>
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${roleBadgeColor}`}
            >
              {userRole === "admin" ? "ADMIN" : "USER"}
            </span>
          </div>
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
            <div
              className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradientColors[userRole]} flex items-center justify-center text-sm font-bold`}
            >
              {displayInitials}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold truncate group-hover:text-white">
                  {displayName}
                </p>
                {userRole === "admin" && (
                  <Shield className="w-3 h-3 text-yellow-400 shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
            </div>
            <ChevronRight className={`w-4 h-4 ${textColors[userRole]}`} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest px-3 mb-3">
            {userRole === "admin" ? "Admin Menu" : "Main Menu"}
          </p>

          {navItems.map((item) => {
            // Get pending count based on item key
            const badgeCount =
              item.key === "events"
                ? pendingCounts.events
                : item.key === "services"
                  ? pendingCounts.services
                  : item.key === "users"
                    ? pendingCounts.users
                    : 0;

            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveNav(item.key);
                  setSidebarOpen(false);
                }}
                className={`
    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
    ${
      activeNav === item.key
        ? `bg-gradient-to-r ${bgGradient[userRole]} text-white border ${borderColors[userRole]}`
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }
  `}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {badgeCount !== undefined && badgeCount > 0 && (
                  <span className="w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </span>
                )}
                {activeNav === item.key && (
                  <ChevronRight className={`w-4 h-4 ${textColors[userRole]}`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <button
            onClick={onGoHome}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
