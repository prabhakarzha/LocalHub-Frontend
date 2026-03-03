"use client";

export default function PendingDropdown({
  items,
  type,
  onApprove,
  onDecline,
}: {
  items: any[];
  type: "event" | "service";
  onApprove: (id: string, type: "event" | "service") => void;
  onDecline: (id: string, type: "event" | "service") => void;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
        <div className="p-4 text-sm text-gray-500 text-center">
          No pending {type}s
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
      {items.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{item.title}</p>
            <p className="text-xs text-gray-500">
              {type === "event" ? "📅 Event" : "🛠️ Service"}
            </p>
          </div>
          <div className="flex gap-2 ml-2">
            <button
              onClick={() => onApprove(item._id, type)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition"
            >
              ✓
            </button>
            <button
              onClick={() => onDecline(item._id, type)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition"
            >
              ✗
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
