"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AdminProtected(props: P) {
    const router = useRouter();
    const { user, token } = useSelector((state: any) => state.auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!token) {
        router.replace("/login"); // Not logged in → redirect
      } else if (user?.role !== "admin") {
        router.replace("/"); // Not admin → redirect to home
      } else {
        setLoading(false); // Admin → allow
      }
    }, [token, user, router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen text-xl">
          Checking permissions...
        </div>
      );
    }

    // ✅ yaha ab error nahi aayega
    return <WrappedComponent {...(props as P)} />;
  };
}
