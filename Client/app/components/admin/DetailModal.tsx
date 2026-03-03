import { DetailModalProps } from "@/src/types/admin";
import { StatusBadge } from "./StatusBadge";

export function DetailModal({ item, type, onClose }: DetailModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-[500px] max-w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <img
          src={item.image || "/images/default-placeholder.png"}
          alt={item.title}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />

        <h2 className="text-xl font-bold mb-2">{item.title}</h2>
        <p className="text-gray-400 mb-2">
          By {item.createdBy?.name || item.createdBy?.username || "Unknown"}
        </p>

        {type === "event" && item.date && (
          <p className="text-gray-300">
            Date: {new Date(item.date).toLocaleDateString()}
          </p>
        )}

        {item.location && (
          <p className="text-gray-300 mt-2">Location: {item.location}</p>
        )}

        <div className="mt-4">
          <StatusBadge status={item.status} />
        </div>
      </div>
    </div>
  );
}
