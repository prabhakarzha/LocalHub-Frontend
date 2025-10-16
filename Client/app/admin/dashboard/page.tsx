"use client";

import { useState, useEffect } from "react";
import { RootState } from "@/src/redux/store";
import withAdminAuth from "@/app/components/withAdminAuth";
import { Calendar, DollarSign, LayoutDashboard, Wrench } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { getEvents } from "@/src/redux/slices/eventsSlice";
import { getServices } from "@/src/redux/slices/servicesSlice";
import { GradientHeading, StatCard } from "@/ui/eventHelpers";
import Navbar from "@/app/components/Navbar";
import EventsPage from "@/app/admin/dashboard/events/page";
import ServicesPage from "@/app/admin/dashboard/services/page";
import { getBookings } from "@/src/redux/slices/bookingsSlice"; // ✅ correct slice name

function AdminDashboardPage() {
  const dispatch = useAppDispatch();

  // events
  const { events } = useAppSelector(
    (state: RootState) => state.events as { events: any[]; loading: boolean }
  );

  // services
  const { services } = useAppSelector(
    (state: RootState) =>
      state.services as { services: any[]; loading: boolean }
  );

  // bookings
  const { list: bookings } = useAppSelector((state) => state.bookings);

  const [activeTab, setActiveTab] = useState<"events" | "services">("events");

  useEffect(() => {
    dispatch(getEvents());
    dispatch(getServices());
    dispatch(getBookings()); // ✅ fetch bookings
  }, [dispatch]);

  const stats = [
    {
      title: "Total Events",
      value: events.length,
      icon: <Calendar />,
      gradient: "from-blue-500 to-purple-500",
    },
    {
      title: "Total Services",
      value: services.length,
      icon: <Wrench />,
      gradient: "from-green-400 to-green-600",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: <LayoutDashboard />,
      gradient: "from-pink-400 to-red-500",
    },
    {
      title: "Revenue",
      value: "$5,200",
      icon: <DollarSign />,
      gradient: "from-yellow-400 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-1200 via-purple-1200 to-slate-1200 overflow-hidden relative">
      <nav className="fixed top-0 left-0 w-full z-30 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow p-4 flex justify-between items-center">
        <Navbar />
      </nav>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-20">
        <div className="sticky top-20 z-20 flex justify-center">
          <GradientHeading text="Admin Dashboard" size="4xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-10 flex gap-4 border-b border-white/30">
          <button
            onClick={() => setActiveTab("events")}
            className={`pb-2 px-4 text-lg font-medium ${
              activeTab === "events"
                ? "text-white border-b-2 border-white"
                : "text-gray-300"
            }`}
          >
            Manage Events
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`pb-2 px-4 text-lg font-medium ${
              activeTab === "services"
                ? "text-white border-b-2 border-white"
                : "text-gray-300"
            }`}
          >
            Manage Services
          </button>
        </div>

        {/* Events Tab */}
        {activeTab === "events" && <EventsPage />}

        {/* Services Tab */}
        {activeTab === "services" && <ServicesPage />}
      </main>
    </div>
  );
}

export default withAdminAuth(AdminDashboardPage);
