"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role === "admin") router.push("/dashboard/admin");
    else if (user.role === "writer") router.push("/dashboard/writer");
    else router.push("/dashboard/user");
  }, [user, loading]);

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
    </main>
  );
}