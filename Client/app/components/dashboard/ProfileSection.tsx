"use client";

import { Mail, Calendar, Star } from "lucide-react";

interface Props {
  user: any;
  bookingsCount: number;
  serviceBookingsCount: number;
}

export default function ProfileSection({
  user,
  bookingsCount,
  serviceBookingsCount,
}: Props) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold">
          {initials}
        </div>

        <div>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
            <Mail className="w-4 h-4" />
            {user?.email}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-400" />
          <p className="text-xl font-bold">{bookingsCount}</p>
          <p className="text-gray-400 text-sm">Event Bookings</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <Star className="w-6 h-6 mx-auto mb-2 text-green-400" />
          <p className="text-xl font-bold">{serviceBookingsCount}</p>
          <p className="text-gray-400 text-sm">Service Bookings</p>
        </div>
      </div>
    </div>
  );
}
