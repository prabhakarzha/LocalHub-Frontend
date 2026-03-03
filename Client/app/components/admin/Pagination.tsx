import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationProps } from "@/src/types/admin";

export function Pagination({ page, hasNext, onPrev, onNext }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 pt-4">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronLeft className="w-4 h-4" /> Previous
      </button>
      <span className="text-gray-400 text-sm px-2">Page {page}</span>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
