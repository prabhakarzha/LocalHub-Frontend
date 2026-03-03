import { AlertTriangle } from "lucide-react";
import { ConfirmModalProps } from "@/src/types/admin";

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  danger = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-96 max-w-full text-center shadow-2xl">
        <div
          className={`w-14 h-14 ${danger ? "bg-red-500/20" : "bg-yellow-500/20"} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <AlertTriangle
            className={`w-7 h-7 ${danger ? "text-red-400" : "text-yellow-400"}`}
          />
        </div>
        <h2 className="text-lg font-bold mb-2 text-white">{title}</h2>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition ${danger ? "bg-gradient-to-r from-red-600 to-red-500" : "bg-gradient-to-r from-yellow-500 to-orange-500"} hover:opacity-90`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
