"use client";

import { PlusCircle } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export default function SectionHeader({
  title,
  subtitle,
  buttonLabel,
  onButtonClick,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-gray-400 text-sm mt-0.5">{subtitle}</p>
      </div>

      {buttonLabel && (
        <button
          onClick={onButtonClick}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-sm font-semibold hover:opacity-90 hover:scale-105 transition"
        >
          <PlusCircle className="w-4 h-4" />
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
