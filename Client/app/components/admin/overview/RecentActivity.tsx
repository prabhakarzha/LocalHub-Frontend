import { RECENT_ACTIVITIES } from "@/src/constants/admin";

export function RecentActivity() {
  return (
    <div className="rounded-2xl border border-white/5 bg-gray-900/60 p-6">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
        Recent Activity
      </p>
      <div className="space-y-1">
        {RECENT_ACTIVITIES.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 py-3.5 border-b border-white/5 last:border-0"
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
            <div className="flex items-center gap-2 flex-1">
              {item.icon}
              <p className="text-sm text-gray-300">{item.label}</p>
            </div>
            <p className="text-xs text-gray-500 shrink-0">{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
