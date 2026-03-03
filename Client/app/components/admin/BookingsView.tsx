import { ClipboardList } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface BookingsViewProps {
  bookings: any[];
}

export function BookingsView({ bookings }: BookingsViewProps) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center max-w-sm mx-auto">
        <ClipboardList className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400">No bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-4 px-6 py-3 border-b border-white/10">
        {["Event / Service", "Booked By", "Date", "Status"].map((h) => (
          <p
            key={h}
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            {h}
          </p>
        ))}
      </div>
      {bookings.map((booking: any) => (
        <div
          key={booking._id || booking.id}
          className="grid grid-cols-4 px-6 py-4 items-center border-b border-white/5 last:border-0 hover:bg-white/5 transition"
        >
          <p className="text-sm font-medium text-white truncate pr-2">
            {booking.eventId?.title || booking.serviceId?.title || "—"}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
              {(booking.userId?.name || "U")[0].toUpperCase()}
            </div>
            <p className="text-sm text-gray-300 truncate">
              {booking.userId?.name || "Unknown"}
            </p>
          </div>
          <p className="text-sm text-gray-400">
            {booking.createdAt
              ? new Date(booking.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </p>
          <StatusBadge status={booking.status || "confirmed"} />
        </div>
      ))}
    </div>
  );
}
