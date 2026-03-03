"use client";

import Image from "next/image";
import { CheckCircle, User, MapPin } from "lucide-react";

interface Props {
  image: string;
  title: string;
  createdBy?: string;
  location?: string;
  badgeText?: string;
  actionLabel: string;
  onAction: () => void;
  children?: React.ReactNode; // optional extra content like date
}

export default function ItemCard({
  image,
  title,
  createdBy,
  location,
  badgeText = "Approved",
  actionLabel,
  onAction,
  children,
}: Props) {
  return (
    <div className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-purple-500/30 hover:scale-[1.02] transition-all duration-300">
      <div className="relative w-full h-48">
        <Image
          src={image || "/images/default-placeholder.png"}
          alt={title}
          fill
          className="object-cover object-center rounded-t-2xl"
          unoptimized
        />

        <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-green-300 text-xs font-semibold">
          <CheckCircle className="w-3 h-3" />
          {badgeText}
        </span>
      </div>

      <div className="p-5 text-white flex flex-col gap-3">
        <h3 className="text-lg font-bold group-hover:text-purple-300 transition-colors line-clamp-1">
          {title}
        </h3>

        {createdBy && (
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>
              By <span className="text-white font-medium">{createdBy}</span>
            </span>
          </div>
        )}

        {children}

        {location && (
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <MapPin className="w-3.5 h-3.5 text-pink-400" />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}

        <button
          onClick={onAction}
          className="w-full mt-1 py-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-sm font-semibold rounded-xl hover:scale-105 transition-all duration-200"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
