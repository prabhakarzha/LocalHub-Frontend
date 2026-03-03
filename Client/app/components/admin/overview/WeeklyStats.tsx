import { WEEKLY_STATS } from "@/src/constants/admin";

export function WeeklyStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {WEEKLY_STATS.map((item, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-400">{item.label}</p>
            {item.icon}
          </div>
          <p className="text-2xl font-bold text-white mb-3">{item.value}</p>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${item.color} rounded-full`}
              style={{ width: `${(item.value / item.max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
