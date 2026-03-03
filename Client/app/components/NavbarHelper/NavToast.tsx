"use client";

import { useEffect } from "react";
import { LogIn, ShieldX, X } from "lucide-react";

type ToastType = "auth" | "access";

interface ToastState {
  visible: boolean;
  type: ToastType;
}

export default function NavToast({
  toast,
  onClose,
  onLogin,
}: {
  toast: ToastState;
  onClose: () => void;
  onLogin: () => void;
}) {
  useEffect(() => {
    if (!toast.visible) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [toast.visible, onClose]);

  const isAuth = toast.type === "auth";

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-top-3 duration-300">
      <div
        className={`
          flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl
          min-w-[320px] max-w-sm
          ${
            isAuth
              ? "bg-gray-900/95 border-purple-500/30 shadow-purple-500/20"
              : "bg-gray-900/95 border-red-500/30 shadow-red-500/20"
          }
        `}
      >
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center shrink-0
            ${isAuth ? "bg-purple-500/20" : "bg-red-500/20"}
          `}
        >
          {isAuth ? (
            <LogIn className="w-5 h-5 text-purple-400" />
          ) : (
            <ShieldX className="w-5 h-5 text-red-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">
            {isAuth ? "Login Required" : "Access Denied"}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            {isAuth
              ? "Please sign in to access this page."
              : "You don't have permission to view this page."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAuth && (
            <button
              onClick={() => {
                onLogin();
                onClose();
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white text-xs font-semibold rounded-lg transition"
            >
              Login
            </button>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className={`mt-1.5 h-0.5 rounded-full overflow-hidden mx-1 ${isAuth ? "bg-purple-500/20" : "bg-red-500/20"}`}
      >
        <div
          className={`h-full rounded-full ${isAuth ? "bg-purple-500" : "bg-red-500"} animate-[shrink_4s_linear_forwards]`}
          style={{
            animationName: "shrink",
            animationDuration: "4s",
            animationTimingFunction: "linear",
            animationFillMode: "forwards",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
