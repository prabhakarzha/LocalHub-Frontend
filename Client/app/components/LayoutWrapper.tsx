"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if admin route
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main
        className={`flex-1 ${
          isAdminRoute ? "p-0" : "container mx-auto px-6 py-8"
        }`}
      >
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}
