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
  return (
    <div className="absolute right-0 mt-5 w-80 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
      {items.length === 0 ? (
        <div className="p-3 text-sm text-gray-500">No pending {type}s</div>
      ) : (
        items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center p-3 border-b border-gray-200"
          >
            <span className="font-medium text-sm">{item.title}</span>
            <div className="flex gap-2">
              <button
                onClick={() => onApprove(item._id, type)}
                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => onDecline(item._id, type)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
              >
                Decline
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
