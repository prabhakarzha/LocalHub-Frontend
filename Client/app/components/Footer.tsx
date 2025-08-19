import { Heart, Code, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 bg-white/5 backdrop-blur-xl border-t border-white/10">
        <div className="container mx-auto px-6 py-8">
          {/* Main Footer Content */}
          <div className="text-center mb-6">
            {/* Brand Section */}
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
              LocalHub
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed max-w-2xl mx-auto">
              Connecting communities through events and services. Your local hub
              for everything that matters.
            </p>
            {/* <div className="flex items-center justify-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Serving communities worldwide</span>
            </div> */}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} LocalHub. All rights reserved.
              </p>
            </div>

            {/* Developer Credit */}
            <div className="flex items-center gap-2 text-gray-400 text-sm group">
              <span>Designed and developed with</span>
              <Heart className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors animate-pulse" />
              <span>by</span>
              <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                Prabhakar
              </span>
              <Code className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
      </div>
    </footer>
  );
}
