import { QUICK_ACTIONS } from "@/src/constants/admin";
import { AdminNavKey } from "@/src/types/admin";

interface QuickActionsProps {
  pendingEvents: number;
  pendingServices: number;
  bookingsCount: number;
  onActionClick: (nav: AdminNavKey) => void;
}

export function QuickActions({
  pendingEvents,
  pendingServices,
  bookingsCount,
  onActionClick,
}: QuickActionsProps) {
  const actions = QUICK_ACTIONS.map((action) => ({
    ...action,
    count:
      action.nav === "events"
        ? pendingEvents
        : action.nav === "services"
          ? pendingServices
          : bookingsCount,
  }));

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
        Quick Actions
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => onActionClick(action.nav)}
            className="group relative flex flex-col items-center justify-center gap-3 py-8 rounded-2xl border border-white/5 bg-gray-900/60 hover:bg-white/5 hover:border-yellow-500/30 transition-all duration-200 hover:shadow-lg"
          >
            {action.count > 0 && (
              <span className="absolute top-3 right-3 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                {action.count}
              </span>
            )}
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-md group-hover:scale-110 transition-transform duration-200`}
            >
              {action.icon}
            </div>
            <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors text-center px-2">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
