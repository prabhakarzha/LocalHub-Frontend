"use client";

import {
  Calendar,
  Users,
  DollarSign,
  PlusCircle,
  ClipboardList,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Active Events",
      value: 5,
      icon: <Calendar className="w-6 h-6" />,
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Bookings",
      value: 32,
      icon: <Users className="w-6 h-6" />,
      color: "from-green-400 to-green-600",
    },
    {
      title: "Earnings",
      value: "$1,250",
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-purple-400 to-purple-600",
    },
  ];

  const actions = [
    { label: "Add Event", icon: <PlusCircle className="w-5 h-5" /> },
    { label: "Manage Events", icon: <ClipboardList className="w-5 h-5" /> },
    { label: "View Bookings", icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="py-16 container mx-auto px-6 min-h-screen text-white">
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Dashboard Overview
      </h1>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${item.color} text-white text-center`}
          >
            <div className="flex justify-center mb-2">{item.icon}</div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <button
            key={index}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow hover:shadow-lg py-4 text-lg font-semibold transition hover:scale-105"
          >
            {action.icon} {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
