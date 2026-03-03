import { FilterTabsProps } from "@/src/types/admin";

export function FilterTabs({ value, onChange }: FilterTabsProps) {
  const filters = ["all", "pending", "approved", "rejected"] as const;

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
            value === f
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
              : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
