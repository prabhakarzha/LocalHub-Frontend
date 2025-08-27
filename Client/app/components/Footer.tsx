export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden">
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border-t border-white/10">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} LocalHub. All rights reserved.
            </p>

            {/* Developer Credit */}
            <div className="flex items-center gap-2 text-gray-400 text-sm group">
              <span>Designed and developed</span>
              <span>by</span>
              <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                Prabhakar kumar
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Border */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
      </div>
    </footer>
  );
}
