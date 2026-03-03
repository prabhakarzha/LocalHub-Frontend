import { AlertTriangle, RefreshCw } from "lucide-react";
import { ErrorDisplayProps } from "@/src/types/admin";

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
      <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
      <p className="text-red-400 font-medium mb-2">Error loading data</p>
      <p className="text-gray-400 text-sm mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      )}
    </div>
  );
}
