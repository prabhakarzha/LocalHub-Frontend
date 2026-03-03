import { Shield } from "lucide-react";

interface WelcomeBannerProps {
  initials: string;
  name: string;
  email: string;
}

export function WelcomeBanner({ initials, name, email }: WelcomeBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-pink-600/20 border border-white/10 p-6 sm:p-8">
      <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-xl font-bold shrink-0 shadow-lg">
          {initials}
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-0.5">Admin Panel 👋</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {name || "Admin"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">{email}</p>
        </div>
        <span className="sm:ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" /> Administrator
        </span>
      </div>
    </div>
  );
}
