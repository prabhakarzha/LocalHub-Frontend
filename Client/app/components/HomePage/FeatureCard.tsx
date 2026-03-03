"use client";

import Link from "next/link";
import { lazy, Suspense, useMemo, ComponentType } from "react";

interface Feature {
  title: string;
  desc: string;
  color: string;
  icon: string;
  route: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
  handleExploreClick: (e: React.MouseEvent, route: string) => void;
}

const IconFallback = () => (
  <div className="w-10 h-10 bg-gray-700 rounded animate-pulse" />
);

export default function FeatureCard({
  feature,
  index,
  handleExploreClick,
}: FeatureCardProps) {
  // Fix: Import ComponentType and use correct typing
  const IconComponent = useMemo(() => {
    return lazy(() =>
      import("lucide-react").then((mod) => {
        // Get the icon component from the module
        const Icon = mod[feature.icon as keyof typeof mod];
        // Return as default export with proper typing
        return { default: Icon as ComponentType<any> };
      }),
    );
  }, [feature.icon]);

  return (
    <Link
      href={feature.route}
      onClick={(e) => handleExploreClick(e, feature.route)}
      className="group relative block"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl sm:rounded-3xl blur-xl"></div>
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center hover:bg-white/10 hover:border-purple-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
        <div className="relative mb-4 sm:mb-6">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <Suspense fallback={<IconFallback />}>
              <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </Suspense>
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-purple-300 transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
          {feature.desc}
        </p>
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500"></div>
      </div>
    </Link>
  );
}
