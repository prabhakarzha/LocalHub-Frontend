import React from "react";
import { StatItem } from "@/src/types/admin";

interface StatsGridProps {
  stats: StatItem[];
}

export const StatsGrid = React.memo(function StatsGrid({
  stats,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.color} p-5 text-white shadow-lg`}
        >
          <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-4 -right-1 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10">
            <div className="p-2 bg-white/20 rounded-xl w-fit mb-3">
              {item.icon}
            </div>
            <p className="text-3xl font-bold mb-0.5">{item.value}</p>
            <p className="text-xs text-white/70 font-medium">{item.title}</p>
            <p className="text-xs text-white/50 mt-0.5">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
});
