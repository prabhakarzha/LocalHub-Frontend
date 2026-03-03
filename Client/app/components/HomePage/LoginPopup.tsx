"use client";

import { motion } from "framer-motion";
import { X, LogIn } from "lucide-react";

interface LoginPopupProps {
  onClose: () => void;
}

export default function LoginPopup({ onClose }: LoginPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center max-w-md w-full"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>

        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <LogIn className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
          Login Required
        </h2>
        <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 leading-relaxed px-2">
          Join our amazing community to explore events and connect with your
          neighbors!
        </p>

        <div className="flex flex-col gap-3 sm:gap-4">
          <button
            onClick={() => {
              window.location.href = "/login";
            }}
            className="w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
            Login Now
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 sm:px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
