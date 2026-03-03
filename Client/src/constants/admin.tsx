import {
  Calendar,
  Wrench,
  ClipboardList,
  TrendingUp,
  Activity,
  Users,
  UserCheck,
  Star,
  CheckCircle,
} from "lucide-react";
import {
  AdminNavKey,
  QuickAction,
  RecentActivity,
  WeeklyStat,
} from "@/src/types/admin";

export const SECTION_TITLES: Record<AdminNavKey, string> = {
  overview: "Admin Overview",
  events: "Manage Events",
  services: "Manage Services",
  bookings: "All Bookings",
  users: "User Management",
  settings: "Settings",
  analytics: "Analytics",
};

export const STATUS_STYLES: Record<string, string> = {
  approved: "bg-green-500/20 text-green-300 border-green-500/30",
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  rejected: "bg-red-500/20 text-red-300 border-red-500/30",
  confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Review Pending Events",
    icon: <Calendar className="w-5 h-5" />,
    nav: "events",
    color: "from-blue-500 to-purple-500",
  },
  {
    label: "Review Pending Services",
    icon: <Wrench className="w-5 h-5" />,
    nav: "services",
    color: "from-green-500 to-teal-500",
  },
  {
    label: "View All Bookings",
    icon: <ClipboardList className="w-5 h-5" />,
    nav: "bookings",
    color: "from-pink-500 to-rose-500",
  },
];

export const RECENT_ACTIVITIES: RecentActivity[] = [
  {
    label: "New event submitted for review",
    time: "2 min ago",
    dot: "bg-blue-500",
    icon: <Calendar className="w-3.5 h-3.5 text-blue-400" />,
  },
  {
    label: "Service booking confirmed",
    time: "15 min ago",
    dot: "bg-green-500",
    icon: <CheckCircle className="w-3.5 h-3.5 text-green-400" />,
  },
  {
    label: "New user registered",
    time: "1 hr ago",
    dot: "bg-purple-500",
    icon: <UserCheck className="w-3.5 h-3.5 text-purple-400" />,
  },
  {
    label: "Event rejected by admin",
    time: "2 hr ago",
    dot: "bg-red-500",
    icon: <UserCheck className="w-3.5 h-3.5 text-red-400" />,
  },
  {
    label: "Service approved",
    time: "3 hr ago",
    dot: "bg-yellow-500",
    icon: <Star className="w-3.5 h-3.5 text-yellow-400" />,
  },
];

export const WEEKLY_STATS: WeeklyStat[] = [
  {
    label: "Events This Week",
    value: 12,
    max: 20,
    color: "bg-blue-500",
    icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
  },
  {
    label: "Services This Week",
    value: 8,
    max: 20,
    color: "bg-green-500",
    icon: <Activity className="w-4 h-4 text-green-400" />,
  },
  {
    label: "Bookings This Week",
    value: 34,
    max: 50,
    color: "bg-purple-500",
    icon: <Users className="w-4 h-4 text-purple-400" />,
  },
];
