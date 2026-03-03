"use client";

interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
}

export default function StatsCard({ title, value, icon, gradient }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg`}
    >
      <div className="relative z-10">
        <div className="p-2 bg-white/20 rounded-xl w-fit mb-3">{icon}</div>
        <p className="text-3xl font-bold mb-0.5">{value}</p>
        <p className="text-xs text-white/70 font-medium">{title}</p>
      </div>
    </div>
  );
}
