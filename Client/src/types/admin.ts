// Admin navigation keys
export type AdminNavKey =
  | "overview"
  | "events"
  | "services"
  | "bookings"
  | "users"
  | "settings"
  | "analytics";

// User navigation keys
export type UserNavKey =
  | "overview"
  | "profile"
  | "events"
  | "services"
  | "bookings"
  | "earnings"
  | "settings";

// Union type for both admin and user nav keys
export type NavKey = AdminNavKey | UserNavKey;

// Quick Action types (for admin)
export interface QuickAction {
  label: string;
  icon: React.ReactNode;
  nav: AdminNavKey;
  color: string;
}

export interface QuickActionProps {
  label: string;
  icon: React.ReactNode;
  nav: AdminNavKey;
  color: string;
  count: number;
  onClick: (nav: AdminNavKey) => void;
}

// Recent Activity types
export interface RecentActivity {
  label: string;
  time: string;
  dot: string;
  icon: React.ReactNode;
}

// Weekly Stats types
export interface WeeklyStat {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: React.ReactNode;
}

// Stat Item for dashboard
export interface StatItem {
  title: string;
  value: number | string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}

// Modal Props
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  danger?: boolean;
}

export interface DetailModalProps {
  item: any;
  type: "event" | "service";
  onClose: () => void;
}

// Badge Props
export interface StatusBadgeProps {
  status: string;
}

// Pagination Props
export interface PaginationProps {
  page: number;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

// Filter Tabs Props
export interface FilterTabsProps {
  value: string;
  onChange: (value: any) => void;
}

// Error Display Props
export interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

// Sidebar Props (for shared sidebar)
export interface SidebarProps {
  activeNav: NavKey;
  setActiveNav: (key: NavKey) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: any;
  initials: string;
  onLogout: () => void;
  onGoHome: () => void;
  userRole: "user" | "admin";
  pendingCounts?: {
    events?: number;
    services?: number;
    users?: number;
    messages?: number;
  };
}

// Header Props
export interface HeaderProps {
  activeNav: AdminNavKey; // Admin only header
  onMenuClick: () => void;
  notificationCount: number;
  initials: string;
}

// Bookings View Props
export interface BookingsViewProps {
  bookings: any[];
}

// Placeholder Props
export interface PlaceholderProps {
  title: string;
  icon: React.ReactNode;
  message?: string;
}

// Overview Props
export interface OverviewProps {
  stats: StatItem[];
  pendingEvents: number;
  pendingServices: number;
  bookingsCount: number;
  user: any;
  initials: string;
  onNavigate: (nav: AdminNavKey) => void;
}

// Welcome Banner Props
export interface WelcomeBannerProps {
  initials: string;
  name: string;
  email: string;
}

// Stats Grid Props
export interface StatsGridProps {
  stats: StatItem[];
}
