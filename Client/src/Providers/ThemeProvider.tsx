"use client";

import { memo, useEffect, useState } from "react";

export default memo(function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering theme-specific things until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
});
