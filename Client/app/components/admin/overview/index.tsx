import React from "react";
import { WelcomeBanner } from "./WelcomeBanner";
import { StatsGrid } from "./StatsGrid";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { WeeklyStats } from "./WeeklyStats";
import { StatItem, AdminNavKey } from "@/src/types/admin";

interface OverviewProps {
  stats: StatItem[];
  pendingEvents: number;
  pendingServices: number;
  bookingsCount: number;
  user: any;
  initials: string;
  onNavigate: (nav: AdminNavKey) => void;
}

// Use React.memo to prevent unnecessary re-renders
export const Overview = React.memo(function Overview({
  stats,
  pendingEvents,
  pendingServices,
  bookingsCount,
  user,
  initials,
  onNavigate,
}: OverviewProps) {
  return (
    <div className="space-y-8">
      <WelcomeBanner
        initials={initials}
        name={user?.name}
        email={user?.email}
      />
      <StatsGrid stats={stats} />
      <QuickActions
        pendingEvents={pendingEvents}
        pendingServices={pendingServices}
        bookingsCount={bookingsCount}
        onActionClick={onNavigate}
      />
      <RecentActivity />
      <WeeklyStats />
    </div>
  );
});
