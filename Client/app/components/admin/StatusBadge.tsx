import { STATUS_STYLES } from "@/src/constants/admin";
import { StatusBadgeProps } from "@/src/types/admin";

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${
        STATUS_STYLES[status] ??
        "bg-gray-500/20 text-gray-300 border-gray-500/30"
      }`}
    >
      {status}
    </span>
  );
}
