interface PlaceholderProps {
  title: string;
  icon: React.ReactNode;
  message?: string;
}

export function Placeholder({
  title,
  icon,
  message = "Coming soon...",
}: PlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-gray-400 font-medium">{title}</p>
      <p className="text-gray-600 text-sm mt-1">{message}</p>
    </div>
  );
}
