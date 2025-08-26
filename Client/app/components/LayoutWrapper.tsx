"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import React, { HTMLAttributes } from "react";

type LayoutWrapperProps = HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
};

export default function LayoutWrapper({
  children,
  className,
  ...rest
}: LayoutWrapperProps) {
  const pathname = usePathname();

  // Check if admin route
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main
        className={`flex-1 w-full ${
          isAdminRoute ||
          pathname === "/login" ||
          pathname === "/signup" ||
          pathname === "/events" ||
          pathname === "/services" ||
          pathname === "/profile"
            ? "p-0"
            : "container mx-auto px-6 py-8"
        } ${className ?? ""}`}
        {...rest}
      >
        {children}
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
}
