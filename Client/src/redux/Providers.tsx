"use client";

import { lazy, Suspense, memo, useEffect, useState, ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";

// Simple fallback - renders children immediately
const ProviderFallback = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

// ✅ Fix: Simple lazy import for ThemeProvider
const ThemeProvider = lazy(() => import("@/src/Providers/ThemeProvider"));

// ✅ Fix: ToastProvider with proper typing - make children optional
const ToastProvider = lazy(() =>
  import("react-hot-toast").then(
    (mod) => ({
      default: ({ children }: { children?: ReactNode }) => (
        <>
          <mod.Toaster position="top-right" />
          {children}
        </>
      ),
    }),
    () => ({
      default: ({ children }: { children?: ReactNode }) => <>{children}</>,
    }),
  ),
);

// Deferred provider - loads non-critical stuff after page paint
const DeferredProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => setIsReady(true), { timeout: 2000 });
      } else {
        setTimeout(() => setIsReady(true), 200);
      }
    }
  }, []);

  return <>{children}</>;
};

// Memoize to prevent re-renders
export const Providers = memo(({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return different content on server vs client
  if (!mounted) {
    return <ReduxProvider store={store}>{children}</ReduxProvider>;
  }

  return (
    <ReduxProvider store={store}>
      <Suspense fallback={<ProviderFallback>{children}</ProviderFallback>}>
        <ThemeProvider>
          <DeferredProvider>
            <Suspense fallback={null}>
              {/* ✅ Fix: ToastProvider doesn't need children */}
              <ToastProvider />
            </Suspense>
          </DeferredProvider>
          {children}
        </ThemeProvider>
      </Suspense>
    </ReduxProvider>
  );
});

Providers.displayName = "Providers";
